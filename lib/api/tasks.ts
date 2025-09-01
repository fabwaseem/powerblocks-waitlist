import { api } from "@/lib/axios";

// Task Types from backend
export enum TaskType {
  // Profile & Verification Tasks
  VERIFY_EMAIL = "VERIFY_EMAIL",
  VERIFY_PHONE_NUMBER = "VERIFY_PHONE_NUMBER",
  CREATE_USERNAME = "CREATE_USERNAME",
  SELECT_GENDER = "SELECT_GENDER",
  ADD_AGE_DOB = "ADD_AGE_DOB",
  VERIFY_LOCATION_COUNTRY = "VERIFY_LOCATION_COUNTRY",
  VERIFY_LOCATION_CITY = "VERIFY_LOCATION_CITY",
  ADD_PROFILE_PIC = "ADD_PROFILE_PIC",

  // Social Media Tasks
  FOLLOW_X_ACCOUNT = "FOLLOW_X_ACCOUNT",
  FOLLOW_IG_ACCOUNT = "FOLLOW_IG_ACCOUNT",
  FOLLOW_TG_ACCOUNT = "FOLLOW_TG_ACCOUNT",
  FOLLOW_DISCORD_ACCOUNT = "FOLLOW_DISCORD_ACCOUNT",
  JOIN_REDDIT = "JOIN_REDDIT",

  // Engagement Tasks
  ENABLE_WEB_PUSH = "ENABLE_WEB_PUSH",
  ENABLE_2FA = "ENABLE_2FA",
  MYSTERY_BOX_QUESTION = "MYSTERY_BOX_QUESTION",
  RAFFLE_LOTTERY_QUESTION = "RAFFLE_LOTTERY_QUESTION",
  CHECK_BLOG = "CHECK_BLOG",
  WATCH_VIDEO = "WATCH_VIDEO",
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
  isNextTask: boolean;
  data: {
    link?: string;
    username?: string;
    groupName?: string;
    serverName?: string;
  };
}

// Task completion response
export interface TaskCompletionResponse {
  success: boolean;
  message: string;
  xpEarned: number;
  taskId: string;
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
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

  sendPhoneOtp: async (phoneNumber: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/tasks/phone/send-otp`,
      {
        phoneNumber,
      }
    );
    return response.data;
  },

  verifyPhoneOtp: async (
    phoneNumber: string,
    otp: string
  ): Promise<{ message: string; success: boolean }> => {
    const response = await api.post<{ message: string; success: boolean }>(
      `/tasks/phone/verify-otp`,
      {
        phoneNumber,
        otp,
      }
    );
    return response.data;
  },

  updateUser: async (userData: {
    username?: string;
    gender?: Gender;
    dob?: string;
    country?: string;
    city?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ success: boolean; message: string }>(
      `/tasks/user/update`,
      userData
    );
    return response.data;
  },

  uploadAvatar: async (
    file: File
  ): Promise<{
    success: boolean;
    message: string;
    avatarUrl?: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    const response = await api.post("/tasks/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  verifyTwitterFollow: async (): Promise<{
    isFollowing: boolean;
    message: string;
    xpAwarded?: number;
  }> => {
    const response = await api.post<{
      isFollowing: boolean;
      message: string;
      xpAwarded?: number;
    }>("/tasks/twitter/verify-follow");
    return response.data;
  },

  verifyInstagramFollow: async (): Promise<{
    isFollowing: boolean;
    message: string;
    xpAwarded?: number;
  }> => {
    const response = await api.post<{
      isFollowing: boolean;
      message: string;
      xpAwarded?: number;
    }>("/tasks/instagram/verify-follow");
    return response.data;
  },

  verifyTelegramJoin: async (): Promise<{
    isFollowing: boolean;
    message: string;
    xpAwarded?: number;
  }> => {
    const response = await api.post<{
      isFollowing: boolean;
      message: string;
      xpAwarded?: number;
    }>("/tasks/telegram/verify-follow");
    return response.data;
  },

  verifyDiscordJoin: async (): Promise<{
    isJoined: boolean;
    message: string;
    xpAwarded?: number;
  }> => {
    const response = await api.post<{
      isJoined: boolean;
      message: string;
      xpAwarded?: number;
    }>("/tasks/discord/verify-join");
    return response.data;
  },
};
