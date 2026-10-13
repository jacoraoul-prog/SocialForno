import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { DEMO_LEADS, DEMO_POSTS, DEMO_RESTAURANT, type Lead, type Post, type Restaurant, type RestaurantPhoto } from "@/lib/content";

type SocialState = {
  restaurant: Restaurant;
  posts: Post[];
  leads: Lead[];
  hydrated: boolean;
  storageWarning: string | null;
  setHydrated: (value: boolean) => void;
  setRestaurant: (restaurant: Restaurant) => void;
  addPhoto: (photo: RestaurantPhoto) => void;
  removePhoto: (id: string) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  removePost: (id: string) => void;
  duplicatePost: (id: string) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  resetDemo: () => void;
  dismissWarning: () => void;
};

const memory = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return memory.get(name) ?? null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") {
      memory.set(name, value);
      return;
    }
    try {
      localStorage.setItem(name, value);
    } catch {
      queueMicrotask(() => {
        useSocialForno.setState({
          storageWarning: "Memoria del browser piena. Elimina una bozza o una foto e riprova.",
        });
      });
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") {
      memory.delete(name);
      return;
    }
    localStorage.removeItem(name);
  },
};

export const useSocialForno = create<SocialState>()(
  persist(
    (set) => ({
      restaurant: DEMO_RESTAURANT,
      posts: DEMO_POSTS,
      leads: DEMO_LEADS,
      hydrated: false,
      storageWarning: null,
      setHydrated: (hydrated) => set({ hydrated }),
      setRestaurant: (restaurant) => set({ restaurant }),
      addPhoto: (photo) =>
        set((state) => ({
          restaurant: { ...state.restaurant, photos: [...state.restaurant.photos, photo].slice(-4) },
        })),
      removePhoto: (id) =>
        set((state) => ({
          restaurant: { ...state.restaurant, photos: state.restaurant.photos.filter((photo) => photo.id !== id) },
        })),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts].slice(0, 12) })),
      updatePost: (id, patch) =>
        set((state) => ({ posts: state.posts.map((post) => (post.id === id ? { ...post, ...patch } : post)) })),
      removePost: (id) => set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
      duplicatePost: (id) =>
        set((state) => {
          const post = state.posts.find((item) => item.id === id);
          if (!post) return state;
          const now = new Date().toISOString();
          const copy: Post = {
            ...post,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            hashtag: [...post.hashtag],
            images: post.images.map((image) => ({ ...image })),
          };
          return { posts: [copy, ...state.posts].slice(0, 12) };
        }),
      addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads].slice(0, 40) })),
      updateLead: (id, patch) =>
        set((state) => ({ leads: state.leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)) })),
      removeLead: (id) => set((state) => ({ leads: state.leads.filter((lead) => lead.id !== id) })),
      resetDemo: () => set({ restaurant: DEMO_RESTAURANT, posts: DEMO_POSTS, leads: DEMO_LEADS, storageWarning: null }),
      dismissWarning: () => set({ storageWarning: null }),
    }),
    {
      name: "socialforno-v1",
      skipHydration: true,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ restaurant: state.restaurant, posts: state.posts, leads: state.leads }),
    },
  ),
);
