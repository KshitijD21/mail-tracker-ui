// Extension API service
import api from './axios';

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  timestamp: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    userName: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<ApiResponse<string>> => {
  const res = await api.post<ApiResponse<string>>("/login", {
    email,
    password,
  });
  return res.data;
};

export const registerUser = async (email: string, userName: string, password: string): Promise<ApiResponse<any>> => {
  const res = await api.post<ApiResponse<any>>("/register", {
    email,
    userName,
    password
  });
  return res.data;
};

export const fetchGoogleOAuthUrl = async (): Promise<string> => {
  try {
    const response = await api.get<{ authUrl: string }>('/connect/google');
    return response.data.authUrl;
  } catch (error) {
    console.error('Failed to get Google OAuth URL:', error);
    throw new Error('Could not initiate Google OAuth. Please try again later.');
  }
};

// Get user profile/verify token
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await api.get('/profile'); // Assuming you have a profile endpoint
    return response.data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
};

// Get AI response for email
export const getAIResponse = async (emailBody: string): Promise<string> => {
  try {
    console.log("🔄 Calling getAIResponse...");
    const response = await api.post("/ai/getResponse", {
      emailBody: emailBody,
    });
    console.log("🤖 AI Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ getAIResponse error:", error);
    throw new Error("Failed to get AI response");
  }
};
