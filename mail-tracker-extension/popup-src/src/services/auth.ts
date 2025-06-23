import { MockUser, User } from '../types/auth';
import { getUserProfile, loginUser, registerUser } from './api';

// Mock user data for demonstration (fallback)
const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    avatar: "JD"
  },
  {
    id: 2,
    email: "jane@example.com",
    password: "password456",
    name: "Jane Smith",
    avatar: "JS"
  },
  {
    id: 3,
    email: "demo@mailtracker.com",
    password: "demo123",
    name: "Demo User",
    avatar: "DU"
  }
];

class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      // Try real API login first
      console.log('🔐 Attempting API login for:', email);
      const response = await loginUser(email, password);

      if (response.status === 'success') {
        // Parse the token from the response
        const token = response.data;

        // Get user profile to get full user data
        try {
          const userProfile = await this.getUserProfileWithToken(token);

          const userData: User = {
            id: userProfile.id || Date.now(),
            email: email,
            name: userProfile.userName || userProfile.name || email.split('@')[0],
            avatar: this.generateAvatar(userProfile.userName || userProfile.name || email),
            token: token
          };

          // Save to Chrome storage
          await this.saveAuthState(userData);
          console.log('✅ API login successful');
          return userData;
        } catch (profileError) {
          console.warn('⚠️ Could not fetch profile, using basic user data');
          // Fallback if profile fetch fails
          const userData: User = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            avatar: this.generateAvatar(email),
            token: token
          };

          await this.saveAuthState(userData);
          return userData;
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (apiError: any) {
      console.warn('⚠️ API login failed, trying mock login:', apiError.message);

      // Fallback to mock authentication for development
      return this.mockLogin(email, password);
    }
  }

  private async getUserProfileWithToken(token: string): Promise<any> {
    // Temporarily save token to storage for the API call
    await chrome.storage.local.set({ tempToken: token });

    try {
      const profile = await getUserProfile();
      await chrome.storage.local.remove(['tempToken']);
      return profile;
    } catch (error) {
      await chrome.storage.local.remove(['tempToken']);
      throw error;
    }
  }

  private async mockLogin(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      token: `mock_token_${user.id}_${Date.now()}`
    };

    // Save to Chrome storage
    await this.saveAuthState(userData);
    return userData;
  }

  private generateAvatar(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  async register(email: string, userName: string, password: string): Promise<User> {
    try {
      console.log('📝 Attempting API registration for:', email);
      const response = await registerUser(email, userName, password);

      if (response.status === 'success') {
        console.log('✅ Registration successful, now logging in...');
        // After successful registration, log the user in
        return this.login(email, password);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (apiError: any) {
      console.error('❌ API registration failed:', apiError.message);
      throw new Error(apiError.response?.data?.message || apiError.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    await this.clearAuthState();
  }

  async getCurrentUser(): Promise<User | null> {
    const result = await chrome.storage.local.get(['authState', 'isAuthenticated']);
    if (result.isAuthenticated && result.authState) {
      return result.authState;
    }
    return null;
  }

  private async saveAuthState(userData: User): Promise<void> {
    return chrome.storage.local.set({
      authState: userData,
      isAuthenticated: true
    });
  }

  private async clearAuthState(): Promise<void> {
    return chrome.storage.local.remove(['authState', 'isAuthenticated']);
  }
}

export const authService = new AuthService();

// Legacy functions for backwards compatibility
export const mockLogin = async (email: string, password: string): Promise<User> => {
  return authService.login(email, password);
};

export const saveAuthState = async (authData: User): Promise<void> => {
  return chrome.storage.local.set({
    authState: authData,
    isAuthenticated: true
  });
};

export const getAuthState = async (): Promise<{ authState?: User; isAuthenticated?: boolean }> => {
  const result = await chrome.storage.local.get(['authState', 'isAuthenticated']);
  return result;
};

export const clearAuthState = async (): Promise<void> => {
  return chrome.storage.local.remove(['authState', 'isAuthenticated']);
};

export const notifyContentScript = async (authData: User | null): Promise<void> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id && tab.url && tab.url.includes('mail.google.com')) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'authStateChanged',
        authData: authData
      });
    }
  } catch (error) {
    console.log('Could not notify content script:', error);
  }
};
