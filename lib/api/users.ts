import { api } from "@/lib/axios";
import { Gender } from "./tasks";

// API functions
export const usersApi = {
  updateUser: async (userData: {
    username?: string;
    gender?: Gender;
    dob?: string;
    country?: string;
    city?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ success: boolean; message: string }>(
      `/users/update`,
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
};
