"use client";

import { addToast } from "@heroui/toast";

type ToastProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const toast = {
  success: (message: string, options?: ToastProps) => {
    addToast({
      title: message,
      description: options?.description,
      color: "success",
    });
  },
  error: (message: string, options?: ToastProps) => {
    addToast({
      title: message,
      description: options?.description,
      color: "danger",
    });
  },
  info: (message: string, options?: ToastProps) => {
    addToast({
      title: message,
      description: options?.description,
      color: "primary",
    });
  },
  warning: (message: string, options?: ToastProps) => {
    addToast({
      title: message,
      description: options?.description,
      color: "warning",
    });
  },
};

// We don't need to export Toaster anymore as we'll use ToastProvider
