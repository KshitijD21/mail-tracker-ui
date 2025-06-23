export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  token: string;
}

export interface MockUser {
  id: number;
  email: string;
  password: string;
  name: string;
  avatar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
