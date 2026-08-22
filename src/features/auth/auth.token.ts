let tokenExpiresAt: number | null = null;

export const tokenManager = {
  setExpiration(expiresInSeconds: number) {
    tokenExpiresAt = Date.now() + expiresInSeconds * 1000;
  },

  isExpired() {
    if (!tokenExpiresAt) {
      return true;
    }

    return Date.now() >= tokenExpiresAt;
  },

  clear() {
    tokenExpiresAt = null;
  },
};
