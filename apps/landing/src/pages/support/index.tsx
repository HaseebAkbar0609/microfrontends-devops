import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function SupportPage() {
  const { t } = useTranslation();

  const channels = [
    { t: t("support.ch1T"), d: t("support.ch1D"), time: t("support.ch1Time") },
    { t: t("support.ch2T"), d: t("support.ch2D"), time: t("support.ch2Time") },
    { t: t("support.ch3T"), d: t("support.ch3D"), time: t("support.ch3Time") },
    { t: t("support.ch4T"), d: t("support.ch4D"), time: t("support.ch4Time") },
  ];

  const migration = ["Hantverksdata","Bygglet","Next","Tengella","Rekyl","Fortnox","Visma","Björn Lundén"];

  return (
    <>
      <Head>
        <title>{`${t("support.heroLabel")} — TimeFlow`}</title>
        <meta name="description" content={t("support.heroDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("support.heroLabel")}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
              {t("support.heroTitle1")} <span className="text-primary italic">{t("support.heroTitle2")}</span>.
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl">{t("support.heroDesc")}</p>
          </div>
        </header>

        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-border border border-border">
            {channels.map((c, i) => (
              <div key={c.t} className="bg-background p-6 sm:p-8">
                <div className="font-mono text-xs text-primary mb-3">0{i + 1}</div>
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">{c.t}</h3>
                <p className="text-muted text-sm sm:text-base mb-4">{c.d}</p>
                <p className="text-xs font-mono uppercase tracking-widest text-primary">{c.time}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-6 bg-surface border-y border-border">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("support.onboardLabel")}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("support.onboardTitle")}</h2>
              <p className="text-muted">{t("support.onboardDesc")}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("support.migrateLabel")}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("support.migrateTitle")}</h2>
              <p className="text-muted mb-4">
                {t("support.migrateDesc")} <strong className="text-foreground">{t("support.migrateItems")}</strong> {t("support.migrateDescSuffix")}
              </p>
              <div className="flex flex-wrap gap-2">
                {migration.map((m) => (
                  <span key={m} className="text-xs font-mono px-3 py-1 border border-border bg-background">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">{t("support.statusLabel")}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("support.statusTitle")}</h2>
            <p className="text-muted mb-8">{t("support.statusUptime")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("support.contactBtn")}
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-border font-bold rounded-sm hover:bg-surface transition-colors">
                {t("support.pricingFaq")}
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
