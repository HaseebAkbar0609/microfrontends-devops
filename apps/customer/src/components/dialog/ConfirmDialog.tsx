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

type ConfirmDialogProps = {
  title?: string;
  description?: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  loading?: boolean;
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
}: ConfirmDialogProps) => {
  return (
    <AlertDialog>
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
          <AlertDialogAction onClick={onConfirm} disabled={disabled || loading}>
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
