import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import type { DraftFields, Post } from "@/lib/content";
import { generateCopy, generateImage, type GenerateInput } from "@/lib/generate";
import { srcToReference } from "@/lib/reference";
import { useSocialForno } from "@/lib/store";

function payload(fields: DraftFields, variant: 1 | 2, reference?: string): GenerateInput {
  const restaurant = useSocialForno.getState().restaurant;
  return {
    obiettivo: fields.obiettivo,
    piatto: fields.piatto,
    tono: fields.tono,
    social: fields.social,
    note: fields.note,
    formato: fields.formato,
    variant,
    reference,
    locale: {
      name: restaurant.name,
      city: restaurant.city,
      cuisine: restaurant.cuisine,
      description: restaurant.description,
    },
  };
}

function fieldsOf(post: Post): DraftFields {
  return {
    obiettivo: post.obiettivo,
    piatto: post.piatto,
    tono: post.tono,
    social: post.social,
    note: post.note,
    formato: post.formato || "1:1",
    referenceId: post.referenceId || "",
  };
}

async function referenceFor(referenceId: string) {
  if (!referenceId) return undefined;
  const photo = useSocialForno.getState().restaurant.photos.find((item) => item.id === referenceId);
  if (!photo) return undefined;
  try {
    return await srcToReference(photo.src);
  } catch {
    return undefined;
  }
}

export function useGenerate() {
  const copyFn = useServerFn(generateCopy);
  const imageFn = useServerFn(generateImage);
  const addPost = useSocialForno((state) => state.addPost);
  const updatePost = useSocialForno((state) => state.updatePost);
  const [busy, setBusy] = useState<null | "testo" | "foto" | "tutto" | "versione">(null);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const live = useRef(true);

  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
    };
  }, []);

  async function compose(fields: DraftFields, variant: 1 | 2) {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const reference = await referenceFor(fields.referenceId);
    const copy = await copyFn({ data: payload(fields, variant) });
    if (!copy.ok) {
      setError(copy.error);
      setBusy(null);
      return null;
    }
    setLeft(copy.left);
    const restaurant = useSocialForno.getState().restaurant;
    addPost({
      id,
      createdAt: now,
      updatedAt: now,
      obiettivo: fields.obiettivo,
      piatto: fields.piatto,
      tono: fields.tono,
      social: fields.social,
      note: fields.note,
      formato: fields.formato,
      referenceId: fields.referenceId || undefined,
      testo: copy.testo,
      hashtag: copy.hashtag,
      images: [],
      fromReference: false,
      demo: restaurant.demo,
    });
    setBusy("foto");
    const image = await imageFn({ data: payload(fields, variant, reference) });
    if (image.ok) {
      setLeft(image.left);
      updatePost(id, { images: [{ src: image.src, alt: fields.piatto }], fromReference: image.fromReference, updatedAt: new Date().toISOString() });
      if (fields.referenceId && !image.fromReference) setError("Testo salvato. Non sono riuscito a usare la foto di riferimento, quindi la foto è nuova.");
    } else setError(`Testo salvato. ${image.error}`);
    setBusy(null);
    return id;
  }

  async function createPost(fields: DraftFields) {
    setError(null);
    setBusy("testo");
    try {
      return await compose(fields, 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualcosa è andato storto. Riprova.");
      setBusy(null);
      return null;
    }
  }

  async function anotherVersion(post: Post) {
    setError(null);
    setBusy("versione");
    try {
      return await compose(fieldsOf(post), 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualcosa è andato storto. Riprova.");
      setBusy(null);
      return null;
    }
  }

  async function regenerate(post: Post) {
    setError(null);
    setBusy("tutto");
    const fields = fieldsOf(post);
    try {
      const copy = await copyFn({ data: payload(fields, 1) });
      if (!copy.ok) {
        setError(copy.error);
        return;
      }
      setLeft(copy.left);
      updatePost(post.id, { testo: copy.testo, hashtag: copy.hashtag, formato: fields.formato, referenceId: fields.referenceId || undefined, updatedAt: new Date().toISOString() });
      setBusy("foto");
      const image = await imageFn({ data: payload(fields, 1, await referenceFor(fields.referenceId)) });
      if (image.ok) {
        setLeft(image.left);
        updatePost(post.id, { images: [{ src: image.src, alt: post.piatto }], fromReference: image.fromReference, updatedAt: new Date().toISOString() });
        if (fields.referenceId && !image.fromReference) setError("Testo aggiornato. La foto di riferimento non è stata usata: ne ho preparata una nuova.");
      } else setError(`Testo aggiornato. ${image.error}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualcosa è andato storto. Riprova.");
    } finally {
      setBusy(null);
    }
  }

  async function addSecondImage(post: Post) {
    if (post.images.length >= 2) return;
    setError(null);
    setBusy("foto");
    try {
      const image = await imageFn({ data: payload(fieldsOf(post), 2, await referenceFor(post.referenceId || "")) });
      if (!image.ok) {
        setError(image.error);
        return;
      }
      setLeft(image.left);
      updatePost(post.id, { images: [...post.images, { src: image.src, alt: `${post.piatto}, altra inquadratura` }], updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Non sono riuscito a preparare la seconda foto.");
    } finally {
      setBusy(null);
    }
  }

  return { busy, error, left, setError, createPost, regenerate, anotherVersion, addSecondImage, live };
}
