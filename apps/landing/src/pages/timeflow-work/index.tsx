import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const stats = [
  { vKey: "stat1V", lKey: "stat1L" },
  { vKey: "stat2V", lKey: "stat2L" },
  { vKey: "stat3V", lKey: "stat3L" },
  { vKey: "stat4V", lKey: "stat4L" },
];

export default function TimeflowWorkPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.timeflowWorkTitle")}</title>
        <meta name="description" content={t("seo.timeflowWorkDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-24 pb-20 px-6 border-b border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("timeflowWork.label")}
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-6">
                {t("timeflowWork.heroTitle1")} <span className="text-primary italic">{t("timeflowWork.heroTitle2")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted max-w-2xl text-pretty">
                {t("timeflowWork.heroDesc")}
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3">
              <Link href="/contact" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm text-center cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("timeflowWork.bookDemo")}
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
              <div className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{t(`timeflowWork.${s.vKey}`)}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{t(`timeflowWork.${s.lKey}`)}</p>
            </div>
          ))}
        </section>

        {/* TimeFlow Work */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowWork.workLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("timeflowWork.workTitle")}
              </h2>
              <p className="text-muted mt-4 text-lg">
                {t("timeflowWork.workDesc")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <div key={i} className="p-6 border border-border bg-background hover:border-primary transition-colors">
                  <div className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
                    {String(i).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{t(`timeflowWork.f${i}T`)}</h3>
                  <p className="text-muted text-sm leading-relaxed">{t(`timeflowWork.f${i}D`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SecureCheck highlight */}
        <section className="bg-ink text-white py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowWork.secureLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {t("timeflowWork.secureTitle")}
              </h2>
              <p className="text-stone-400 text-lg mb-8 max-w-md">
                {t("timeflowWork.secureDesc")}
              </p>
              <ul className="space-y-3 mb-8 text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary grid place-items-center text-xs">✓</span>
                    {t(`timeflowWork.secureP${i}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-stone-800 via-stone-900 to-ink rounded-md border border-white/10 grid place-items-center">
              <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">{t("timeflowWork.securePreview")}</span>
            </div>
          </div>
        </section>

        {/* TimeFlow Manager teaser */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowWork.managerLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("timeflowWork.managerTitle")}
              </h2>
              <p className="text-muted mt-4 text-lg">
                {t("timeflowWork.managerDesc")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="p-6 border border-border bg-background hover:border-primary transition-colors">
                  <div className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
                    {String(i).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{t(`timeflowWork.m${i}T`)}</h3>
                  <p className="text-muted text-sm leading-relaxed">{t(`timeflowWork.m${i}D`)}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link href="/timeflow-manager" className="inline-flex items-center gap-2 px-6 py-3 border border-border font-bold rounded-sm hover:bg-surface transition-colors">
                {t("timeflowWork.readMore")}
              </Link>
            </div>
          </div>
        </section>

        {/* AI Robert highlight */}
        <section className="bg-surface py-24 px-6 border-y border-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowWork.robertLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("timeflowWork.robertTitle")}
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              {t("timeflowWork.robertDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("timeflowWork.bookDemo")}
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-border font-bold rounded-sm hover:bg-background transition-colors">
                {t("solutions.seePricing")}
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("timeflowWork.ctaLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("timeflowWork.ctaTitle")}
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              {t("timeflowWork.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("professional.startAccount")}
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-border font-bold rounded-sm hover:bg-surface transition-colors">
                {t("solutions.seePricing")}
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
