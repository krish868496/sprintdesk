import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "./auth.store";

export function ProtectedRoute() {
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
