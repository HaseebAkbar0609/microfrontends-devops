"use client";

import { useState } from "react";
import { FileText, ChevronUp, ChevronDown, Pencil, Plus } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AgreementParty } from "../types/offer";

const AVATAR_COLORS: Record<string, string> = {
  customer: "bg-slate-700",
  supplier: "bg-teal-700",
};

function PartyAvatar({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${AVATAR_COLORS[role] ?? "bg-slate-500"}`}
    >
      {initials}
    </div>
  );
}

function FieldPair({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) return <div />;
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm text-slate-800">{value}</p>
    </div>
  );
}

function PartyCard({ party }: { party: AgreementParty }) {
  const t = useTranslate();
  const isCustomer = party.role === "customer";

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
      <div className="mb-4 flex items-center gap-2.5">
        <PartyAvatar name={party.name} role={party.role} />
        <span className="text-sm font-semibold text-slate-900">
          {party.name}
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
            isCustomer
              ? "bg-blue-50 text-blue-700"
              : "bg-purple-50 text-purple-700"
          }`}
        >
          {isCustomer
            ? t(localizationConstants.agreementCustomerBadge)
            : t(localizationConstants.agreementSupplierBadge)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Edit party"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded hover:bg-slate-200"
          >
            <Pencil size={13} className="text-slate-500" />
          </button>
          <button
            type="button"
            aria-label="Add party"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded hover:bg-slate-200"
          >
            <Plus size={13} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {isCustomer ? (
          <>
            <FieldPair
              label={t(localizationConstants.agreementCompanyOrPerson)}
              value={party.companyOrPerson}
            />
            <FieldPair
              label={t(localizationConstants.agreementContactPerson)}
              value={party.contactPerson}
            />
            <FieldPair
              label={t(localizationConstants.agreementOrgNumber)}
              value={party.orgNumber}
            />
            <FieldPair
              label={t(localizationConstants.agreementPhoneNumber)}
              value={party.phone}
            />
            <FieldPair
              label={t(localizationConstants.agreementPersonalNumber)}
              value={party.personalNumber}
            />
            <FieldPair
              label={t(localizationConstants.agreementEmail)}
              value={party.email}
            />
            <div className="col-span-2">
              <FieldPair
                label={t(localizationConstants.agreementAddress)}
                value={party.address}
              />
            </div>
          </>
        ) : (
          <>
            <FieldPair
              label={t(localizationConstants.agreementCompany)}
              value={party.company}
            />
            <FieldPair
              label={t(localizationConstants.agreementAuthorizedSignatory)}
              value={party.authorizedSignatory}
            />
            <FieldPair
              label={t(localizationConstants.agreementOrgNumber)}
              value={party.orgNumber}
            />
            <FieldPair
              label={t(localizationConstants.agreementPersonalNumber)}
              value={party.personalNumber}
            />
            <FieldPair
              label={t(localizationConstants.agreementPhoneNumber)}
              value={party.phone}
            />
            <FieldPair
              label={t(localizationConstants.agreementEmail)}
              value={party.email}
            />
            <div className="col-span-2">
              <FieldPair
                label={t(localizationConstants.agreementAddress)}
                value={party.address}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface Props {
  parties: AgreementParty[];
}

export function AgreementPartiesSection({ parties }: Props) {
  const t = useTranslate();
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-5 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <FileText size={18} className="shrink-0 text-slate-500" />
        <span className="text-sm font-semibold text-slate-800">
          {t(localizationConstants.agreementSection)}
        </span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </span>
      </button>

      {open && (
        <>
          <div className="border-t border-slate-100" />
          <div className="space-y-3 px-5 py-4">
            {parties.map((party) => (
              <PartyCard key={party.id} party={party} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
