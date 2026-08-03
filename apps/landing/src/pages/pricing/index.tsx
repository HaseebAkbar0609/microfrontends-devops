import { useMemo, useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
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
  type PlanKey,
} from "@/lib/pricing";

const formatSEK = (n: number) => n.toLocaleString("sv-SE");

const catKey = (cat: string): string => ({
  "Kalkyl": "pricing.catCalc",
  "Order": "pricing.catOrder",
  "Inköp": "pricing.catInkop",
  "Maskin": "pricing.catMaskin",
  "Ekonomi": "pricing.catEkonomi",
  "Marknad": "pricing.catMarknad",
}[cat] || "pricing.catOther");

export default function PricingPage() {
  const { t } = useTranslation();

  const plans = [
    {
      code: "1101",
      name: "Start",
      price: "2 995",
      suffix: t("pricing.perMonth"),
      desc: t("home.runBusinessDesc"),
      cta: t("pricing.startFree30"),
      highlight: false,
      features: [
        t("solutions.feat1"),
        t("solutions.area1Tag"),
        t("consumer.homeAppLabel"),
        t("home.faq4A"),
        t("support.heroLabel"),
      ],
    },
    {
      code: "1102",
      name: "Standard",
      price: "995",
      suffix: t("pricing.perUserMonth"),
      desc: t("solutions.area2Desc"),
      cta: t("pricing.startFree30"),
      highlight: true,
      features: [
        t("professional.sec1"),
        t("professional.sec2"),
        t("professional.sec3"),
        t("professional.stat3V"),
        t("professional.appLabel"),
      ],
    },
    {
      code: "1103",
      name: "PRO",
      price: "1 295",
      suffix: t("pricing.perUserMonth"),
      desc: t("professional.heroDesc"),
      cta: t("contact.heroLabel"),
      highlight: false,
      features: [
        t("professional.sec4"),
        t("solutions.area4Desc"),
        t("about.val3D"),
        t("support.migrateTitle"),
        t("professional.stat1V"),
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{`${t("pricing.heroLabel")} — TimeFlow`}</title>
        <meta name="description" content={t("pricing.heroSub")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${t("pricing.heroLabel")} — TimeFlow`} />
        <meta property="og:description" content={t("pricing.heroSub")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-12 px-4 sm:px-6 text-center border-b border-border">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("pricing.heroLabel")}</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
            {t("pricing.heroTitle1")} <span className="text-primary italic">{t("pricing.heroTitle2")}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">{t("pricing.heroSub")}</p>
        </header>

        {/* Plans */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`p-6 sm:p-8 border bg-background flex flex-col ${p.highlight ? "border-primary shadow-xl shadow-primary/10 relative" : "border-border"
                  }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-6 sm:left-8 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                    {t("pricing.popular")}
                  </div>
                )}
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  <span className="font-mono text-xs text-muted">#{p.code}</span>
                </div>
                <p className="text-muted text-sm mb-6 min-h-[3rem]">{p.desc}</p>
                <div className="mb-6 flex items-baseline flex-wrap gap-1">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="text-muted text-sm">{p.suffix}</span>
                </div>
                <button
                  className={`w-full py-3 font-bold rounded-sm mb-8 cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all ${p.highlight ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                    }`}
                >
                  {p.cta}
                </button>
                <ul className="space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 pt-6 border-t border-border text-xs text-muted">
                  {t("pricing.commitment")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator */}
        <PriceCalculator />

        {/* Addons */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("pricing.addonsLabel")}</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                {t("pricing.addonsTitle")}
              </h2>
              <p className="text-muted mt-3 text-sm">{t("pricing.addonsSub")}</p>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px] border-collapse bg-background border border-border text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.codeCol")}</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.nameCol")}</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.categoryCol")}</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.priceCol")}</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.descCol")}</th>
                  </tr>
                </thead>
                <tbody>
                  {ADDONS.map((a) => (
                    <tr key={a.code} className="border-b border-border last:border-b-0">
                      <td className="p-3 font-mono text-xs">{a.code}</td>
                      <td className="p-3 font-bold">{a.name}</td>
                      <td className="p-3 text-muted">{t(catKey(a.category))}</td>
                      <td className="p-3 whitespace-nowrap">
                        {formatSEK(a.price)} {t("pricing.sek")}{a.unit === "per_user" ? t("pricing.unitPerUser") : a.unit === "per_scan" ? `/${t("pricing.unitScan")}` : t("pricing.perMonthAbbr")}
                      </td>
                      <td className="p-3 text-muted">{a.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-surface border-y border-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-10 tracking-tight">{t("pricing.faqTitle")}</h2>
            <div className="divide-y divide-border">
              {[
                { q: t("home.faq1Q"), a: t("home.faq1A") },
                { q: t("home.faq2Q"), a: t("home.faq2A") },
                { q: t("home.faq3Q"), a: t("home.faq3A") },
                { q: t("home.faq4Q"), a: t("home.faq4A") },
                { q: t("home.faq5Q"), a: t("home.faq5A") },
                { q: t("home.faq6Q"), a: t("home.faq6A") },
                { q: t("home.faq7Q"), a: t("home.faq7A") },
                { q: t("home.faq8Q"), a: t("home.faq8A") },
                { q: t("home.faq9Q"), a: t("home.faq9A") },
                { q: t("home.faq10Q"), a: t("home.faq10A") },
                { q: t("home.faq11Q"), a: t("home.faq11A") },
                { q: t("home.faq12Q"), a: t("home.faq12A") },
                { q: t("home.faq13Q"), a: t("home.faq13A") },
              ].map((f) => (
                <details key={f.q} className="group py-5 cursor-pointer">
                  <summary className="list-none flex justify-between items-center font-bold">
                    {f.q}
                    <span className="text-primary text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="pt-3 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 text-center bg-ink text-white">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("pricing.readyToTest")}</h2>
          <p className="text-stone-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">{t("pricing.noCreditCard")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">{t("pricing.startFree30")}</button>
            <Link href="/contact" className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors">{t("pricing.bookDemo")}</Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

function PriceCalculator() {
  const { t } = useTranslation();
  const [plan, setPlan] = useState<PlanKey>("Standard");
  const [admins, setAdmins] = useState(1);
  const [workers, setWorkers] = useState(3);
  const [hourlyCost, setHourlyCost] = useState(450);
  const [hoursSavedPerUser, setHoursSavedPerUser] = useState(8);
  const [autoEko, setAutoEko] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const users = Math.max(0, admins) + Math.max(0, workers);
  const showUsers = plan !== "Start";
  const totalUsersForCalc = plan === "Start" ? 0 : users;

  const perUser = plan === "Standard" ? STANDARD_PER_USER : plan === "PRO" ? PRO_PER_USER : 0;

  const lineUserLicenses = perUser * totalUsersForCalc;
  const workAppQty = plan === "Start" ? 0 : Math.max(0, workers);
  const lineWorkApps = WORK_APP_PER_USER * workAppQty;
  const lineAutoEko = autoEko ? AUTOEKO_PRICE : 0;

  const lineAddons = ADDONS.reduce((sum, a) => {
    const qty = selectedAddons[a.code] ?? 0;
    if (!qty) return sum;
    if (a.unit === "per_user") return sum + a.price * totalUsersForCalc;
    if (a.unit === "flat") return sum + a.price;
    return sum + a.price * qty;
  }, 0);

  const monthlyTotalRaw = START_BASE + lineUserLicenses + lineWorkApps + lineAutoEko + lineAddons;
  const monthlyTotal = useMemo(() => applyCycle(monthlyTotalRaw, cycle), [monthlyTotalRaw, cycle]);

  const savingsPerMonth = hourlyCost * hoursSavedPerUser * Math.max(1, users);
  const net = savingsPerMonth - monthlyTotal;
  const roi = monthlyTotal > 0 ? Math.round((net / monthlyTotal) * 100) : 0;

  const toggleAddon = (code: string, defaultQty = 1) => {
    setSelectedAddons((prev) => {
      const cur = prev[code] ?? 0;
      if (cur > 0) {
        const next = { ...prev };
        delete next[code];
        return next;
      }
      return { ...prev, [code]: defaultQty };
    });
  };

  return (
    <section id="kalkylator" className="py-12 sm:py-16 px-4 sm:px-6 bg-surface border-y border-border scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("pricing.calcLabel")}</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">{t("pricing.calcTitle")}</h2>
          <p className="text-muted text-sm">{t("pricing.calcSub")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-background border border-border p-4 sm:p-6 md:p-8 space-y-6">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-3">{t("pricing.planLabel")}</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Start", "Standard", "PRO"] as PlanKey[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`py-2.5 sm:py-3 text-xs sm:text-base font-bold rounded-sm border transition-colors cursor-pointer ${plan === p ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberField
                label={t("pricing.admins")}
                value={admins}
                onChange={setAdmins}
                disabled={!showUsers}
                hint={showUsers ? t("pricing.adminsHint") : t("pricing.unlimitedInStart")}
                min={0}
              />
              <NumberField
                label={t("pricing.workers")}
                value={workers}
                onChange={setWorkers}
                disabled={!showUsers}
                hint={showUsers ? t("pricing.hintWorkApp", { price: WORK_APP_PER_USER }) : t("pricing.unlimitedInStart")}
                min={0}
              />
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
                onChange={setHoursSavedPerUser}
                hint={t("pricing.hoursSavedHint")}
                min={0}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer border-t border-border pt-6">
              <input type="checkbox" checked={autoEko} onChange={(e) => setAutoEko(e.target.checked)} className="mt-1 w-5 h-5 accent-primary shrink-0" />
              <span>
                <span className="block font-bold text-sm">{t("pricing.autoEkoTitle")}</span>
                <span className="block text-xs text-muted">{t("pricing.autoEkoSub")}</span>
              </span>
            </label>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted block mb-3">{t("pricing.addonsLabel")}</p>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {ADDONS.filter((a) => a.code !== "2301").map((a) => {
                  const active = (selectedAddons[a.code] ?? 0) > 0;
                  return (
                    <li key={a.code}>
                      <label className="flex items-start gap-3 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleAddon(a.code, a.unit === "per_scan" ? 50 : 1)}
                          className="mt-1 w-4 h-4 accent-primary shrink-0"
                        />
                        <span className="flex-1">
                          <span className="font-bold">{a.name}</span>{" "}
                          <span className="text-muted text-xs">
                            ({formatSEK(a.price)} {t("pricing.sek")}{a.unit === "per_user" ? t("pricing.unitPerUser") : a.unit === "per_scan" ? `/${t("pricing.unitScan")}` : t("pricing.perMonthAbbr")})
                          </span>
                          {active && a.unit === "per_scan" && (
                            <span className="block mt-1">
                              <input
                                type="number"
                                min={0}
                                value={selectedAddons[a.code] ?? 0}
                                onChange={(e) =>
                                  setSelectedAddons((prev) => ({ ...prev, [a.code]: Math.max(0, Number(e.target.value) || 0) }))
                                }
                                className="w-24 h-8 px-2 border border-border bg-background text-xs"
                              />
                              <span className="text-xs text-muted ml-2">{t("pricing.unitScansMonth")}</span>
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
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

          <div className="bg-background border border-border p-4 sm:p-6 md:p-8 flex flex-col">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">{t("pricing.yourMonthlyCost")}</p>

            <ul className="space-y-3 text-sm mb-6">
              <Row label={t("pricing.startLicense")} value={START_BASE} t={t} />
              {plan !== "Start" && totalUsersForCalc > 0 && (
                <Row label={t("pricing.usersCount", { plan, count: totalUsersForCalc })} value={lineUserLicenses} t={t} />
              )}
              {workAppQty > 0 && <Row label={t("pricing.workAppCount", { count: workAppQty })} value={lineWorkApps} t={t} />}
              {autoEko && <Row label={t("pricing.autoEkoTitle")} value={AUTOEKO_PRICE} t={t} />}
              {lineAddons > 0 && <Row label={t("pricing.addonsLabel")} value={lineAddons} t={t} />}
              {cycle !== "monthly" && (
                <li className="flex justify-between text-primary pt-2 border-t border-border">
                  <span>{t("pricing.discountLabel", { type: cycle === "quarterly" ? "-5%" : "-20%" })}</span>
                  <span className="font-bold">−{formatSEK(Math.round(monthlyTotalRaw * CYCLE_DISCOUNT[cycle]))} {t("pricing.sek")}</span>
                </li>
              )}
            </ul>

            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">{t("pricing.total")}</span>
                <div className="text-left sm:text-right">
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{formatSEK(monthlyTotal)}</span>
                  <span className="text-muted text-sm ml-2">{t("pricing.sek")}{t("pricing.perMonthAbbr")}</span>
                </div>
              </div>
              <p className="text-xs text-muted mb-6 sm:text-right">{t("pricing.exVat")}</p>

              <div className="bg-surface border border-border p-4 mb-6 text-sm">
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{t("pricing.savingsPerMonth")}</p>
                <div className="flex justify-between mb-1 text-xs sm:text-sm">
                  <span>{t("pricing.savedWorkTime")}</span>
                  <span className="font-bold">{formatSEK(savingsPerMonth)} {t("pricing.sek")}</span>
                </div>
                <div className="flex justify-between mb-3 text-xs sm:text-sm text-muted">
                  <span>{t("pricing.minusLicenseCost")}</span>
                  <span>{formatSEK(monthlyTotal)} {t("pricing.sek")}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-3 text-xs sm:text-sm">
                  <span className={net >= 0 ? "text-primary" : "text-foreground"}>
                    {t("pricing.net")} {net >= 0 ? "+" : ""}
                  </span>
                  <span className={net >= 0 ? "text-primary" : "text-foreground"}>
                    {formatSEK(net)} {t("pricing.sek")} {net >= 0 && <span className="text-xs">({roi}{t("pricing.roi")})</span>}
                  </span>
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("pricing.startFree30")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, t }: { label: string; value: number; t: (key: string) => string }) {
  return (
    <li className="flex justify-between border-b border-border pb-3">
      <span>{label}</span>
      <span className="font-bold">{formatSEK(value)} {t("pricing.sek")}</span>
    </li>
  );
}

function NumberField({
  label,
  value,
  onChange,
  hint,
  disabled,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
  disabled?: boolean;
  min?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{label}</label>
      <input
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      hasHeader: false,
    },
  };
};
