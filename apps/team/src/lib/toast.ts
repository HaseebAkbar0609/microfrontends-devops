"use client";

import { toast as sonnerToast } from "sonner";

export type ToastType = "success" | "error" | "info";

export const showToast = (type: ToastType, message: string) => {
  if (type === "success") {
    sonnerToast.success(message, { richColors: true });
    return;
  }

  if (type === "error") {
    sonnerToast.error(message, { richColors: true });
    return;
  }

  sonnerToast(message, { richColors: true });
};
