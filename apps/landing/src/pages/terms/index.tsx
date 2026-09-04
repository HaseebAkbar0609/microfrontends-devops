import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t("terms.heroTitle")} — TimeFlow`}</title>
        <meta name="description" content={t("terms.heroTitle")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-10 sm:pb-12 px-4 sm:px-6 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("terms.heroLabel")}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {t("terms.heroTitle")}
            </h1>
            <p className="text-muted text-sm sm:text-base">
              {t("terms.heroDesc1")} <strong className="text-foreground">{t("terms.termsPrivate")}</strong>,{" "}
              <strong className="text-foreground">{t("terms.termsBusiness")}</strong>,{" "}
              <strong className="text-foreground">{t("terms.cookiesWord")}</strong>{" "}
              {t("terms.heroConj")} <strong className="text-foreground">{t("terms.privacy")}</strong>{t("terms.heroDesc2")}
            </p>
            <nav className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-mono">
              <a href="#privat" className="text-primary hover:underline">{t("terms.navPrivate")}</a>
              <a href="#hantverkare" className="text-primary hover:underline">{t("terms.navBusiness")}</a>
              <a href="#cookies" className="text-primary hover:underline">{t("terms.navCookies")}</a>
              <a href="#integritet" className="text-primary hover:underline">{t("terms.navPrivacy")}</a>
            </nav>
          </div>
        </header>

        <article className="py-12 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-12 sm:space-y-16 text-muted leading-relaxed">
          <section id="privat">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s1Title")}</h2>
            <p className="mb-3">{t("terms.s1P1")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H1")}</h3>
            <p>{t("terms.s1H1P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H2")}</h3>
            <p>{t("terms.s1H2P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H3")}</h3>
            <p>{t("terms.s1H3P")}</p>
          </section>

          <section id="hantverkare">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s2Title")}</h2>
            <p className="mb-3">{t("terms.s2P1")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H1")}</h3>
            <p>{t("terms.s2H1P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H2")}</h3>
            <p>{t("terms.s2H2P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H3")}</h3>
            <p>{t("terms.s2H3P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H4")}</h3>
            <p>{t("terms.s2H4P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H5")}</h3>
            <p>{t("terms.s2H5P")}</p>
          </section>

          <section id="cookies">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s3Title")}</h2>
            <p className="mb-3">{t("terms.s3P1")}</p>
            <p>{t("terms.s3P2")}</p>
          </section>

          <section id="integritet">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s4Title")}</h2>
            <p className="mb-3">{t("terms.s4P1")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s4H1")}</h3>
            <p>{t("terms.s4H1P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s4H2")}</h3>
            <p>{t("terms.s4H2P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s4H3")}</h3>
            <p>{t("terms.s4H3P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s4H4")}</h3>
            <p>{t("terms.s4H4P")}</p>
          </section>
        </article>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { hasHeader: false } };
};