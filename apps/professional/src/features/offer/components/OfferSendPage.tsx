"use client";

import { CircleUser, FileText, Info } from "lucide-react";

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
    <div className="flex flex-1 flex-col bg-white">
      <OfferSendPageHeader
        title={data.title}
        postedDate={data.postedDate}
        badges={data.badges}
      />

      <div className="w-full px-6 pb-6 pt-4">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_333px]">
          <div className="space-y-6">
            <OfferSendSection
              title={
                <Translate
                  text={localizationConstants.offerSendCustomerDetails}
                />
              }
              icon={<CircleUser className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
              iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none"
              defaultOpen
            >
              <OfferSendCustomerDetails customer={data.customer} />
            </OfferSendSection>

            <OfferSendSection
              title={
                <Translate text={localizationConstants.offerSendDescription} />
              }
              icon={<Info className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
              iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none"
              defaultOpen
            >
              <p className="whitespace-pre-line font-sans font-normal text-base leading-6 tracking-normal text-[#475569]">
                {data.description}
              </p>
            </OfferSendSection>

            <OfferSendSection
              title={
                <Translate
                  text={localizationConstants.offerSendDocumentsAndImages}
                />
              }
              icon={<FileText className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
              iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none"
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
