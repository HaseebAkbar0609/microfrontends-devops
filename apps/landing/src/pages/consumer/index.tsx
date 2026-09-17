import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CUSTOMER_CREATE_OFFER_URL } from "@/utils/constants";

const projectCategories = [
  { icon: "🏠", titleKey: "cat1Title", itemsKey: "cat1Items" },
  { icon: "⚡", titleKey: "cat2Title", itemsKey: "cat2Items" },
  { icon: "🚿", titleKey: "cat3Title", itemsKey: "cat3Items" },
  { icon: "🎨", titleKey: "cat4Title", itemsKey: "cat4Items" },
  { icon: "🌳", titleKey: "cat5Title", itemsKey: "cat5Items" },
  { icon: "✨", titleKey: "cat6Title", itemsKey: "cat6Items" },
];

const steps = [
  { n: "01", titleKey: "step1T", bodyKey: "step1B" },
  { n: "02", titleKey: "step2T", bodyKey: "step2B" },
  { n: "03", titleKey: "step3T", bodyKey: "step3B" },
  { n: "04", titleKey: "step4T", bodyKey: "step4B" },
];

export default function ConsumerPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const url = query.trim() ? `${CUSTOMER_CREATE_OFFER_URL}?q=${encodeURIComponent(query.trim())}` : CUSTOMER_CREATE_OFFER_URL;
    window.location.href = url;
  };

  return (
    <>
      <Head>
        <title>{t("seo.consumerTitle")}</title>
        <meta name="description" content={t("seo.consumerDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.consumerOgTitle")} />
        <meta property="og:description" content={t("seo.consumerOgDesc")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-20 px-6 border-b border-border bg-surface">
          <div className="max-w-5xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.heroLabel")}</p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-8">
              {t("consumer.heroFind1")} <span className="text-primary italic">{t("consumer.heroFind2")}</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
              {t("consumer.heroDescA")} <strong className="text-foreground">{t("consumer.heroDescB")}</strong>{" "}
              {t("consumer.heroDescC")} <strong className="text-foreground">{t("consumer.heroDescD")}</strong> {t("consumer.heroDescE")}
            </p>

            <form className="max-w-xl mx-auto bg-background border border-border rounded-md p-2 flex flex-col sm:flex-row gap-2" onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("consumer.searchPlaceholderFull")}
                aria-label={t("consumer.searchPlaceholderFull")}
                className="flex-1 px-4 py-3 bg-transparent outline-none text-sm"
              />
              <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("consumer.searchBtn")}
              </button>
            </form>
            <p className="text-xs text-muted mt-4 font-mono">{t("consumer.searchNoteFull")}</p>
          </div>
        </header>

        {/* How it works */}
        <section className="py-24 px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.howLabel")}</p>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
                {t("consumer.howTitle1")} <span className="text-primary italic">{t("consumer.howTitle2")}</span>
                <br />
                {t("consumer.howTitle3")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
              {steps.map((s) => (
                <div key={s.n} className="bg-background p-8 flex flex-col">
                  <div className="font-display text-5xl font-extrabold text-primary mb-6">{s.n}</div>
                  <h3 className="font-display text-xl font-bold mb-3">{t(`consumer.${s.titleKey}`)}</h3>
                  <p className="text-muted text-sm">{t(`consumer.${s.bodyKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TimeFlow Home value */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.homeLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("consumer.homeTitle1")} <span className="text-primary italic">{t("consumer.homeTitle2")}</span>
              </h2>
              <p className="text-muted text-lg mb-4">
                {t("consumer.homeDescA")} <strong className="text-foreground">{t("consumer.homeDescB")}</strong>
              </p>
              <p className="text-muted">{t("consumer.homeDescC")}</p>
            </div>
            <ul className="space-y-4 text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-start gap-3 border-b border-border py-3">
                  <span className="text-xl">{["📱", "💬", "📋", "📸", "🧾"][i - 1]}</span>
                  <span>{t(`consumer.homeFeat${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Project categories */}
        <section className="py-20 px-6 bg-surface border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.popularLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("consumer.popularTitle")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectCategories.map((cat) => (
                <div key={cat.titleKey} className="p-6 bg-background border border-border">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-display font-bold text-lg mb-4">{t(`consumer.${cat.titleKey}`)}</h3>
                  <ul className="space-y-2 text-sm">
                    {(t(`consumer.${cat.itemsKey}`, { returnObjects: true }) as string[]).map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="text-primary">→</span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business management system */}
        <section className="pt-16 pb-16 px-6 text-center border-b ">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              {t("consumer.businessManagementLabel")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tigh ">
              {t("consumer.businessManagementTitle")}{" "}
              <span className="text-primary italic">
                {t("consumer.businessManagementTitle2")}
              </span> 
            </h2>
          </div>
        </section>

        {/* Full control */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.controlLabel")}</p>
              <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">
                {t("consumer.controlTitle1")} <span className="text-primary italic">{t("consumer.controlTitle2")}</span>
              </h2>
              <p className="text-muted text-lg">{t("consumer.controlDesc")}</p>
            </div>
            <ul className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <li key={i} className="flex items-start gap-3 border-b border-border py-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs shrink-0 mt-0.5">✓</span>
                  {t(`consumer.controlF${i}`)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Trust */}
        <section className="py-24 px-6 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.trustLabel")}</p>
              <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">
                {t("consumer.trustTitle")}
              </h2>
            </div>
            <ul className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i} className="flex items-start gap-3 border-b border-border py-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs shrink-0 mt-0.5">✓</span>
                  {t(`consumer.trustF${i}`)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-20 px-6 text-center bg-ink text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("consumer.finalCtaTitle")}</h2>
          <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
            {t("consumer.finalCtaDesc")}
          </p>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all text-center"
          >
            {t("consumer.searchBtn")}
          </button>
        </section>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { hasHeader: false } };
};
