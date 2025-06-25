// lib/api.ts
import api from "./axios";

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  timestamp: string;
}

export interface TrackingLinkEntity {
  id: string;
  userId?: string;
  code: string;
  recipientEmail: string;
  subject: string;
  totalOpens: number;
  createdAt: string;
  opened: boolean;
}

export interface DashboardMetrics {
  totalEmailsSent: number;
  totalUniqueRecipients: number;
  totalOpens: number;
  openRate: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}


export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const loginUser = async (email: string, password: string) : Promise<ApiResponse<string>> => {
  const res = await api.post<ApiResponse<string>>("/login", {
    email,
    password,
  });

  return res.data;
};

export const registerUser = async (email: string, userName: string, password: string) => {
  const res = await api.post("/register", {
    email,
    userName,
    password
  })
  return res.data;
}

export const fetchGoogleOAuthUrl = async () => {
  try {
        const response = await api.get<{ authUrl: string }>('/connect/google');
        return response.data.authUrl;
  } catch (error) {
     console.error('Failed to get Google OAuth URL:', error);
    throw new Error('Could not initiate Google OAuth. Please try again later.');
  }
}

export async function fetchAllTrackingLinks(): Promise<TrackingLinkEntity[]> {
  try {
    console.log("🔄 Calling fetchAllTrackingLinks...");
    const res = await api.get("/allEmailData");

    console.log("📊 fetchAllTrackingLinks response:", res.data);

    // Handle case where response.data might be null or undefined
    if (!res.data || !Array.isArray(res.data)) {
      console.warn("⚠️ fetchAllTrackingLinks: Invalid response data", res.data);
      return [];
    }

    // Optional: pick only fields you need
    const newData = res.data.map((item: TrackingLinkEntity) => ({
      id: item.id,
      recipientEmail: item.recipientEmail,
      subject: item.subject,
      totalOpens: item.totalOpens,
      createdAt: item.createdAt,
      opened: item.opened,
      code: item.code,
    }));

    console.log("📊 fetchAllTrackingLinks processed data:", newData)  ;
      return newData;
  } catch (err) {
    console.error("❌ fetchAllTrackingLinks error:", err);
    // Return empty array instead of throwing to prevent crash
    return [];
  }
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    console.log("🔄 Calling fetchDashboardMetrics...");
    const response = await api.get("/fetchDashboardMetrics");
    console.log("📊 fetchDashboardMetrics response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ fetchDashboardMetrics error:", error);
    // Return default values instead of throwing to prevent crash
    return {
      totalEmailsSent: 0,
      totalUniqueRecipients: 0,
      totalOpens: 0,
      openRate: 0,
    };
  }
}

export async function fetchOpenChartData(trackingId: string, dateRange: { startDate: Date; endDate: Date }) {
  const res = await api.post(`/open-chart/${trackingId}`, {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  return res.data;
}

// Follow-up API endpoints
export async function setFollowUp(trackingId: string, isFollowUp: boolean): Promise<string> {
  try {
    const response = await api.post("/followup/set", null, {
      params: {
        trackingId,
        isFollowUp,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ setFollowUp error:", error);
    throw new Error("Failed to update follow-up status");
  }
}

export async function getAllFollowUps(): Promise<TrackingLinkEntity[]> {
  try {
    const response = await api.get("/followup/all");
    console.log("📊 getAllFollowUps response:", response.data);

    // Process the data to match TrackingLinkEntity interface
    const followUpData = response.data.map((item: TrackingLinkEntity) => ({
      id: item.id,
      recipientEmail: item.recipientEmail,
      subject: item.subject,
      totalOpens: item.totalOpens,
      createdAt: item.createdAt,
      opened: item.opened,
      code: item.code,
    }));

    console.log("📊 getAllFollowUps processed data:", followUpData);
    return followUpData;
  } catch (error) {
    console.error("❌ getAllFollowUps error:", error);
    throw new Error("Failed to fetch follow-up items");
  }
}
