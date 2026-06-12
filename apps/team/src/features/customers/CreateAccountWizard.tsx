"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1 — Company details
  companyName: string;
  orgNumber: string;
  category: string;
  city: string;
  // Step 2 — Contact person
  contactName: string;
  email: string;
  phone: string;
  // Step 3 — Offer
  plan: string;
  price: string;
  discount: string;
  startDate: string;
}

const INITIAL_FORM: FormData = {
  companyName: "",
  orgNumber: "",
  category: "",
  city: "",
  contactName: "",
  email: "",
  phone: "",
  plan: "",
  price: "",
  discount: "",
  startDate: "",
};

const CATEGORY_OPTIONS = [
  "Bygg",
  "Elektriker",
  "Målare",
  "VVS",
  "Tak",
  "Städbolag",
  "Golv",
  "Fasad",
];

const CITY_OPTIONS = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Solna",
  "Järfälla",
  "Täby",
  "Linköping",
  "Örebro",
  "Västerås",
  "Helsingborg",
];

const PLAN_OPTIONS = ["Basic", "Standard", "Premium"];

// ─── Progress bar ───────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 bg-[#F8FAFC] px-6 py-3">
      {([1, 2, 3, 4] as Step[]).map((s) => (
        <div
          key={s}
          className="h-2 flex-1 rounded-full transition-colors"
          style={{ backgroundColor: s <= step ? "#111721" : "#E2E8F0" }}
        />
      ))}
    </div>
  );
}

// ─── Field helpers ──────────────────────────────────────────────────────────────

