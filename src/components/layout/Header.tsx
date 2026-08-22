import { Bell, ChevronDown, Search } from "lucide-react";

import { useAuthStore } from "../../features/auth/auth.store";

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="hidden text-sm text-slate-500 sm:block">
          Workspace
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-medium text-slate-900">Sprint</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-300 hover:bg-white sm:flex"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />

          <span>Search</span>

          <kbd className="ml-4 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            ⌘ K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-[18px] w-[18px]" />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
        </button>

        {/* User */}
        <button className="ml-1 flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50">
          {user?.image ? (
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
              {user?.firstName?.[0]}
            </div>
          )}

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-[10px] text-slate-400">Product team</p>
          </div>

          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
