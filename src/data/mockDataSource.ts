import mockData from "../../public/mock-data.json";

let data = structuredClone(mockData);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMockData() {
  await delay(300);

  return data;
}

export async function updateMockTask(
  taskId: number,
  updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: number | null;
    dueDate?: string | null;
    sprintId?: number;
    completedAt?: string | null;
    updatedAt?: string;
  },
) {
  await delay(300);

  const task = data.tasks.find((task) => task.id === taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  Object.assign(task, updates);

  return task;
}
export async function createMockTask(task: any) {
  await delay(300);

  data.tasks.push(task);

  return task;
}

export async function deleteMockTask(taskId: number) {
  await delay(300);

  const taskIndex = data.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    throw new Error("Task not found");
  }

  data.tasks.splice(taskIndex, 1);
}