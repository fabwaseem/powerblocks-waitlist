import { useEffect, useState } from "react";

// Utility function to check if access token exists in cookies
const hasAccessToken = (): boolean => {
  if (typeof document === "undefined") return false;
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? true : false;
};

export const useAuthToken = () => {
  // Initialize with actual cookie state instead of false
  const [hasToken, setHasToken] = useState(() => hasAccessToken());

  useEffect(() => {
    const checkToken = () => {
      const tokenExists = hasAccessToken();
      setHasToken(tokenExists);
    };

    // Check on mount (redundant now but kept for consistency)
    checkToken();

    const handleStorageChange = () => checkToken();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return hasToken;
};
