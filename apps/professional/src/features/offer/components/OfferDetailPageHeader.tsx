"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface OfferDetailPageHeaderProps {
  title: string;
}

export function OfferDetailPageHeader({ title }: OfferDetailPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full px-4 pt-6">
      <div className="mr-auto flex w-full max-w-5xl items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-0!"
        >
          <ArrowLeft className="w-6! h-6!" />
        </Button>

        <h1 className="text-2xl font-semibold leading-tight text-slate-900">
          <Translate text={localizationConstants.project} />
          {` - ${title}`}
        </h1>
      </div>
    </div>
  );
}
