import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function ProfessionalPage() {
  const { t } = useTranslation();

  const sections = [
    { section: t("professional.sec1"), desc: t("professional.sec1Desc"), items: [
      { name: t("professional.featOffer"), desc: t("professional.sec1Desc") }, { name: t("professional.featB2B"), desc: "" }, { name: t("professional.featCRM"), desc: "" },
      { name: t("professional.featDeal"), desc: "" }, { name: t("professional.featMyPages"), desc: "" }, { name: t("professional.featCalc"), desc: "" }, { name: t("professional.featSalesSupport"), desc: "" },
    ]},
    { section: t("professional.sec2"), desc: t("professional.sec2Desc"), items: [
      { name: t("professional.featOrder"), desc: "" }, { name: t("professional.featProject"), desc: "" }, { name: t("professional.featPlanning"), desc: "" }, { name: t("professional.featKMA"), desc: "" },
      { name: t("professional.featMachineVehicle"), desc: "" }, { name: t("professional.featAccess"), desc: "" }, { name: t("professional.featMaterialStock"), desc: "" },
      { name: t("professional.featScheduling"), desc: "" }, { name: t("professional.featID06"), desc: "" }, { name: t("professional.featTimeFlowApps"), desc: "" },
    ]},
    { section: t("professional.sec3"), desc: t("professional.sec3Desc"), items: [
      { name: t("professional.featTimeReporting"), desc: "" }, { name: t("professional.featInvoicing"), desc: "" }, { name: t("professional.featSalary"), desc: "" },
      { name: t("professional.featAutoEconomy"), desc: "" }, { name: t("professional.featScan"), desc: "" }, { name: t("professional.featLedger"), desc: "" }, { name: t("professional.featCollection"), desc: "" },
    ]},
    { section: t("professional.sec4"), desc: t("professional.sec4Desc"), items: [
      { name: t("professional.featAgreement"), desc: "" }, { name: t("professional.featLegal"), desc: "" }, { name: t("professional.featTemplates"), desc: "" },
      { name: t("professional.featHR"), desc: "" }, { name: t("professional.featMarketing"), desc: "" }, { name: t("professional.featDataIT"), desc: "" }, { name: t("professional.featSupportOnboard"), desc: "" },
    ]},
  ];

  return (
    <>
      <Head>
        <title>{`TimeFlow — ${t("professional.heroTitle1")} ${t("professional.heroTitle2")}`}</title>
        <meta name="description" content={t("professional.heroDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <header className="pt-20 pb-16 px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-8">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4 animate-fade-up">
                  {t("professional.heroLabel")}
                </p>
                <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance animate-fade-up [animation-delay:100ms]">
                  {t("professional.heroTitle1")} <span className="text-primary italic">{t("professional.heroTitle2")}</span>{t("professional.heroTitle3")}
                </h1>
              </div>
              <div className="md:col-span-4 animate-fade-up [animation-delay:200ms]">
                <p className="text-lg text-muted text-pretty mb-6">
                  {t("professional.heroDesc")}
                  <strong className="text-foreground"> {t("professional.heroSaving")}</strong> {t("professional.heroSavingSuffix")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
                    {t("professional.trialBtn")}
                  </button>
                  <button className="px-6 py-3 border border-border font-bold rounded-sm hover:bg-surface transition-all cursor-pointer">
                    {t("professional.demoBtn")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
          {[
            { v: t("professional.stat1V"), l: t("professional.stat1L") },
            { v: t("professional.stat2V"), l: t("professional.stat2L") },
            { v: t("professional.stat3V"), l: t("professional.stat3L") },
            { v: t("professional.stat4V"), l: t("professional.stat4L") },
          ].map((s) => (
            <div key={s.l} className="p-8 border-r border-border last:border-r-0">
              <div className="font-display text-4xl font-extrabold tracking-tight">{s.v}</div>
              <p className="text-xs text-muted uppercase tracking-widest mt-2">{s.l}</p>
            </div>
          ))}
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("professional.areasLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t("professional.areasTitle")}
              </h2>
              <p className="text-muted mt-4">
                {t("professional.areasDesc")}{" "}
                <strong className="text-foreground">TimeFlow Work</strong> &{" "}
                <strong className="text-foreground">TimeFlow Manager</strong> {t("professional.areasDescSuffix")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((m, i) => (
                <div key={m.section} className="p-8 border border-border bg-background hover:border-primary/30 transition-colors flex flex-col">
                  <div className="font-mono text-xs text-primary mb-4">0{i + 1} / 0{sections.length}</div>
                  <h3 className="font-display text-2xl font-bold mb-3 uppercase tracking-tight">{m.section}</h3>
                  <p className="text-muted mb-6">{m.desc}</p>
                  <ul className="space-y-4 text-sm">
                    {m.items.map((it: { name: string; desc?: string }) => (
                      <li key={it.name} className="border-b border-border pb-3 last:border-b-0">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <span className="text-primary">→</span>{it.name}
                        </div>
                        {it.desc && <p className="text-muted text-xs pl-5 mb-2">{it.desc}</p>}
                        <div className="pl-5 flex gap-3 text-xs font-mono">
                          <a href="#" className="text-primary hover:underline">{t("professional.seeFunction")}</a>
                          <span className="text-stone-300">·</span>
                          <a href="#" className="text-primary hover:underline">{t("professional.seeVideo")}</a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink text-white py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("professional.appLabel")}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("professional.appTitle")}</h2>
              <p className="text-stone-400 text-lg mb-8 max-w-md">{t("professional.appDesc")}</p>
              <ul className="space-y-3 mb-8 text-sm">
                {[t("professional.appFeat1"), t("professional.appFeat2"), t("professional.appFeat3"), t("professional.appFeat4"), t("professional.appFeat5")].map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary grid place-items-center text-xs">✓</span>{p}
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

        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{t("professional.roiLabel")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t("professional.roiTitle")}</h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">{t("professional.roiDesc")}</p>
            <Link href="/pricing#kalkylator" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm text-lg inline-block hover:shadow-lg hover:shadow-primary/20 transition-all">
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
