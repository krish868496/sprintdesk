import mockData from "../../public/mock-data.json";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import { useState } from "react";

import { taskService } from "../services/taskService";

import type { Task, TaskStatus } from "../features/board/task.types";

import { TaskModal, type CreateTaskForm } from "../features/board/TaskModal";
import TaskCard from "../features/board/TaskCard";
import { BoardColumn } from "../features/board/BoardColumn";
import { TaskDrawer } from "../features/board/TaskDrawer";
import { Plus } from "lucide-react";

const columns: {
  id: TaskStatus;
  title: string;
}[] = [
  {
    id: "backlog",
    title: "Backlog",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "In Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

export function TaskBoardPage() {
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] =
    useState<Task | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(taskId),

    onSuccess: (_, taskId) => {
      queryClient.setQueryData<Task[]>(["tasks"], (currentTasks = []) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    },
  });

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });

  /*
   * CREATE TASK
   */
  const createTaskMutation = useMutation({
    mutationFn: (form: CreateTaskForm) =>
      taskService.createTask({
        ...form,
        assigneeId: null,
        sprintId: 1,
      }),

    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(["tasks"], (currentTasks = []) => [
        ...currentTasks,
        {
          ...newTask,
          position: currentTasks.length,
        },
      ]);

      setIsCreateModalOpen(false);
    },
  });

  /*
   * UPDATE STATUS
   */
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) =>
      taskService.updateTaskStatus(taskId, status),

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks"],
      });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (currentTasks = []) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
                updatedAt: new Date().toISOString(),
                completedAt:
                  status === "done" ? new Date().toISOString() : null,
              }
            : task,
        ),
      );

      return {
        previousTasks,
      };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, form }: { taskId: number; form: CreateTaskForm }) =>
      taskService.updateTask(taskId, {
        ...form,
        assigneeId: selectedTask?.assigneeId ?? null,
        sprintId: selectedTask?.sprintId ?? 1,
      }),

    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(["tasks"], (currentTasks = []) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id
            ? {
                ...updatedTask,
                position: task.position,
              }
            : task,
        ),
      );

      setSelectedTask(null);
    },
  });

  /*
   * DRAG END
   */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = Number(active.id);

    const newStatus = over.data.current?.status as TaskStatus | undefined;

    if (!newStatus) {
      return;
    }

    const currentTasks = queryClient.getQueryData<Task[]>(["tasks"]) ?? [];

    const task = currentTasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    if (task.status === newStatus) {
      return;
    }

    updateStatusMutation.mutate({
      taskId,
      status: newStatus,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

        <div className="grid gap-5 xl:grid-cols-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="h-[500px] animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="font-semibold text-rose-900">Unable to load tasks</h2>

        <p className="mt-1 text-sm text-rose-600">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-600">Workspace</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Task board
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your sprint work and track progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedTask(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Create task
        </button>
      </section>

      {/* Board */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <section className="grid gap-5 xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.status === column.id)
              .sort((a, b) => a.position - b.position);

            return (
              <BoardColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskDelete={(taskId) => {
                  const task = tasks.find((task) => task.id === taskId);

                  if (!task) return;

                  const confirmed = window.confirm(
                    `Are you sure you want to remove "${task.title}"?`,
                  );

                  if (!confirmed) return;

                  deleteTaskMutation.mutate(taskId);
                }}
                onTaskEdit={(task) => {
                  setSelectedTask(task);
                }}
                onTaskClick={(task) => {
                  setSelectedTaskForDrawer(task);
                }}
              />
            );
          })}
        </section>
      </DndContext>

      <TaskModal
        isOpen={isCreateModalOpen || selectedTask !== null}
        task={selectedTask}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={(form) => {
          if (selectedTask) {
            updateTaskMutation.mutate({
              taskId: selectedTask.id,
              form,
            });

            return;
          }

          createTaskMutation.mutate(form);
        }}
        isSubmitting={
          createTaskMutation.isPending || updateTaskMutation.isPending
        }
      />

      <TaskDrawer
        task={selectedTaskForDrawer}
        comments={mockData.comments}
        users={mockData.users}
        onClose={() => setSelectedTaskForDrawer(null)}
      />
    </div>
  );
}
