import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatTime = (seconds: number, showSeconds: boolean = true) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (showSeconds) {
    return `${hours}:${minutes}:${remainingSeconds}`;
  }
  return `${hours}:${minutes}`;
};

export const getXProfileLinkFromUsername = (username: string) => {
  return `https://x.com/${username}`;
};

export const getInstagramProfileLinkFromUsername = (username: string) => {
  return `https://instagram.com/${username}`;
};

export const formatNumber = (number?: number) => {
  return number?.toLocaleString();
};
