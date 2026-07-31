import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t("about.heroLabel")} — TimeFlow System AB`}</title>
        <meta name="description" content={t("about.heroDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.heroLabel")}</p>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 text-balance leading-tight">
              {t("about.heroTitle1")}<br />
              <span className="text-primary italic">{t("about.heroTitle2")}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-3xl">{t("about.heroDesc")}</p>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
          {[
            { v: t("about.stat1V"), l: t("about.stat1L") },
            { v: t("about.stat2V"), l: t("about.stat2L") },
            { v: t("about.stat3V"), l: t("about.stat3L") },
            { v: t("about.stat4V"), l: t("about.stat4L") },
          ].map((s, i) => (
            <div key={s.l} className={`p-4 sm:p-8 border-b md:border-b-0 ${i % 2 === 0 ? "border-r" : "md:border-r"} border-border last:border-r-0`}>
              <div className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">{s.v}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{s.l}</p>
            </div>
          ))}
        </section>

        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.missionLabel")}</p>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 text-balance">
              {t("about.missionTitle1")} <span className="text-primary italic">{t("about.missionTitle2")}</span>.
            </h2>
            <p className="text-base sm:text-lg text-muted mb-4">{t("about.missionP1")}</p>
            <p className="text-base sm:text-lg text-muted">{t("about.missionP2")}</p>
          </div>
        </section>

        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 sm:mb-16 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.valuesLabel")}</p>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t("about.valuesTitle")}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
              {[
                { t: t("about.val1T"), d: t("about.val1D") },
                { t: t("about.val2T"), d: t("about.val2D") },
                { t: t("about.val3T"), d: t("about.val3D") },
                { t: t("about.val4T"), d: t("about.val4D") },
              ].map((v, i) => (
                <div key={v.t} className="bg-background p-6 sm:p-10">
                  <div className="font-mono text-xs text-primary mb-3">0{i + 1}</div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-3">{v.t}</h3>
                  <p className="text-muted text-sm sm:text-base">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.journeyLabel")}</p>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-12 sm:mb-16">{t("about.journeyTitle")}</h2>
            <div className="space-y-8 sm:space-y-10">
              {[
                { y: t("about.tl1Y"), title: t("about.tl1T"), d: t("about.tl1D") },
                { y: t("about.tl2Y"), title: t("about.tl2T"), d: t("about.tl2D") },
                { y: t("about.tl3Y"), title: t("about.tl3T"), d: t("about.tl3D") },
                { y: t("about.tl4Y"), title: t("about.tl4T"), d: t("about.tl4D") },
                { y: t("about.tl5Y"), title: t("about.tl5T"), d: t("about.tl5D") },
              ].map((tl) => (
                <div key={tl.y} className="grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 sm:gap-6 border-b border-border pb-8 sm:pb-10 last:border-b-0">
                  <div className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">{tl.y}</div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold mb-2">{tl.title}</h3>
                    <p className="text-muted text-sm sm:text-base">{tl.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("about.moreTitle")}</h2>
          <p className="text-muted text-base sm:text-lg mb-8 max-w-xl mx-auto">{t("about.moreDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">{t("about.contactBtn")}</Link>
            <Link href="/cases" className="px-8 py-4 border border-border font-bold rounded-sm hover:bg-surface transition-colors">{t("about.seeCases")}</Link>
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
