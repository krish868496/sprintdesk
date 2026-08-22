import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Task, TaskStatus } from "./task.types";

interface BoardState {
  tasks: Task[];

  hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;

  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  updateTask: (taskId: number, updates: Partial<Task>) => void;

  deleteTask: (taskId: number) => void;

  moveTask: (
    taskId: number,
    status: TaskStatus,
    newIndex: number,
  ) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

      hasHydrated: false,

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),

      setTasks: (tasks) =>
        set({
          tasks,
        }),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        })),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => task.id !== taskId,
          ),
        })),

      moveTask: (taskId, status, newIndex) =>
        set((state) => {
          const task = state.tasks.find(
            (task) => task.id === taskId,
          );

          if (!task) {
            return state;
          }

          /*
           * Remove the task from its current column.
           */
          const remainingTasks = state.tasks.filter(
            (task) => task.id !== taskId,
          );

          /*
           * Get tasks from destination column.
           */
          const destinationTasks = remainingTasks
            .filter((task) => task.status === status)
            .sort((a, b) => a.position - b.position);

          /*
           * Create updated task.
           */
          const movedTask: Task = {
            ...task,
            status,
            updatedAt: new Date().toISOString(),
            completedAt:
              status === "done"
                ? task.completedAt ?? new Date().toISOString()
                : null,
          };

          /*
           * Prevent invalid indexes.
           */
          const safeIndex = Math.max(
            0,
            Math.min(newIndex, destinationTasks.length),
          );

          /*
           * Insert task into destination column.
           */
          destinationTasks.splice(safeIndex, 0, movedTask);

          /*
           * Recalculate positions.
           */
          const updatedDestinationTasks =
            destinationTasks.map((task, index) => ({
              ...task,
              position: index,
            }));

          /*
           * Keep tasks from other columns.
           */
          const otherTasks = remainingTasks.filter(
            (task) => task.status !== status,
          );

          return {
            tasks: [
              ...otherTasks,
              ...updatedDestinationTasks,
            ],
          };
        }),
    }),
    {
      name: "sprintdesk-board",

      /*
       * Called when Zustand finishes restoring
       * state from localStorage.
       */
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.error(
              "Failed to hydrate board store:",
              error,
            );
          }

          useBoardStore
            .getState()
            .setHasHydrated(true);
        };
      },
    },
  ),
);