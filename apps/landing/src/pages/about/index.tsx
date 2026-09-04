import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const timeline = [
  { icon: "🚀", yKey: "tl1Y", tKey: "tl1T", dKey: "tl1D" },
  { icon: "🛠️", yKey: "tl2Y", tKey: "tl2T", dKey: "tl2D" },
  { icon: "💻", yKey: "tl3Y", tKey: "tl3T", dKey: "tl3D" },
  { icon: "📱", yKey: "tl4Y", tKey: "tl4T", dKey: "tl4D" },
  { icon: "🇸🇪", yKey: "tl5Y", tKey: "tl5T", dKey: "tl5D" },
];

const stats = [
  { vKey: "stat1V", lKey: "stat1L" },
  { vKey: "stat2V", lKey: "stat2L" },
  { vKey: "stat3V", lKey: "stat3L" },
  { vKey: "stat4V", lKey: "stat4L" },
  { vKey: "stat5V", lKey: "stat5L" },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.aboutTitle")}</title>
        <meta name="description" content={t("seo.aboutDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.aboutOgTitle")} />
        <meta property="og:description" content={t("seo.aboutOgDesc")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-16 px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.heroLabel")}</p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance">
              {t("about.heroTitle1")}<br />
              <span className="text-primary italic">{t("about.heroTitle2")}</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl">
              {t("about.heroDesc")}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-5 border-b border-border">
          {stats.map((s, i) => (
            <div key={s.vKey} className={`p-8 border-r border-border last:border-r-0 ${i < 2 ? "md:border-b-0 border-b" : i < 4 ? "border-b md:border-b-0" : ""}`}>
              <div className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{t(`about.${s.vKey}`)}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{t(`about.${s.lKey}`)}</p>
            </div>
          ))}
        </section>

        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.journeyLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-16">{t("about.journeyTitle")}</h2>
            <div className="space-y-10">
              {timeline.map((tl) => (
                <div key={tl.yKey} className="grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr] gap-6 border-b border-border pb-10 last:border-b-0">
                  <div className="font-display text-2xl md:text-3xl font-extrabold text-primary">
                    {t(`about.${tl.yKey}`)} <span className="text-2xl">{tl.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">{t(`about.${tl.tKey}`)}</h3>
                    <p className="text-muted">{t(`about.${tl.dKey}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.valuesLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{t("about.valuesTitle")}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-background p-10">
                  <div className="font-mono text-xs text-primary mb-3">0{i}</div>
                  <h3 className="font-display text-2xl font-bold mb-3">{t(`about.val${i}T`)}</h3>
                  <p className="text-muted">{t(`about.val${i}D`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("about.behindLabel")}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-8">TimeFlowSystem</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 border border-border bg-background">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">{t("about.licLabel")}</p>
                <h3 className="font-display text-2xl font-bold mb-2">{t("about.licCompany")}</h3>
                <p className="text-muted text-sm">{t("about.licVat")}</p>
              </div>
              <div className="p-8 border border-border bg-background">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">{t("about.affLabel")}</p>
                <h3 className="font-display text-2xl font-bold mb-2">{t("about.affCompany")}</h3>
                <p className="text-muted text-sm">{t("about.affOrg")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("about.moreTitle")}</h2>
          <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
            {t("about.moreDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm">{t("about.contactBtn")}</Link>
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
