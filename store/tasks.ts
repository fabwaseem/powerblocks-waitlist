import { TaskCompletionResponse, tasksApi, Task } from "@/lib/api/tasks";
import axios from "axios";
import { create } from "zustand";

interface TaskState {
  // Tasks data
  tasks: Task[];

  // Loading states
  loading: boolean;
  completingTask: boolean;

  // Error state
  error: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setCompletingTask: (completing: boolean) => void;

  // API actions
  fetchTasks: () => Promise<void>;
  completeTask: (taskId: string) => Promise<TaskCompletionResponse | null>;

  // Utility actions
  clearTasksData: () => void;
  refreshAllData: () => Promise<void>;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  // Initial state
  tasks: [],
  completedTasks: [],
  xpHistory: [],
  loading: false,
  completingTask: false,
  error: null,

  // Basic setters
  setTasks: (tasks) => set({ tasks }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setCompletingTask: (completing) => set({ completingTask: completing }),

  // Fetch tasks with enhanced details
  fetchTasksWithDetails: async () => {
    try {
      set({ loading: true, error: null });
      const tasks = await tasksApi.getAllTasks();
      set({ tasks, error: null });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Failed to fetch tasks",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch basic tasks
  fetchTasks: async () => {
    try {
      set({ loading: true, error: null });
      const tasks = await tasksApi.getAllTasks();
      // Convert UserTask[] to TaskWithDetails[] for consistency
      const tasksWithDetails: Task[] = tasks.map((task) => ({
        ...task,
      }));
      set({ tasks: tasksWithDetails, error: null });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Failed to fetch tasks",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Complete a task
  completeTask: async (
    taskId: string
  ): Promise<TaskCompletionResponse | null> => {
    try {
      set({ completingTask: true, error: null });
      const response = await tasksApi.completeTask(taskId);

      // Update the task status in the local state
      const { tasks } = get();
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "COMPLETED" as const, canComplete: false }
          : task
      );
      set({ tasks: updatedTasks });

      // Refresh all data to get the latest state
      await get().refreshAllData();

      return response;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : "Failed to complete task";

      set({ error: errorMessage });
      return null;
    } finally {
      set({ completingTask: false });
    }
  },

  // Clear all task data
  clearTasksData: () =>
    set({
      tasks: [],
      error: null,
    }),

  // Refresh all task data
  refreshAllData: async () => {
    const { fetchTasks } = get();
    await fetchTasks();
  },

  getTaskById: (taskId: string) => {
    const { tasks } = get();
    return tasks.find((task) => task.id === taskId);
  },
}));
