"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  title?: string;
  description?: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  loading?: boolean;
  confirmClassName?: string;
};

export const ConfirmDialog = ({
  title = "Are you sure?",
  description,
  onConfirm,
  trigger,
  confirmText = "Confirm",
  cancelText = "Cancel",
  disabled = false,
  loading = false,
  confirmClassName,
}: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            disabled={disabled || loading}
            className={cn(
              "bg-slate-900 text-white hover:bg-slate-900/90",
              confirmClassName
            )}
          >
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
