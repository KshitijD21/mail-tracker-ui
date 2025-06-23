import React, { useEffect, useState } from "react";
import { LoadingSpinner, LoginForm, UserProfile } from "./components";
import { authService } from "./services/auth";
import { AuthState, User } from "./types/auth";

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is already authenticated on popup open
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.getCurrentUser();

      setAuthState({
        isAuthenticated: !!user,
        user,
        isLoading: false,
        error: null,
      });

      // Notify content script about auth state
      notifyContentScript(!!user, user);
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Failed to check authentication state",
      });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.login(email, password);

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });

      // Notify content script about successful login
      notifyContentScript(true, user);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
    }
  };

  const handleRegister = async (
    email: string,
    userName: string,
    password: string
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.register(email, userName, password);

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });

      // Notify content script about successful registration/login
      notifyContentScript(true, user);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
    }
  };

  const handleLogout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authService.logout();

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });

      // Notify content script about logout
      notifyContentScript(false, null);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Logout failed",
      }));
    }
  };

  const notifyContentScript = (isAuthenticated: boolean, user: User | null) => {
    // Send message to content script about auth state change
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs
          .sendMessage(tabs[0].id, {
            type: "AUTH_STATE_CHANGED",
            payload: { isAuthenticated, user },
          })
          .catch(() => {
            // Ignore errors if content script is not available
            console.log("Content script not available");
          });
      }
    });
  };

  if (authState.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="popup-container">
      {authState.isAuthenticated && authState.user ? (
        <UserProfile
          user={authState.user}
          onLogout={handleLogout}
          isLoggingOut={authState.isLoading}
        />
      ) : (
        <LoginForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          error={authState.error}
          isLoading={authState.isLoading}
        />
      )}
    </div>
  );
};

export default App;
