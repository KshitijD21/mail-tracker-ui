import React from "react";
import { User } from "../types/auth";

interface UserProfileProps {
  user: User;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onLogout,
  isLoggingOut,
}) => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="logo">
          <div className="logo-icon">📧</div>
          <h2>Mail Tracker</h2>
        </div>
        <div className="status-indicator">
          <div className="status-dot active"></div>
          <span>Active</span>
        </div>
      </div>

      <div className="profile-card">
        <div className="avatar">{user.avatar}</div>
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-email">{user.email}</p>
        </div>
      </div>

      <div className="feature-status">
        <div className="feature-item">
          <div className="feature-icon">✅</div>
          <div className="feature-text">
            <strong>Email Tracking</strong>
            <p>Your emails will be tracked automatically</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🔒</div>
          <div className="feature-text">
            <strong>Privacy Protected</strong>
            <p>Only you can see tracking data</p>
          </div>
        </div>
      </div>

      <div className="actions">
        <button
          className="logout-button"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>

      <div className="footer">
        <p className="version">v1.0.0</p>
      </div>
    </div>
  );
};

export default UserProfile;
