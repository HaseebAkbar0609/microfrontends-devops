import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const areas = [
  { key: "kunder", num: "01", tKey: "areaKunderT", dKey: "areaKunderD", iKey: "areaKunderI" },
  { key: "leverera", num: "02", tKey: "areaLevereraT", dKey: "areaLevereraD", iKey: "areaLevereraI" },
  { key: "fakturera", num: "03", tKey: "areaFaktureraT", dKey: "areaFaktureraD", iKey: "areaFaktureraI" },
  { key: "vaxa", num: "04", tKey: "areaVaxaT", dKey: "areaVaxaD", iKey: "areaVaxaI" },
];

export default function SolutionsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.solutionsTitle")}</title>
        <meta name="description" content={t("seo.solutionsDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.solutionsOgTitle")} />
        <meta property="og:description" content={t("seo.solutionsOgDesc")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-12 px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("solutions.heroLabel")}</p>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance">
              {t("solutions.heroTitleNew1")} <span className="text-primary italic">{t("solutions.heroTitleNew2")}</span>
            </h1>
            <p className="text-lg text-muted max-w-3xl">
              {t("solutions.heroDescNew")}
            </p>
          </div>
        </header>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-border border border-border">
            {areas.map((a) => (
              <article key={a.key} id={a.key} className="bg-background p-10 flex flex-col">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-xs text-primary">{a.num}</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{t(`solutions.${a.tKey}`)}</h2>
                </div>
                <p className="text-muted mb-6">{t(`solutions.${a.dKey}`)}</p>
                <ul className="space-y-2 text-sm">
                  {(t(`solutions.${a.iKey}`, { returnObjects: true }) as string[]).map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <span className="text-primary mt-1">→</span>{it}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20 px-6 text-center bg-ink text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("home.ctaTitle")}</h2>
          <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
            {t("home.ctaSub")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm">{t("solutions.seePricing")}</Link>
            <Link href="/contact" className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors">{t("professional.tryDemo")}</Link>
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
