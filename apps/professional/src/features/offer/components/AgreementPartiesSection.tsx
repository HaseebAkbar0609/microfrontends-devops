"use client";

import { useState, useId } from "react";
import { Handshake, ChevronUp, ChevronDown, Pencil, Plus } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AgreementParty } from "../types/offer";

function PartyAvatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500">
      {initials}
    </div>
  );
}

function InputField({
  label,
  defaultValue = "",
  fullWidth = false,
  name,
  type = "text",
  maxLength,
}: {
  label: string;
  defaultValue?: string;
  fullWidth?: boolean;
  name?: string;
  type?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1${fullWidth ? " col-span-2" : ""}`}>
      <label htmlFor={id} className="text-sm font-medium text-zinc-950">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        maxLength={maxLength}
        className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/50"
      />
    </div>
  );
}

function PartyCard({ party }: { party: AgreementParty }) {
  const t = useTranslate();
  const isCustomer = party.role === "customer";
  const prefix = isCustomer ? "customer" : "supplier";

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <PartyAvatar name={party.name} />
        <span className="text-base font-semibold text-slate-800">
          {party.name}
        </span>
        <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
          {isCustomer
            ? t(localizationConstants.agreementCustomerBadge)
            : t(localizationConstants.agreementSupplierBadge)}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit party"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white shadow-sm hover:bg-slate-50"
          >
            <Pencil size={13} className="text-zinc-700" aria-hidden={true} />
          </button>
          <button
            type="button"
            aria-label="Add party"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white shadow-sm hover:bg-slate-50"
          >
            <Plus size={13} className="text-zinc-700" aria-hidden={true} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isCustomer ? (
          <>
            <InputField
              label={t(localizationConstants.agreementCompanyOrPerson)}
              defaultValue={party.companyOrPerson}
              name={`${prefix}-company-or-person`}
            />
            <InputField
              label={t(localizationConstants.agreementContactPerson)}
              defaultValue={party.contactPerson}
              name={`${prefix}-contact-person`}
            />
            <InputField
              label={t(localizationConstants.agreementOrgNumber)}
              defaultValue={party.orgNumber}
              name={`${prefix}-org-number`}
              maxLength={11}
            />
            <InputField
              label={t(localizationConstants.agreementPhoneNumber)}
              defaultValue={party.phone}
              name={`${prefix}-phone`}
              type="tel"
            />
            <InputField
              label={t(localizationConstants.agreementPersonalNumber)}
              defaultValue={party.personalNumber}
              name={`${prefix}-personal-number`}
              maxLength={12}
            />
            <InputField
              label={t(localizationConstants.agreementEmail)}
              defaultValue={party.email}
              name={`${prefix}-email`}
              type="email"
            />
            <InputField
              label={t(localizationConstants.agreementAddress)}
              defaultValue={party.address}
              name={`${prefix}-address`}
              fullWidth
            />
          </>
        ) : (
          <>
            <InputField
              label={t(localizationConstants.agreementCompany)}
              defaultValue={party.company}
              name={`${prefix}-company`}
            />
            <InputField
              label={t(localizationConstants.agreementAuthorizedSignatory)}
              defaultValue={party.authorizedSignatory}
              name={`${prefix}-authorized-signatory`}
            />
            <InputField
              label={t(localizationConstants.agreementOrgNumber)}
              defaultValue={party.orgNumber}
              name={`${prefix}-org-number`}
              maxLength={11}
            />
            <InputField
              label={t(localizationConstants.agreementPersonalNumber)}
              defaultValue={party.personalNumber}
              name={`${prefix}-personal-number`}
              maxLength={12}
            />
            <InputField
              label={t(localizationConstants.agreementPhoneNumber)}
              defaultValue={party.phone}
              name={`${prefix}-phone`}
              type="tel"
            />
            <InputField
              label={t(localizationConstants.agreementEmail)}
              defaultValue={party.email}
              name={`${prefix}-email`}
              type="email"
            />
            <InputField
              label={t(localizationConstants.agreementAddress)}
              defaultValue={party.address}
              name={`${prefix}-address`}
              fullWidth
            />
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
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <Handshake size={18} className="shrink-0 text-slate-800" />
        <span className="text-base font-medium text-slate-800">
          {t(localizationConstants.agreementSection)}
        </span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp size={16} className="text-zinc-500" />
          ) : (
            <ChevronDown size={16} className="text-zinc-500" />
          )}
        </span>
      </button>

      {open && (
        <>
          <div className="border-t border-slate-200" />
          <div className="px-4 py-4">
            {parties.map((party, index) => (
              <div key={party.id}>
                <PartyCard party={party} />
                {index < parties.length - 1 && (
                  <div className="my-5 border-t border-slate-200" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
