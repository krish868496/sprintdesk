import { authService } from "./auth.service";
import { authStorage } from "./auth.storage";
import { useAuthStore } from "./auth.store";
import { tokenManager } from "./auth.token";
import type { LoginCredentials } from "./auth.types";

export async function login(credentials: LoginCredentials) {
  const response = await authService.login(credentials);

  const user = {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    image: response.image,
  };

  // Access token → memory
  useAuthStore.getState().setSession(user, response.accessToken);

  // Refresh token → localStorage
  authStorage.setRefreshToken(response.refreshToken);

  // User → localStorage
  authStorage.setUser(user);

  // Simulated expiration
  tokenManager.setExpiration(30);

  return user;
}

export function logout() {
  authStorage.clear();

  tokenManager.clear();

  useAuthStore.getState().clearSession();
}