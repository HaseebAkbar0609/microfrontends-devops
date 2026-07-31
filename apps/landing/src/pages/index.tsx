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
        <title>{`TimeFlow — ${t("home.heroTitle")}`}</title>
        <meta name="description" content={t("home.heroSub")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`TimeFlow — ${t("home.heroTitle")}`} />
        <meta property="og:description" content={t("home.heroSub")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        {/* Hero */}
        <header className="pt-20 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t("home.badge")}
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-8 animate-fade-up [animation-delay:100ms]">
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto text-pretty mb-4 animate-fade-up [animation-delay:200ms]">
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

        {/* Trust bar */}
        <section className="py-12 border-y border-border bg-surface/50">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] uppercase tracking-[0.2em] font-mono text-muted mb-8">
              {t("home.trustTitle")}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
              <span className="font-display font-black text-xl">NORDIC BUILD</span>
              <span className="h-10 w-20 border-2 border-stone-400 grid place-items-center text-xs font-bold">
                ID06
              </span>
              <span className="font-display font-black text-xl">VÄST-EL</span>
              <span className="font-display font-black text-xl">STHLM RÖR</span>
              <span className="font-display font-black text-xl">CITY STÄD</span>
              <span className="font-display font-black text-xl">NORD VENT</span>
            </div>
          </div>
        </section>

        {/* Explainer video */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("home.videoLabel")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
                {t("home.videoTitle")}
              </h2>
            </div>
            <div className="relative aspect-video bg-ink rounded-md overflow-hidden border border-border group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-ink to-stone-900" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary grid place-items-center group-hover:scale-110 transition-transform shadow-2xl shadow-primary/40">
                    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 sm:w-8 sm:h-8 ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-white/80 font-mono text-xs uppercase tracking-widest">
                    {t("home.videoPlay")}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                {t("home.videoLive")}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("home.platformLabel")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                {t("home.platformTitle")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: "01", title: t("home.feat1Title"), body: t("home.feat1Body") },
                { num: "02", title: t("home.feat2Title"), body: t("home.feat2Body") },
                { num: "03", title: t("home.feat3Title"), body: t("home.feat3Body") },
              ].map((f) => (
                <div key={f.num} className="p-6 sm:p-8 border border-border hover:border-primary/30 transition-colors bg-background">
                  <div className="font-mono text-xs text-primary mb-4">{f.num}</div>
                  <h3 className="font-display text-2xl font-bold mb-4">{f.title}</h3>
                  <p className="text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience Split */}
        <section className="grid md:grid-cols-2 min-h-[450px] border-y border-border">
          <Link href="/professional" className="relative p-8 sm:p-12 md:p-20 flex flex-col justify-center bg-ink text-white group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("home.forCompany")}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">{t("home.runBusiness")}</h2>
              <p className="text-stone-400 text-base sm:text-lg mb-8 max-w-md">{t("home.runBusinessDesc")}</p>
              <span className="font-bold text-primary group-hover:translate-x-1 inline-block transition-transform">{t("home.seePro")}</span>
            </div>
          </Link>
          <Link href="/consumer" className="relative p-8 sm:p-12 md:p-20 flex flex-col justify-center bg-background group">
            <div className="relative z-10">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("home.forPrivate")}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">{t("home.hireHelp")}</h2>
              <p className="text-muted text-base sm:text-lg mb-8 max-w-md">{t("home.hireHelpDesc")}</p>
              <span className="font-bold text-foreground group-hover:translate-x-1 inline-block transition-transform">{t("home.seeConsumer")}</span>
            </div>
          </Link>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 tracking-tight">
              {t("home.stepsTitle")}
            </h2>
            <div className="space-y-8 sm:space-y-12">
              {[
                { n: "1", title: t("home.step1Title"), body: t("home.step1Body") },
                { n: "2", title: t("home.step2Title"), body: t("home.step2Body") },
                { n: "3", title: t("home.step3Title"), body: t("home.step3Body") },
              ].map((s, i) => (
                <div key={s.n} className="flex gap-4 sm:gap-8">
                  <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 font-bold flex items-center justify-center rounded-sm ${i === 2 ? "bg-primary text-white" : "bg-foreground text-background"
                    }`}>
                    {s.n}
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2">{s.title}</h4>
                    <p className="text-muted text-sm sm:text-base">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
            ].map((item) => (
              <details key={item.q} className="group py-6 cursor-pointer">
                <summary className="list-none flex justify-between items-center font-bold text-lg">
                  {item.q}
                  <span className="text-primary text-2xl group-open:rotate-45 transition-transform">+</span>
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
    props: {
      hasHeader: false,
    },
  };
};
