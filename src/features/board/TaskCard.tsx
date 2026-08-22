import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Task } from "./task.types";
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

export default function TaskCard({
  task,
  onDelete,
  onEdit,
  onClick,
}: {
  task: Task;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onClick: (task: Task) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  function handleDelete() {
    setIsMenuOpen(false);
    onDelete(task.id);
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={() => onClick(task)}
      className={`
        relative
        cursor-grab
        rounded-xl border
        border-slate-200
        bg-white p-4
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        active:cursor-grabbing
        ${isDragging ? "z-50 rotate-2 opacity-50 shadow-xl" : ""}
      `}
    >
      {/* Priority + Menu */}
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />

        <div className="relative">
          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen((previous) => !previous);
            }}
            className="rounded-md p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Task options"
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Dropdown */}
          {isMenuOpen && (
            <div
              className="
                absolute right-0 top-9 z-50
                w-36
                overflow-hidden
                rounded-xl
                border border-slate-200
                bg-white
                p-1
                shadow-xl
              "
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {/* Edit */}
              <button
                type="button"
                className="
                  flex w-full items-center gap-2
                  rounded-lg
                  px-3 py-2
                  text-left text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(task);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              {/* Remove */}
              <button
                type="button"
                className="
                  flex w-full items-center gap-2
                  rounded-lg
                  px-3 py-2
                  text-left text-sm
                  text-rose-600
                  transition
                  hover:bg-rose-50
                "
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-900">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {task.dueDate ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />

            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-xs text-slate-300">No due date</span>
        )}

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
          {task.assigneeId ?? "?"}
        </div>
      </div>
    </article>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-blue-50 text-blue-700",
    high: "bg-orange-50 text-orange-700",
    urgent: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
        styles[priority] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}
