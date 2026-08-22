import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { taskService } from "../services/taskService";

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <span className="text-lg text-rose-600">!</span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading your sprint data. Please try
            again.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.status === "done").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const reviewTasks = tasks.filter((task) => task.status === "review").length;

  const todoTasks = tasks.filter((task) => task.status === "backlog").length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    {
      label: "Total tasks",
      value: totalTasks,
      icon: ListTodo,
      description: "Across current sprint",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      description: "Successfully delivered",
    },
    {
      label: "In progress",
      value: inProgressTasks,
      icon: Clock3,
      description: "Currently being worked on",
    },
    {
      label: "In review",
      value: reviewTasks,
      icon: TrendingUp,
      description: "Awaiting review",
    },
  ];

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            Sprint overview
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Good afternoon 👋
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Here's what's happening across your current sprint.
          </p>
        </div>

        <button
          onClick={() => navigate("/board")}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Open task board
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Sprint
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {stat.label}
              </p>

              <p className="mt-1 text-xs text-slate-400">{stat.description}</p>
            </div>
          );
        })}
      </section>

      {/* Progress + Breakdown */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sprint progress
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Keep the momentum going
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {completedTasks} of {totalTasks} tasks completed.
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-violet-600">
                {completionRate}%
              </p>

              <p className="text-xs text-slate-400">completed</p>
            </div>
          </div>

          <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-700"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>0%</span>
            <span>Goal: 100%</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Task breakdown
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Current workload
          </h2>

          <div className="mt-5 space-y-4">
            <ProgressRow label="To do" value={todoTasks} total={totalTasks} />

            <ProgressRow
              label="In progress"
              value={inProgressTasks}
              total={totalTasks}
            />

            <ProgressRow
              label="In review"
              value={reviewTasks}
              total={totalTasks}
            />

            <ProgressRow
              label="Completed"
              value={completedTasks}
              total={totalTasks}
            />
          </div>
        </div>
      </section>

      {/* Recent tasks */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Activity
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              Recently updated
            </h2>
          </div>

          <button
            onClick={() => navigate("/board")}
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            View all
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ListTodo className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No tasks yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Create your first task to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => navigate("/board")}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Updated recently
                  </p>
                </div>

                <StatusBadge status={task.status} />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">{label}</span>

        <span className="text-xs font-semibold text-slate-700">{value}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    todo: "bg-slate-100 text-slate-600",
    "in-progress": "bg-amber-50 text-amber-700",
    review: "bg-blue-50 text-blue-700",
    done: "bg-emerald-50 text-emerald-700",
  };

  const labels: Record<string, string> = {
    todo: "To do",
    "in-progress": "In progress",
    review: "In review",
    done: "Completed",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
