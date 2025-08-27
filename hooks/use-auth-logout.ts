import { useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { useReferralStore } from "@/store/referrals";
import { useTaskStore } from "@/store/tasks";

export const useAuthLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const clearReferralInfo = useReferralStore(
    (state) => state.clearReferralInfo
  );
  const clearTasksData = useTaskStore((state) => state.clearTasksData);

  const handleLogout = useCallback(async () => {
    await logout();

    // Reset all states
    clearReferralInfo();
    clearTasksData();
  }, [logout, clearReferralInfo, clearTasksData]);

  return handleLogout;
};
