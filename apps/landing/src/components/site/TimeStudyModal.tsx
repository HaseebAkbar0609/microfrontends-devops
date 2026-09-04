import { useEffect, useMemo, useState } from "react";
import {
  TIME_STUDY_AREAS,
  computeTimeStudy,
  formatHours,
  type ItemOverride,
  type AreaResult,
  type TimeStudyArea,
  type TimeStudyItem,
} from "@/lib/timeStudy";

export interface TimeStudyApplyPayload {
  savedHours: number;
  savedHoursPerUser: number;
  userCount: number;
  hourlyCost: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  workers: number;
  totalUsers: number;
  hourlyCost: number;
  onApply: (payload: TimeStudyApplyPayload) => void;
}

export function TimeStudyModal({ open, onClose, workers, totalUsers, hourlyCost, onApply }: Props) {
  const [selected, setSelected] = useState<string[]>(["offert", "order", "tid-material", "faktura"]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [overrides, setOverrides] = useState<Record<string, ItemOverride>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Synka grunduppgifter från ROI-kalkylatorn (så länge användaren inte ändrat själv)
  useEffect(() => {
    setVolumes((prev) => {
      const next = { ...prev };
      for (const area of TIME_STUDY_AREAS) {
        for (const item of area.items) {
          if (!item.syncFrom || touched[item.id]) continue;
          const synced = item.syncFrom === "workers" ? workers : totalUsers;
          next[item.id] = Math.max(0, synced);
        }
      }
      return next;
    });
  }, [workers, totalUsers, touched]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const result = useMemo(
    () => computeTimeStudy({ selectedAreaIds: selected, volumes, overrides, userCount: totalUsers }),
    [selected, volumes, overrides, totalUsers],
  );

  if (!open) return null;

  const toggleArea = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const setVolume = (item: TimeStudyItem, v: number) => {
    setTouched((t) => ({ ...t, [item.id]: true }));
    setVolumes((prev) => ({ ...prev, [item.id]: Math.max(0, v) }));
  };

  const maxSaved = Math.max(1, ...result.areas.map((a) => a.savedHours));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-0 md:p-6">
      <div
        className="relative w-full max-w-4xl bg-background border border-border shadow-2xl my-0 md:my-6"
        role="dialog"
        aria-modal="true"
        aria-label="TimeFlow Tidsstudie"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">TimeFlow Tidsstudie</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Hur mycket tid kan TimeFlow frigöra i ert företag?
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng tidsstudien"
            className="shrink-0 w-9 h-9 border border-border text-xl leading-none hover:border-primary"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          <p className="text-sm text-muted max-w-2xl">
            Välj vilka delar av verksamheten ni vill jämföra. Ange exempelvis antal offerter, order, projekt
            och fakturor per månad. Vi visar uppskattad tidsåtgång med traditionella arbetssätt jämfört med TimeFlow.
          </p>

          <div className="bg-surface border border-border p-4 text-xs text-muted">
            Resultatet är en uppskattning baserad på era uppgifter och våra standardantaganden. Den faktiska
            tidsbesparingen påverkas av företagets arbetssätt, införandegrad och vilka TimeFlow-funktioner som används.
          </div>

          {/* Grunduppgifter */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Arbetare", value: workers },
              { label: "Användare totalt", value: totalUsers },
              { label: "Kostnad per timme", value: `${hourlyCost} kr` },
            ].map((g) => (
              <div key={g.label} className="border border-border p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">{g.label}</p>
                <p className="font-display text-xl font-bold">{g.value}</p>
              </div>
            ))}
          </div>
          <p className="-mt-6 text-xs text-muted">Hämtas från ROI-kalkylatorn — ni behöver inte fylla i dem två gånger.</p>

          {/* Områdesval */}
          <section>
            <h3 className="font-display text-xl font-bold mb-1">Vad vill ni inkludera?</h3>
            <p className="text-xs text-muted mb-4">
              Välj de områden som motsvarar hur företaget arbetar. Endast valda områden räknas med.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {TIME_STUDY_AREAS.map((area) => (
                <AreaCard
                  key={area.id}
                  area={area}
                  checked={selected.includes(area.id)}
                  onToggle={() => toggleArea(area.id)}
                  volumes={volumes}
                  overrides={overrides}
                  onVolume={setVolume}
                  onOverride={(itemId, patch) =>
                    setOverrides((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...patch } }))
                  }
                  savedHours={result.areas.find((a) => a.area.id === area.id)?.savedHours ?? 0}
                />
              ))}
            </div>
          </section>

          {/* Resultat */}
          <section className="border border-primary/40 bg-surface p-5">
            <h3 className="font-display text-xl font-bold mb-4">Er uppskattade tidsbesparing</h3>
            {selected.length === 0 ? (
              <p className="text-sm text-muted">Välj minst ett arbetsområde för att se resultatet.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <Stat label="Traditionellt" value={`${formatHours(result.traditionalHours)} h/mån`} />
                  <Stat label="Med TimeFlow" value={`${formatHours(result.timeFlowHours)} h/mån`} />
                  <Stat label="Tidsbesparing" value={`${formatHours(result.savedHours)} h/mån`} highlight />
                  <Stat
                    label="Per användare"
                    value={`${formatHours(result.savedHoursPerUser)} h/mån`}
                    highlight
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="border border-border bg-background p-3">
                    Sparade arbetsdagar: <strong>{formatHours(result.savedDaysPerMonth)} dagar/mån</strong>
                  </div>
                  <div className="border border-border bg-background p-3">
                    Sparade timmar: <strong>{formatHours(result.savedHoursPerYear)} h/år</strong>
                  </div>
                </div>

                {/* Stapeldiagram per område */}
                <div className="space-y-3 mb-6">
                  {result.areas.map((a) => (
                    <AreaBar key={a.area.id} result={a} max={maxSaved} />
                  ))}
                </div>

                <p className="text-sm text-muted mb-5">
                  Er tidsstudie visar vad antagandet om cirka åtta sparade timmar per användare består av.
                </p>

                <button
                  onClick={() => {
                    onApply({
                      savedHours: result.savedHours,
                      savedHoursPerUser: result.savedHoursPerUser,
                      userCount: totalUsers,
                      hourlyCost,
                    });
                    onClose();
                  }}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-sm"
                >
                  Använd resultatet i ROI-kalkylen
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border p-3 bg-background ${highlight ? "border-primary" : "border-border"}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">{label}</p>
      <p className={`font-display text-xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}

function AreaBar({ result, max }: { result: AreaResult; max: number }) {
  return (
    <details className="group">
      <summary className="list-none cursor-pointer">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-bold">{result.area.title}</span>
          <span className="text-primary font-bold">{formatHours(result.savedHours)} h/mån</span>
        </div>
        <div className="h-2 bg-border">
          <div
            className="h-2 bg-primary transition-all"
            style={{ width: `${Math.min(100, (result.savedHours / max) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted group-open:hidden">Så har vi räknat ▾</span>
      </summary>
      <div className="mt-2 border border-border bg-background p-3 text-xs space-y-2">
        {result.items.map((i) => (
          <div key={i.item.id} className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-muted">{i.item.volumeUnit}:</span>
            <span className="font-bold">{i.volume}</span>
            <span className="text-muted">Traditionellt:</span>
            <span>{i.traditionalMinutes} min · {formatHours(i.traditionalHours)} h/mån</span>
            <span className="text-muted">TimeFlow:</span>
            <span>{i.timeFlowMinutes} min · {formatHours(i.timeFlowHours)} h/mån</span>
            <span className="text-muted">Besparing:</span>
            <span className="text-primary font-bold">{formatHours(i.savedHours)} h/mån</span>
          </div>
        ))}
      </div>
    </details>
  );
}

function AreaCard({
  area,
  checked,
  onToggle,
  volumes,
  overrides,
  onVolume,
  onOverride,
  savedHours,
}: {
  area: TimeStudyArea;
  checked: boolean;
  onToggle: () => void;
  volumes: Record<string, number>;
  overrides: Record<string, ItemOverride>;
  onVolume: (item: TimeStudyItem, v: number) => void;
  onOverride: (itemId: string, patch: ItemOverride) => void;
  savedHours: number;
}) {
  return (
    <div className={`border p-4 ${checked ? "border-primary bg-surface" : "border-border"}`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onToggle} className="mt-1 w-5 h-5 accent-primary" />
        <span className="flex-1">
          <span className="block font-bold">{area.title}</span>
          <span className="block text-xs text-muted">{area.help}</span>
        </span>
        {checked && (
          <span className="font-mono text-xs text-primary whitespace-nowrap">
            {formatHours(savedHours)} h
          </span>
        )}
      </label>

      {checked && (
        <div className="mt-4 space-y-4">
          {area.items.map((item) => (
            <div key={item.id}>
              <p className="text-xs text-muted mb-2">{item.volumeLabel}</p>
              <Stepper
                value={volumes[item.id] ?? item.defaultVolume}
                unit={item.volumeUnit}
                onChange={(v) => onVolume(item, v)}
              />
              <details className="mt-2">
                <summary className="list-none cursor-pointer text-xs text-primary underline underline-offset-2">
                  Justera tider
                </summary>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <MiniField
                    label="Traditionellt"
                    suffix={item.adjustUnitLabel}
                    value={overrides[item.id]?.traditionalMinutes ?? item.traditionalMinutes}
                    onChange={(v) => onOverride(item.id, { traditionalMinutes: v })}
                  />
                  <MiniField
                    label="Med TimeFlow"
                    suffix={item.adjustUnitLabel}
                    value={overrides[item.id]?.timeFlowMinutes ?? item.timeFlowMinutes}
                    onChange={(v) => onOverride(item.id, { timeFlowMinutes: v })}
                  />
                </div>
              </details>
            </div>
          ))}

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Traditionellt</p>
              <ul className="space-y-1 text-muted">
                {area.traditionalIncludes.map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Med TimeFlow</p>
              <ul className="space-y-1 text-muted">
                {area.timeFlowIncludes.map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
            </div>
          </div>

          {area.qualitativeBenefits.length > 0 && (
            <div className="border-t border-border pt-3 text-xs text-muted">
              <span className="font-bold text-foreground">Övriga verksamhetsvärden: </span>
              {area.qualitativeBenefits.join(" · ")}
              <span className="block mt-1 italic">Räknas inte som ekonomisk besparing.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stepper({
  value,
  unit,
  onChange,
}: {
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const [valStr, setValStr] = useState<string>(value.toString());
  const [lastPublished, setLastPublished] = useState<number>(value);

  useEffect(() => {
    if (value !== lastPublished) {
      setValStr(value.toString());
      setLastPublished(value);
    }
  }, [value, lastPublished]);

  const publish = (n: number) => {
    const norm = Math.max(0, n);
    onChange(norm);
    setLastPublished(norm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValStr(raw);
    if (raw === "" || raw === "-") return;
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      publish(parsed);
    }
  };

  const handleBlur = () => {
    const raw = valStr.trim();
    if (raw === "" || raw === "-") {
      setValStr("0");
      publish(0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setValStr("0");
      publish(0);
    } else {
      const norm = Math.max(0, parsed);
      setValStr(norm.toString());
      publish(norm);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Minska"
        onClick={() => {
          const next = Math.max(0, value - 1);
          setValStr(next.toString());
          publish(next);
        }}
        className="w-10 h-10 border border-border font-bold hover:border-primary shrink-0 cursor-pointer"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        min={0}
        value={valStr}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        className="w-full h-10 px-3 border border-border bg-background font-display text-lg font-bold text-center"
      />
      <button
        type="button"
        aria-label="Öka"
        onClick={() => {
          const next = value + 1;
          setValStr(next.toString());
          publish(next);
        }}
        className="w-10 h-10 border border-border font-bold hover:border-primary shrink-0 cursor-pointer"
      >
        +
      </button>
      <span className="text-xs text-muted whitespace-nowrap w-24">{unit}</span>
    </div>
  );
}

function MiniField({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [valStr, setValStr] = useState<string>(value.toString());
  const [lastPublished, setLastPublished] = useState<number>(value);

  useEffect(() => {
    if (value !== lastPublished) {
      setValStr(value.toString());
      setLastPublished(value);
    }
  }, [value, lastPublished]);

  const publish = (n: number) => {
    const norm = Math.max(0, n);
    onChange(norm);
    setLastPublished(norm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValStr(raw);
    if (raw === "" || raw === "-") return;
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      publish(parsed);
    }
  };

  const handleBlur = () => {
    const raw = valStr.trim();
    if (raw === "" || raw === "-") {
      setValStr("0");
      publish(0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setValStr("0");
      publish(0);
    } else {
      const norm = Math.max(0, parsed);
      setValStr(norm.toString());
      publish(norm);
    }
  };

  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        min={0}
        value={valStr}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        className="w-full h-9 px-2 border border-border bg-background text-sm font-bold"
      />
      <span className="block text-[10px] text-muted mt-1">{suffix}</span>
    </label>
  );
}
