import api from './api';

const AUTH_KEY = 'elite_travel_auth';
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const TWO_FA_KEY = 'elite_travel_2fa';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const loginData = response.data.data;
    
    if (loginData?.token || loginData?.requires2FA) {
      // SessionStorage only - no localStorage
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        token: loginData.token,
        user: loginData.user,
        loginTime: Date.now(),
        requires2FA: loginData.requires2FA || false,
        tempToken: loginData.tempToken,
        isFirstTimeSetup: loginData.isFirstTimeSetup || false,
        qrCodeUrl: loginData.qrCodeUrl,
        secret: loginData.secret
      }));
      
      // Start session timeout only if fully logged in
      if (loginData.token) {
        authService.startSessionTimeout();
      }
    }
    return loginData;
  },

  // Verify 2FA
  verify2FA: async (code, tempToken) => {
    const response = await api.post('/auth/verify-2fa', { code, tempToken });
    const verifyData = response.data.data;
    
    if (verifyData?.token) {
      const auth = JSON.parse(sessionStorage.getItem(AUTH_KEY) || '{}');
      auth.token = verifyData.token;
      auth.user = verifyData.user || auth.user;
      auth.requires2FA = false;
      auth.isFirstTimeSetup = false;
      auth.tempToken = null;
      auth.qrCodeUrl = null;
      auth.secret = null;
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      authService.startSessionTimeout();
    }
    return verifyData;
  },

  // Get current auth
  getAuth: () => {
    try {
      const auth = JSON.parse(sessionStorage.getItem(AUTH_KEY) || 'null');
      if (!auth) return null;

      // Check if session expired
      const elapsed = Date.now() - auth.loginTime;
      if (elapsed > SESSION_TIMEOUT) {
        authService.logout();
        return null;
      }

      return auth;
    } catch {
      return null;
    }
  },

  // Get token
  getToken: () => {
    const auth = authService.getAuth();
    return auth?.token || null;
  },

  // Logout
  logout: () => {
    sessionStorage.removeItem(AUTH_KEY);
    if (authService.timeoutId) {
      clearTimeout(authService.timeoutId);
    }
  },

  // Start session timeout
  startSessionTimeout: () => {
    if (authService.timeoutId) clearTimeout(authService.timeoutId);
    
    authService.timeoutId = setTimeout(() => {
      authService.logout();
      window.location.href = '/login';
    }, SESSION_TIMEOUT);
  },

  // Is authenticated
  isAuthenticated: () => {
    return authService.getToken() !== null;
  },

  // Get user
  getUser: () => {
    const auth = authService.getAuth();
    return auth?.user || null;
  }
};
