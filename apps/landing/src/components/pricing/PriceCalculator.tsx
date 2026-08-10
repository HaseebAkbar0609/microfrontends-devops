import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TimeStudyModal } from "@/components/site/TimeStudyModal";
import { formatNumber } from "@/lib/formatters";
import {
  ADDONS,
  AUTOEKO_PRICE,
  CYCLE_DISCOUNT,
  PRO_PER_USER,
  START_BASE,
  STANDARD_PER_USER,
  WORK_APP_PER_USER,
  applyCycle,
  type BillingCycle,
} from "@/lib/pricing";
import { NumberField } from "./NumberField";
import { Row } from "./Row";

export function PriceCalculator() {
  const { t, i18n } = useTranslation();
  const [standardAdmins, setStandardAdmins] = useState(2);
  const [proAdmins, setProAdmins] = useState(1);
  const [workers, setWorkers] = useState(3);
  const [hourlyCost, setHourlyCost] = useState(450);
  const [hoursSavedPerUser, setHoursSavedPerUser] = useState(8);
  const [autoEko, setAutoEko] = useState(false);
  const [driveUsers, setDriveUsers] = useState(0);
  const [metricUsers, setMetricUsers] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [studyOpen, setStudyOpen] = useState(false);
  const [fromTimeStudy, setFromTimeStudy] = useState(false);

  const fmt = (n: number) => formatNumber(n, i18n.language);
  const sekLabel = t("pricing.sek");

  const stdCount = Math.max(0, standardAdmins);
  const proCount = Math.max(0, proAdmins);
  const adminCount = stdCount + proCount;
  const workerCount = Math.max(0, workers);
  const totalPeople = adminCount + workerCount;

  const lineStandard = STANDARD_PER_USER * stdCount;
  const linePro = PRO_PER_USER * proCount;
  const lineAdminLicenses = lineStandard + linePro;

  const lineWorkApps = WORK_APP_PER_USER * workerCount;

  const lineAutoEko = autoEko ? AUTOEKO_PRICE : 0;

  const drivePrice = ADDONS.find((a) => a.code === "2291")?.price ?? 0;
  const lineDrive = drivePrice * Math.max(0, driveUsers);

  const metricPrice = ADDONS.find((a) => a.code === "1660")?.price ?? 0;
  const lineMetric = metricPrice * Math.max(0, metricUsers);

  const lineAddons = ADDONS.reduce((sum, a) => {
    if (a.code === "2291" || a.code === "1660") return sum;
    if (!selectedAddons[a.code]) return sum;
    if (a.unit === "per_user") return sum + a.price * Math.max(1, adminCount);
    return sum + a.price;
  }, 0);

  const monthlyTotalRaw = START_BASE + lineAdminLicenses + lineWorkApps + lineAutoEko + lineDrive + lineMetric + lineAddons;
  const monthlyTotal = applyCycle(monthlyTotalRaw, cycle);

  const savingsPerMonth = hourlyCost * hoursSavedPerUser * Math.max(1, totalPeople);
  const net = savingsPerMonth - monthlyTotal;
  const roi = monthlyTotal > 0 ? Math.round((net / monthlyTotal) * 100) : 0;

  const toggleAddon = (code: string) => {
    setSelectedAddons((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <section id="kalkylator" className="py-12 sm:py-16 px-4 sm:px-6 bg-surface border-y border-border scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("pricing.calcLabel")}</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">{t("pricing.calcTitle")}</h2>
          <p className="text-muted text-sm">{t("pricing.calcSub", { workPrice: fmt(WORK_APP_PER_USER) })}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="border border-border bg-background p-4">
              <p className="font-bold mb-1 text-sm">{t("pricing.calcQuickLabel")}</p>
              <p className="text-xs text-muted">{t("pricing.calcQuickSub")}</p>
            </div>
            <div className="border border-primary bg-background p-4">
              <p className="font-bold mb-1 text-sm">{t("pricing.calcStudyLabel")}</p>
              <p className="text-xs text-muted mb-3">{t("pricing.calcStudySub")}</p>
              <button
                type="button"
                onClick={() => setStudyOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-sm cursor-pointer"
              >
                {t("pricing.calcStudyButton")}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-background border border-border p-4 sm:p-6 md:p-8 space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted block mb-3">{t("pricing.adminsSectionLabel")}</p>
              <p className="text-xs text-muted mb-4">{t("pricing.adminsSectionHint", { price: fmt(START_BASE) })}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberField
                  label={t("pricing.stdAdmins")}
                  value={standardAdmins}
                  onChange={setStandardAdmins}
                  hint={t("pricing.pricePerAdmin", { price: fmt(STANDARD_PER_USER) })}
                  min={0}
                />
                <NumberField
                  label={t("pricing.proAdmins")}
                  value={proAdmins}
                  onChange={setProAdmins}
                  hint={t("pricing.pricePerAdmin", { price: fmt(PRO_PER_USER) })}
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberField
                label={t("pricing.workers")}
                value={workers}
                onChange={setWorkers}
                hint={t("pricing.hintWorkApp", { price: fmt(WORK_APP_PER_USER) })}
                min={0}
              />
              <div />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberField
                label={t("pricing.hourlyRate")}
                value={hourlyCost}
                onChange={setHourlyCost}
                step={50}
                hint={t("pricing.hourlyRateHint")}
                min={0}
              />
              <NumberField
                label={t("pricing.hoursSaved")}
                value={hoursSavedPerUser}
                onChange={(n) => {
                  setHoursSavedPerUser(n);
                  setFromTimeStudy(false);
                }}
                hint={t("pricing.hoursSavedHint")}
                min={0}
              />
            </div>

            <div className="border border-border bg-surface p-4">
              {fromTimeStudy && (
                <p className="inline-block mb-2 font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
                  {t("pricing.fromStudy")}
                </p>
              )}
              <p className="text-xs text-muted mb-3">{t("pricing.studyTxt")}</p>
              <button
                type="button"
                onClick={() => setStudyOpen(true)}
                className="w-full py-3 border border-primary text-primary font-bold rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {t("pricing.studyBtn")}
              </button>
              <p className="text-[11px] text-muted mt-2">{t("pricing.studyNote")}</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer border-t border-border pt-6">
              <input type="checkbox" checked={autoEko} onChange={(e) => setAutoEko(e.target.checked)} className="mt-1 w-5 h-5 accent-primary shrink-0" />
              <span>
                <span className="block font-bold text-sm">{t("pricing.autoEkoTitle", { price: fmt(AUTOEKO_PRICE) })}</span>
                <span className="block text-xs text-muted">{t("pricing.autoEkoSub")}</span>
              </span>
            </label>

            <div className="border-t border-border pt-6">
              <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("pricing.driveLabel", { price: fmt(drivePrice) })}</label>
              <input
                type="number"
                min={0}
                value={driveUsers}
                onChange={(e) => setDriveUsers(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-11 px-3 border border-border bg-background font-display text-lg font-bold"
              />
              <p className="text-xs text-muted mt-1">{t("pricing.driveHint")}</p>
            </div>

            <div className="border-t border-border pt-6">
              <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("pricing.metricLabel", { price: fmt(metricPrice) })}</label>
              <input
                type="number"
                min={0}
                value={metricUsers}
                onChange={(e) => setMetricUsers(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-11 px-3 border border-border bg-background font-display text-lg font-bold"
              />
              <p className="text-xs text-muted mt-1">{t("pricing.metricHint")}</p>
            </div>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted block mb-3">{t("pricing.otherAddons")}</p>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {ADDONS.filter((a) => a.code !== "2291" && a.code !== "2301" && a.code !== "1660").map((a) => (
                  <li key={a.code}>
                    <label className="flex items-start gap-3 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={!!selectedAddons[a.code]}
                        onChange={() => toggleAddon(a.code)}
                        className="mt-1 w-4 h-4 accent-primary shrink-0"
                      />
                      <span className="flex-1">
                        <span className="font-bold">{a.name}</span>{" "}
                        <span className="text-muted text-xs">
                          ({fmt(a.price)} {sekLabel}{a.unit === "per_user" ? t("pricing.unitPerUser") : t("pricing.perMonthAbbr")})
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted block mb-3">{t("pricing.billingCycleLabel")}</p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCycle(c)}
                    className={`py-2 px-1 text-xs sm:text-sm font-bold rounded-sm border transition-colors cursor-pointer truncate ${cycle === c ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"
                      }`}
                  >
                    {c === "monthly" ? t("pricing.cycleMonthly") : c === "quarterly" ? t("pricing.cycleQuarterly") : t("pricing.cycleYearly")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-background border border-border p-4 sm:p-6 md:p-8 flex flex-col">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">{t("pricing.yourMonthlyCost")}</p>

            <ul className="space-y-3 text-sm mb-6">
              <Row label={t("pricing.startLicense")} value={START_BASE} currencyLabel={sekLabel} />
              {stdCount > 0 && <Row label={t("pricing.stdRow", { count: stdCount })} value={lineStandard} currencyLabel={sekLabel} />}
              {proCount > 0 && <Row label={t("pricing.proRow", { count: proCount })} value={linePro} currencyLabel={sekLabel} />}
              {workerCount > 0 && <Row label={t("pricing.workRow", { count: workerCount })} value={lineWorkApps} currencyLabel={sekLabel} />}
              {autoEko && <Row label={t("pricing.autoEkoRow")} value={AUTOEKO_PRICE} currencyLabel={sekLabel} />}
              {driveUsers > 0 && <Row label={t("pricing.driveRow", { count: driveUsers })} value={lineDrive} currencyLabel={sekLabel} />}
              {metricUsers > 0 && <Row label={t("pricing.metricRow", { count: metricUsers })} value={lineMetric} currencyLabel={sekLabel} />}
              {lineAddons > 0 && <Row label={t("pricing.otherAddonsValue")} value={lineAddons} currencyLabel={sekLabel} />}
              {cycle !== "monthly" && (
                <li className="flex justify-between text-primary pt-2 border-t border-border">
                  <span>{t("pricing.discountLabel", { type: cycle === "quarterly" ? t("pricing.discountQuarterly") : t("pricing.discountYearly") })}</span>
                  <span className="font-bold">−{fmt(Math.round(monthlyTotalRaw * CYCLE_DISCOUNT[cycle]))} {sekLabel}</span>
                </li>
              )}
            </ul>

            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.total")}</span>
                <div className="text-left sm:text-right">
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{fmt(monthlyTotal)}</span>
                  <span className="text-muted text-sm ml-2">{sekLabel}{t("pricing.perMonthAbbr")}</span>
                </div>
              </div>
              <p className="text-xs text-muted mb-6 sm:text-right">{t("pricing.exVat")}</p>

              <div className="bg-surface border border-border p-4 mb-6 text-sm">
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{t("pricing.savingsPerMonth")}</p>
                <div className="flex justify-between mb-1 text-xs sm:text-sm">
                  <span>{t("pricing.savedWorkTime")}</span>
                  <span className="font-bold">{fmt(savingsPerMonth)} {sekLabel}</span>
                </div>
                <div className="flex justify-between mb-3 text-xs sm:text-sm text-muted">
                  <span>{t("pricing.minusLicenseCost")}</span>
                  <span>{fmt(monthlyTotal)} {sekLabel}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-3 text-xs sm:text-sm">
                  <span className={net >= 0 ? "text-primary" : "text-foreground"}>
                    {t("pricing.net")} {net >= 0 ? "+" : ""}
                  </span>
                  <span className={net >= 0 ? "text-primary" : "text-foreground"}>
                    {fmt(net)} {sekLabel} {net >= 0 && <span className="text-xs">({roi}{t("pricing.roi")})</span>}
                  </span>
                </div>
              </div>

              <Link href="/register?type=business" className="w-full block text-center py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("pricing.startFree30")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TimeStudyModal
        open={studyOpen}
        onClose={() => setStudyOpen(false)}
        workers={workerCount}
        totalUsers={Math.max(1, totalPeople)}
        hourlyCost={hourlyCost}
        onApply={({ savedHoursPerUser }) => {
          setHoursSavedPerUser(Math.round(savedHoursPerUser * 10) / 10);
          setFromTimeStudy(true);
        }}
      />
    </section>
  );
}
