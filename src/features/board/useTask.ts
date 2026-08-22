import { useQuery } from "@tanstack/react-query";
import { taskService } from "../../services/taskService";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });
}
