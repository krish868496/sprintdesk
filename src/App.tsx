import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "./app/router";

import { useAuthStore } from "./features/auth/auth.store";
import { authStorage } from "./features/auth/auth.storage";
import { authService } from "./features/auth/auth.service";
import { tokenManager } from "./features/auth/auth.token";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  useEffect(() => {
    async function initializeAuth() {
      try {
        const refreshToken = authStorage.getRefreshToken();

        // No previous session
        if (!refreshToken) {
          return;
        }

        const user = authStorage.getUser();

        // Refresh token exists but user doesn't
        if (!user) {
          authStorage.clear();
          return;
        }

        // Get a new access token
        const response = await authService.refresh(refreshToken);

        // Restore Zustand session
        useAuthStore.getState().setSession(user, response.accessToken);

        // Store rotated refresh token if API sends one
        if (response.refreshToken) {
          authStorage.setRefreshToken(response.refreshToken);
        }

        // Simulated token expiration
        tokenManager.setExpiration(30);
      } catch (error) {
        console.error("Failed to restore session:", error);

        useAuthStore.getState().clearSession();

        authStorage.clear();

        tokenManager.clear();
      } finally {
        useAuthStore.getState().setInitializing(false);
      }
    }

    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
