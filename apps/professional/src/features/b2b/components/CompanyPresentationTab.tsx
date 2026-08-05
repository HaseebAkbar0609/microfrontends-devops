"use client";

import { useState } from "react";
import { Monitor, ChevronUp, FileText } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail, CompanyTeamMember } from "../types/company";

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2 text-slate-600">
          {icon}
          <span className="text-sm font-semibold text-zinc-900">{title}</span>
        </div>
        <ChevronUp
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          aria-hidden={true}
        />
      </button>
      {open && <div className="border-t border-slate-100 px-5 py-4">{children}</div>}
    </div>
  );
}

function TeamMemberCard({ member }: { member: CompanyTeamMember }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${member.avatarColor}`}>
        {member.initials}
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold text-zinc-900">{member.name}</span>
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium text-white ${member.roleColor}`}>
          {member.role}
        </span>
        <span className="max-w-28 truncate text-xs text-slate-500">{member.email}</span>
      </div>
    </div>
  );
}

function FileDocItem({ file }: { file: { id: string; label: string; type: string } }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-10 w-10 items-center justify-center">
        {file.type === "pdf" ? (
          <Image src="/file-type-pdf.png" alt={file.label} width={40} height={40} className="h-10 w-10 object-contain" />
        ) : file.type === "doc" ? (
          <Image src="/file-type-doc.png" alt={file.label} width={40} height={40} className="h-10 w-10 object-contain" />
        ) : (
          <FileText className="h-10 w-10 text-slate-300" aria-hidden={true} />
        )}
      </div>
      <span className="max-w-20 truncate text-center text-xs text-slate-600">{file.label}</span>
    </div>
  );
}

interface Props {
  data: CompanyDetail;
}

export function CompanyPresentationTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <AccordionSection title={t(localizationConstants.b2bCompanyPresentationSection)} icon={<Monitor size={18} />}>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">{t(localizationConstants.b2bCompanyPresentationText)}</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">{data.presentationText}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-900">{t(localizationConstants.b2bCompanyTeam)}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {data.team.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-900">{t(localizationConstants.b2bCompanyPresentationFiles)}</p>
            <div className="flex flex-wrap gap-4">
              {data.presentationFiles.map((file) => (
                <FileDocItem key={file.id} file={file} />
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}
