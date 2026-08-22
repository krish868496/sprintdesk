import { useEffect } from "react";

import { useBoardStore } from "./board.store";
import { useTasks } from "./useTask";

export function useInitializeBoard() {
  const { data, isLoading, isError } = useTasks();

  const tasks = useBoardStore((state) => state.tasks);

  const hasHydrated = useBoardStore((state) => state.hasHydrated);

  const setTasks = useBoardStore((state) => state.setTasks);

  useEffect(() => {
    if (hasHydrated && tasks.length === 0 && data) {
      setTasks(data);
    }
  }, [hasHydrated, tasks.length, data, setTasks]);

  return {
    isLoading,
    isError,
  };
}
