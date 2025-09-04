import { useState, useCallback } from "react";
import { useAuthToken } from "./useAuthToken";

export const useOAuth = (baseUrl?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl =
    baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";

  const openOAuthPopup = useCallback(
    (provider: string, isConnect = false, referralCode?: string) => {
      return new Promise<any>((resolve, reject) => {
        setLoading(true);
        setError(null);

        // Build URL with referral code if provided
        const params = new URLSearchParams({
          state: isConnect ? "connect" : "login",
          ...(referralCode && { referralCode }),
        });

        const popupUrl = `${apiUrl}/auth/oauth/${provider}?${params.toString()}`;
        const popup = window.open(
          popupUrl,
          "oauth_popup",
          "width=600,height=700,scrollbars=yes,resizable=yes"
        );

        if (!popup) {
          setLoading(false);
          setError(
            "Failed to open OAuth popup. Please check your popup blocker settings."
          );
          reject(new Error("Failed to open OAuth popup"));
          return;
        }

        const messageHandler = (event: MessageEvent) => {
          console.log("OAuth message received:", event);
          if (event.origin !== apiUrl.replace("/api", "")) return;

          if (event.data.type === "OAUTH_SUCCESS") {
            window.removeEventListener("message", messageHandler);
            popup.close();
            setLoading(false);

            // Handle login success - store token and reload
            if (!isConnect && event.data.data?.accessToken) {
              localStorage.setItem("accessToken", event.data.data.accessToken);
              // Reload the page to update auth state
              window.location.reload();
            }

            resolve(event.data.data);
          } else if (event.data.type === "OAUTH_ERROR") {
            window.removeEventListener("message", messageHandler);
            popup.close();
            setLoading(false);
            setError(event.data.error);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener("message", messageHandler);

        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener("message", messageHandler);
            setLoading(false);
            setError("OAuth popup was closed");
            reject(new Error("OAuth popup was closed"));
          }
        }, 1000);
      });
    },
    [apiUrl]
  );

  const loginWithOAuth = useCallback(
    async (provider: string, referralCode?: string) => {
      try {
        return await openOAuthPopup(provider, false, referralCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "OAuth login failed";
        setError(errorMessage);
        throw error;
      }
    },
    [openOAuthPopup]
  );

  const connectOAuth = useCallback(
    async (provider: string) => {
      try {
        return await openOAuthPopup(provider, true);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "OAuth connection failed";
        setError(errorMessage);
        throw error;
      }
    },
    [openOAuthPopup]
  );

  return {
    loginWithOAuth,
    connectOAuth,
    loading,
    error,
    clearError: () => setError(null),
  };
};
