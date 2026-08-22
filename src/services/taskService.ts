import { createMockTask, deleteMockTask, getMockData, updateMockTask } from "../data/mockDataSource";
import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "../features/board/task.types";


function isTaskStatus(status: string): status is TaskStatus {
  return (
    status === "backlog" ||
    status === "in-progress" ||
    status === "review" ||
    status === "done"
  );
}

interface UpdateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  dueDate: string | null;
  sprintId: number;
}

function isTaskPriority(priority: string): priority is TaskPriority {
  return (
    priority === "low" ||
    priority === "medium" ||
    priority === "high" ||
    priority === "urgent"
  );
}

interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  dueDate: string | null;
  sprintId: number;
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const data = await getMockData();

    return data.tasks.map((task, index): Task => {
      if (!isTaskStatus(task.status)) {
        throw new Error(`Invalid task status: ${task.status}`);
      }

      if (!isTaskPriority(task.priority)) {
        throw new Error(`Invalid task priority: ${task.priority}`);
      }

      return {
        id: task.id,
        title: task.title,
        description: task.description,

        status: task.status,
        priority: task.priority,

        assigneeId: task.assigneeId ?? null,
        dueDate: task.dueDate ?? null,

        sprintId: task.sprintId,

        position: index,
        order: task.order,

        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt ?? null,
      };
    });
  },

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    const updatedTask = await updateMockTask(taskId, {
      status,
      updatedAt: new Date().toISOString(),
      completedAt: status === "done" ? new Date().toISOString() : null,
    });

    console.log(updatedTask, "updatedtask");

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,

      status: updatedTask.status as TaskStatus,
      priority: updatedTask.priority as TaskPriority,

      assigneeId: updatedTask.assigneeId ?? null,
      dueDate: updatedTask.dueDate ?? null,

      sprintId: updatedTask.sprintId,

      position: updatedTask.id ?? 0,
      order: updatedTask.order,

      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
      completedAt: updatedTask.completedAt ?? null,
    };
  },

  async updateTask(
    taskId: number,
    input: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      assigneeId: number | null;
      dueDate: string | null;
      sprintId: number;
    },
  ): Promise<Task> {
    const updatedTask = await updateMockTask(taskId, {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
    });

    return {
      ...updatedTask,
      status: updatedTask.status as TaskStatus,
      position:updatedTask.id,
      priority: updatedTask.priority as TaskPriority,
      assigneeId: updatedTask.assigneeId ?? null,
      dueDate: updatedTask.dueDate ?? null,
      completedAt: updatedTask.completedAt ?? null,
    };
  },
  async createTask(input: CreateTaskInput): Promise<Task> {
    const data = await getMockData();

    const position = data.tasks.length;

    const newTask: Task = {
      id: Math.max(0, ...data.tasks.map((task) => task.id)) + 1,

      title: input.title,
      description: input.description,

      status: input.status,
      priority: input.priority,

      assigneeId: input.assigneeId,
      dueDate: input.dueDate,

      sprintId: input.sprintId,

      position,
      order: position,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      completedAt: input.status === "done" ? new Date().toISOString() : null,
    };

    await createMockTask(newTask);

    return newTask;
  },

  async deleteTask(taskId: number): Promise<void> {
    await deleteMockTask(taskId);
  },
};
