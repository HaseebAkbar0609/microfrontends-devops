import type { ReactNode } from "react";
import { Star, Award, Clock, MapPin, ArrowRight, ChevronRight, Wrench } from "lucide-react";
import type { Supplier, SupplierService } from "@/types/tools-suppliers";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  supplier: Supplier;
  services: SupplierService[];
}

export function OverviewTab({ supplier, services }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          icon={<Star className="w-6 h-6 text-[#FFB800]" />}
          value={supplier.rating.toFixed(1)}
          label={localizationConstants.supplierLabelRating}
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-[#FF8100]" />}
          value={String(supplier.certifications).padStart(2, "0")}
          label={localizationConstants.supplierLabelCertifications}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-[#3B82F6]" />}
          value={supplier.responseTime}
          label={localizationConstants.supplierLabelResponseTime}
        />
        <div className="border border-slate-200 rounded-lg pt-[17px] pb-[17px] pl-[27px] pr-[16px] flex flex-col items-start justify-center gap-1.5 text-left bg-white h-full shadow-sm">
          <div className="flex items-center justify-start w-6 h-6 shrink-0 mb-0.5">
            <MapPin className="w-6 h-6 text-[#EF4444]" />
          </div>
          <p className="font-sans text-[18px] font-semibold text-[#0A0A0A] leading-[27px] tracking-[-0.44px] text-left truncate w-full">
            {supplier.mainMunicipality}
          </p>
          <p className="font-sans text-[12px] font-normal text-slate-500 leading-[18px] text-left">
            +{supplier.additionalMunicipalities}{" "}
            <Translate
              text={localizationConstants.supplierLabelMunicipalities}
            />
          </p>
        </div>
      </div>

      {/* Om leverantören */}
      <div className="border border-slate-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-3">
          <Translate text={localizationConstants.supplierAboutSection} />
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">
          {supplier.description}
        </p>
        <Button variant="link" size="sm" className="mt-3 text-sm font-medium text-[#FF8100] hover:underline p-0 h-auto flex items-center gap-1">
          <Translate text={localizationConstants.supplierReadMore} />
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Projektbilder / Projekt */}
      <div className="border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight">
            <Translate
              text={localizationConstants.supplierProjectImagesSection}
            />
          </h3>
          <Button variant="link" size="sm" className="text-sm font-medium text-[#FF8100] hover:underline p-0 h-auto flex items-center gap-1">
            <Translate text={localizationConstants.supplierSeeAll} />
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 h-48">
          {/* Large image left */}
          <div className="w-36 shrink-0 bg-[#F3F4F6] rounded-lg" />
          {/* Small images grid right */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
            <div className="bg-[#F3F4F6] rounded-lg" />
            <div className="bg-[#F3F4F6] rounded-lg" />
            <div className="bg-[#F3F4F6] rounded-lg" />
            <div className="bg-[#F3F4F6] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Tjänster som erbjuds */}
      <div className="border border-slate-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-4">
          <Translate text={localizationConstants.supplierServicesSection} />
        </h3>
        <div className="flex flex-col gap-1">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-md px-3 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[rgba(255,129,0,0.1)] rounded-lg flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 text-[#FF8100]" />
                </div>
                <span className="text-sm text-[#0A0A0A]">{service.name}</span>
              </div>
              {service.isPopular && (
                <span className="px-2 py-0.5 text-xs font-medium text-[#FF8100] bg-[rgba(255,129,0,0.1)] border border-[rgba(255,129,0,0.2)] rounded-lg shrink-0">
                  <Translate
                    text={localizationConstants.supplierPopularBadge}
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="border border-slate-200 rounded-lg pt-[17px] pb-[17px] pl-[27px] pr-[16px] flex flex-col items-start justify-center gap-1.5 text-left bg-white h-full shadow-sm">
      <div className="flex items-center justify-start w-6 h-6 shrink-0 mb-0.5">
        {icon}
      </div>
      <p className="font-sans text-[18px] font-semibold text-[#0A0A0A] leading-[27px] tracking-[-0.44px] text-left">
        {value}
      </p>
      <p className="font-sans text-[12px] font-normal text-slate-500 leading-[18px] text-left">
        <Translate text={label} />
      </p>
    </div>
  );
}
