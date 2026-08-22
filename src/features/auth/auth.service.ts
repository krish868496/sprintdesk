import type { AuthResponse, LoginCredentials } from "./auth.types";

const AUTH_BASE_URL = "https://dummyjson.com";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 30,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    return response.json();
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 30,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh session");
    }

    return response.json();
  },
};
