import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslation, Trans } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function ConsumerPage() {
  const { t } = useTranslation();

  const industries = [
    t("consumer.ind1"), t("consumer.ind2"), t("consumer.ind3"), t("consumer.ind4"),
    t("consumer.ind5"), t("consumer.ind6"), t("consumer.ind7"), t("consumer.ind8"),
    t("consumer.ind9"), t("consumer.ind10"), t("consumer.ind11"), t("consumer.ind12"),
  ];

  return (
    <>
      <Head>
        <title>{`TimeFlow — ${t("consumer.heroTitle1")} ${t("consumer.heroTitle2")}`}</title>
        <meta name="description" content={`${t("consumer.heroDesc1")} ${t("consumer.heroDesc2")}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-20 px-6 border-b border-border bg-surface">
          <div className="max-w-5xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4 animate-fade-up">{t("consumer.heroLabel")}</p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-8 animate-fade-up [animation-delay:100ms]">
              {t("consumer.heroTitle1")}<br />
              <span className="text-primary italic">{t("consumer.heroTitle2")}</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10 animate-fade-up [animation-delay:200ms]">
              <Trans
                i18nKey="consumer.heroDesc"
                defaults={`${t("consumer.heroDesc1")} <strong1>${t("consumer.heroDesc2")}</strong1> ${t("consumer.heroDesc3")} <strong2>${t("consumer.heroDesc4")}</strong2> ${t("consumer.heroDesc5")}`}
                components={{
                  strong1: <strong className="text-foreground" />,
                  strong2: <strong className="text-foreground" />,
                }}
              />
            </p>

            <div className="max-w-xl mx-auto bg-background border border-border rounded-md p-2 flex flex-col sm:flex-row gap-2 animate-fade-up [animation-delay:300ms]">
              <input type="text" placeholder={t("consumer.searchPlaceholder")} aria-label={t("consumer.searchPlaceholder")} className="flex-1 px-4 py-3 bg-transparent outline-none text-sm" />
              <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("consumer.searchBtn")}
              </button>
            </div>
            <p className="text-xs text-muted mt-4 font-mono">{t("consumer.searchNote")}</p>
          </div>
        </header>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.industriesLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{t("consumer.industriesTitle")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industries.map((ind) => (
                <a key={ind} href="#" className="p-6 border border-border hover:border-primary/30 hover:bg-surface transition-colors group">
                  <div className="font-display font-bold text-lg mb-2">{ind}</div>
                  <span className="text-xs text-primary group-hover:translate-x-1 inline-block transition-transform">{t("consumer.getQuote")}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-ink text-white">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.howLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{t("consumer.howTitle")}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { n: "01", t: t("consumer.how1T"), b: t("consumer.how1B") },
                { n: "02", t: t("consumer.how2T"), b: t("consumer.how2B") },
                { n: "03", t: t("consumer.how3T"), b: t("consumer.how3B") },
              ].map((s) => (
                <div key={s.n} className="border-t border-white/20 pt-6">
                  <div className="font-mono text-xs text-primary mb-4">{s.n}</div>
                  <h3 className="font-display text-2xl font-bold mb-3">{s.t}</h3>
                  <p className="text-stone-400 text-sm">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.trackLabel")}</p>
              <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">{t("consumer.trackTitle")}</h2>
              <p className="text-muted text-lg">{t("consumer.trackDesc")}</p>
            </div>
            <ul className="space-y-4">
              {[t("consumer.trackF1"), t("consumer.trackF2"), t("consumer.trackF3"), t("consumer.trackF4"), t("consumer.trackF5"), t("consumer.trackF6")].map((f) => (
                <li key={f} className="flex items-start gap-3 border-b border-border py-4 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs shrink-0 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("consumer.homeAppLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("consumer.homeAppTitle")} <span className="text-primary italic">{t("consumer.homeAppHighlight")}</span>
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">{t("consumer.homeAppDesc")}</p>
            <div className="flex justify-center gap-3">
              <button className="px-6 py-3 bg-foreground text-background font-bold rounded-sm cursor-pointer hover:bg-ink transition-colors">{t("common.appStore")}</button>
              <button className="px-6 py-3 bg-foreground text-background font-bold rounded-sm cursor-pointer hover:bg-ink transition-colors">{t("common.googlePlay")}</button>
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
