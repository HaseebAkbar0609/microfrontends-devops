import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function CasesPage() {
  const { t } = useTranslation();

  const cases = [
    {
      company: t("cases.case1Company"),
      industry: t("cases.case1Industry"),
      size: t("cases.case1Size"),
      headline: t("cases.case1Headline"),
      body: t("cases.case1Body"),
      stats: [
        { v: t("cases.case1Stat1V"), l: t("cases.case1Stat1L") },
        { v: t("cases.case1Stat2V"), l: t("cases.case1Stat2L") },
        { v: t("cases.case1Stat3V"), l: t("cases.case1Stat3L") },
      ],
      quote: t("cases.case1Quote"),
      person: t("cases.case1Person"),
    },
    {
      company: t("cases.case2Company"),
      industry: t("cases.case2Industry"),
      size: t("cases.case2Size"),
      headline: t("cases.case2Headline"),
      body: t("cases.case2Body"),
      stats: [
        { v: t("cases.case2Stat1V"), l: t("cases.case2Stat1L") },
        { v: t("cases.case2Stat2V"), l: t("cases.case2Stat2L") },
        { v: t("cases.case2Stat3V"), l: t("cases.case2Stat3L") },
      ],
      quote: t("cases.case2Quote"),
      person: t("cases.case2Person"),
    },
    {
      company: t("cases.case3Company"),
      industry: t("cases.case3Industry"),
      size: t("cases.case3Size"),
      headline: t("cases.case3Headline"),
      body: t("cases.case3Body"),
      stats: [
        { v: t("cases.case3Stat1V"), l: t("cases.case3Stat1L") },
        { v: t("cases.case3Stat2V"), l: t("cases.case3Stat2L") },
        { v: t("cases.case3Stat3V"), l: t("cases.case3Stat3L") },
      ],
      quote: t("cases.case3Quote"),
      person: t("cases.case3Person"),
    },
  ];

  const competitors = ["TimeFlow PRO", "Hantverksdata", "Bygglet", "Next", "Tengella", "Rekyl"];

  const compareFeatures: { label: string; values: boolean[] }[] = [
    { label: t("cases.featLead"), values: [true, false, false, true, false, false] },
    { label: t("cases.featQuote"), values: [true, true, true, true, true, true] },
    { label: t("cases.featCalc"), values: [true, true, true, true, true, true] },
    { label: t("cases.featAICalc"), values: [true, false, false, false, false, false] },
    { label: t("cases.featPlan"), values: [true, true, true, true, true, true] },
    { label: t("cases.featResPlan"), values: [true, true, true, true, true, true] },
    { label: t("cases.featTime"), values: [true, true, true, true, true, true] },
    { label: t("cases.featEko"), values: [true, true, true, true, true, true] },
    { label: t("cases.featID06"), values: [true, true, true, true, false, true] },
    { label: t("cases.featKMA"), values: [true, true, true, false, false, true] },
    { label: t("cases.featPurch"), values: [true, true, false, false, false, false] },
    { label: t("cases.featProjDesign"), values: [true, false, false, false, false, false] },
    { label: t("cases.featCRM"), values: [true, true, true, true, true, true] },
    { label: t("cases.featDigSign"), values: [true, false, false, false, true, false] },
    { label: t("cases.featMobileApp"), values: [true, true, true, true, true, true] },
    { label: t("cases.featTalkFlow"), values: [true, false, false, false, false, false] },
    { label: t("cases.featAllInOne"), values: [true, false, false, false, false, false] },
    { label: t("cases.featAutoFollowup"), values: [true, false, false, true, false, false] },
    { label: t("cases.featROTRUT"), values: [true, true, true, true, true, true] },
    { label: t("cases.featSupport"), values: [true, true, true, true, true, true] },
    { label: t("cases.featHR"), values: [true, false, false, false, true, false] },
    { label: t("cases.featDebt"), values: [true, false, false, false, false, false] },
    { label: t("cases.featForecast"), values: [true, false, false, false, false, false] },
    { label: t("cases.featSales"), values: [true, false, false, false, false, false] },
    { label: t("cases.featLegal"), values: [true, false, false, false, false, false] },
    { label: t("cases.featTemplates"), values: [true, false, false, false, false, false] },
    { label: t("cases.featB2B"), values: [true, false, false, false, false, false] },
  ];

  function Cell({ v }: { v: boolean }) {
    return v ? (
      <span className="text-primary font-bold" aria-label="supported">
        ✓<span className="sr-only">supported</span>
      </span>
    ) : (
      <span className="text-stone-300" aria-label="not supported">
        —<span className="sr-only">not supported</span>
      </span>
    );
  }

  const tengellaCore = [
    t("cases.tc1"), t("cases.tc2"), t("cases.tc3"), t("cases.tc4"),
    t("cases.tc5"), t("cases.tc6"), t("cases.tc7"), t("cases.tc8"),
    t("cases.tc9"), t("cases.tc10"), t("cases.tc11"), t("cases.tc12"),
    t("cases.tc13"),
  ];

  const tengellaIntegrations = Array.from({ length: 24 }, (_, i) => t(`cases.ti${i + 1}`));

  const tengellaVsTimeflow = [
    { tf: t("cases.tvst1TF"), t: t("cases.tvst1T") },
    { tf: t("cases.tvst2TF"), t: t("cases.tvst2T") },
    { tf: t("cases.tvst3TF"), t: t("cases.tvst3T") },
    { tf: t("cases.tvst4TF"), t: t("cases.tvst4T") },
    { tf: t("cases.tvst5TF"), t: t("cases.tvst5T") },
    { tf: t("cases.tvst6TF"), t: t("cases.tvst6T") },
    { tf: t("cases.tvst7TF"), t: t("cases.tvst7T") },
  ];

  return (
    <>
      <Head>
        <title>{`${t("cases.heroLabel")} — TimeFlow`}</title>
        <meta name="description" content={t("cases.heroSub")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${t("cases.heroLabel")} — TimeFlow`} />
        <meta property="og:description" content={t("cases.heroSub")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        {/* Hero */}
        <header className="pt-16 md:pt-20 pb-12 px-4 sm:px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.heroLabel")}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
              {t("cases.heroTitle1")} <span className="text-primary italic">{t("cases.heroTitle2")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl">{t("cases.heroSub")}</p>
          </div>
        </header>

        {/* Cases */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-16">
            {cases.map((c, i) => (
              <article key={c.company} className="grid md:grid-cols-12 gap-6 md:gap-8 pb-16 border-b border-border last:border-b-0">
                <div className="md:col-span-4">
                  <div className="font-mono text-xs text-primary mb-3">
                    CASE 0{i + 1} / 0{cases.length}
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">{c.company}</h2>
                  <p className="text-sm text-muted">{c.industry}</p>
                  <p className="text-xs text-muted/70 mt-1">{c.size}</p>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">{c.headline}</h3>
                  <p className="text-muted mb-6">{c.body}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 border-y border-border py-6">
                    {c.stats.map((s) => (
                      <div key={s.l}>
                        <div className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">{s.v}</div>
                        <p className="text-xs text-muted uppercase tracking-widest mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <blockquote className="border-l-2 border-primary pl-4 sm:pl-6">
                    <p className="font-display text-base sm:text-lg italic mb-2">&quot;{c.quote}&quot;</p>
                    <footer className="text-sm text-muted">— {c.person}, {c.company}</footer>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Konkurrentmatris */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 max-w-3xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.compareLabel")}</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {t("cases.compareTitle")}
              </h2>
              <p className="text-muted text-sm sm:text-base">{t("cases.compareSub")}</p>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[650px] border-collapse bg-background border border-border text-sm">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th scope="col" className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted sticky left-0 bg-background z-10">
                      {t("cases.funcHeader")}
                    </th>
                    {competitors.map((c, i) => (
                      <th scope="col" key={c} className={`p-3 text-center font-display font-bold whitespace-nowrap ${i === 0 ? "text-primary bg-primary/5" : "text-muted"}`}>
                        {i === 0 && (
                          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">{t("cases.bestChoice")}</div>
                        )}
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFeatures.map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-b-0">
                      <th scope="row" className="p-3 text-left font-medium sticky left-0 bg-background z-10 font-normal">{row.label}</th>
                      {row.values.map((v, j) => (
                        <td key={j} className={`p-3 text-center ${j === 0 ? "bg-primary/5" : ""}`}>
                          <Cell v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-4">{t("cases.disclaimer")}</p>
          </div>
        </section>

        {/* Tengella deep dive */}
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 max-w-3xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.tengellaLabel")}</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {t("cases.tengellaTitle")}
              </h2>
              <p className="text-muted text-sm sm:text-base">{t("cases.tengellaSub")}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
              <div className="bg-background border border-border p-5 sm:p-6">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.coreModules")}</p>
                <ul className="space-y-2 text-sm">
                  {tengellaCore.map((m) => (
                    <li key={m} className="flex items-start gap-2"><span className="text-primary">→</span>{m}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-background border border-border p-5 sm:p-6">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.integrations")}</p>
                <ul className="grid grid-cols-1 gap-2 text-sm">
                  {tengellaIntegrations.map((m) => (
                    <li key={m} className="flex items-start gap-2"><span className="text-primary">+</span>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-surface border border-border p-4 sm:p-8">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("cases.vsHeader")}
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">TimeFlow</th>
                      <th className="text-left p-3 font-mono text-xs uppercase tracking-widest text-muted">Tengella</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tengellaVsTimeflow.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="p-3 align-top"><span className="text-primary font-bold mr-2">✓</span>{r.tf}</td>
                        <td className="p-3 align-top text-muted">{r.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 text-center bg-ink text-white">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("cases.ctaTitle")}</h2>
          <p className="text-stone-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">{t("cases.ctaSub")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">{t("nav.getStarted")}</Link>
            <Link href="/about" className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors">{t("nav.about")}</Link>
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
