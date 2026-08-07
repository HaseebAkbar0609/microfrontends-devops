import { useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FAQ } from "@/components/site/FAQ";
import { PriceCalculator } from "@/components/pricing/PriceCalculator";
import { formatNumber } from "@/lib/formatters";
import {
  ADDONS,
  WORK_APP_PER_USER,
} from "@/lib/pricing";

const catKey = (cat: string): string => ({
  "Kalkyl": "pricing.catCalc",
  "Order": "pricing.catOrder",
  "Inköp": "pricing.catInkop",
  "Maskin": "pricing.catMaskin",
  "Ekonomi": "pricing.catEkonomi",
  "Marknad": "pricing.catMarknad",
}[cat] || "pricing.catOther");

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const fmt = (n: number) => formatNumber(n, i18n.language);
  const [selectedPlan, setSelectedPlan] = useState<string>("1102");

  const plans = [
    {
      code: "1101",
      name: "Start",
      price: "2 995",
      suffix: t("pricing.planUnitMonth"),
      desc: t("pricing.planStartDesc"),
      cta: t("pricing.startAccount"),
      features: [
        t("pricing.planStartF1"),
        t("pricing.planStartF2"),
        t("pricing.planStartF3"),
        t("pricing.planStartF4"),
        t("pricing.planStartF5"),
      ],
    },
    {
      code: "1102",
      name: "Standard",
      price: "995",
      suffix: t("pricing.planUnitAdmin"),
      desc: t("pricing.planStandardDesc", { workPrice: fmt(WORK_APP_PER_USER) }),
      cta: t("pricing.startAccount"),
      popular: true,
      features: [
        t("pricing.planStandardF1"),
        t("pricing.planStandardF2"),
        t("pricing.planStandardF3"),
        t("pricing.planStandardF4"),
        t("pricing.planStandardF5"),
      ],
    },
    {
      code: "1103",
      name: "PRO",
      price: "1 295",
      suffix: t("pricing.planUnitAdmin"),
      desc: t("pricing.planProDesc"),
      cta: t("pricing.startAccount"),
      features: [
        t("pricing.planProF1"),
        t("pricing.planProF2"),
        t("pricing.planProF3"),
        t("pricing.planProF4"),
        t("pricing.planProF5"),
        t("pricing.planProF6"),
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{`${t("pricing.heroLabel")} — TimeFlow`}</title>
        <meta name="description" content={t("pricing.heroSub").replace(/<\/?strong>/g, "")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${t("pricing.heroLabel")} — TimeFlow`} />
        <meta property="og:description" content={t("pricing.heroSub").replace(/<\/?strong>/g, "")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-12 px-4 sm:px-6 text-center border-b border-border">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("pricing.heroLabel")}</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
            {t("pricing.heroTitle1")} <span className="text-primary italic">{t("pricing.heroTitle2")}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
            <Trans i18nKey="pricing.heroSub" components={{ strong: <strong className="font-bold text-foreground" /> }} />
          </p>
        </header>

        {/* Plans */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.code;
              return (
                <div
                  key={p.name}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedPlan(p.code)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPlan(p.code);
                    }
                  }}
                  className={`p-6 sm:p-8 border bg-background flex flex-col cursor-pointer transition-colors duration-150 ${
                    isSelected
                      ? "border-primary shadow-xl shadow-primary/10 relative scale-[1.02] z-10"
                      : "border-border hover:border-primary/40 hover:shadow-md relative"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 left-6 sm:left-8 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                      {t("pricing.selected") || "VALD PLAN"}
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
                  <Link
                    href={`/register?type=business&plan=${p.code}`}
                    onClick={() => setSelectedPlan(p.code)}
                    className={`w-full py-3 text-center block font-bold rounded-sm mb-8 cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground text-background hover:bg-primary/80 hover:text-primary-foreground"
                    }`}
                  >
                    {p.cta}
                  </Link>
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
              );
            })}
          </div>
          <p className="text-center text-sm text-muted max-w-2xl mx-auto mt-8">
            {t("pricing.workNote1")} <strong className="text-foreground">{t("pricing.workNoteApp", { price: fmt(WORK_APP_PER_USER) })}</strong> {t("pricing.workNote2")}
          </p>
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
                        {fmt(a.price)} {t("pricing.sek")}{t("pricing.perMonthAbbr")}{a.unit === "per_user" ? t("pricing.unitPerUser") : ""}
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
            <FAQ />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 text-center bg-ink text-white">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("pricing.readyToTest")}</h2>
          <p className="text-stone-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">{t("pricing.noCreditCard")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register?type=business" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all text-center">{t("pricing.startFree30")}</Link>
            <Link href="/professional/book_a_demo" className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors text-center">{t("pricing.bookDemo")}</Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      hasHeader: false,
    },
  };
};