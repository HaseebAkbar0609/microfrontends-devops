"use client";

import { User, Info, FolderOpen } from "lucide-react";

import { OfferSendData } from "../types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { OfferSendPageHeader } from "./OfferSendPageHeader";
import { OfferSendSection } from "./OfferSendSection";
import { OfferSendCustomerDetails } from "./OfferSendCustomerDetails";
import { OfferSendDocumentsAndImages } from "./OfferSendDocumentsAndImages";
import { OfferSendConfirmationPanel } from "./OfferSendConfirmationPanel";

type OfferSendPageProps = {
  data: OfferSendData;
};

export function OfferSendPage({ data }: OfferSendPageProps) {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <OfferSendPageHeader
        title={data.title}
        postedDate={data.postedDate}
        badges={data.badges}
      />

      <div className="mr-auto w-[calc(100%-24px)] px-6 pb-6 pt-4 ml-6">
        <div className="grid grid-cols-1 gap-6  lg:grid-cols-[1fr_350px] 2xl:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <OfferSendSection
              title={
                <Translate
                  text={localizationConstants.offerSendCustomerDetails}
                />
              }
              icon={<User className="h-4 w-4" />}
              defaultOpen
            >
              <OfferSendCustomerDetails customer={data.customer} />
            </OfferSendSection>

            <OfferSendSection
              title={
                <Translate text={localizationConstants.offerSendDescription} />
              }
              icon={<Info className="h-4 w-4" />}
              defaultOpen
            >
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {data.description}
              </p>
            </OfferSendSection>

            <OfferSendSection
              title={
                <Translate
                  text={localizationConstants.offerSendDocumentsAndImages}
                />
              }
              icon={<FolderOpen className="h-4 w-4" />}
              defaultOpen
            >
              <OfferSendDocumentsAndImages data={data} />
            </OfferSendSection>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <OfferSendConfirmationPanel data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
