import { authService } from "./auth.service";
import { authStorage } from "./auth.storage";
import { useAuthStore } from "./auth.store";
import { tokenManager } from "./auth.token";

export async function initializeAuth() {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    useAuthStore.getState().setInitializing(false);

    return;
  }

  try {
    const response = await authService.refresh(refreshToken);

    const user = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      image: response.image,
    };

    useAuthStore.getState().setSession(user, response.accessToken);

    // DummyJSON may return a new refresh token.
    if (response.refreshToken) {
      authStorage.setRefreshToken(response.refreshToken);
    }

    tokenManager.setExpiration(30);
  } catch {
    authStorage.clearRefreshToken();
    tokenManager.clear();
    useAuthStore.getState().clearSession();
  } finally {
    useAuthStore.getState().setInitializing(false);
  }
}
