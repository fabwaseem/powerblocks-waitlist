"use client";
import App from "@/components/waitlist/App";
import Auth from "@/components/waitlist/Auth";
import { useAuth } from "@/hooks/use-auth";

const page = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <App /> : <Auth />;
};

export default page;
