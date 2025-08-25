"use client";
import React from "react";
import Auth from "@/components/waitlist/Auth";
import { useAuthStore } from "@/store/auth";
import Loader from "@/components/waitlist/Loader";
import App from "@/components/waitlist/App";

const page = () => {
  const { isAuthenticated, loading } = useAuthStore();
  return loading ? <Loader /> : isAuthenticated ? <App /> : <Auth />;
};

export default page;
