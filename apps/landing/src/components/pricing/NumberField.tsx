import { useEffect, useId, useState } from "react";

interface NumberFieldProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
  disabled?: boolean;
  min?: number;
  step?: number;
  decimal?: boolean;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  disabled,
  min = 0,
  step,
  decimal = false,
}: NumberFieldProps) {
  const [valStr, setValStr] = useState<string>(value.toString());
  const [lastPublishedValue, setLastPublishedValue] = useState<number>(value);
  const generatedId = useId();
  const inputId = id || generatedId;

  useEffect(() => {
    if (value !== lastPublishedValue) {
      setValStr(value.toString());
      setLastPublishedValue(value);
    }
  }, [value, lastPublishedValue]);

  const publishValue = (next: number) => {
    const normalized = Math.max(min, next);
    onChange(normalized);
    setLastPublishedValue(normalized);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValStr(raw);

    if (raw === "" || raw === "-" || raw.endsWith(".") || raw.endsWith(",")) {
      return;
    }

    const parsed = Number(raw.replace(",", "."));
    if (Number.isFinite(parsed)) {
      publishValue(parsed);
    }
  };

  const handleBlur = () => {
    const raw = valStr.trim();
    if (raw === "" || raw === "-" || raw === "." || raw === ",") {
      const normalized = min;
      setValStr(normalized.toString());
      publishValue(normalized);
      return;
    }

    const parsed = Number(raw.replace(",", "."));
    if (!Number.isFinite(parsed)) {
      const normalized = min;
      setValStr(normalized.toString());
      publishValue(normalized);
      return;
    }

    const normalized = Math.max(min, parsed);
    setValStr(normalized.toString());
    publishValue(normalized);
  };

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="number"
        min={min}
        step={step ?? (decimal ? "any" : 1)}
        value={valStr}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        className="w-full h-11 px-3 border border-border bg-background font-display text-lg font-bold disabled:opacity-50 disabled:bg-surface focus:outline-none focus:border-primary transition-colors"
      />
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}
