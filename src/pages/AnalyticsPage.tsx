import {
  BarChart3,
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useQuery } from "@tanstack/react-query";

import { taskService } from "../services/taskService";

export default function AnalyticsPage() {
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
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="font-semibold text-rose-900">
          Unable to load analytics
        </h2>

        <p className="mt-1 text-sm text-rose-600">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  const total = tasks.length;

  const completed = tasks.filter((task) => task.status === "done").length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const review = tasks.filter((task) => task.status === "review").length;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const statusData = [
    {
      name: "Backlog",
      value: tasks.filter((task) => task.status === "backlog").length,
    },
    {
      name: "In Progress",
      value: inProgress,
    },
    {
      name: "Review",
      value: review,
    },
    {
      name: "Done",
      value: completed,
    },
  ];

  const priorityData = [
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "low").length,
    },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "medium").length,
    },
    {
      name: "High",
      value: tasks.filter((task) => task.priority === "high").length,
    },
    {
      name: "Urgent",
      value: tasks.filter((task) => task.priority === "urgent").length,
    },
  ];

  const stats = [
    {
      label: "Total tasks",
      value: total,
      description: "Across current sprint",
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: completed,
      description: `${completionRate}% completion rate`,
      icon: CheckCircle2,
    },
    {
      label: "In progress",
      value: inProgress,
      description: "Currently being worked on",
      icon: Clock3,
    },
    {
      label: "Sprint health",
      value: `${completionRate}%`,
      description: "Overall completion",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <section>
        <p className="text-sm font-medium text-violet-600">Insights</p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Sprint analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Understand delivery progress, workload, and sprint health.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <BarChart3 className="h-4 w-4 text-violet-600" />

            <span className="text-sm font-medium text-slate-700">
              Current sprint
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-emerald-600">
                  Live
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold text-slate-950">
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

      {/* Charts */}

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Status */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-slate-950">Tasks by status</h2>

            <p className="mt-1 text-sm text-slate-500">
              Current distribution of sprint work.
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="name" tickLine={false} axisLine={false} />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-slate-950">Tasks by priority</h2>

            <p className="mt-1 text-sm text-slate-500">
              Understand where the highest-impact work sits.
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={["#94a3b8", "#3b82f6", "#f59e0b", "#f43f5e"][index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Sprint progress */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Sprint progress</h2>

            <p className="mt-1 text-sm text-slate-500">
              {completed} of {total} tasks completed.
            </p>
          </div>

          <span className="text-2xl font-bold text-violet-600">
            {completionRate}%
          </span>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-700"
            style={{
              width: `${completionRate}%`,
            }}
          />
        </div>
      </section>
    </div>
  );
}
