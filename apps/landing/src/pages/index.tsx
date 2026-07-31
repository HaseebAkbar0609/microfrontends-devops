import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.homeTitle")}</title>
        <meta name="description" content={t("seo.homeDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.homeOgTitle")} />
        <meta property="og:description" content={t("seo.homeOgDesc")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        {/* Hero */}
        <header className="pt-20 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-8 mt-6 animate-fade-up [animation-delay:100ms]">
              {t("home.heroTitle1")}{" "}
              <span className="text-primary italic">{t("home.heroTitle2")}</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto text-pretty mb-4 animate-fade-up [animation-delay:200ms]">
              {t("home.heroSub")}
            </p>
            <p className="text-sm text-muted/80 max-w-xl mx-auto mb-10 animate-fade-up [animation-delay:250ms]">
              {t("home.heroBranches")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [animation-delay:300ms]">
              <Link
                href="/professional"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm text-lg hover:shadow-lg hover:shadow-primary/20 transition-all text-center"
              >
                {t("home.ctaPro")}
              </Link>
              <Link
                href="/consumer"
                className="w-full sm:w-auto px-8 py-4 bg-background border border-border font-bold rounded-sm text-lg hover:bg-surface transition-all text-center"
              >
                {t("home.ctaConsumer")}
              </Link>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-y border-border">
          {[
            { v: t("home.stat1V"), l: t("home.stat1L") },
            { v: t("home.stat2V"), l: t("home.stat2L") },
            { v: t("home.stat3V"), l: t("home.stat3L") },
            { v: t("home.stat4V"), l: t("home.stat4L") },
          ].map((s) => (
            <div key={s.l} className="p-8 border-r border-border last:border-r-0">
              <div className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{s.v}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{s.l}</p>
            </div>
          ))}
        </section>

        {/* Feature Grid — Plattformen */}
        <section className="py-24 px-6 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("home.platformLabel")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("home.platformTitle1")}{" "}
                <span className="text-primary italic">{t("home.platformTitle2")}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: t("home.feat1Title"),
                  body: t("home.feat1Body"),
                },
                {
                  num: "02",
                  title: t("home.feat2Title"),
                  body: t("home.feat2Body"),
                },
                {
                  num: "03",
                  title: t("home.feat3Title"),
                  body: t("home.feat3Body"),
                },
              ].map((f) => (
                <div
                  key={f.num}
                  className="p-8 border border-border hover:border-primary/30 transition-colors bg-background"
                >
                  <div className="font-mono text-xs text-primary mb-4">{f.num}</div>
                  <h3 className="font-display text-2xl font-bold mb-4">{f.title}</h3>
                  <p className="text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience Split */}
        <section className="grid md:grid-cols-2 min-h-[500px] border-b border-border">
          <Link
            href="/professional"
            className="relative p-12 md:p-20 flex flex-col justify-center bg-ink text-white group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("home.forCompany")}
              </p>
              <h2 className="font-display text-4xl font-bold mb-6">
                {t("home.runBusiness")}
              </h2>
              <p className="text-stone-400 text-lg mb-8 max-w-md">
                {t("home.runBusinessDesc")}
              </p>
              <span className="font-bold text-primary group-hover:translate-x-1 inline-block transition-transform">
                {t("home.seePro")}
              </span>
            </div>
          </Link>
          <Link
            href="/consumer"
            className="relative p-12 md:p-20 flex flex-col justify-center bg-background group"
          >
            <div className="relative z-10">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("home.forPrivate")}
              </p>
              <h2 className="font-display text-4xl font-bold mb-6">
                {t("home.hireHelp")}
              </h2>
              <p className="text-muted text-lg mb-8 max-w-md">
                {t("home.hireHelpDesc")}
              </p>
              <span className="font-bold text-foreground group-hover:translate-x-1 inline-block transition-transform">
                {t("home.seeConsumer")}
              </span>
            </div>
          </Link>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-surface text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {t("home.ctaTitle1")}{" "}
            <span className="text-primary italic">{t("home.ctaTitle2")}</span>
          </h2>
          <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
            {t("home.ctaSub")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm">
              {t("home.ctaPricing")}
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-border bg-background font-bold rounded-sm hover:bg-surface transition-colors">
              {t("home.ctaDemo")}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 max-w-4xl mx-auto border-t border-border">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight">
            {t("home.faqTitle")}
          </h2>
          <div className="divide-y divide-border">
            {[
              { q: t("home.faq1Q"), a: t("home.faq1A") },
              { q: t("home.faq2Q"), a: t("home.faq2A") },
              { q: t("home.faq3Q"), a: t("home.faq3A") },
              { q: t("home.faq4Q"), a: t("home.faq4A") },
              { q: t("home.faq5Q"), a: t("home.faq5A") },
              { q: t("home.faq6Q"), a: t("home.faq6A") },
              { q: t("home.faq7Q"), a: t("home.faq7A") },
              { q: t("home.faq8Q"), a: t("home.faq8A") },
              { q: t("home.faq9Q"), a: t("home.faq9A") },
              { q: t("home.faq10Q"), a: t("home.faq10A") },
              { q: t("home.faq11Q"), a: t("home.faq11A") },
              { q: t("home.faq12Q"), a: t("home.faq12A") },
              { q: t("home.faq13Q"), a: t("home.faq13A") },
            ].map((item) => (
              <details key={item.q} className="group py-6 cursor-pointer">
                <summary className="list-none flex justify-between items-center font-bold text-lg gap-4">
                  <span>{item.q}</span>
                  <span className="text-primary text-2xl group-open:rotate-45 transition-transform shrink-0">+</span>
                </summary>
                <p className="pt-4 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { hasHeader: false },
  };
};
