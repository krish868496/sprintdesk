import type { CreateTaskForm } from "./TaskModal";

export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: number;

  title: string;

  description: string;

  status: TaskStatus;

  priority: TaskPriority;

  assigneeId: number | null;

  dueDate: string | null;

  sprintId: number;

  position: number;

  order: number;

  createdAt: string;

  completedAt: string | null;

  updatedAt: string;
}


export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (form: CreateTaskForm) => void;

  isSubmitting: boolean;

  task?: Task | null;
}