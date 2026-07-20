"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
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
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createProfessionalAPIAction } from "@/api-actions";

type Step = 1 | 2 | 3 | 4;

interface LicenseEntry {
  name: string;
  quantity: number;
  amountPerMonth: number;
}

interface FormData {
  companyName: string;
  orgNumber: string;
  categoryName: string;
  cityName: string;
  contactName: string;
  email: string;
  phone: string;
  plan: string;
  planAmount: number;
  licenses: LicenseEntry[];
  testPeriodStart: string;
  testPeriodEnd: string;
}

const INITIAL_FORM: FormData = {
  companyName: "",
  orgNumber: "",
  categoryName: "",
  cityName: "",
  contactName: "",
  email: "",
  phone: "",
  plan: "startTest",
  planAmount: 2995,
  licenses: [
    { name: "Standard", quantity: 4, amountPerMonth: 995 },
    { name: "PRO", quantity: 4, amountPerMonth: 995 },
  ],
  testPeriodStart: "2026-06-01",
  testPeriodEnd: "2026-06-01",
};

const step1Schema = z.object({
  companyName: z.string().min(1, localizationConstants.validationRegisterCompanyNameRequired as string),
  orgNumber: z
    .string()
    .min(1, localizationConstants.validationRegisterOrganisationNumberRequired as string)
    .regex(/^\d{6}-\d{4}$/, localizationConstants.validationOrgNumberInvalid as string),
  categoryName: z.string().min(1, localizationConstants.validationRegisterCategoryRequired as string),
  cityName: z.string().min(1, localizationConstants.validationRegisterCityRequired as string),
});

const step2Schema = z.object({
  contactName: z.string().min(1, localizationConstants.validationContactNameRequired as string),
  email: z
    .string()
    .min(1, localizationConstants.validationRegisterEmailRequired as string)
    .email(localizationConstants.validationRegisterEmailInvalid as string),
  phone: z.string().min(1, localizationConstants.validationRegisterPhoneRequired as string),
});

const step3Schema = z.object({
  plan: z.string().min(1, localizationConstants.validationPlanRequired as string),
});

function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path[0];
    if (typeof path === "string") {
      errors[path] = issue.message;
    }
  }
  return errors;
}

const inputClass =
  "h-[42px] w-full rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-slate-400";

const labelClass =
  "text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]";

const stepTitleClass =
  "text-[18px] font-medium text-slate-900 leading-[28px] tracking-[-0.44px]";

const dateDisplayClass =
  "mt-1 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal";

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 bg-white px-8 py-3">
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

function Step1({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.companyNameLabel} /> *
        </Label>
        <Input
          className={inputClass}
          placeholder={t(localizationConstants.companyNamePlaceholder)}
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
        />
        {errors.companyName && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.companyName} />
          </span>
        )}
      </div>

      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.orgNumberLabel} /> *
        </Label>
        <Input
          className={inputClass}
          placeholder="XXXXXX-XXXX"
          value={data.orgNumber}
          onChange={(e) => onChange({ orgNumber: e.target.value })}
        />
        {errors.orgNumber && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.orgNumber} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.categoryLabel} /> *
        </Label>
        <Input
          className={inputClass}
          placeholder={t(localizationConstants.categoryPlaceholder)}
          value={data.categoryName}
          onChange={(e) => onChange({ categoryName: e.target.value })}
        />
        {errors.categoryName && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.categoryName} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.cityLabel} /> *
        </Label>
        <Input
          className={inputClass}
          placeholder={t(localizationConstants.cityPlaceholder)}
          value={data.cityName}
          onChange={(e) => onChange({ cityName: e.target.value })}
        />
        {errors.cityName && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.cityName} />
          </span>
        )}
      </div>
    </div>
  );
}

