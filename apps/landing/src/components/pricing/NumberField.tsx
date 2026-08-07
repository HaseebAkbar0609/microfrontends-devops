interface NumberFieldProps {
  id?: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
  disabled?: boolean;
  min?: number;
  step?: number;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  disabled,
  min = 0,
  step = 1,
}: NumberFieldProps) {
  const inputId = id || `number-field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={inputId} className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        value={value}
        min={min}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="w-full h-11 px-3 border border-border bg-background font-display text-lg font-bold disabled:opacity-50 disabled:bg-surface"
      />
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}
