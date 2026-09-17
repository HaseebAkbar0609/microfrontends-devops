import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { moduleSections as sections } from "@/lib/modules";
import { CALENDLY_DEMO_URL } from "@/utils/constants";

export default function ProfessionalPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalTitle")}</title>
        <meta name="description" content={t("seo.professionalDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalOgTitle")} />
        <meta property="og:description" content={t("seo.professionalOgDesc")} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-16 px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-8">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                  {t("professional.heroLabel")}
                </p>
                <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
                  {t("professional.heroTitle1")}{" "}
                  <span className="text-primary italic">{t("professional.heroTitle2")}</span>
                  {t("professional.heroTitle3")}
                </h1>
              </div>
              <div className="md:col-span-4">
                <p className="text-lg text-muted text-pretty mb-6">
                  {t("professional.heroDesc")}
                  <strong className="text-foreground"> {t("professional.heroSaving")}</strong>{" "}
                  {t("professional.heroSavingSuffix")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register?type=business" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm text-center">{t("professional.startAccount")}</Link>
                  <a href={CALENDLY_DEMO_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-border font-bold rounded-sm hover:bg-surface text-center">{t("professional.tryDemo")}</a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
          {[
            { v: "professional.stat1V", l: "professional.stat1L" },
            { v: "professional.stat2V", l: "professional.stat2L" },
            { v: "professional.stat3V", l: "professional.stat3L" },
            { v: "professional.stat4V", l: "professional.stat4L" },
          ].map((s) => (
            <div key={s.l} className="p-8 border-r border-border last:border-r-0">
              <div className="font-display text-4xl font-extrabold tracking-tight">{t(s.v)}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{t(s.l)}</p>
            </div>
          ))}
        </section>

        {/* Sections */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("professional.areasLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("professional.areasTitle")}
              </h2>
              <p className="text-muted mt-4">
                {t("professional.areasDesc")}{" "}
                <strong className="text-foreground">TimeFlow Work</strong>{" "}
                {t("professional.workTag")} &{" "}
                <strong className="text-foreground">TimeFlow Manager</strong>{" "}
                {t("professional.managerTag")}
              </p>
            </div>

            <div className="space-y-4">
              {sections.map((m, i) => (
                <details
                  key={m.section}
                  className="group border border-border bg-background overflow-hidden"
                >
                  <summary className="list-none cursor-pointer p-6 md:p-8 bg-surface flex items-start justify-between gap-6 hover:bg-surface/70 transition-colors">
                    <div>
                      <div className="font-mono text-xs text-primary mb-2">0{i + 1} / 04</div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">{t(`modules.sections.${i + 1}.title`)}</h3>
                      <p className="text-muted mt-3 max-w-2xl">{t(`modules.sections.${i + 1}.desc`)}</p>
                    </div>
                    <span className="text-primary text-3xl group-open:rotate-45 transition-transform shrink-0 leading-none">+</span>
                  </summary>
                  <ul className="divide-y divide-border">
                    {m.items.map((it) => (
                      <li key={it.name} className="p-6 hover:bg-surface/50 transition-colors">
                        <div className="flex items-center gap-2 font-bold mb-2">
                          <span className="text-primary">→</span>{t(`modules.items.${it.slug}.name`)}
                        </div>
                        <p className="text-muted text-sm pl-5 mb-2 leading-relaxed">{t(`modules.items.${it.slug}.desc`)}</p>
                        {it.extra && (
                          <p className="pl-5 text-xs text-primary italic mb-2">★ {t(`modules.items.${it.slug}.extra`)}</p>
                        )}
                        <div className="pl-5">
                          {it.href ? (
                            <Link
                              href={it.href}
                              className="text-xs font-mono text-primary hover:underline"
                            >
                              {t("modules.readMore")} →
                            </Link>
                          ) : (
                            <Link
                              href={`/professional/${it.slug}`}
                              className="text-xs font-mono text-primary hover:underline"
                            >
                              {t("modules.readMore")} →
                            </Link>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Professional business management system*/}
        <section className="pt-16 pb-16 px-6 text-center border-t">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              {t("professional.professionalBusinessLabel")} 
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tigh ">
              {t("professional.professionalBusinessTitle")}{" "}
              <span className="text-primary italic">
                {t("professional.professionalBusinessTitle2")}
              </span> 
            </h2>
          </div>
        </section>


        {/* App promo */}
        <section className="bg-ink text-white py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {t("professional.appLabel")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {t("professional.appTitle")}
              </h2>
              <p className="text-stone-400 text-lg mb-8 max-w-md">
                {t("professional.appDesc")}
              </p>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "professional.appFeat1",
                  "professional.appFeat2",
                  "professional.appFeat3",
                  "professional.appFeat4",
                  "professional.appFeat5",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary grid place-items-center text-xs">✓</span>
                    {t(p)}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button className="px-5 py-3 bg-white text-ink font-bold rounded-sm text-sm cursor-pointer hover:bg-stone-200 transition-colors">{t("common.appStore")}</button>
                <button className="px-5 py-3 bg-white text-ink font-bold rounded-sm text-sm cursor-pointer hover:bg-stone-200 transition-colors">{t("common.googlePlay")}</button>
              </div>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-stone-800 via-stone-900 to-ink rounded-md border border-white/10 grid place-items-center">
              <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">{t("professional.appPreview")}</span>
            </div>
          </div>
        </section>

        {/* ROI / CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("professional.roiLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("professional.roiTitle")}
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              {t("professional.roiDesc")}
            </p>
            <Link href="/pricing#kalkylator" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm text-lg inline-block">
              {t("professional.roiCta")}
            </Link>
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