function FieldGroup({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1${className ? ` ${className}` : ""}`}>
      <Label className="text-sm font-medium text-[#314158]">{label}</Label>
      {children}
    </div>
  );
}

const inputClass =
  "h-[42px] rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-base text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus-visible:ring-0 focus-visible:border-slate-400";

const selectTriggerClass =
  "h-[42px] w-full rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-base text-[#0A0A0A] focus:ring-0 focus:border-slate-400";

// ─── Step 1: Company details ────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const t = useTranslate();
  return (
    <div className="flex flex-col gap-4 px-6 pt-6 pb-2">
      <h3 className="text-lg font-medium text-[#0F172B]">
        <Translate text={localizationConstants.companyDetailsTitle} />
      </h3>
      <div className="flex flex-col gap-4">
        <FieldGroup label={<>{t(localizationConstants.companyNameLabel)} *</>}>
          <Input
            className={inputClass}
            placeholder={t(localizationConstants.companyNamePlaceholder)}
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
          />
        </FieldGroup>

        <FieldGroup label={<>{t(localizationConstants.orgNumberFullLabel)} *</>}>
          <Input
            className={inputClass}
            placeholder="XXXXXX-XXXX"
            value={data.orgNumber}
            onChange={(e) => onChange({ orgNumber: e.target.value })}
          />
        </FieldGroup>

        <div className="flex gap-4">
          <FieldGroup className="flex-1" label={<>{t(localizationConstants.categoryLabel)} *</>}>
            <Select value={data.category} onValueChange={(v) => onChange({ category: v })}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder={t(localizationConstants.categoryLabel)} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup className="flex-1" label={<>{t(localizationConstants.cityLabel)} *</>}>
            <Select value={data.city} onValueChange={(v) => onChange({ city: v })}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder={t(localizationConstants.cityLabel)} />
              </SelectTrigger>
              <SelectContent>
                {CITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Contact person ─────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const t = useTranslate();
  return (
    <div className="flex flex-col gap-4 px-6 pt-6 pb-2">
      <h3 className="text-lg font-medium text-[#0F172B]">
        <Translate text={localizationConstants.contactPersonLabel} />
      </h3>
      <div className="flex flex-col gap-4">
        <FieldGroup label={<>{t(localizationConstants.nameLabel)} *</>}>
          <Input
            className={inputClass}
            placeholder={t(localizationConstants.nameLabel)}
            value={data.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
          />
        </FieldGroup>

        <FieldGroup label={<>{t(localizationConstants.emailLabel)} *</>}>
          <Input
            type="email"
            className={inputClass}
            placeholder="namn@foretag.se"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </FieldGroup>

        <FieldGroup label={<>{t(localizationConstants.phoneLabel)} *</>}>
          <Input
            type="tel"
            className={inputClass}
            placeholder="0XX XXX XX XX"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

// ─── Step 3: Offer ─────────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const t = useTranslate();
  return (
    <div className="flex flex-col gap-4 px-6 pt-6 pb-2">
      <h3 className="text-lg font-medium text-[#0F172B]">
        <Translate text={localizationConstants.offerSectionTitle} />
      </h3>
      <div className="flex flex-col gap-4">
        <FieldGroup label={<>{t(localizationConstants.planLabel)} *</>}>
          <Select value={data.plan} onValueChange={(v) => onChange({ plan: v })}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder={t(localizationConstants.planLabel)} />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>

        <div className="flex gap-4">
          <FieldGroup className="flex-1" label={<>{t(localizationConstants.priceMonthlyLabel)} *</>}>
            <Input
              type="number"
              className={inputClass}
              placeholder="1500"
              value={data.price}
              onChange={(e) => onChange({ price: e.target.value })}
            />
          </FieldGroup>

          <FieldGroup className="flex-1" label={t(localizationConstants.discountPercentLabel)}>
            <Input
              type="number"
              className={inputClass}
              placeholder="0"
              value={data.discount}
              onChange={(e) => onChange({ discount: e.target.value })}
            />
          </FieldGroup>
        </div>

        <FieldGroup label={<>{t(localizationConstants.startDateLabel)} *</>}>
          <input
            type="date"
            className={`${inputClass} w-full`}
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

// ─── Step 4: Review ─────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: React.ReactNode; value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#45556C]">{label}</span>
      <span className="text-sm font-medium text-[#0F172B]">{value ?? "—"}</span>
    </div>
  );
}

function Step4({ data }: { data: FormData }) {
  const t = useTranslate();
  return (
    <div className="flex flex-col gap-4 px-6 pt-6 pb-2">
      <h3 className="text-lg font-medium text-[#0F172B]">
        <Translate text={localizationConstants.reviewAndSendInvoiceTitle} />
      </h3>

      {/* Summary card */}
      <div className="flex flex-col gap-3 rounded-[10px] bg-[#F8FAFC] px-4 pt-4 pb-0">
        <ReviewRow label={`${t(localizationConstants.companyLabel)}:`} value={data.companyName} />
        <ReviewRow label={`${t(localizationConstants.orgNumberLabel)}:`} value={data.orgNumber} />
        <ReviewRow label={`${t(localizationConstants.categoryLabel)}:`} value={data.category} />
        <ReviewRow label={`${t(localizationConstants.contactPersonLabel)}:`} value={data.contactName} />
        <ReviewRow label={`${t(localizationConstants.emailLabel)}:`} value={data.email} />

        <div className="flex flex-col gap-2 border-t border-[#E2E8F0] pt-3 pb-4">
          <ReviewRow
            label={`${t(localizationConstants.planLabel)}:`}
            value={data.plan}
          />
          <ReviewRow
            label={`${t(localizationConstants.amountLabel)}:`}
            value={data.price ? `${data.price} SEK/mån` : undefined}
          />
        </div>
      </div>

      {/* Invoice note */}
      <div className="rounded-[10px] border border-[#BEDBFF] bg-[#EFF6FF] px-4 py-4">
        <p className="text-sm text-[#111721]">
          <Translate text={localizationConstants.invoiceNoteText} />
        </p>
      </div>
    </div>
  );
}

// ─── Wizard ─────────────────────────────────────────────────────────────────────

export type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: FormData) => void;
};

export function CreateAccountWizard({ open, onOpenChange, onSubmit }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  const patch = (update: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...update }));

  const handleClose = () => {
    setStep(1);
    setFormData(INITIAL_FORM);
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
    else {
      onSubmit?.(formData);
      handleClose();
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.companyName || !formData.orgNumber || !formData.category || !formData.city;
    if (step === 2) return !formData.contactName || !formData.email || !formData.phone;
    if (step === 3) return !formData.plan || !formData.price || !formData.startDate;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-[672px] gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-0 pr-14" style={{ height: 85 }}>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-xl font-semibold leading-7 tracking-tight text-[#0F172B]">
              <Translate text={localizationConstants.createCustomerAccountTitle} />
            </DialogTitle>
            <p className="text-sm text-[#45556C]">
              {`Steg ${step} av 4`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100"
          >
            <X className="h-4 w-4 text-[#0A0A0A]" />
          </button>
        </div>

        {/* Progress bar */}
        <ProgressBar step={step} />

        {/* Step content */}
        {step === 1 && <Step1 data={formData} onChange={patch} />}
        {step === 2 && <Step2 data={formData} onChange={patch} />}
        {step === 3 && <Step3 data={formData} onChange={patch} />}
        {step === 4 && <Step4 data={formData} />}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] px-6 py-4 mt-4">
          <Button
            variant="outline"
            className="min-w-[85px] border-[#CAD5E2] text-[#0A0A0A] hover:bg-slate-50"
            onClick={step === 1 ? handleClose : () => setStep((s) => (s - 1) as Step)}
          >
            {step === 1
              ? <Translate text={localizationConstants.cancelLabel} />
              : <Translate text={localizationConstants.backLabel} />}
          </Button>
          <Button
            className="min-w-[86px] bg-[#111721] text-white hover:bg-[#111721]/90"
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            {step === 4
              ? <Translate text={localizationConstants.sendInvoiceLabel} />
              : <Translate text={localizationConstants.nextLabel} />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
