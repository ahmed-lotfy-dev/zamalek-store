"use client";

import { toast as sonnerToast, Toaster } from "sonner";

type ToastProps = {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const toast = {
  success: (message: string, options?: ToastProps) => {
    sonnerToast.success(message, {
      description: options?.description,
      action: options?.action,
    });
  },
  error: (message: string, options?: ToastProps) => {
    sonnerToast.error(message, {
      description: options?.description,
      action: options?.action,
    });
  },
  info: (message: string, options?: ToastProps) => {
    sonnerToast.info(message, {
      description: options?.description,
      action: options?.action,
    });
  },
  warning: (message: string, options?: ToastProps) => {
    sonnerToast.warning(message, {
      description: options?.description,
      action: options?.action,
    });
  },
};

// Export Toaster to be added to root layout
export { Toaster };
