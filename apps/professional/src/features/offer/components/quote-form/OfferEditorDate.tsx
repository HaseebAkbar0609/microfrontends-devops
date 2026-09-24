"use client";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

type Props = { id: string; label: string; value: string; change: (date: string) => void; error?: string };
export function OfferEditorDate({ id, label, value, change, error }: Props) {
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T12:00:00`) : undefined;
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className="block text-sm font-medium">{label}</label>
    <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild>
      <Button id={id} type="button" variant="outline" aria-label={label} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`w-full justify-between font-normal ${error ? "border-red-500" : ""}`}>
        {value || t(localizationConstants.offerFormPickADate)}<CalendarIcon className="h-4 w-4" />
      </Button>
    </PopoverTrigger><PopoverContent align="start" className="w-auto p-0">
      <Calendar mode="single" captionLayout="dropdown" selected={selected} defaultMonth={selected}
        onSelect={(date) => { change(date ? format(date, "yyyy-MM-dd") : ""); setOpen(false); }} />
    </PopoverContent></Popover>
    {error && <p id={`${id}-error`} className="text-sm text-red-700">{t(error as keyof typeof localizationConstants)}</p>}
  </div>;
}
