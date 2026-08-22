import {
  LayoutDashboard,
  KanbanSquare,
  BarChart3,
  LogOut,
  Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { logout } from "../../features/auth/auth.actions";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sprint Board",
    path: "/board",
    icon: KanbanSquare,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950">
              SprintDesk
            </p>

            <p className="text-[11px] text-slate-400">Team workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={[
                        "h-4 w-4 transition",
                        isActive
                          ? "text-violet-600"
                          : "text-slate-400 group-hover:text-slate-600",
                      ].join(" ")}
                    />

                    <span>{item.label}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-3">
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-500" />
          Logout
        </button>
      </div>
    </aside>
  );
}
