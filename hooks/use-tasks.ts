import { TaskCompletionResponse, tasksApi } from "@/lib/api/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get all tasks for the user
export const useTasksQuery = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.getAllTasks(),
    staleTime: 60000, // 1 minute
  });
};

// Get tasks with enhanced details for frontend
export const useTasksWithDetailsQuery = () => {
  return useQuery({
    queryKey: ["tasks", "with-details"],
    queryFn: () => tasksApi.getAllTasks(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds for lock countdown updates
  });
};

// Complete a task mutation
export const useCompleteTaskMutation = (options?: {
  onSuccess?: (data: TaskCompletionResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      return await tasksApi.completeTask(taskId);
    },
    onSuccess: (data) => {
      // Invalidate tasks queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Also invalidate user profile/balance queries if they exist
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