function Step2({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.nameLabel} /> *
        </Label>
        <Input
          className={inputClass}
          placeholder={t(localizationConstants.contactNamePlaceholder)}
          value={data.contactName}
          onChange={(e) => onChange({ contactName: e.target.value })}
        />
        {errors.contactName && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.contactName} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.emailLabel} /> *
        </Label>
        <Input
          type="email"
          className={inputClass}
          placeholder={t(localizationConstants.emailPlaceholder)}
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        {errors.email && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.email} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={labelClass}>
          <Translate text={localizationConstants.phoneLabel} /> *
        </Label>
        <Input
          className={inputClass}
          placeholder={t(localizationConstants.phonePlaceholder)}
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
        {errors.phone && (
          <span className="text-xs font-medium text-red-500">
            <Translate text={errors.phone} />
          </span>
        )}
      </div>
    </div>
  );
}

function Step3({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslate();
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const PLAN_OPTIONS = [
    { value: "startTest", label: t(localizationConstants.startTestPlanLabel) },
    { value: "start", label: "Start" },
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Controls */}
      <div className="md:col-span-7 flex flex-col gap-5">
        {/* Välj plan */}
        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>
            <Translate text={localizationConstants.choosePlanSectionTitle} />
          </Label>
          <Select
            value={data.plan}
            onValueChange={(val) => onChange({ plan: val })}
          >
            <SelectTrigger className="h-[42px] w-full rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal focus:border-slate-400 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white">
              {PLAN_OPTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.plan && (
            <span className="text-xs font-medium text-red-500">
              <Translate text={errors.plan} />
            </span>
          )}
        </div>

        {/* License Rows */}
        {data.licenses.map((lic) => (
          <div key={lic.name} className="flex flex-col gap-1.5">
            <Label className={labelClass}>
              <Translate text={localizationConstants.licensesLabel} />
            </Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                className="h-[42px] flex-1 rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal"
                value={lic.name}
              />
              <div className="h-[42px] w-[42px] shrink-0 rounded-[8px] bg-[#D9D9D9] flex items-center justify-center text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal">
                {lic.quantity}
              </div>
            </div>
          </div>
        ))}

        {/* Test Period */}
        <div className="flex flex-col gap-2 mt-1">
          <Label className={labelClass}>
            <Translate text={localizationConstants.testPeriodLabel} />
          </Label>
          <div className="flex flex-col gap-3">
            {/* Start Date */}
            <div>
              <input
                type="date"
                ref={startRef}
                className="absolute pointer-events-none h-0 w-0 opacity-0"
                value={data.testPeriodStart}
                onChange={(e) => onChange({ testPeriodStart: e.target.value })}
              />
              <button
                type="button"
                onClick={() =>
                  (startRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
                }
                className="flex h-[38px] w-[130px] cursor-pointer items-center justify-between rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal"
              >
                <span>{t(localizationConstants.startLabel)}</span>
              </button>
              <div className={dateDisplayClass}>
                {data.testPeriodStart}
              </div>
            </div>

            {/* End Date */}
            <div>
              <input
                type="date"
                ref={endRef}
                className="absolute pointer-events-none h-0 w-0 opacity-0"
                value={data.testPeriodEnd}
                onChange={(e) => onChange({ testPeriodEnd: e.target.value })}
              />
              <button
                type="button"
                onClick={() =>
                  (endRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
                }
                className="flex h-[38px] w-[130px] cursor-pointer items-center justify-between rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal"
              >
                <span>{t(localizationConstants.endLabel)}</span>
              </button>
              <div className={dateDisplayClass}>
                {data.testPeriodEnd}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Summary */}
      <div className="md:col-span-5 flex flex-col gap-5 pt-6 sm:pt-7">
        {/* Plan Amount */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
          <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
            <Translate text={localizationConstants.amountLabel} />:
          </span>
          <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
            {data.planAmount} {t(localizationConstants.sekPerMonthLabel)}
          </span>
        </div>

        {/* License 1 Amount */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
          <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
            <Translate text={localizationConstants.amountLabel} />:
          </span>
          <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
            995 {t(localizationConstants.sekPerMonthLabel)}
          </span>
        </div>

        {/* License 2 Amount */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
          <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
            <Translate text={localizationConstants.amountLabel} />:
          </span>
          <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
            995 {t(localizationConstants.sekPerMonthLabel)}
          </span>
        </div>

        {/* Total Amount */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
          <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
            <Translate text={localizationConstants.totalLabel} />
          </span>
          <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
            12,155 {t(localizationConstants.sekPerMonthLabel)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ labelKey, value }: { labelKey: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
        <Translate text={labelKey} />:
      </span>
      <span className="text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal">{value}</span>
    </div>
  );
}

function Step4({ data }: { data: FormData }) {
  const t = useTranslate();
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const PLAN_OPTIONS = [
    { value: "startTest", label: t(localizationConstants.startTestPlanLabel) },
    { value: "start", label: "Start" },
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-[10px] bg-slate-50 px-4 py-3 border border-slate-200">
        <ReviewRow labelKey={localizationConstants.companyNameLabel} value={data.companyName} />
        <ReviewRow labelKey={localizationConstants.orgNumberLabel} value={data.orgNumber} />
        <ReviewRow labelKey={localizationConstants.categoryLabel} value={data.categoryName} />
        <ReviewRow labelKey={localizationConstants.cityLabel} value={data.cityName} />
        <ReviewRow labelKey={localizationConstants.nameLabel} value={data.contactName} />
        <ReviewRow labelKey={localizationConstants.emailLabel} value={data.email} />
        <ReviewRow labelKey={localizationConstants.phoneLabel} value={data.phone} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className={labelClass}>
              <Translate text={localizationConstants.choosePlanSectionTitle} />
            </Label>
            <Select value={data.plan} disabled>
              <SelectTrigger className="h-[42px] w-full rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal opacity-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {PLAN_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.licenses.map((lic) => (
            <div key={lic.name} className="flex flex-col gap-1.5">
              <Label className={labelClass}>
                <Translate text={localizationConstants.licensesLabel} />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  className="h-[42px] flex-1 rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal"
                  value={lic.name}
                />
                <div className="h-[42px] w-[42px] shrink-0 rounded-[8px] bg-[#D9D9D9] flex items-center justify-center text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal">
                  {lic.quantity}
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-2 mt-1">
            <Label className={labelClass}>
              <Translate text={localizationConstants.testPeriodLabel} />
            </Label>
            <div className="flex flex-col gap-3">
              <div>
                <input
                  type="date"
                  ref={startRef}
                  readOnly
                  className="absolute pointer-events-none h-0 w-0 opacity-0"
                  value={data.testPeriodStart}
                />
                <button
                  type="button"
                  className="flex h-[38px] w-[130px] items-center justify-between rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal"
                >
                  <span>{t(localizationConstants.startLabel)}</span>
                </button>
                <div className={dateDisplayClass}>
                  {data.testPeriodStart}
                </div>
              </div>

              <div>
                <input
                  type="date"
                  ref={endRef}
                  readOnly
                  className="absolute pointer-events-none h-0 w-0 opacity-0"
                  value={data.testPeriodEnd}
                />
                <button
                  type="button"
                  className="flex h-[38px] w-[130px] items-center justify-between rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal"
                >
                  <span>{t(localizationConstants.endLabel)}</span>
                </button>
                <div className={dateDisplayClass}>
                  {data.testPeriodEnd}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-5 pt-6 sm:pt-7">
          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
            <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
              <Translate text={localizationConstants.amountLabel} />:
            </span>
            <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
              {data.planAmount} {t(localizationConstants.sekPerMonthLabel)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
            <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
              <Translate text={localizationConstants.amountLabel} />:
            </span>
            <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
              995 {t(localizationConstants.sekPerMonthLabel)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
            <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
              <Translate text={localizationConstants.amountLabel} />:
            </span>
            <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
              995 {t(localizationConstants.sekPerMonthLabel)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
            <span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
              <Translate text={localizationConstants.totalLabel} />
            </span>
            <span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-[-0.15px]">
              12,155 {t(localizationConstants.sekPerMonthLabel)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#BEDBFF] bg-[#EFF6FF] p-3 text-[14px] font-normal text-[#111721] leading-[20px] tracking-[-0.15px] mt-2">
        <Translate text={localizationConstants.invoiceNoteText} />
      </div>
    </div>
  );
}

export type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CreateAccountWizard({ open, onOpenChange, onSuccess }: Props) {
  const t = useTranslate();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setStep(1);
      setFormData(INITIAL_FORM);
      setStep1Errors({});
      setStep2Errors({});
      setStep3Errors({});
    }
  }, [open]);

  const updateForm = (patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      const result = step1Schema.safeParse(formData);
      if (!result.success) {
        setStep1Errors(formatZodErrors(result.error));
        return false;
      }
      setStep1Errors({});
    } else if (step === 2) {
      const result = step2Schema.safeParse(formData);
      if (!result.success) {
        setStep2Errors(formatZodErrors(result.error));
        return false;
      }
      setStep2Errors({});
    } else if (step === 3) {
      const result = step3Schema.safeParse(formData);
      if (!result.success) {
        setStep3Errors(formatZodErrors(result.error));
        return false;
      }
      setStep3Errors({});
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep((s) => (s + 1) as Step);
    } else {
      setIsSubmitting(true);
      try {
        await createProfessionalAPIAction({
          company_name: formData.companyName,
          organization_number: formData.orgNumber,
          company_category: formData.categoryName,
          city: formData.cityName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
        });
        onSuccess?.();
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to create professional account:", err);
        toast.error("Misslyckades att skapa kontot. Försök igen.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    } else {
      onOpenChange(false);
    }
  };

  const stepTitle =
    step === 1
      ? localizationConstants.companyDetailsSectionTitle
      : step === 2
      ? localizationConstants.contactInfoSectionTitle
      : step === 3
      ? localizationConstants.choosePlanSectionTitle
      : localizationConstants.reviewSectionTitle;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[calc(100dvh-3.5rem)] sm:max-h-[88vh] max-w-[min(92vw,680px)] lg:max-w-[720px] xl:max-w-[750px] rounded-[16px] overflow-hidden p-0 bg-white border border-slate-200 shadow-xl">
        <div className="flex shrink-0 flex-col gap-1 bg-white px-5 sm:px-8 pt-5 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-200">
          <DialogTitle className="text-[18px] sm:text-[20px] font-semibold text-slate-900 leading-[26px] sm:leading-[28px] tracking-[-0.45px]">
            <Translate text={localizationConstants.createCustomerAccountTitle} />
          </DialogTitle>
          <span className="text-[13px] sm:text-[14px] font-normal text-slate-500 leading-[18px] sm:leading-[20px] tracking-[-0.15px]">
            {t(localizationConstants.stepOfLabel).replace("{step}", String(step))}
          </span>
        </div>

        <div className="shrink-0">
          <ProgressBar step={step} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto bg-white px-5 sm:px-8 py-4 sm:py-5 flex flex-col gap-5">
          {step !== 3 && (
            <h3 className={stepTitleClass}>
              <Translate text={stepTitle} />
            </h3>
          )}

          {step === 1 && (
            <Step1
              data={formData}
              onChange={updateForm}
              errors={step1Errors}
            />
          )}
          {step === 2 && (
            <Step2 data={formData} onChange={updateForm} errors={step2Errors} />
          )}
          {step === 3 && (
            <Step3 data={formData} onChange={updateForm} errors={step3Errors} />
          )}
          {step === 4 && <Step4 data={formData} />}
        </div>

        <div className="flex shrink-0 items-center justify-between bg-white px-5 sm:px-8 py-3.5 sm:py-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="h-[40px] min-w-[100px] rounded-[10px] border border-[#CAD5E2] bg-white px-6 font-medium text-slate-900 hover:bg-slate-50"
          >
            {step === 1 ? (
              <Translate text={localizationConstants.cancelLabel} />
            ) : (
              <Translate text={localizationConstants.backLabel} />
            )}
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-[40px] min-w-[100px] rounded-[10px] bg-[#111721] px-6 font-medium text-white hover:bg-[#111721]/90"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : step === 4 ? (
              <Translate text={localizationConstants.createAccountLabel} />
            ) : (
              <Translate text={localizationConstants.nextLabel} />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
