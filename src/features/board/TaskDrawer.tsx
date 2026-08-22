import { CalendarDays, X } from "lucide-react";
import type { Task } from "./task.types";

type Comment = {
  id: number;
  taskId: number;
  authorId: number;
  message: string;
  createdAt: string;
};

type User = {
  id: number;
  name: string;
  avatar: string;
};

interface TaskDrawerProps {
  task: Task | null;
  comments: Comment[];
  users: User[];
  onClose: () => void;
}

export function TaskDrawer({
  task,
  comments,
  users,
  onClose,
}: TaskDrawerProps) {
  if (!task) {
    return null;
  }

  const assignee = users.find((user) => user.id === task.assigneeId);

  const taskComments = comments.filter((comment) => comment.taskId === task.id);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close task details"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-violet-600">Task details</p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900">
              Description
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {task.description || "No description"}
            </p>
          </section>

          {/* Details */}
          <section className="mt-6 grid grid-cols-2 gap-4">
            <Detail label="Status" value={task.status} />

            <Detail label="Priority" value={task.priority} />

            <div>
              <p className="text-xs text-slate-400">Assignee</p>

              {assignee ? (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="h-7 w-7 rounded-full"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {assignee.name}
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Unassigned</p>
              )}
            </div>

            <div>
              <p className="text-xs text-slate-400">Due date</p>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                <CalendarDays className="h-4 w-4 text-slate-400" />

                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Comments</h3>

              <span className="text-xs text-slate-400">
                {taskComments.length}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {taskComments.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                  No comments yet.
                </p>
              ) : (
                taskComments.map((comment) => {
                  const author = users.find(
                    (user) => user.id === comment.authorId,
                  );

                  return (
                    <div
                      key={comment.id}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-2">
                        {author && (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-7 w-7 rounded-full"
                          />
                        )}

                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {author?.name ?? "Unknown user"}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-5 text-slate-600">
                        {comment.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 text-sm font-medium capitalize text-slate-700">
        {value}
      </p>
    </div>
  );
}
