import { createBrowserRouter, Navigate } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { BoardPage } from "../pages/BoardPage";

import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
import { TaskBoardPage } from "../pages/TaskBoardPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "/board",
            element: <TaskBoardPage />,
          },
        ],
      },
    ],
  },
]);
