"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OfferFields, OfferErrors } from "../../services/offerFormService";

type Props = { value: OfferFields; errors: OfferErrors; update: (next: Partial<OfferFields>) => void; itemized?: boolean };
export function OfferEditorFields({ value, errors, update, itemized }: Props) {
  const t = useTranslate();
  function field(key: keyof OfferFields, label: keyof typeof localizationConstants, options: { multiline?: boolean; type?: string; max?: number; readOnly?: boolean } = {}) {
    const input = { id: `offer-${key}`, value: String(value[key]), "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `offer-${key}-error` : undefined,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update({ [key]: event.target.value }),
      maxLength: options.max, readOnly: options.readOnly, className: `w-full min-w-0 ${errors[key] ? "border-red-500" : ""}` };
    return <div className="min-w-0 space-y-2"><label htmlFor={input.id} className="block text-sm font-medium">{t(label)}</label>
      {options.multiline ? <Textarea {...input} className={`${input.className} min-h-24`} /> : <Input {...input} type={options.type || "text"} inputMode={key === "total" || key === "hourly_rate" ? "decimal" : undefined} />}
      {errors[key] && <p id={`offer-${key}-error`} className="text-sm text-red-700">{t(errors[key] as keyof typeof localizationConstants)}</p>}
    </div>;
  }
  return <>
    <Card className="space-y-4 p-5 shadow-none">
      <h2 className="font-semibold">{t(localizationConstants.offerFormProjectDescription)}</h2>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {field("project_name", "offerFormProjectName", { max: 255 })}
        {field("work_location", "offerFormWorkLocation", { max: 1000 })}
      </div>
      {value.variant === "rent" && field("personnel", "offerFormPersonnel", { max: 1000 })}
      {field("specifications", "offerFormSpecifications", { multiline: true, max: 10000 })}
    </Card>
    <Card className="space-y-4 p-5 shadow-none">
      <h2 className="font-semibold">{t(localizationConstants.offerFormSchedule)}</h2>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {field("start", "offerFormStartDate", { type: "date" })}{field("end", "offerFormEndDate", { type: "date" })}
      </div>
    </Card>
    <Card className="space-y-4 p-5 shadow-none">
      <h2 className="font-semibold">{t(localizationConstants.offerFormBudget)}</h2>
      {value.variant !== "rent" && <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {field("work", "offerFormWork", { max: 5000 })}{field("material", "offerFormMaterial", { max: 5000 })}
      </div>}
      {value.variant === "rent" && field("hourly_rate", "offerFormHourlyRateLabel")}
      {field("total", "offerEditorTotal", { readOnly: itemized })}
      {itemized && <p className="text-sm text-slate-600">{t(localizationConstants.offerEditorItemized)}</p>}
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={value.rot} onCheckedChange={(checked) => update({ rot: checked === true })} />{t(localizationConstants.offerFormRotDeduction)}</label>
      <p className="text-sm text-slate-600">{t(localizationConstants.offerEditorPriceHelp)}</p>
      {field("payment_terms", "offerFormPaymentTerms", { multiline: true, max: 10000 })}
    </Card>
  </>;
}
