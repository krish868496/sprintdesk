import { useDroppable } from "@dnd-kit/core";
import { MoreHorizontal } from "lucide-react";

import type { Task, TaskStatus } from "./task.types";
import TaskCard from "./TaskCard";

interface BoardColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const columnStyles: Record<TaskStatus, string> = {
  backlog: "bg-slate-100/80",
  "in-progress": "bg-blue-50/70",
  review: "bg-amber-50/70",
  done: "bg-emerald-50/70",
};

const dotStyles: Record<TaskStatus, string> = {
  backlog: "bg-slate-400",
  "in-progress": "bg-blue-500",
  review: "bg-amber-500",
  done: "bg-emerald-500",
};

export function BoardColumn({
  column,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskClick,
}: {
  column: {
    id: TaskStatus;
    title: string;
  };

  tasks: Task[];

  onTaskEdit: (task: Task) => void;
  onTaskClick: (task: Task) => void;

  onTaskDelete: (taskId: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      status: column.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex min-h-[500px] flex-col
        rounded-2xl p-3
        transition
        ${isOver ? "bg-violet-50 ring-2 ring-violet-300" : "bg-slate-100/70"}
      `}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            {column.title}
          </h2>

          <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 shadow-sm">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
          aria-label={`${column.title} options`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Tasks */}
      <div className="mt-2 flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-400">Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
