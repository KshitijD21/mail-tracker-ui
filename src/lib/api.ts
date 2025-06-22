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
    const res = await api.get("/allEmailData");

    console.log("📊 fetchAllTrackingLinks response:", res.data);

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
    return [];
  }
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await api.get("/fetchDashboardMetrics");
    return response.data;
  } catch (error) {
    console.error("❌ fetchDashboardMetrics error:", error);
    throw new Error("Failed to fetch dashboard metrics");
  }
}

export async function fetchOpenChartData(trackingId: string, dateRange: { startDate: Date; endDate: Date }) {
  const res = await api.post(`/open-chart/${trackingId}`, {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  return res.data;
}
