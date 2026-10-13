import { createServerFn } from "@tanstack/react-start";
import { FORMATS, GOALS, SOCIALS, TONES } from "@/lib/content";

const BROWSER_CAP = 24;
const PROCESS_CAP = 40;
let processUses = 0;

export type GenerateInput = {
  obiettivo: string;
  piatto: string;
  tono: string;
  social: string;
  note: string;
  variant?: 1 | 2;
  formato?: string;
  reference?: string;
  locale: { name: string; city: string; cuisine: string; description: string };
};

export type CopyResult =
  | { ok: true; testo: string; hashtag: string[]; left: number }
  | { ok: false; error: string };

export type ImageResult =
  | { ok: true; src: string; left: number; fromReference: boolean }
  | { ok: false; error: string };

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function readInput(input: GenerateInput): GenerateInput {
  const obiettivo = clean(input?.obiettivo, 60);
  const piatto = clean(input?.piatto, 140);
  const tono = clean(input?.tono, 40);
  const social = clean(input?.social, 40);
  const note = clean(input?.note, 400);
  const name = clean(input?.locale?.name, 80);
  const city = clean(input?.locale?.city, 60);
  const cuisine = clean(input?.locale?.cuisine, 40);
  const description = clean(input?.locale?.description, 400);
  if (!obiettivo || !piatto || !name) throw new Error("Servono il nome del locale, l’obiettivo e il piatto.");
  if (!GOALS.includes(obiettivo as (typeof GOALS)[number])) throw new Error("Obiettivo non riconosciuto.");
  if (!TONES.includes(tono as (typeof TONES)[number])) throw new Error("Tono non riconosciuto.");
  if (!SOCIALS.includes(social as (typeof SOCIALS)[number])) throw new Error("Social non riconosciuto.");
  const variant = input?.variant === 2 ? 2 : 1;
  const formato = (FORMATS as readonly { id: string }[]).some((item) => item.id === input?.formato)
    ? String(input.formato)
    : "1:1";
  return { obiettivo, piatto, tono, social, note, variant, formato, reference: readReference(input?.reference), locale: { name, city, cuisine, description } };
}

function readReference(value: unknown) {
  if (typeof value !== "string" || value.length > 400_000) return undefined;
  if (!value.startsWith("data:image/jpeg;base64,") && !value.startsWith("data:image/png;base64,") && !value.startsWith("data:image/webp;base64,")) return undefined;
  return value;
}

const QUOTA_ERROR = "Hai raggiunto il limite della demo su questo browser. I piani a pagamento non sono ancora attivi.";

async function gate(): Promise<{ ok: true; left: number; stamp: () => void } | { ok: false; error: string }> {
  if (processUses >= PROCESS_CAP) return { ok: false, error: QUOTA_ERROR };
  try {
    const { getCookie, setCookie } = await import("@tanstack/react-start/server");
    const used = Number(getCookie("sf_gen") ?? "0");
    const safe = Number.isFinite(used) ? used : 0;
    if (safe >= 24) return { ok: false, error: QUOTA_ERROR };
    return {
      ok: true,
      left: Math.max(0, 24 - safe - 1),
      stamp: () => {
        processUses += 1;
        setCookie("sf_gen", String(safe + 1), { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
      },
    };
  } catch {
    return { ok: true, left: Math.max(0, PROCESS_CAP - processUses - 1), stamp: () => { processUses += 1; } };
  }
}

function buildCopyPrompt(input: GenerateInput) {
  const length = input.social === "Google Business" ? "35-70 parole, hashtag vuoti." : input.social === "Facebook" ? "50-100 parole, 3 hashtag." : "70-130 parole, 5 hashtag.";
  return [
    `Locale: ${input.locale.name}`,
    `Città: ${input.locale.city || "non indicata"}`,
    `Tipo: ${input.locale.cuisine || "ristorante"}`,
    `Descrizione: ${input.locale.description || "nessuna"}`,
    `Obiettivo: ${input.obiettivo}`,
    `Piatto: ${input.piatto}`,
    `Tono: ${input.tono}`,
    `Social: ${input.social}`,
    `Note: ${input.note || "nessuna"}`,
    `Lunghezza: ${length}`,
    input.variant === 2 ? "Scrivi una versione diversa, stessi fatti." : "",
  ].filter(Boolean).join("\n");
}

const SYSTEM = `Sei il copywriter di SocialForno. Scrivi post in italiano naturale, come il titolare di un locale. Niente superlativi vuoti, niente inglese. Massimo due emoji, solo se il tono è Amichevole o Divertente. Non inventare indirizzo, telefono, prezzi, sconti o orari. Rispondi solo con JSON: {"testo":"...","hashtag":["#..."]}`;

function parseCopy(raw: string) {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("parse");
  const json = JSON.parse(trimmed.slice(start, end + 1)) as { testo?: unknown; hashtag?: unknown };
  const testo = String(json.testo ?? "").trim();
  if (testo.length < 20) throw new Error("short");
  const hashtag = Array.isArray(json.hashtag)
    ? json.hashtag.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 8).map((tag) => (tag.startsWith("#") ? tag.replace(/\s+/g, "") : `#${tag.replace(/\s+/g, "")}`))
    : [];
  return { testo: testo.slice(0, 1600), hashtag };
}

function aspectFor(input: GenerateInput) {
  if (input.formato === "9:16" || input.formato === "16:9" || input.formato === "1:1") return input.formato;
  return "1:1";
}

function shapeLine(formato?: string) {
  if (formato === "9:16") return "vertical 9:16 framing, like a story";
  if (formato === "16:9") return "horizontal 16:9 framing";
  return "square 1:1 framing";
}

function imagePrompt(input: GenerateInput) {
  const place = input.locale.city ? `in ${input.locale.city}` : "in Italy";
  return `Photorealistic editorial food photograph for an Italian ${input.locale.cuisine || "restaurant"} ${place}. Main subject: ${input.piatto}. ${shapeLine(input.formato)}. Warm natural light, cream stone, dark wood, shallow depth of field, no text, no logo, no watermark, no faces.`;
}

function editPrompt(input: GenerateInput) {
  return `Use the reference photo as the visual source. Keep the same dish or room recognizable. New ${shapeLine(input.formato)} photograph. Focus: ${input.piatto}. Natural light, no text, no logo, no watermark, no faces.`;
}

async function embedImage(url: string) {
  if (url.startsWith("data:image/")) return url;
  const res = await fetch(url);
  if (!res.ok) return url;
  const mime = (res.headers.get("content-type") ?? "image/jpeg").split(";")[0] ?? "image/jpeg";
  if (!mime.startsWith("image/")) return url;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < 1000 || buf.byteLength > 900_000) return url;
  return `data:\( {mime};base64, \){buf.toString("base64")}`;
}

