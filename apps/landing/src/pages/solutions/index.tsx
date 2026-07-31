import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function SolutionsPage() {
  const { t } = useTranslation();

  const areas = [
    {
      key: "affar", num: "01", title: t("solutions.area1Title"), tagline: t("solutions.area1Tag"), desc: t("solutions.area1Desc"),
      items: [t("solutions.feat1"), t("solutions.feat2"), t("solutions.feat3"), t("solutions.feat4"), t("solutions.feat5")]
    },
    {
      key: "produktion", num: "02", title: t("solutions.area2Title"), tagline: t("solutions.area2Tag"), desc: t("solutions.area2Desc"),
      items: [t("solutions.feat6"), t("solutions.feat7"), t("solutions.feat8"), t("solutions.feat9"), t("solutions.feat10")]
    },
    {
      key: "ekonomi", num: "03", title: t("solutions.area3Title"), tagline: t("solutions.area3Tag"), desc: t("solutions.area3Desc"),
      items: [t("solutions.feat11"), t("solutions.feat12"), t("solutions.feat13"), t("solutions.feat14"), t("solutions.feat15")]
    },
    {
      key: "affarsstod", num: "04", title: t("solutions.area4Title"), tagline: t("solutions.area4Tag"), desc: t("solutions.area4Desc"),
      items: [t("solutions.feat16"), t("solutions.feat17"), t("solutions.feat18"), t("solutions.feat19"), t("solutions.feat20")]
    },
  ];

  return (
    <>
      <Head>
        <title>{`${t("solutions.heroLabel")} — TimeFlow`}</title>
        <meta name="description" content={t("solutions.heroDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-12 px-4 sm:px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("solutions.heroLabel")}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
              {t("solutions.heroTitle1")} <span className="text-primary italic">{t("solutions.heroTitle2")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl">{t("solutions.heroDesc")}</p>
          </div>
        </header>

        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-border border border-border">
            {areas.map((a) => (
              <article key={a.key} id={a.key} className="bg-background p-6 sm:p-10 flex flex-col">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-xs text-primary">{a.num}</span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{a.title}</h2>
                </div>
                <p className="font-display text-lg sm:text-xl text-foreground mb-4">{a.tagline}</p>
                <p className="text-muted text-sm sm:text-base mb-6">{a.desc}</p>
                <ul className="space-y-2 text-sm mb-8">
                  {a.items.map((it) => (
                    <li key={it} className="flex items-start gap-3"><span className="text-primary mt-1">→</span>{it}</li>
                  ))}
                </ul>
                <Link href="/professional" className="mt-auto inline-block font-bold text-primary text-sm hover:translate-x-1 transition-transform">
                  {t("solutions.seeDetail", { area: a.title.toLowerCase() })}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 text-center bg-ink text-white">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("solutions.ctaTitle")}</h2>
          <p className="text-stone-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">{t("solutions.ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
              {t("solutions.seePricing")}
            </Link>
            <button className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/5 transition-colors cursor-pointer">
              {t("solutions.bookDemo")}
            </button>
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
