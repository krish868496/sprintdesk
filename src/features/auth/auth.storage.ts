const REFRESH_TOKEN_KEY = "sprintdesk_refresh_token";
const USER_KEY = "sprintdesk_user";

export const authStorage = {
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setUser(user: unknown) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const value = localStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },

  clearRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearUser() {
    localStorage.removeItem(USER_KEY);
  },

  clear() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
