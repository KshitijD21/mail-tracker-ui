import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister?: (
    email: string,
    userName: string,
    password: string
  ) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onRegister,
  error,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    if (isRegisterMode) {
      if (!userName) return;
      if (onRegister) {
        await onRegister(email, userName, password);
      }
    } else {
      await onLogin(email, password);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegisterMode(false);
    onLogin(demoEmail, demoPassword);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setUserName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          <div className="logo-icon">📧</div>
          <h2>Mail Tracker</h2>
        </div>
        <p className="subtitle">Track your email opens</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}

        {isRegisterMode && (
          <div className="form-group">
            <label htmlFor="userName">Name</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={
            isLoading || !email || !password || (isRegisterMode && !userName)
          }
        >
          {isLoading
            ? isRegisterMode
              ? "Creating Account..."
              : "Signing in..."
            : isRegisterMode
            ? "Create Account"
            : "Sign In"}
        </button>

        <button
          type="button"
          className="toggle-mode-button"
          onClick={toggleMode}
          disabled={isLoading}
        >
          {isRegisterMode
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </button>

        {!isRegisterMode && (
          <div className="demo-section">
            <button
              type="button"
              className="demo-toggle"
              onClick={() => setShowDemo(!showDemo)}
              disabled={isLoading}
            >
              {showDemo ? "Hide" : "Show"} Demo Accounts
            </button>

            {showDemo && (
              <div className="demo-accounts">
                <p className="demo-title">Demo Accounts:</p>
                <button
                  type="button"
                  className="demo-account"
                  onClick={() =>
                    handleDemoLogin("john@example.com", "password123")
                  }
                  disabled={isLoading}
                >
                  John Doe (john@example.com)
                </button>
                <button
                  type="button"
                  className="demo-account"
                  onClick={() =>
                    handleDemoLogin("jane@example.com", "password456")
                  }
                  disabled={isLoading}
                >
                  Jane Smith (jane@example.com)
                </button>
                <button
                  type="button"
                  className="demo-account"
                  onClick={() =>
                    handleDemoLogin("demo@mailtracker.com", "demo123")
                  }
                  disabled={isLoading}
                >
                  Demo User (demo@mailtracker.com)
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
