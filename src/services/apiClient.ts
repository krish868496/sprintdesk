import { useAuthStore } from "../features/auth/auth.store";
import { authStorage } from "../features/auth/auth.storage";
import { tokenManager } from "../features/auth/auth.token";
import { authService } from "../features/auth/auth.service";

const API_BASE_URL = "https://dummyjson.com";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh the access token.
 *
 * Multiple requests that receive 401 will share
 * the same refresh promise instead of making
 * multiple refresh requests.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  refreshPromise = (async () => {
    try {
      const response = await authService.refresh(refreshToken);

      const currentUser = useAuthStore.getState().user;

      if (!currentUser) {
        return null;
      }

      useAuthStore.getState().setSession(currentUser, response.accessToken);

      if (response.refreshToken) {
        authStorage.setRefreshToken(response.refreshToken);
      }

      tokenManager.setExpiration(30);

      return response.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Centralized API request function.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {},
  hasRetried = false,
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const accessToken = useAuthStore.getState().accessToken;

  const tokenExpired = !skipAuth && !!accessToken && tokenManager.isExpired();

  const headers = new Headers(fetchOptions.headers);

  headers.set("Content-Type", "application/json");

  if (!skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;

  /*
   * Simulate token expiration.
   *
   * In a real application the backend would
   * return 401 when the token is expired.
   */
  if (tokenExpired) {
    response = new Response(null, {
      status: 401,
    });
  } else {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
    });
  }

  /*
   * Normal response.
   */
  if (response.status !== 401 || skipAuth) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  /*
   * Prevent infinite refresh loops.
   */
  if (hasRetried) {
    useAuthStore.getState().clearSession();

    authStorage.clearRefreshToken();
    tokenManager.clear();

    throw new Error("Authentication failed after token refresh");
  }

  /*
   * Access token expired.
   */
  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    useAuthStore.getState().clearSession();

    authStorage.clearRefreshToken();
    tokenManager.clear();

    throw new Error("Session expired");
  }

  /*
   * Retry the original request once
   * using the new access token.
   */
  headers.set("Authorization", `Bearer ${newAccessToken}`);

  return request<T>(
    path,
    {
      ...options,
      headers,
    },
    true,
  );
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>(path, {
      ...options,
      method: "GET",
    });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string, options?: RequestOptions) {
    return request<T>(path, {
      ...options,
      method: "DELETE",
    });
  },
};
