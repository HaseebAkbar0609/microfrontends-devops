import { useState } from "react";
import { useRouter } from "next/navigation";
import { Glasses, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { OfferFormType } from "../types";
import { OfferConfirmationModal } from "./OfferConfirmationModal";

type Props = { type: OfferFormType; projectName?: string };

export function OfferFormRightPanel({ projectName }: Props) {
  const router = useRouter();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleConfirmSend = () => {
    router.push("/module/business/offer/list");
  };

  return (
    <>
      <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-none flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-lg border-transparent bg-slate-100 text-sm font-medium text-slate-800 hover:bg-slate-200 cursor-pointer shadow-none"
          onClick={() => router.back()}
        >
          <Translate text={localizationConstants.offerSendCancel} />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-900 hover:bg-slate-50 cursor-pointer shadow-xs gap-2"
          onClick={() => setConfirmModalOpen(true)}
        >
          <Glasses className="h-4 w-4 text-slate-700" />
          <Translate text={localizationConstants.offerFormViewOffer} />
        </Button>

        <Button
          type="button"
          className="h-10 w-full rounded-lg bg-[#1E2530] text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-xs gap-2"
          onClick={() => setConfirmModalOpen(true)}
        >
          <Send className="h-4 w-4 text-white" />
          <Translate text={localizationConstants.offerFormSendOffer} />
        </Button>
      </Card>

      <OfferConfirmationModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        projectName={projectName}
        onConfirm={handleConfirmSend}
      />
    </>
  );
}
