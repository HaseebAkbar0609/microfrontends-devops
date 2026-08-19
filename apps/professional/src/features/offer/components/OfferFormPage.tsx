"use client";

import {
  BadgeDollarSign,
  BadgePercent,
  Building2,
  CalendarMinus2,
  CircleUser,
  ClipboardList,
} from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
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

type Props = { data: OfferFormData };

export function OfferFormPage({ data }: Props) {
  const isRent = data.type === "rent";
  const isExpress = data.type === "express";
  const isB2C = data.type === "b2c";

  const pageTitle = isExpress
    ? "EXPRESS"
    : isRent
      ? "B2B - HYRA UT / IN"
      : "Ladda ner Offert - mallar +";

  const subtitle = isB2C ? "Offert numer: 079687345" : "";

  return (
    <div className="flex flex-1 flex-col bg-white">
      <OfferSendPageHeader
        title={pageTitle}
        postedDate={subtitle}
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
                icon={<CircleUser className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferSendCustomerDetails customer={data.customer} />
              </OfferSendSection>

              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormCompanyNumber} />}
                icon={<Building2 className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferFormCompanySection company={data.company} />
              </OfferSendSection>
            </div>

            {/* Rent-specific */}
            {isRent && (
              <OfferSendSection
                title="Personal"
                icon={<CircleUser className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferFormPersonnelSection />
              </OfferSendSection>
            )}

            {isRent && (
              <OfferSendSection
                title="Offert"
                icon={<BadgePercent className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferFormRentOffertSection />
              </OfferSendSection>
            )}

            {/* Express / B2C shared */}
            {(isExpress || isB2C) && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormProjectDescription} />}
                icon={<ClipboardList className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferFormProjectSection />
              </OfferSendSection>
            )}

            {(isExpress || isB2C) && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormSchedule} />}
                icon={<CalendarMinus2 className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferFormScheduleSection />
              </OfferSendSection>
            )}

            {(isExpress || isB2C) && (
              <OfferSendSection
                title={<Translate text={localizationConstants.offerFormBudget} />}
                icon={<BadgeDollarSign className="h-5 w-5 text-[#1E293B]" strokeWidth={2} />}
                iconWrapperClassName="h-auto w-auto bg-transparent p-0 shadow-none border-none text-[#1E293B]"
                defaultOpen
              >
                <OfferFormBudgetSection variant={isExpress ? "express" : "b2c"} />
              </OfferSendSection>
            )}
          </div>

          {/* Right column — action panel */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <OfferFormRightPanel type={data.type} projectName={pageTitle} />
          </div>
        </div>
      </div>
    </div>
  );
}
