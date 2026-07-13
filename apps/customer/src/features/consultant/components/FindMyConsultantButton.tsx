"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function FindMyConsultantButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/business/consultant/create")}
      className={cn(
        "h-10 gap-2 rounded-md bg-[#18181B] px-4 text-white transition-colors hover:bg-[#18181B]/90",
        className,
      )}
    >
      <Plus className="h-4 w-4" />
      <Translate text={localizationConstants.findMyConsultant} />
    </Button>
  );
}
