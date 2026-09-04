"use client";

import { useState, useId, useRef } from "react";
import { Handshake, ChevronUp, ChevronDown, PencilLine, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AgreementParty } from "../types/offer";
import { showToast } from "@/lib/toast";

function PartyAvatar({ name, role }: { name: string; role: "customer" | "supplier" }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (role === "supplier") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-800">
        {initials || "S"}
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500">
      {initials || "C"}
    </div>
  );
}

function InputField({
  label,
  value = "",
  onChange,
  error,
  fullWidth = false,
  name,
  type = "text",
  maxLength,
  pattern,
  inputRef,
}: {
  label: string;
  value?: string;
  onChange?: (val: string) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  name?: string;
  type?: string;
  maxLength?: number;
  pattern?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1${fullWidth ? " col-span-1 md:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-sm font-medium text-zinc-950">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={maxLength}
        pattern={pattern}
        className={cn(
          "h-9 w-full rounded border bg-white px-3 text-sm text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2",
          error
            ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
            : "border-zinc-200 focus-visible:border-slate-300 focus-visible:ring-slate-300/50"
        )}
      />
      {error && <span className="text-[11px] text-red-500 font-normal">{error}</span>}
    </div>
  );
}

function PartyCard({
  party,
  errors = {},
  canRemove = false,
  onChange,
  onAddParty,
  onRemove,
}: {
  party: AgreementParty;
  errors?: Record<string, string>;
  canRemove?: boolean;
  onChange?: (updated: AgreementParty) => void;
  onAddParty?: (role: "customer" | "supplier") => void;
  onRemove?: () => void;
}) {
  const t = useTranslate();
  const isCustomer = party.role === "customer";
  const prefix = isCustomer ? "customer" : "supplier";
  const firstInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof AgreementParty, val: string) => {
    if (!onChange) return;
    onChange({
      ...party,
      [field]: val,
    });
  };

  const handleEditClick = () => {
    firstInputRef.current?.focus();
    showToast("info", `Editing ${party.name} details`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <PartyAvatar name={party.name} role={party.role} />
        <span className="text-base font-semibold text-slate-800">
          {party.name}
        </span>
        <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
          {isCustomer
            ? t(localizationConstants.agreementCustomerBadge) || "Customer"
            : t(localizationConstants.agreementSupplierBadge) || "Supplier"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit party"
            onClick={handleEditClick}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-zinc-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <PencilLine size={15} className="text-zinc-700" aria-hidden={true} />
          </button>
          <button
            type="button"
            aria-label="Add party"
            onClick={() => onAddParty?.(party.role)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-zinc-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <Plus size={15} className="text-zinc-700" aria-hidden={true} />
          </button>
          {canRemove && (
            <button
              type="button"
              aria-label="Remove party"
              onClick={onRemove}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-zinc-200 bg-white text-zinc-700 hover:bg-slate-50 transition-colors"
            >
              <Trash2 size={15} className="text-zinc-700" aria-hidden={true} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isCustomer ? (
          <>
            <InputField
              label={t(localizationConstants.agreementCompanyOrPerson) || "Customer"}
              value={party.companyOrPerson ?? ""}
              onChange={(val) => updateField("companyOrPerson", val)}
              error={errors.companyOrPerson}
              required
              name={`${prefix}-company-or-person`}
              inputRef={firstInputRef}
            />
            <InputField
              label={t(localizationConstants.agreementContactPerson) || "Contract person"}
              value={party.contactPerson ?? ""}
              onChange={(val) => updateField("contactPerson", val)}
              error={errors.contactPerson}
              required
              name={`${prefix}-contact-person`}
            />
            <InputField
              label={t(localizationConstants.agreementOrgNumber) || "Org number / personal number"}
              value={party.orgNumber ?? ""}
              onChange={(val) => updateField("orgNumber", val)}
              error={errors.orgNumber}
              name={`${prefix}-org-number`}
              maxLength={15}
            />
            <InputField
              label={t(localizationConstants.agreementPhoneNumber) || "Phone number"}
              value={party.phone ?? ""}
              onChange={(val) => updateField("phone", val)}
              error={errors.phone}
              required
              name={`${prefix}-phone`}
              type="tel"
            />
            <InputField
              label={t(localizationConstants.agreementPersonalNumber) || "Personal number"}
              value={party.personalNumber ?? ""}
              onChange={(val) => updateField("personalNumber", val)}
              error={errors.personalNumber}
              name={`${prefix}-personal-number`}
              maxLength={15}
            />
            <InputField
              label={t(localizationConstants.agreementEmail) || "Email"}
              value={party.email ?? ""}
              onChange={(val) => updateField("email", val)}
              error={errors.email}
              required
              name={`${prefix}-email`}
              type="email"
            />
            <InputField
              label={t(localizationConstants.agreementAddress) || "Address"}
              value={party.address ?? ""}
              onChange={(val) => updateField("address", val)}
              error={errors.address}
              required
              name={`${prefix}-address`}
              fullWidth
            />
          </>
        ) : (
          <>
            <InputField
              label={t(localizationConstants.agreementCompany) || "Company"}
              value={party.company ?? ""}
              onChange={(val) => updateField("company", val)}
              error={errors.company}
              required
              name={`${prefix}-company`}
              inputRef={firstInputRef}
            />
            <InputField
              label={t(localizationConstants.agreementAuthorizedSignatory) || "Authorized signatory"}
              value={party.authorizedSignatory ?? ""}
              onChange={(val) => updateField("authorizedSignatory", val)}
              error={errors.authorizedSignatory}
              required
              name={`${prefix}-authorized-signatory`}
            />
            <InputField
              label={t(localizationConstants.agreementOrgNumber) || "Org number"}
              value={party.orgNumber ?? ""}
              onChange={(val) => updateField("orgNumber", val)}
              error={errors.orgNumber}
              name={`${prefix}-org-number`}
              maxLength={15}
            />
            <InputField
              label={t(localizationConstants.agreementPersonalNumber) || "Personal number"}
              value={party.personalNumber ?? ""}
              onChange={(val) => updateField("personalNumber", val)}
              error={errors.personalNumber}
              name={`${prefix}-personal-number`}
              maxLength={15}
            />
            <InputField
              label={t(localizationConstants.agreementPhoneNumber) || "Phone number"}
              value={party.phone ?? ""}
              onChange={(val) => updateField("phone", val)}
              error={errors.phone}
              required
              name={`${prefix}-phone`}
              type="tel"
            />
            <InputField
              label={t(localizationConstants.agreementEmail) || "Email"}
              value={party.email ?? ""}
              onChange={(val) => updateField("email", val)}
              error={errors.email}
              required
              name={`${prefix}-email`}
              type="email"
            />
            <InputField
              label={t(localizationConstants.agreementAddress) || "Address"}
              value={party.address ?? ""}
              onChange={(val) => updateField("address", val)}
              error={errors.address}
              required
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
  errors?: Record<string, Record<string, string>>;
  onPartyChange?: (index: number, updated: AgreementParty) => void;
  onAddParty?: (role: "customer" | "supplier") => void;
  onRemoveParty?: (index: number) => void;
}

export function AgreementPartiesSection({
  parties,
  errors = {},
  onPartyChange,
  onAddParty,
  onRemoveParty,
}: Props) {
  const t = useTranslate();
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center gap-4 p-4",
          open && "border-b border-slate-200",
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <Handshake size={21} className="shrink-0 text-slate-800" />
        <span className="flex-1 text-left text-base font-medium text-slate-800">
          {t(localizationConstants.agreementSection) || "Agreement"}
        </span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-zinc-500" />
        )}
      </button>

      {open && (
        <div className="p-4">
          {parties.map((party, index) => (
            <div key={party.id}>
              <PartyCard
                party={party}
                errors={errors[party.id]}
                canRemove={parties.length > 2}
                onChange={(updated) => onPartyChange?.(index, updated)}
                onAddParty={onAddParty}
                onRemove={() => onRemoveParty?.(index)}
              />
              {index < parties.length - 1 && (
                <div className="my-5 border-t border-slate-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

