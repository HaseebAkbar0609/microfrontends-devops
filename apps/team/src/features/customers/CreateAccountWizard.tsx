"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  createProfessionalAPIAction,
  getCitiesAPIAction,
  getProfessionalCategoriesAPIAction,
} from "@/api-actions";
import type { SelectOption } from "@/api-actions/customers/professionals/options";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  companyName: string;
  orgNumber: string;
  categoryId: string;
  categoryName: string;
  cityId: string;
  cityName: string;
  contactName: string;
  email: string;
  phone: string;
  /** Account access is created now; billing is configured separately. */
  accountAccess: "demo" | "trial";
  trialDurationDays: number;
}

const INITIAL_FORM: FormData = {
  companyName: "",
  orgNumber: "",
  categoryId: "",
  categoryName: "",
  cityId: "",
  cityName: "",
  contactName: "",
  email: "",
  phone: "",
  accountAccess: "demo",
  trialDurationDays: 30,
};

const step1Schema = z.object({
  companyName: z.string().min(1, localizationConstants.validationRegisterCompanyNameRequired as string),
  orgNumber: z
    .string()
    .min(1, localizationConstants.validationRegisterOrganisationNumberRequired as string)
    .regex(/^\d{6}-\d{4}$/, localizationConstants.validationOrgNumberInvalid as string),
  categoryId: z.string().uuid(localizationConstants.validationRegisterCategoryRequired as string),
  cityId: z.string().uuid(localizationConstants.validationRegisterCityRequired as string),
});

const step2Schema = z.object({
  contactName: z.string().min(1, localizationConstants.validationContactNameRequired as string),
  email: z
    .string()
    .min(1, localizationConstants.validationRegisterEmailRequired as string)
    .email(localizationConstants.validationRegisterEmailInvalid as string),
  phone: z.string().min(1, localizationConstants.validationRegisterPhoneRequired as string),
});

const step3Schema = z
  .object({
    accountAccess: z.enum(["demo", "trial"]),
    trialDurationDays: z.number(),
  })
  .refine(
    (val) =>
      val.accountAccess !== "trial" ||
      (val.trialDurationDays >= 1 && val.trialDurationDays <= 183),
    {
      message: localizationConstants.validationTrialDurationInvalid as string,
      path: ["trialDurationDays"],
    },
  );

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

function ReferenceField({
  label,
  placeholder,
  value,
  selectedId,
  error,
  fetchOptions,
  onChange,
  onSelect,
}: {
  label: string;
  placeholder: string;
  value: string;
  selectedId: string;
  error?: string;
  fetchOptions: (search: string) => Promise<SelectOption[]>;
  onChange: (value: string) => void;
  onSelect: (option: SelectOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || selectedId) return;
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      const results = await fetchOptions(value.trim());
      if (active) {
        setOptions(results);
        setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchOptions, open, selectedId, value]);

  return (
    <div
      className="relative flex flex-col gap-1.5"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Label className={labelClass}>{label}</Label>
      <Input
        className={inputClass}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      />
      {open && !selectedId && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-44 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">...</div>
          ) : options.length ? (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-100 focus:bg-slate-100"
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                {option.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-500">{placeholder}</div>
          )}
        </div>
      )}
      {error && (
        <span className="text-xs font-medium text-red-500">
          <Translate text={error} />
        </span>
      )}
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
          <Translate text={localizationConstants.companyNameLabel} />
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
          <Translate text={localizationConstants.orgNumberLabel} />
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

      <ReferenceField
        label={t(localizationConstants.categoryLabel)}
        placeholder={t(localizationConstants.categoryPlaceholder)}
        value={data.categoryName}
        selectedId={data.categoryId}
        error={errors.categoryId}
        fetchOptions={getProfessionalCategoriesAPIAction}
        onChange={(categoryName) => onChange({ categoryName, categoryId: "" })}
        onSelect={(option) => onChange({ categoryName: option.name, categoryId: option.id })}
      />

      <ReferenceField
        label={t(localizationConstants.cityLabel)}
        placeholder={t(localizationConstants.cityPlaceholder)}
        value={data.cityName}
        selectedId={data.cityId}
        error={errors.cityId}
        fetchOptions={getCitiesAPIAction}
        onChange={(cityName) => onChange({ cityName, cityId: "" })}
        onSelect={(option) => onChange({ cityName: option.name, cityId: option.id })}
      />
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
          <Translate text={localizationConstants.nameLabel} />
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
          <Translate text={localizationConstants.emailLabel} />
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
          <Translate text={localizationConstants.phoneLabel} />
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

  return (
    <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 mt-1">
          <Label className={labelClass}>
            <Translate text={localizationConstants.accountAccessLabel} />
          </Label>
          <div className="flex gap-2" role="radiogroup">
            {(["demo", "trial"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={data.accountAccess === option}
                onClick={() => onChange({ accountAccess: option })}
                className={`h-[42px] flex-1 rounded-[10px] border px-3 text-[14px] font-medium leading-[20px] tracking-normal transition-colors ${
                  data.accountAccess === option
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-[#CAD5E2] bg-white text-[#0A0A0A] hover:border-slate-400"
                }`}
              >
                {option === "demo"
                  ? t(localizationConstants.demoAccessOptionLabel)
                  : t(localizationConstants.trialAccessOptionLabel)}
              </button>
            ))}
          </div>
          <span className="text-xs font-normal text-slate-500">
            {data.accountAccess === "demo"
              ? t(localizationConstants.demoAccessHelp)
              : t(localizationConstants.trialAccessHelp)}
          </span>

          {data.accountAccess === "trial" && (
            <div className="flex flex-col gap-1.5 mt-1">
              <Label className={labelClass}>
                <Translate text={localizationConstants.trialDurationLabel} />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={183}
                  className="h-[42px] w-[100px] rounded-[10px] border border-[#CAD5E2] bg-white px-3 text-[14px] font-normal text-[#0A0A0A] leading-[20px] tracking-normal focus-visible:ring-0 focus-visible:border-slate-400"
                  value={data.trialDurationDays}
                  onChange={(e) => onChange({ trialDurationDays: Number(e.target.value) })}
                />
                <span className="text-[14px] font-normal text-slate-500">
                  {t(localizationConstants.trialDurationDaysSuffix)}
                </span>
              </div>
              {errors.trialDurationDays && (
                <span className="text-xs font-medium text-red-500">
                  <Translate text={errors.trialDurationDays} />
                </span>
              )}
            </div>
          )}
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
  const accessLabel =
    data.accountAccess === "demo"
      ? `${t(localizationConstants.demoAccessOptionLabel)} (30 ${t(localizationConstants.trialDurationDaysSuffix)})`
      : `${t(localizationConstants.trialAccessOptionLabel)} (${data.trialDurationDays} ${t(localizationConstants.trialDurationDaysSuffix)})`;

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
        <ReviewRow labelKey={localizationConstants.accountAccessLabel} value={accessLabel} />
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
          company_category: formData.categoryId,
          city: formData.cityId,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          // Omit for the default 30-day Demo; set only for a Sales-chosen
          // Trial — the backend validates the 1 day–6 month range itself.
          trial_duration_days:
            formData.accountAccess === "trial" ? formData.trialDurationDays : undefined,
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
      ? localizationConstants.accountAccessLabel
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
          <h3 className={stepTitleClass}>
            <Translate text={stepTitle} />
          </h3>

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
