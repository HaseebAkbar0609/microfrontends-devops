import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t("contact.heroLabel")} — TimeFlow`}</title>
        <meta name="description" content={t("contact.heroTitle2")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-16 md:pt-20 pb-10 sm:pb-12 px-4 sm:px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("contact.heroLabel")}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
              {t("contact.heroTitle1")} <span className="text-primary italic">{t("contact.heroTitle2")}</span>
            </h1>
          </div>
        </header>

        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
            <form
              className="space-y-4 bg-background border border-border p-5 sm:p-8"
              onSubmit={(e) => { e.preventDefault(); alert(t("contact.thankYou")); }}
            >
              <div>
                <label htmlFor="contact-name" className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("contact.nameLabel")}</label>
                <input id="contact-name" required className="w-full h-11 px-4 border border-border bg-background outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="contact-company" className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("contact.companyLabel")}</label>
                <input id="contact-company" className="w-full h-11 px-4 border border-border bg-background outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("contact.emailLabel")}</label>
                <input id="contact-email" type="email" required className="w-full h-11 px-4 border border-border bg-background outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="contact-phone" className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("contact.phoneLabel")}</label>
                <input id="contact-phone" className="w-full h-11 px-4 border border-border bg-background outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="contact-subject" className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("contact.subjectLabel")}</label>
                <select id="contact-subject" className="w-full h-11 px-4 border border-border bg-background outline-none focus:border-primary">
                  <option>{t("contact.subjectOpt1")}</option>
                  <option>{t("contact.subjectOpt2")}</option>
                  <option>{t("contact.subjectOpt3")}</option>
                  <option>{t("contact.subjectOpt4")}</option>
                  <option>{t("contact.subjectOpt5")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">{t("contact.messageLabel")}</label>
                <textarea id="contact-message" rows={5} className="w-full p-4 border border-border bg-background outline-none focus:border-primary" />
              </div>
              <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                {t("contact.sendBtn")}
              </button>
            </form>

            <div className="space-y-8">
              <div>
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">{t("contact.addressLabel")}</p>
                <p className="font-bold">TimeFlow System AB</p>
                <p className="text-muted text-sm">Sveavägen 100<br />113 50 Stockholm</p>
              </div>
              <div>
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">{t("contact.salesLabel")}</p>
                <a href="mailto:hej@timeflowsystem.se" className="font-bold hover:text-primary">hej@timeflowsystem.se</a>
                <p className="text-muted text-sm">08-123 45 60</p>
              </div>
              <div>
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">{t("contact.supportLabel")}</p>
                <a href="mailto:support@timeflowsystem.se" className="font-bold hover:text-primary">support@timeflowsystem.se</a>
                <p className="text-muted text-sm">08-123 45 67</p>
              </div>
              <div className="border border-border p-6 bg-surface">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">{t("contact.demoLabel")}</p>
                <p className="text-sm text-muted mb-4">{t("contact.demoDesc")}</p>
                <button className="px-5 py-3 bg-foreground text-background font-bold rounded-sm text-sm cursor-pointer hover:bg-ink transition-colors">
                  {t("contact.findTime")}
                </button>
              </div>
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
