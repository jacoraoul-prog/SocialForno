export const GOALS = [
  "Promozione",
  "Piatto del giorno",
  "Evento",
  "Storia del locale",
  "Menù di stagione",
] as const;

export const TONES = ["Professionale", "Amichevole", "Divertente", "Elegante"] as const;

export const SOCIALS = ["Instagram", "Facebook", "Google Business", "Tutti"] as const;

export const FORMATS = [
  { id: "1:1", label: "Quadrato", hint: "Instagram" },
  { id: "9:16", label: "Verticale", hint: "Stories e Reels" },
  { id: "16:9", label: "Orizzontale", hint: "Facebook e sito" },
] as const;

export const LEAD_STATUSES = ["Da contattare", "Contattato", "Interessato"] as const;

export const CUISINES = [
  "Pizzeria",
  "Pizzeria al taglio",
  "Trattoria",
  "Osteria",
  "Ristorante",
  "Agriturismo",
  "Altro",
] as const;

export type Goal = (typeof GOALS)[number];
export type Tone = (typeof TONES)[number];
export type Social = (typeof SOCIALS)[number];
export type FormatId = (typeof FORMATS)[number]["id"];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type PostImage = { src: string; alt: string };

export type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  obiettivo: string;
  piatto: string;
  tono: string;
  social: string;
  note: string;
  testo: string;
  hashtag: string[];
  images: PostImage[];
  formato?: string;
  referenceId?: string;
  fromReference?: boolean;
  demo: boolean;
};

export type RestaurantPhoto = { id: string; name: string; src: string };

export type Restaurant = {
  name: string;
  city: string;
  cuisine: string;
  description: string;
  photos: RestaurantPhoto[];
  demo: boolean;
};

export type DraftFields = {
  obiettivo: string;
  piatto: string;
  tono: string;
  social: string;
  note: string;
  formato: string;
  referenceId: string;
};

export type Lead = {
  id: string;
  name: string;
  city: string;
  instagram: string;
  status: LeadStatus;
  note: string;
  demo: boolean;
};

export const DEMO_LEADS: Lead[] = [
  { id: "lead-mercato", name: "Trattoria del Mercato", city: "Torino", instagram: "@trattoriamercato", status: "Da contattare", note: "", demo: true },
  { id: "lead-angoli", name: "Pizzeria Quattro Angoli", city: "Torino", instagram: "@quattroangoli", status: "Contattato", note: "", demo: true },
  { id: "lead-erbe", name: "Osteria delle Erbe", city: "Moncalieri", instagram: "@osteriaerbe", status: "Interessato", note: "", demo: true },
];

export function formatLabel(id?: string) {
  return FORMATS.find((item) => item.id === id)?.label ?? "Quadrato";
}

export function frameClass(id?: string) {
  if (id === "9:16") return "frame-story";
  if (id === "16:9") return "frame-wide";
  return "frame-square";
}

export const PLANS = [
  {
    id: "base",
    name: "Base",
    price: "49",
    audience: "Per un locale che pubblica qualche volta a settimana.",
    items: ["Fino a 30 contenuti al mese", "1 immagine per contenuto", "Instagram, Facebook e Google Business", "Modifica del testo e archivio bozze", "1 locale"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "99",
    audience: "Per chi vuole due foto e più di un locale.",
    items: ["Fino a 100 contenuti al mese", "Fino a 2 immagini per contenuto", "Stessi canali, con varianti di tono", "Archivio bozze e modifiche", "Fino a 3 locali", "Generazione prioritaria"],
  },
] as const;

export const DEMO_RESTAURANT: Restaurant = {
  name: "Pizzeria Da Mario",
  city: "Torino",
  cuisine: "Pizzeria",
  description: "Forno a legna dal 1987 in Borgo San Paolo. Impasto a lunga lievitazione, pomodoro San Marzano e fior di latte. Pochi posti, servizio diretto.",
  photos: [
    { id: "demo-forno", name: "Forno a legna", src: "/demo/forno.jpg" },
    { id: "demo-margherita", name: "Margherita", src: "/demo/margherita.jpg" },
  ],
  demo: true,
};

export const DEMO_POSTS: Post[] = [
  {
    id: "demo-margherita",
    createdAt: "2026-04-02T10:30:00.000Z",
    updatedAt: "2026-04-02T10:30:00.000Z",
    obiettivo: "Piatto del giorno",
    piatto: "Margherita del forno",
    tono: "Amichevole",
    social: "Instagram",
    note: "",
    testo: "Oggi dal forno esce la Margherita.\n\nImpasto a lunga lievitazione, pomodoro San Marzano, fior di latte e basilico. La crosta ha le macchie scure: la pietra è alla temperatura giusta.\n\nSe sei a Borgo San Paolo, passa a pranzo. Ne facciamo finché il forno tiene.",
    hashtag: ["#PizzeriaTorino", "#FornoALegna", "#BorgoSanPaolo", "#PizzaNapoletana", "#Torino"],
    images: [{ src: "/demo/margherita.jpg", alt: "Pizza margherita, esempio dimostrativo" }],
    demo: true,
  },
  {
    id: "demo-suppli",
    createdAt: "2026-04-03T16:00:00.000Z",
    updatedAt: "2026-04-03T16:00:00.000Z",
    obiettivo: "Promozione",
    piatto: "Supplì al telefono",
    tono: "Divertente",
    social: "Facebook",
    note: "",
    testo: "Lo stuzzichino di oggi è il supplì.\n\nCrosta calda, riso al pomodoro e mozzarella che fila. A pranzo ne facciamo una teglia: quando finiscono, finiscono. Niente lista d’attesa, si chiede al banco.",
    hashtag: ["#Supplì", "#PizzeriaTorino", "#StreetFoodTorino"],
    images: [{ src: "/demo/suppli.jpg", alt: "Supplì con mozzarella filante, esempio dimostrativo" }],
    demo: true,
  },
  {
    id: "demo-tiramisu",
    createdAt: "2026-04-04T18:15:00.000Z",
    updatedAt: "2026-04-04T18:15:00.000Z",
    obiettivo: "Piatto del giorno",
    piatto: "Tiramisù della casa",
    tono: "Elegante",
    social: "Google Business",
    note: "",
    testo: "Il dolce della casa è il tiramisù, preparato al mattino.\n\nSavoiardi, caffè e mascarpone. Se resti a cena, conviene tenerlo in conto prima che finisca la teglia.\n\nPizzeria Da Mario, Borgo San Paolo, Torino.",
    hashtag: [],
    images: [{ src: "/demo/tiramisu.jpg", alt: "Tiramisù in coppetta, esempio dimostrativo" }],
    demo: true,
  },
];

export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function slugify(value: string) {
  const slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return slug || "post";
}

export function captionOf(post: Pick<Post, "testo" | "hashtag">) {
  const tags = post.hashtag.filter(Boolean).join(" ");
  return tags ? `\( {post.testo.trim()}\n\n \){tags}` : post.testo.trim();
}
