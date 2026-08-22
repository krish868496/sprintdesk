import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { BOARD_COLUMNS } from "../features/board/board.constants";

import { useInitializeBoard } from "../features/board/useInitializeBoard";

import { useBoardStore } from "../features/board/board.store";

import { BoardColumn } from "../features/board/BoardColumn";

import type { Task, TaskStatus } from "../features/board/task.types";

export function BoardPage() {
  const { isLoading, isError } = useInitializeBoard();

  const tasks = useBoardStore((state) => state.tasks);

  const moveTask = useBoardStore((state) => state.moveTask);

  if (isLoading) {
    return <p>Loading board...</p>;
  }

  if (isError) {
    return <p>Failed to load board.</p>;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = Number(active.id);

    const targetStatus = over.id as TaskStatus;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return;
    }

    moveTask(taskId, targetStatus, 0);
  }

  function handleTaskClick(task: Task) {
    console.log("Open task:", task);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sprint Board</h1>

        <p className="mt-1 text-sm text-slate-500">Manage your sprint tasks.</p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 lg:grid-cols-4">
          {BOARD_COLUMNS.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id,
            );

            return (
              <BoardColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                onTaskClick={handleTaskClick}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
