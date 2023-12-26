import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date | string): string => {
  const now = new Date();
  createdAt = new Date(createdAt);
  const diff = now.getTime() - createdAt.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
};

export const formatAndDivideNumber = (number: number | string): string => {
  number = Number(number);
  if (isNaN(number)) {
    return "0";
  }
  number = Math.round(number);
  if (number < 0) {
    return "0";
  } else if (number > 1000000000) {
    return `${(number / 1000000000).toFixed(1)}B`;
  } else if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number > 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  } else {
    return String(number);
  }
};
