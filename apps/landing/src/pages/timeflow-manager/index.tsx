import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const managerModules = [
  { id: "affar", catKey: "cat1", items: [1, 2, 3, 4] },
  { id: "produktion", catKey: "cat2", items: [5, 6, 7, 8, 9, 10] },
  { id: "ekonomi", catKey: "cat3", items: [11, 12, 13, 14, 15] },
  { id: "affarsstod", catKey: "cat4", items: [16, 17, 18, 19, 20] },
];

const comparisonRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const stats = [
  { vKey: "stat1V", lKey: "stat1L" },
  { vKey: "stat2V", lKey: "stat2L" },
  { vKey: "stat3V", lKey: "stat3L" },
  { vKey: "stat4V", lKey: "stat4L" },
];

export default function TimeflowManagerPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.timeflowManagerTitle")}</title>
        <meta name="description" content={t("seo.timeflowManagerDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-24 pb-20 px-6 border-b border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("timeflowManager.label")}
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-6">
                {t("timeflowManager.heroTitle1")} <span className="text-primary italic">{t("timeflowManager.heroTitle2")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted max-w-2xl text-pretty">
                {t("timeflowManager.heroDesc")}
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3">
              <Link href="/contact" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm text-center cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("timeflowManager.bookDemo")}
              </Link>
              <div className="flex gap-3">
                <button className="flex-1 px-5 py-3 bg-foreground text-background font-bold rounded-sm text-sm">{t("common.appStore")}</button>
                <button className="flex-1 px-5 py-3 bg-foreground text-background font-bold rounded-sm text-sm">{t("common.googlePlay")}</button>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
          {stats.map((s) => (
            <div key={s.vKey} className="p-8 border-r border-border last:border-r-0">
              <div className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{t(`timeflowManager.${s.vKey}`)}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{t(`timeflowManager.${s.lKey}`)}</p>
            </div>
          ))}
        </section>

        {/* Modules */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowManager.allModulesLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("timeflowManager.allModulesTitle")}
              </h2>
              <p className="text-muted mt-4 text-lg">
                {t("timeflowManager.allModulesDesc")}
              </p>
            </div>

            {/* Module overview / anchor nav */}
            <nav aria-label={t("timeflowManager.allModulesLabel")} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {managerModules.map((mod) => (
                <a
                  key={mod.id}
                  href={`#${mod.id}`}
                  className="group border border-border bg-surface/30 hover:bg-surface/60 p-6 transition-colors"
                >
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">{t(`timeflowManager.${mod.catKey}`)}</p>
                  <p className="font-display font-bold text-lg group-hover:underline underline-offset-4">
                    {t("timeflowManager.modulesCount", { count: mod.items.length })}
                  </p>
                  <p className="text-muted text-sm mt-2">{t("timeflowManager.jumpTo", { cat: t(`timeflowManager.${mod.catKey}`) })}</p>
                </a>
              ))}
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
              {managerModules.map((mod) => (
                <div key={mod.id} id={mod.id} className="scroll-mt-24 border border-border p-8 bg-surface/30">
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-6">{t(`timeflowManager.${mod.catKey}`)}</p>
                  <div className="space-y-6">
                    {mod.items.map((i) => (
                      <div key={i}>
                        <h3 className="font-display text-lg font-bold mb-1">{t(`timeflowManager.m${i}T`)}</h3>
                        <p className="text-muted text-sm leading-relaxed">{t(`timeflowManager.m${i}D`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-surface py-24 px-6 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowManager.compareLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("timeflowManager.compareTitle")}
              </h2>
              <p className="text-muted mt-4 text-lg">
                {t("timeflowManager.compareDesc")}
              </p>
            </div>

            <div className="overflow-x-auto border border-border bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-ink text-white">
                    <th className="text-left p-4 font-display font-bold">{t("timeflowManager.compareFeature")}</th>
                    <th className="text-left p-4 font-display font-bold w-1/3">{t("timeflowManager.compareWorkH")}</th>
                    <th className="text-left p-4 font-display font-bold w-1/3 text-primary">{t("timeflowManager.compareManagerH")}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((i, idx) => (
                    <tr key={i} className={idx % 2 === 1 ? "bg-surface/50" : ""}>
                      <td className="p-4 font-bold border-r border-border">{t(`timeflowManager.cmp${i}F`)}</td>
                      <td className="p-4 text-muted border-r border-border">{t(`timeflowManager.cmp${i}W`)}</td>
                      <td className="p-4 text-muted">{t(`timeflowManager.cmp${i}M`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* AI Robert */}
        <section className="bg-dark-section text-white py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowManager.robertLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {t("timeflowManager.robertTitle")}
              </h2>
              <p className="text-stone-400 text-lg mb-8 max-w-md">
                {t("timeflowManager.robertDesc")}
              </p>
              <ul className="space-y-4 mb-8 text-sm">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs shrink-0">✓</span>
                    {t(`timeflowManager.robertP${i}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-dark-card via-dark-card to-dark-section rounded-lg border border-white/10 grid place-items-center">
              <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">{t("timeflowManager.robertPreview")}</span>
            </div>
          </div>
        </section>

        {/* Pricing hint */}
        <section className="bg-ink text-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowManager.priceLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("timeflowManager.priceTitle")}
            </h2>
            <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto">
              {t("timeflowManager.priceDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("timeflowManager.calcBtn")}
              </Link>
              <Link href="/contact" className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors">
                {t("timeflowManager.bookDemo")}
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowManager.ctaLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("timeflowManager.ctaTitle")}
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              {t("timeflowManager.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("professional.startAccount")}
              </Link>
              <Link href="/timeflow-work" className="px-8 py-4 border border-border font-bold rounded-sm hover:bg-surface transition-colors">
                {t("timeflowManager.readWork")}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { hasHeader: false } };
};
