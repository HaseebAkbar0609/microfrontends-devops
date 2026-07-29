"use client";

import Image from "next/image";
import { Building2, CalendarDays, CircleDollarSign, ClipboardList, FileText } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { OfferFormData } from "../types";
import { OfferSendPageHeader } from "./OfferSendPageHeader";
import { OfferSendSection } from "./OfferSendSection";
import { OfferSendCustomerDetails } from "./OfferSendCustomerDetails";
import { OfferFormCompanySection } from "./OfferFormCompanySection";
import { OfferFormRightPanel } from "./OfferFormRightPanel";
import { OfferFormPersonnelSection } from "./OfferFormPersonnelSection";
import { OfferFormRentOffertSection } from "./OfferFormRentOffertSection";
import { OfferFormProjectSection } from "./OfferFormProjectSection";
import { OfferFormScheduleSection } from "./OfferFormScheduleSection";
import { OfferFormBudgetSection } from "./OfferFormBudgetSection";
import { OfferFormDocumentsSection } from "./OfferFormDocumentsSection";

type Props = { data: OfferFormData };

export function OfferFormPage({ data }: Props) {
  const t = useTranslate();
  const isRent = data.type === "rent";
  const isExpress = data.type === "express";
  const isB2C = data.type === "b2c";

  const pageTitle = isB2C ? t(localizationConstants.offerFormB2CTitle) : data.title;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <OfferSendPageHeader
        title={pageTitle}
        postedDate=""
        badges={data.badges}
      />

      <div className="px-6 pb-6 pt-4">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_333px]">
          {/* Left column — sections */}
          <div className="space-y-4">
            {/* Customer + Company side by side */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <OfferSendSection
                title={<Translate text={localizationConstants.offerSendCustomerDetails} />}
                icon={<Image src="/assets/icons/personal-info.svg" alt="" width={20} height={20} />}
                defaultOpen
              >
                <OfferSendCustomerDetails customer={data.customer} />
              </OfferSendSection>

              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormCompanyNumber} />}
                icon={<Building2 className="h-5 w-5" />}
                defaultOpen
              >
                <OfferFormCompanySection company={data.company} />
              </OfferSendSection>
            </div>

            {/* Rent-specific */}
            {isRent && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormPersonnel} />}
                icon={<Image src="/assets/icons/users.svg" alt="" width={20} height={20} />}
                defaultOpen
              >
                <OfferFormPersonnelSection />
              </OfferSendSection>
            )}

            {isRent && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormOffertSection} />}
                icon={<FileText className="h-5 w-5" />}
                defaultOpen
              >
                <OfferFormRentOffertSection />
              </OfferSendSection>
            )}

            {/* Express / B2C shared */}
            {(isExpress || isB2C) && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormProjectDescription} />}
                icon={<ClipboardList className="h-5 w-5" />}
                defaultOpen
              >
                <OfferFormProjectSection />
              </OfferSendSection>
            )}

            {(isExpress || isB2C) && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormSchedule} />}
                icon={<CalendarDays className="h-5 w-5" />}
                defaultOpen
              >
                <OfferFormScheduleSection />
              </OfferSendSection>
            )}

            {isExpress && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormBudget} />}
                icon={<CircleDollarSign className="h-5 w-5" />}
                defaultOpen
              >
                <OfferFormBudgetSection variant="express" />
              </OfferSendSection>
            )}

            {isB2C && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormOffertSection} />}
                icon={<CircleDollarSign className="h-5 w-5" />}
                defaultOpen
              >
                <OfferFormBudgetSection variant="b2c" />
              </OfferSendSection>
            )}

            {isB2C && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormDocuments} />}
                icon={<Image src="/assets/icons/file-plus.svg" alt="" width={20} height={20} />}
                defaultOpen
              >
                <OfferFormDocumentsSection />
              </OfferSendSection>
            )}
          </div>

          {/* Right column — action panel */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <OfferFormRightPanel type={data.type} />
          </div>
        </div>
      </div>
    </div>
  );
}
