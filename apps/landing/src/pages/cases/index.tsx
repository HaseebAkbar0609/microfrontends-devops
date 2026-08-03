import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const industries = [
  { icon: "👷", tKey: "ind1T", qKey: "ind1Q", bKey: "ind1B", benKey: "ind1Ben" },
  { icon: "⚡", tKey: "ind2T", qKey: "ind2Q", bKey: "ind2B", benKey: "ind2Ben" },
  { icon: "🔧", tKey: "ind3T", qKey: "ind3Q", bKey: "ind3B", benKey: "ind3Ben" },
  { icon: "🧹", tKey: "ind4T", qKey: "ind4Q", bKey: "ind4B", benKey: "ind4Ben" },
  { icon: "🚀", tKey: "ind5T", qKey: "ind5Q", bKey: "ind5B", benKey: "ind5Ben" },
];

export default function CasesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.casesTitle")}</title>
        <meta name="description" content={t("seo.casesDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.casesOgTitle")} />
        <meta property="og:description" content={t("seo.casesOgDesc")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-12 px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.heroLabel")}</p>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance">
              {t("cases.heroTitle1")} <span className="text-primary italic">{t("cases.heroTitle2")}</span>
            </h1>
            <p className="text-lg text-muted max-w-3xl">
              {t("cases.heroDesc")}
            </p>
          </div>
        </header>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {industries.map((ind) => {
              const benefits = t(`cases.${ind.benKey}`, { returnObjects: true });
              const benefitList = Array.isArray(benefits)
                ? (benefits as unknown[]).filter((b): b is string => typeof b === "string")
                : [];
              return (
                <article key={ind.tKey} className="p-8 border border-border bg-background flex flex-col">
                  <div className="text-4xl mb-4">{ind.icon}</div>
                  <h2 className="font-display text-2xl font-bold mb-3">{t(`cases.${ind.tKey}`)}</h2>
                  <p className="font-display italic text-primary mb-4">&ldquo;{t(`cases.${ind.qKey}`)}&rdquo;</p>
                  <p className="text-muted text-sm mb-6">{t(`cases.${ind.bKey}`)}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{t("cases.benefitsLabel")}</p>
                  <ul className="space-y-2 text-sm">
                    {benefitList.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-16 px-6 bg-surface border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.valueLabel")}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                {t("cases.valueTitle")}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background border border-border text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-mono text-xs uppercase tracking-widest text-muted w-1/3">{t("cases.valueAreaCol")}</th>
                    <th className="text-left p-4 font-mono text-xs uppercase tracking-widest text-muted">{t("cases.valueBestCol")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const valueTable = t("cases.valueTable", { returnObjects: true });
                    const valueRows = Array.isArray(valueTable)
                      ? (valueTable as unknown[]).filter(
                          (r): r is [string, string] =>
                            Array.isArray(r) && r.length === 2 && typeof r[0] === "string" && typeof r[1] === "string"
                        )
                      : [];
                    return valueRows.map(([area, value]) => (
                      <tr key={area} className="border-b border-border last:border-b-0">
                        <td className="p-4 font-bold">{area}</td>
                        <td className="p-4 text-muted">{value}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("cases.refLabel")}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {t("cases.refTitle")}
            </h2>
            <p className="text-muted text-lg">
              {t("cases.refDesc")}
            </p>
          </div>
        </section>

        <section className="py-20 px-6 text-center bg-ink text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("about.moreTitle")}</h2>
          <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
            {t("cases.ctaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm">{t("cases.startNow")}</Link>
            <Link href="/contact" className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors">{t("contact.heroLabel")}</Link>
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
