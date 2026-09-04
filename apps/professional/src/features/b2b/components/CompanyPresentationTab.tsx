"use client";

import { MonitorPlay } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail, CompanyTeamMember } from "../types/company";
import { CompanyAccordionSection } from "./CompanyAccordionSection";
import { PptFileIcon } from "@/components/ui/PptFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Textarea } from "@/components/ui/textarea";

function getRoleBadgeClass(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes("vd")) {
    return "border border-blue-500 text-blue-600 bg-white";
  }
  if (normalized.includes("ekonomi")) {
    return "border border-emerald-500 text-emerald-600 bg-white";
  }
  if (normalized.includes("arbetschef") || normalized.includes("chef")) {
    return "border border-amber-500 text-amber-600 bg-white";
  }
  if (normalized.includes("inköpare") || normalized.includes("inkopare")) {
    return "border border-rose-500 text-rose-500 bg-white";
  }
  return "border border-slate-300 text-slate-500 bg-white";
}

function TeamMemberCard({ member }: { member: CompanyTeamMember }) {
  return (
    <div className="w-[198px] h-[152px] shrink-0 flex flex-col items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-200 bg-slate-50 text-center box-border">
      {member.image ? (
        <Image
          src={member.image}
          alt={member.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-sans text-[18px] font-medium leading-[30px] tracking-normal text-center text-orange-700 shrink-0">
          {member.initials}
        </div>
      )}
      <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-center text-slate-900 truncate max-w-full">
        {member.name}
      </span>
      <span
        className={`w-[91px] h-[20px] shrink-0 inline-flex items-center justify-center rounded border px-2 py-0.5 font-sans text-xs font-medium leading-4 tracking-normal text-center whitespace-nowrap ${getRoleBadgeClass(
          member.role
        )}`}
      >
        {member.role}
      </span>
      <span className="font-sans text-xs font-medium leading-4 tracking-normal text-center text-[#64748B] max-w-full truncate">
        {member.email}
      </span>
    </div>
  );
}

function FileAttachmentItem({
  file,
}: {
  file: { id: string; label: string; type: string };
}) {
  return (
    <div className="flex w-20 sm:w-24 flex-col items-center gap-1.5 cursor-pointer group text-center" title={file.label}>
      <div className="flex h-10 w-10 items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        {file.type === "ppt" ? (
          <PptFileIcon className="h-10 w-10" />
        ) : file.type === "doc" ? (
          <DocFileIcon className="h-10 w-10" />
        ) : (
          <PdfFileIcon className="h-10 w-10" />
        )}
      </div>
      <span className="w-full truncate font-sans text-xs font-normal text-slate-700 group-hover:text-blue-600">
        {file.label}
      </span>
    </div>
  );
}

interface Props {
  data: CompanyDetail;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: string) => void;
}

export function CompanyPresentationTab({
  data,
  isEditMode = false,
  onFieldChange,
}: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <CompanyAccordionSection
        title={t(localizationConstants.b2bCompanyPresentationSection)}
        icon={<MonitorPlay className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
      >
        <div className="space-y-4">
          {/* Presentations text */}
          <div className="space-y-2">
            <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
              {t(localizationConstants.b2bCompanyPresentationText)}
            </span>
            {isEditMode ? (
              <Textarea
                value={data.presentationText ?? ""}
                rows={5}
                onChange={(e) => onFieldChange?.("presentationText", e.target.value)}
                className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-700"
              />
            ) : (
              <p className="whitespace-pre-line font-sans text-sm font-normal leading-5 tracking-normal text-[#71717A]">
                {data.presentationText}
              </p>
            )}
          </div>

          <div className="border-t border-[#E5E5E5] w-full" />

          {/* Företags team */}
          <div className="space-y-2">
            <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 block">
              {t(localizationConstants.b2bCompanyTeam)}
            </span>
            <div className="flex flex-wrap gap-4 items-start">
              {data.team.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] w-full" />

          {/* Presentation företag */}
          <div className="space-y-4">
            <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 block">
              {t(localizationConstants.b2bCompanyPresentationFiles)}
            </span>
            <div className="flex flex-wrap gap-4 items-start">
              {data.presentationFiles.map((file) => (
                <FileAttachmentItem key={file.id} file={file} />
              ))}
            </div>
          </div>
        </div>
      </CompanyAccordionSection>
    </div>
  );
}
