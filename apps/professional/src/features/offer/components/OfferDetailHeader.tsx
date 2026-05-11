"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MODAL_CONSTANTS, type ModalType } from "@/constants/constant";
import useModal from "@/features/auth/hooks/useModal";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ArrowBigRightDash, Briefcase, Heart, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { BusinessExpressModal } from "./BusinessExpressModal";
import { BusinessOfferModal } from "./BusinessOfferModal";
import { BusinessRentModal } from "./BusinessRentModal";
import { OfferConfirmationModal } from "./OfferConfirmationModal";
import { OfferDetailHeaderProps } from "../types";

export const OfferDetailHeader = ({ data }: OfferDetailHeaderProps) => {
  const { isOpen, openModal, closeModal, type } = useModal<ModalType>();
  const router = useRouter();

  const jobType = (data.type ?? "").toLowerCase();

  return (
    <Card className="border-slate-200 bg-white px-6 py-5 shadow-sm rounded-t-xl rounded-b-none">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-secondary mb-1">
            {data.titleKey}
          </h1>
          <p className="text-sm text-slate-500 mt-2 mb-2">
            <Translate text={localizationConstants.offerDetailPostedLabel} />:{" "}
            {data.postedDate}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {data.isExpress && (
              <Badge
                variant="info"
                className="gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
              >
                <Briefcase className="h-3.5 w-3.5" />
                <Translate
                  text={localizationConstants.offerDetailExpressJobBadge}
                />
              </Badge>
            )}
            {data.locations.map((location) => (
              <Badge
                key={location}
                variant={location === "Stockholm" ? "success" : "warning"}
                className={[
                  "gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                  location === "Stockholm"
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-50",
                ].join(" ")}
              >
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="outline"
          >
            <Heart className="mr-2 h-4 w-4" />
            <Translate
              text={localizationConstants.offerDetailMarkAsFavourite}
            />
          </Button>
          <Button
            variant={"secondary"}
            className="!min-w-[140px]"
            onClick={() => {
              const isExpress = jobType.includes("express") || data.isExpress;
              const isRent = jobType.includes("rent");
              const isBusinessOffer =
                jobType.includes("b2c") || jobType.includes("b2b");

              if (isExpress) {
                openModal(MODAL_CONSTANTS.BUSINESS_EXPRESS, data.id);
                return;
              }

              if (isRent) {
                openModal(MODAL_CONSTANTS.BUSINESS_RENT, data.id);
                return;
              }

              if (isBusinessOffer) {
                openModal(MODAL_CONSTANTS.BUSINESS_OFFER, data.id);
                return;
              }

              openModal(MODAL_CONSTANTS.OFFER_CONFIRMATION, data.id);
            }}
          >
             <ArrowBigRightDash />
            <Translate text={localizationConstants.offerDetailTakeJob} />
          </Button>
        </div>
      </div>

      <BusinessOfferModal
        open={isOpen && type === MODAL_CONSTANTS.BUSINESS_OFFER}
        onOpenChange={(open) => !open && closeModal()}
        quote={data}
        onConfirm={() => router.push(`/offer/send/${data.id}`)}
      />

      <BusinessExpressModal
        open={isOpen && type === MODAL_CONSTANTS.BUSINESS_EXPRESS}
        onOpenChange={(open) => !open && closeModal()}
        quote={data}
        onConfirm={() => router.push(`/offer/send/${data.id}`)}
      />

      <BusinessRentModal
        open={isOpen && type === MODAL_CONSTANTS.BUSINESS_RENT}
        onOpenChange={(open) => !open && closeModal()}
        quote={data}
        onConfirm={() => router.push(`/offer/send/${data.id}`)}
      />

      <OfferConfirmationModal
        open={isOpen && type === MODAL_CONSTANTS.OFFER_CONFIRMATION}
        onOpenChange={(open) => !open && closeModal()}
        onConfirm={() => router.push(`/offer/send/${data.id}`)}
      />
    </Card>
  );
};
