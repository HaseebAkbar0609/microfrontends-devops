import type { ReactNode } from "react";
import {
  Phone,
  Mail,
  Globe,
  Languages,
  Clock,
  Star,
  CircleCheck,
} from "lucide-react";
import type { Supplier } from "@/types/tools-suppliers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface SupplierProfileCardProps {
  supplier: Supplier;
}

export function SupplierProfileCard({ supplier }: SupplierProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
      {/* Avatar + info wrapper */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Top centered part: image, tags, name */}
        <div className="flex flex-col items-center text-center gap-2 w-full">
          {/* Avatar with online indicator */}
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 bg-[#E4E4E7] rounded-full flex items-center justify-center border border-slate-300 shadow-inner">
              <span className="text-[#111721] text-3xl font-bold leading-none">
                {supplier.initials}
              </span>
            </div>
            {supplier.isOnline && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00C950] border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                {supplier.isVerified && <CircleCheck className="w-3.5 h-3.5 text-white" />}
              </div>
            )}
          </div>

          {/* Status badges */}
          <div className="flex gap-1.5 flex-wrap justify-center mt-1">
            {supplier.isVerified && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-[#008236] bg-[#F0FDF4] border border-[#B9F8CF] rounded-lg">
                <Translate text={localizationConstants.supplierVerified} />
              </span>
            )}
            {supplier.isTopSupplier && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-[#FF8100] bg-[rgba(255,129,0,0.1)] border border-[rgba(255,129,0,0.2)] rounded-lg">
                <Translate text={localizationConstants.supplierTopSupplier} />
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="text-xl font-semibold text-[#0A0A0A] tracking-tight leading-snug mt-1">
            {supplier.name}
          </h2>
        </div>

        {/* Non-centered section: category, location */}
        <div className="flex flex-col gap-2 w-full items-start text-left">
          <p className="text-xs text-slate-500 font-normal">
            {supplier.category} • {supplier.location}
          </p>

          {/* Star rating - centered 5-stars layout */}
          <div className="flex items-center justify-center gap-1.5 w-full">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const isFilled = supplier.rating >= i + 1;
                const isPartial = !isFilled && supplier.rating > i;
                const partialPercentage = isPartial
                  ? (supplier.rating - i) * 100
                  : 0;

                return (
                  <span key={i} className="relative block w-4 h-4 shrink-0">
                    <Star
                      className={cn(
                        "w-4 h-4 text-[#FFB800] absolute inset-0",
                        isFilled ? "fill-[#FFB800]" : "fill-transparent",
                      )}
                    />
                    {isPartial && (
                      <span
                        className="absolute inset-y-0 left-0 overflow-hidden block"
                        style={{ width: `${partialPercentage}%` }}
                      >
                        <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800] absolute inset-0" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="text-sm font-semibold text-[#0A0A0A] ml-0.5">
              {supplier.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              ({supplier.reviewCount}{" "}
              <Translate text={localizationConstants.supplierReviewCount} />)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-1.5 w-full">
          <Button className="w-full h-8 bg-[#1E293B] text-white rounded-lg text-[13px] font-medium hover:bg-slate-900 transition-colors">
            <Translate text={localizationConstants.supplierInviteToProject} />
          </Button>
          <div className="flex gap-1.5">
            <Button variant={"outline"} className="flex-1 h-8 border">
              <Translate text={localizationConstants.supplierMessage} />
            </Button>
            <Button variant={"outline"} className="w-8 h-8">
              <Globe className="w-4 h-4 text-[#0A0A0A]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 pb-1">
        <ContactRow
          icon={<Phone className="w-[18px] h-[18px] text-slate-400" />}
          label={localizationConstants.supplierLabelPhone}
          value={supplier.phone}
        />
        <ContactRow
          icon={<Mail className="w-[18px] h-[18px] text-slate-400" />}
          label={localizationConstants.supplierLabelEmail}
          value={supplier.email}
        />
        <ContactRow
          icon={<Globe className="w-[18px] h-[18px] text-slate-400" />}
          label={localizationConstants.supplierLabelWebsite}
          value={supplier.website}
          isLink
        />
        <ContactRow
          icon={<Languages className="w-[18px] h-[18px] text-slate-400" />}
          label={localizationConstants.supplierLabelLanguage}
          value={supplier.languages}
        />
        <ContactRow
          icon={<Clock className="w-[18px] h-[18px] text-slate-400" />}
          label={localizationConstants.supplierLabelResponseTime}
          value={supplier.responseTime}
        />
        <ContactRow
          icon={<div className="w-[18px] h-[18px] bg-[#00C950] rounded-full shrink-0 shadow-sm" />}
          label={localizationConstants.supplierLabelAvailability}
          value={supplier.lastActive}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <p className="text-xl font-semibold text-[#0A0A0A] tracking-tight leading-none">
              {supplier.completedProjects}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <Translate
                text={localizationConstants.supplierCompletedProjects}
              />
            </p>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <p className="text-xl font-semibold text-[#0A0A0A] tracking-tight leading-none">
              {supplier.ongoingProjects}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <Translate text={localizationConstants.supplierOngoingProjects} />
            </p>
          </div>
        </div>
        {supplier.hasRotRut && (
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <p className="text-xs text-slate-500">
              <Translate text={localizationConstants.supplierRotRut} />
            </p>
            <p className="text-sm font-medium text-[#00A63E] mt-0.5">
              <Translate text={localizationConstants.supplierRotRutApproved} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="shrink-0 mt-0.5 flex items-center justify-center w-[18px] h-[18px]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-normal leading-tight text-slate-500">
          <Translate text={label} />
        </p>
        {isLink ? (
          <a
            href={value.includes("://") ? value : `//${value}`}
            className="text-sm font-medium text-[#FF8100] hover:underline break-all block leading-tight mt-0.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-slate-900 break-all leading-tight mt-0.5">{value}</p>
        )}
      </div>
    </div>
  );
}
