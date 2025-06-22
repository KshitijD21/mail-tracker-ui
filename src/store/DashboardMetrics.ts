
import { create } from "zustand";

import { DashboardMetrics, fetchDashboardMetrics } from "@/lib/api";

interface DashboardMetricsStore {
  metrics: DashboardMetrics | null;
  fetchMetrics: () => Promise<void>;
}

export const useDashboardMetricsStore = create<DashboardMetricsStore>((set) => ({
  metrics: null,
  fetchMetrics: async () => {
    const data = await fetchDashboardMetrics();
    set({ metrics: data });
  },
}));
