
import { create } from "zustand";


import { fetchAllTrackingLinks, TrackingLinkEntity } from "@/lib/api";

interface TrackingStore {
  trackingLinks: TrackingLinkEntity[];
  fetchTrackingLinks: () => Promise<void>;
}

export const useTrackingStore = create<TrackingStore>((set) => ({
    trackingLinks: [],
    fetchTrackingLinks: async () => {
      try {
        const links = await fetchAllTrackingLinks();
        set({ trackingLinks: links });
      } catch (error) {
        console.error("Failed to fetch tracking links:", error);
      }
    },
  }));
