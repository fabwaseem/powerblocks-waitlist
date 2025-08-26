import { api } from "@/lib/axios";

// Task Types from backend
export enum TaskType {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  VERIFY_PHONE_NUMBER = "VERIFY_PHONE_NUMBER",
  CONNECT_GOOGLE_ACCOUNT = "CONNECT_GOOGLE_ACCOUNT",
  CONNECT_TWITTER_ACCOUNT = "CONNECT_TWITTER_ACCOUNT",
  CONNECT_DISCORD_ACCOUNT = "CONNECT_DISCORD_ACCOUNT",
  CONNECT_TELEGRAM_ACCOUNT = "CONNECT_TELEGRAM_ACCOUNT",
  CONNECT_X_ACCOUNT = "CONNECT_X_ACCOUNT",
  CONNECT_WALLET = "CONNECT_WALLET",
}

// Task Status from backend
export enum TaskStatus {
  PENDING = "PENDING",
  LOCKED = "LOCKED",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

// Task interface
export interface Task {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  taskType: TaskType;
  isActive: boolean;
  orderIndex: number;
  unlockDelay: number | null;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
  isCompleted: boolean;
  timeUntilUnlock?: number;
  isNextTask:boolean
}

// Task completion response
export interface TaskCompletionResponse {
  success: boolean;
  message: string;
  xpEarned: number;
  taskId: string;
}

// API functions
export const tasksApi = {
  // Get all available tasks for the user
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  },

  // Complete a task and earn XP
  completeTask: async (taskId: string): Promise<TaskCompletionResponse> => {
    const response = await api.post<TaskCompletionResponse>(
      `/tasks/${taskId}/complete`
    );
    return response.data;
  },
};