async function postImage(apiKey: string, path: string, body: Record<string, unknown>) {
  return fetch(`https://api.x.ai/v1/images/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
}

export const generateCopy = createServerFn({ method: "POST" })
  .validator((input: GenerateInput) => readInput(input))
  .handler(async ({ data }): Promise<CopyResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "La generazione non è disponibile in questo ambiente." };
    const ticket = await gate();
    if (!ticket.ok) return ticket;
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.7,
          max_tokens: 700,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: buildCopyPrompt(data) },
          ],
        }),
      });
      if (!res.ok) return { ok: false, error: res.status === 429 || res.status >= 500 ? "Il servizio è occupato. Riprova tra poco." : `Non sono riuscito a scrivere il testo (errore ${res.status}).` };
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const parsed = parseCopy(body.choices?.[0]?.message?.content ?? "");
      ticket.stamp();
      return { ok: true, ...parsed, left: ticket.left };
    } catch {
      return { ok: false, error: "La risposta non era utilizzabile. Riprova." };
    }
  });

export const generateImage = createServerFn({ method: "POST" })
  .validator((input: GenerateInput) => readInput(input))
  .handler(async ({ data }): Promise<ImageResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "La generazione immagini non è disponibile in questo ambiente." };
    const ticket = await gate();
    if (!ticket.ok) return ticket;
    let lastStatus = 0;
    try {
      if (data.reference) {
        let res = await postImage(apiKey, "edits", {
          model: "grok-imagine-image-2.0",
          prompt: editPrompt(data),
          image: { url: data.reference, type: "image_url" },
          resolution: "1k",
          response_format: "url",
          quality: "low",
          aspect_ratio: aspectFor(data),
        });
        if (res.status === 400) {
          res = await postImage(apiKey, "edits", {
            model: "grok-imagine-image-2.0",
            prompt: editPrompt(data),
            image: { url: data.reference, type: "image_url" },
            resolution: "1k",
            response_format: "url",
            quality: "low",
          });
        }
        if (res.ok) {
          const body = (await res.json()) as { data?: { url?: string; b64_json?: string }[] };
          const url = body.data?.[0]?.url || (body.data?.[0]?.b64_json ? `data:image/jpeg;base64,${body.data[0].b64_json}` : "");
          const src = url ? await embedImage(url) : "";
          if (src) {
            ticket.stamp();
            return { ok: true, src, left: ticket.left, fromReference: true };
          }
        } else if (res.status === 429) {
          return { ok: false, error: "Il servizio foto è occupato. Riprova tra poco." };
        } else lastStatus = res.status;
      }
      for (const model of ["grok-imagine-image", "grok-imagine-image-2.0"] as const) {
        const res = await postImage(apiKey, "generations", {
          model,
          prompt: imagePrompt(data),
          n: 1,
          aspect_ratio: aspectFor(data),
          resolution: "1k",
          response_format: "url",
          ...(model.endsWith("2.0") ? { quality: "low" } : {}),
        });
        if (!res.ok) {
          lastStatus = res.status;
          if (res.status === 401 || res.status === 403 || res.status === 429) break;
          continue;
        }
        const body = (await res.json()) as { data?: { url?: string }[] };
        const src = await embedImage(body.data?.[0]?.url ?? "");
        if (!src) return { ok: false, error: "Il modello non ha restituito una foto." };
        ticket.stamp();
        return { ok: true, src, left: ticket.left, fromReference: false };
      }
    } catch {
      return { ok: false, error: "Non sono riuscito a preparare la foto. Il testo, se c’è, resta salvato." };
    }
    return { ok: false, error: lastStatus === 429 ? "Il servizio foto è occupato. Riprova tra poco." : "Non sono riuscito a preparare la foto." };
  });
