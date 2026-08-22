import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const TaskBoardPage = lazy(() => import("../pages/TaskBoardPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-sm font-medium text-slate-500">Loading...</div>
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    path: "/login",
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: "/analytics",
            element: (
              <LazyPage>
                <AnalyticsPage />
              </LazyPage>
            ),
          },
          {
            path: "/board",
            element: (
              <LazyPage>
                <TaskBoardPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
]);
