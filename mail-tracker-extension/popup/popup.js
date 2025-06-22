// Mock user data for demonstration
const MOCK_USERS = [
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

// Authentication functions
async function mockLogin(email, password) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    token: `mock_token_${user.id}_${Date.now()}`
  };
}

async function saveAuthState(authData) {
  return chrome.storage.local.set({
    authState: authData,
    isAuthenticated: true
  });
}

async function getAuthState() {
  const result = await chrome.storage.local.get(['authState', 'isAuthenticated']);
  return result;
}

async function clearAuthState() {
  return chrome.storage.local.remove(['authState', 'isAuthenticated']);
}

// Notify content script about auth state changes
async function notifyContentScript(authData) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('mail.google.com')) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'authStateChanged',
        authData: authData
      });
    }
  } catch (error) {
    console.log('Could not notify content script:', error);
  }
}

// UI Management
class PopupUI {
  constructor() {
    this.loginForm = document.getElementById('loginForm');
    this.userInfo = document.getElementById('userInfo');
    this.loading = document.getElementById('loading');
    this.errorMessage = document.getElementById('errorMessage');

    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.logoutBtn = document.getElementById('logoutBtn');

    this.userAvatar = document.getElementById('userAvatar');
    this.userName = document.getElementById('userName');
    this.userEmail = document.getElementById('userEmail');

    this.initEventListeners();
    this.checkAuthState();
  }

  initEventListeners() {
    this.loginBtn.addEventListener('click', () => this.handleLogin());
    this.logoutBtn.addEventListener('click', () => this.handleLogout());

    // Enter key support
    [this.emailInput, this.passwordInput].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleLogin();
        }
      });
    });
  }

  async checkAuthState() {
    const { authState, isAuthenticated } = await getAuthState();

    if (isAuthenticated && authState) {
      this.showUserInfo(authState);
    } else {
      this.showLoginForm();
    }
  }

  async handleLogin() {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value.trim();

    if (!email || !password) {
      this.showError('Please enter both email and password');
      return;
    }

    this.showLoading();

    try {
      const authData = await mockLogin(email, password);
      await saveAuthState(authData);
      await notifyContentScript(authData);
      this.showUserInfo(authData);
    } catch (error) {
      this.showError(error.message);
      this.showLoginForm();
    }
  }

  async handleLogout() {
    await clearAuthState();
    await notifyContentScript(null);
    this.showLoginForm();
    this.clearForm();
  }

  showLoginForm() {
    this.loginForm.style.display = 'flex';
    this.userInfo.style.display = 'none';
    this.loading.style.display = 'none';
    this.hideError();
  }

  showUserInfo(authData) {
    this.loginForm.style.display = 'none';
    this.userInfo.style.display = 'block';
    this.loading.style.display = 'none';

    this.userAvatar.textContent = authData.avatar;
    this.userName.textContent = authData.name;
    this.userEmail.textContent = authData.email;

    this.hideError();
  }

  showLoading() {
    this.loginForm.style.display = 'none';
    this.userInfo.style.display = 'none';
    this.loading.style.display = 'block';
    this.hideError();
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
  }

  hideError() {
    this.errorMessage.style.display = 'none';
  }

  clearForm() {
    this.emailInput.value = '';
    this.passwordInput.value = '';
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupUI();
});

// Add demo credentials hint
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  emailInput.addEventListener('focus', () => {
    if (!emailInput.value) {
      emailInput.placeholder = 'Try: demo@mailtracker.com';
    }
  });

  const passwordInput = document.getElementById('password');
  passwordInput.addEventListener('focus', () => {
    if (!passwordInput.value) {
      passwordInput.placeholder = 'Try: demo123';
    }
  });
});
