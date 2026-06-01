"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface UsersToolbarProps {
  onCreateClick?: () => void;
  createHref?: string;
  createButtonLabel?: string;
  className?: string;
}

export function UsersToolbar({
  onCreateClick,
  createHref,
  createButtonLabel = localizationConstants.createNewButtonText,
  className,
}: UsersToolbarProps) {
  const buttonClassName =
    "bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md transition-colors";

  return (
    <div className={cn("flex items-center justify-end gap-4 px-5 py-6", className)}>
      {createHref && (
        <Button asChild className={buttonClassName}>
          <Link href={createHref}>
            <Plus className="h-4 w-4" />
            <Translate text={createButtonLabel} />
          </Link>
        </Button>
      )}

      {!createHref && onCreateClick && (
        <Button onClick={onCreateClick} className={buttonClassName}>
          <Plus className="h-4 w-4" />
          <Translate text={createButtonLabel} />
        </Button>
      )}
    </div>
  );
}
