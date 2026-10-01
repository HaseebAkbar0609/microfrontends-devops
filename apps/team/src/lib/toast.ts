"use client";

import { toast as sonnerToast } from "sonner";

export type ToastType = "success" | "error" | "info";

/** A toast shown again with the same `id` replaces the one on screen instead of stacking. */
export const showToast = (type: ToastType, message: string, id?: string) => {
  const options = { richColors: true, id };
  if (type === "success") {
    sonnerToast.success(message, options);
    return;
  }

  if (type === "error") {
    sonnerToast.error(message, options);
    return;
  }

  sonnerToast(message, options);
};
