import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, Task, TaskCompletionResponse } from "@/lib/api/tasks";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Hook to fetch all tasks
export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: tasksApi.getAllTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a specific task by ID
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => {
      // Since we don't have a single task API endpoint, we'll get it from the cached list
      const queryClient = useQueryClient();
      const tasks = queryClient.getQueryData<Task[]>(taskKeys.lists());
      return tasks?.find((task) => task.id === taskId);
    },
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to complete a task
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.completeTask(taskId),
    onSuccess: (response, taskId) => {
      // Update the task status in the cache
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (oldTasks) => {
        if (!oldTasks) return oldTasks;

        return oldTasks.map((task) =>
          task.id === taskId
            ? { ...task, isCompleted: true, isNextTask: false }
            : task
        );
      });

      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to complete task:", error);
    },
  });
};

// Hook to refresh all task data
export const useRefreshTasks = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
  };
};

// Hook to get task statistics
export const useTaskStats = () => {
  const { data: tasks } = useTasks();

  if (!tasks) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      lockedTasks: 0,
      totalXpReward: 0,
      earnedXp: 0,
    };
  }

  const completedTasks = tasks.filter((task) => task.isCompleted);
  const pendingTasks = tasks.filter(
    (task) => !task.isCompleted && !task.isLocked
  );
  const lockedTasks = tasks.filter((task) => task.isLocked);

  const totalXpReward = tasks.reduce((sum, task) => sum + task.xpReward, 0);
  const earnedXp = completedTasks.reduce((sum, task) => sum + task.xpReward, 0);

  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    pendingTasks: pendingTasks.length,
    lockedTasks: lockedTasks.length,
    totalXpReward,
    earnedXp,
  };
};

// Hook to get next available task
export const useNextTask = () => {
  const { data: tasks } = useTasks();

  if (!tasks) return null;

  return tasks.find((task) => task.isNextTask) || null;
};

// Hook to get available tasks (not locked, not completed)
export const useAvailableTasks = () => {
  const { data: tasks } = useTasks();

  if (!tasks) return [];

  return tasks.filter((task) => !task.isLocked && !task.isCompleted);
};

// Hook to get completed tasks
export const useCompletedTasks = () => {
  const { data: tasks } = useTasks();

  if (!tasks) return [];

  return tasks.filter((task) => task.isCompleted);
};

// Hook to get locked tasks
export const useLockedTasks = () => {
  const { data: tasks } = useTasks();

  if (!tasks) return [];

  return tasks.filter((task) => task.isLocked);
};
