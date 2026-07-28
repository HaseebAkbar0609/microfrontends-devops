"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalWrapperProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
};

export function ModalWrapper({
  open,
  onOpenChange,
  children,
  title,
  description,
  footer,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-card p-6 shadow-lg",
          "grid max-w-lg max-h-[calc(100vh-2rem)] w-full",
          contentClassName
        )}
      >
        {(title || description) && (
          <DialogHeader className={cn("flex flex-col gap-1", headerClassName)}>
            {title && (
              <DialogTitle className="text-center text-xl font-bold text-gray-700 sm:text-2xl">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-xs text-center py-3">
                <span className="flex justify-center text-muted-foreground">{description}</span>
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={cn("pt-2", bodyClassName)}>{children}</div>

        {footer && (
          <DialogFooter className={footerClassName}>{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
