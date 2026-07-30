import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  const activeLocale = i18n.language || "sv";
  const docPath = `/content/terms/${activeLocale}.md`;

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
              {t("terms.heroDesc1")} <strong className="text-foreground">{t("terms.termsOfUse")}</strong>,{" "}
              <strong className="text-foreground">{t("terms.privacy")}</strong> {" "}
              <strong className="text-foreground">{t("terms.cookiesWord")}</strong>{t("terms.heroDesc2")}
            </p>
            <nav className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm font-mono">
              <a href="#anvandarvillkor" className="text-primary hover:underline">{t("terms.navTerms")}</a>
              <a href="#integritet" className="text-primary hover:underline">{t("terms.navPrivacy")}</a>
              <a href="#cookies" className="text-primary hover:underline">{t("terms.navCookies")}</a>
            </nav>
          </div>
        </header>

        <article data-doc-path={docPath} className="py-12 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-12 sm:space-y-16 text-muted leading-relaxed">
          <section id="anvandarvillkor">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s1Title")}</h2>
            <p className="mb-3">{t("terms.s1P1")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H1")}</h3>
            <p>{t("terms.s1H1P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H2")}</h3>
            <p>{t("terms.s1H2P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H3")}</h3>
            <p>{t("terms.s1H3P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s1H4")}</h3>
            <p>{t("terms.s1H4P")}</p>
          </section>

          <section id="integritet">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s2Title")}</h2>
            <p className="mb-3">{t("terms.s2P1")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H1")}</h3>
            <p>{t("terms.s2H1P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H2")}</h3>
            <p>{t("terms.s2H2P")}</p>
            <h3 className="font-bold text-foreground mt-6 mb-2">{t("terms.s2H3")}</h3>
            <p>{t("terms.s2H3P")}</p>
          </section>

          <section id="cookies">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t("terms.s3Title")}</h2>
            <p className="mb-3">{t("terms.s3P1")}</p>
            <p>{t("terms.s3P2")}</p>
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
