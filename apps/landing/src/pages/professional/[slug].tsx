import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { findModule, moduleSections, ModuleSection, ModuleItem } from "@/lib/modules";
import {
  moduleContent,
  ModuleRichContent,
  ModuleRichSection,
  ModuleRichCard,
  ModuleRichStep,
  ModuleRichPricing,
  ModulePriceObj,
} from "@/lib/module-content";

interface PageProps {
  slug: string;
  item: ModuleItem;
  section: ModuleSection;
  hasHeader?: boolean;
}

function formatModulePrice(price: string | ModulePriceObj | undefined, locale: string) {
  if (!price) return null;
  if (typeof price === "string") return price;

  const activeLocale = locale || "sv-SE";
  const currencyFormatter = new Intl.NumberFormat(activeLocale, {
    style: "currency",
    currency: price.currency ?? "SEK",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });

  const unitLabel =
    price.unit === "per_user"
      ? activeLocale.startsWith("da") ? "/bruger" : activeLocale.startsWith("sv") ? "/användare" : "/user"
      : price.unit === "per_month" || price.unit === "month"
        ? activeLocale.startsWith("da") ? "/md." : activeLocale.startsWith("sv") ? "/mån" : "/month"
        : price.unit === "per_scan"
          ? activeLocale.startsWith("da") ? "/scanning" : activeLocale.startsWith("sv") ? "/skanning" : "/scan"
          : "";

  return `${currencyFormatter.format(price.amount)}${unitLabel}`;
}

function formatPricingLine(pricing: ModuleRichPricing | undefined, locale: string) {
  if (!pricing?.price) return null;

  const trialDays = pricing.trialDays ?? 30;
  const planName = pricing.planName ?? "Start";
  const priceLabel = formatModulePrice(pricing.price, locale);

  if (locale.startsWith("da")) {
    return `${trialDays} dages prøveperiode — derefter ${planName} fra ${priceLabel}.`;
  }

  if (locale.startsWith("en")) {
    return `${trialDays}-day free trial — then ${planName} from ${priceLabel}.`;
  }

  return `${trialDays} dagars provperiod — därefter ${planName} från ${priceLabel}.`;
}

function CardView({ card }: { card: ModuleRichCard }) {
  const { i18n } = useTranslation("modulePages");
  const priceLabel = formatModulePrice(card.price, i18n.language || "sv-SE");

  return (
    <div className="p-5 border border-border bg-background flex flex-col h-full">
      {card.emoji && <span className="text-2xl mb-2">{card.emoji}</span>}
      {card.icon && <span className="text-2xl mb-2">{card.icon}</span>}
      <div className="flex items-center gap-2 font-bold mb-1">
        <span className="text-primary">→</span>
        {card.title && <span className="text-foreground">{card.title}</span>}
        {card.range && <span className="text-xs font-mono text-primary">{card.range}</span>}
        {priceLabel && <span className="text-xs font-mono text-primary">{priceLabel}</span>}
      </div>
      {card.desc && <p className="text-muted text-sm leading-relaxed">{card.desc}</p>}
      {Array.isArray(card.items) && (
        <ul className="mt-3 space-y-1.5">
          {card.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted">
              <span className="text-primary mt-0.5">→</span>
              <span>{typeof it === "string" ? it : it.title ?? it.desc}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RichItems({ items }: { items: Array<string | ModuleRichCard> }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((it, i) =>
        typeof it === "string" ? (
          <div key={i} className="p-4 border border-border bg-background flex items-center gap-3">
            <span className="text-primary">→</span>
            <span className="font-bold text-sm text-foreground">{it}</span>
          </div>
        ) : (
          <CardView key={i} card={it} />
        )
      )}
    </div>
  );
}

function RichSectionBlock({ section, index }: { section: ModuleRichSection; index: number }) {
  return (
    <section className={`py-24 px-6 border-b border-border ${index % 2 === 0 ? "bg-surface" : ""}`}>
      <div className="max-w-6xl mx-auto">
        {section.label && (
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{section.label}</p>
        )}
        {section.title && (
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {section.title}
          </h2>
        )}
        {section.intro && <p className="text-lg text-muted text-pretty mb-10 max-w-3xl">{section.intro}</p>}
        {section.text && <p className="text-lg text-muted text-pretty mb-10 max-w-3xl leading-relaxed">{section.text}</p>}
        {Array.isArray(section.items) && section.items.length > 0 && <RichItems items={section.items} />}
        {section.itemsHeading && (
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4 mt-8">{section.itemsHeading}</p>
        )}
        {Array.isArray(section.scoreLevels) && section.scoreLevels.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {section.scoreLevels.map((lvl, i) => (
              <div key={i} className="p-5 border border-border bg-background">
                <div className="flex items-center gap-2 font-bold mb-2">
                  {lvl.emoji && <span>{lvl.emoji}</span>}
                  {lvl.range && <span className="font-mono text-sm text-primary">{lvl.range}</span>}
                </div>
                {lvl.desc && <p className="text-muted text-sm leading-relaxed">{lvl.desc}</p>}
              </div>
            ))}
          </div>
        )}
        {section.factorsTitle && (
          <p className="font-display text-xl font-bold mb-4 mt-8">{section.factorsTitle}</p>
        )}
        {Array.isArray(section.factors) && section.factors.length > 0 && (
          <ul className="space-y-3">
            {section.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                <span className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary grid place-items-center text-xs shrink-0">✓</span>
                <span className="text-foreground">{f}</span>
              </li>
            ))}
          </ul>
        )}
        {Array.isArray(section.groups) && section.groups.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {section.groups.map((g, i) => (
              <div key={i} className="p-6 border border-border bg-background">
                {g.heading && <h3 className="font-display text-lg font-bold mb-3">{g.heading}</h3>}
                <RichItems items={g.items} />
              </div>
            ))}
          </div>
        )}
        {section.example && (
          <div className="mt-8 p-6 border border-border bg-background">
            <p className="text-muted text-sm leading-relaxed">
              {typeof section.example === "string" ? section.example : (
                <>
                  {section.example.label && <strong className="text-foreground">{section.example.label}: </strong>}
                  {section.example.text}
                </>
              )}
            </p>
          </div>
        )}
        {Array.isArray(section.cards) && section.cards.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {section.cards.map((c, i) => (
              typeof c === "string" ? (
                <div key={i} className="p-5 border border-border bg-background">
                  <span className="text-muted text-sm">{c}</span>
                </div>
              ) : (
                <CardView key={i} card={c} />
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Build translated rich content for a module slug.
 * Uses the modulePages i18n namespace; falls back to the hardcoded Swedish moduleContent.
 */
function useTranslatedContent(slug: string): ModuleRichContent | undefined {
  const { t, i18n } = useTranslation("modulePages");

  // Check if this namespace has content for the current language + slug
  const hasTranslation =
    i18n.exists(`${slug}.heroDesc`, { ns: "modulePages" }) ||
    i18n.exists(`${slug}.steps`, { ns: "modulePages" });

  if (!hasTranslation) {
    // Fall back to Swedish hardcoded content
    return moduleContent[slug];
  }

  // Pull the entire translated object for this slug
  const translated = t(slug, { returnObjects: true, ns: "modulePages" }) as
    | ModuleRichContent
    | string;

  // If t() returned a plain string (key not found), fall back
  if (typeof translated === "string") {
    return moduleContent[slug];
  }

  return translated;
}

export default function DynamicModulePage({ slug, item, section }: PageProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("modulePages");
  const rich = useTranslatedContent(slug);

  // Common UI strings from the modulePages namespace
  const tc = (key: string, fallback: string) =>
    t(`common.${key}`, { defaultValue: fallback, ns: "modulePages" });

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-background text-foreground font-body grid place-items-center">
        <p className="font-mono text-sm text-muted">{tc("loading", "Laddar modul...")}</p>
      </div>
    );
  }

  if (!item || !section) {
    return (
      <div className="min-h-screen bg-background text-foreground font-body flex flex-col justify-between">
        <Nav />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">404</p>
          <h1 className="font-display text-4xl font-bold mb-4">{tc("notFoundTitle", "Modulen hittades inte")}</h1>
          <p className="text-muted mb-8">{tc("notFoundDesc", "Kolla listan över alla moduler för hantverkare.")}</p>
          <Link href="/professional" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm inline-block">
            {tc("seeAllModules", "Se alla moduler")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const siblings = section.items.filter((i) => i.slug !== item.slug).slice(0, 6);
  const otherSections = moduleSections.filter((s) => s.section !== section.section);

  const heroDesc = rich?.heroDesc ?? item.long;
  const stepsData: { label?: string; title?: string; steps: ModuleRichStep[] } | null =
    rich?.steps ?? (item.steps && item.steps.length > 0
      ? {
        label: tc("stepsDefaultLabel", "Så fungerar det"),
        title: tc("stepsDefaultTitle", "Från förfrågan till färdigt projekt i enkla steg."),
        steps: item.steps.map((s): ModuleRichStep => ({ title: s.title, desc: s.desc })),
      }
      : null);
  const smart = rich?.smart ?? null;
  const featuresData = rich?.features ?? (item.features && item.features.length > 0
    ? { label: tc("featuresDefaultLabel", "Funktioner"), title: tc("featuresDefaultTitle", `Funktioner som förenklar hela ${item.name.toLowerCase()}flödet.`), items: item.features.map((f) => f) }
    : null);
  const integrationsData = rich?.integrations ?? (item.integrations && item.integrations.length > 0
    ? { label: tc("integrationsDefaultLabel", "Integrationer"), title: tc("integrationsDefaultTitle", "Integrerat med hela TimeFlow."), items: item.integrations }
    : null);
  const sections = rich?.sections ?? [];
  const summary = rich?.summary ?? null;
  const ctaTitle = rich?.ctaTitle ?? tc("ctaStart", `Redo att testa ${item.name}modulen?`);
  const localizedTitle = rich?.heroTitle ?? item.name;
  const localizedDescription = rich?.heroDesc ?? item.desc;
  const title = `${localizedTitle} — ${section.section} · TimeFlow`;
  const pricingLine = formatPricingLine(rich?.pricing, i18n.language || "sv-SE");

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={localizedDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={localizedDescription} />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        {/* Header */}
        <header className="pt-24 pb-20 px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <nav className="font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-muted">
              <Link href="/professional" className="hover:text-primary transition-colors">
                {tc("breadcrumb", "Hantverkare")}
              </Link>
              <span>/</span>
              <span className="text-primary">{section.section}</span>
              <span>/</span>
              <span>{item.name}</span>
            </nav>
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              {tc("moduleLabel", "Modul")} · {section.section}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-balance">
              {t("common.heroTitle", { name: item.name, defaultValue: `${item.name}modulen för hantverkare`, ns: "modulePages" }).split(item.name).map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="text-primary italic">{item.name}</span></span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-3xl text-pretty mb-8">
              {heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm text-center hover:opacity-90 transition-opacity"
              >
                {item.cta?.primary ?? tc("ctaPrimary", "Boka demo")}
              </Link>
              <a
                href="#steg"
                className="px-6 py-3 border border-border font-bold rounded-sm hover:bg-surface text-center transition-colors"
              >
                {item.cta?.secondary ?? tc("ctaSecondary", "Se hur det fungerar")}
              </a>
            </div>
          </div>
        </header>

        {/* Sub-hero description */}
        {rich?.subhero && (
          <section className="py-16 px-6 border-b border-border bg-surface">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg md:text-xl text-muted leading-relaxed">
                {rich.subhero}
              </p>
            </div>
          </section>
        )}

        {/* Extra highlight if available */}
        {item.extra && (
          <section className="py-8 px-6 border-b border-border bg-primary/10">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <span className="text-primary text-xl">★</span>
              <p className="text-sm font-medium text-foreground">{item.extra}</p>
            </div>
          </section>
        )}

        {/* Steps section */}
        {stepsData && stepsData.steps.length > 0 && (
          <section id="steg" className="py-24 px-6 border-b border-border">
            <div className="max-w-6xl mx-auto">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {stepsData.label ?? tc("stepsDefaultLabel", "Så fungerar det")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-16 tracking-tight">
                {stepsData.title ?? tc("stepsDefaultTitle", "Från förfrågan till färdigt projekt.")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {stepsData.steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="p-6 border border-border bg-background hover:border-primary transition-colors flex flex-col"
                  >
                    <div className="font-mono text-2xl text-primary font-bold mb-3">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                    {step.desc && <p className="text-muted text-sm leading-relaxed mb-4">{step.desc}</p>}
                    {Array.isArray(step.items) && step.items.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {step.items.map((it: string) => (
                          <li key={it} className="flex items-start gap-2 text-sm text-muted">
                            <span className="text-primary mt-0.5">→</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.note && (
                      <p className="text-sm text-muted border-t border-border pt-4 italic mt-auto">{step.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Smart features Section */}
        {smart && smart.features.length > 0 && (
          <section className="py-24 px-6 border-b border-border bg-surface">
            <div className="max-w-6xl mx-auto">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {smart.label ?? tc("smartDefaultLabel", "Smarta funktioner")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-16 tracking-tight">
                {smart.title ?? tc("smartDefaultTitle", "Automatisering som spar tid och minskar fel.")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {smart.features.map((f) => (
                  <div key={f.title} className="p-6 border border-border bg-background">
                    <div className="flex items-center gap-2 font-bold mb-3">
                      <span className="text-primary">→</span>
                      {f.title}
                    </div>
                    {f.desc && <p className="text-muted text-sm leading-relaxed">{f.desc}</p>}
                    {Array.isArray(f.bullets) && f.bullets.length > 0 && (
                      <ul className="space-y-2 mt-4">
                        {f.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm text-muted">
                            <span className="text-primary mt-0.5">→</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {featuresData && featuresData.items.length > 0 && (
          <section className="py-24 px-6 border-b border-border">
            <div className="max-w-6xl mx-auto">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {featuresData.label ?? tc("featuresDefaultLabel", "Funktioner")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-16 tracking-tight">
                {featuresData.title ?? tc("featuresDefaultTitle", "Vad du får med modulen.")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuresData.items.map((f, i) =>
                  typeof f === "string" ? (
                    <div key={f} className="p-6 border border-border bg-surface flex items-start gap-4">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary grid place-items-center text-xs shrink-0 mt-0.5">✓</span>
                      <h4 className="font-bold text-base text-foreground">{f}</h4>
                    </div>
                  ) : (
                    <div key={i} className="p-6 border border-border bg-surface">
                      <div className="flex items-center gap-2 font-bold mb-2">
                        <span className="text-primary">→</span>
                        {f.title}
                      </div>
                      {f.desc && <p className="text-muted text-sm leading-relaxed">{f.desc}</p>}
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* Integrations Section */}
        {integrationsData && integrationsData.items.length > 0 && (
          <section className="py-24 px-6 border-b border-border bg-surface">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
                  {integrationsData.label ?? tc("integrationsDefaultLabel", "Integrationer")}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                  {integrationsData.title ?? tc("integrationsDefaultTitle", "Integrerat med hela TimeFlow.")}
                </h2>
              </div>
              <ul className="md:col-span-2 space-y-3">
                {integrationsData.items.map((integration, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary grid place-items-center text-xs shrink-0">✓</span>
                    {typeof integration === "string" ? (
                      <span className="text-foreground">{integration}</span>
                    ) : (
                      <span className="text-foreground">
                        <strong>{integration.name ?? integration.title}</strong>
                        {integration.desc ? ` — ${integration.desc}` : ""}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Unique module sections */}
        {sections.map((s, i) => (
          <RichSectionBlock key={i} section={s} index={i} />
        ))}

        {pricingLine && (
          <section className="py-8 px-6 border-b border-border bg-primary/10">
            <div className="max-w-5xl mx-auto">
              <p className="text-sm font-medium text-foreground">{pricingLine}</p>
            </div>
          </section>
        )}

        {/* Summary */}
        {summary && (
          <section className="py-24 px-6 border-b border-border">
            <div className="max-w-4xl mx-auto text-center">
              {summary.label && (
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{summary.label}</p>
              )}
              {summary.title && (
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 tracking-tight">{summary.title}</h2>
              )}
              <p className="text-lg md:text-xl text-muted text-pretty leading-relaxed">{summary.text}</p>
            </div>
          </section>
        )}

        {/* Siblings / Recommendations */}
        {siblings.length > 0 && (
          <section className="py-16 px-6 border-b border-border bg-surface">
            <div className="max-w-5xl mx-auto">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
                {tc("moreModulesIn", "Fler moduler i")} {section.section}
              </p>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {siblings.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={s.href ?? `/professional/${s.slug}`}
                      className="block p-5 border border-border bg-background hover:border-primary hover:bg-surface transition-colors h-full"
                    >
                      <div className="font-bold mb-1 flex items-center gap-2 text-foreground">
                        <span className="text-primary">→</span>
                        {s.name}
                      </div>
                      <p className="text-muted text-sm leading-relaxed line-clamp-2">{s.desc}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Other Sections */}
        <section className="py-16 px-6 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">{tc("otherSections", "Övriga områden")}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {otherSections.map((s) => (
                <Link
                  key={s.section}
                  href="/professional"
                  className="block p-5 border border-border bg-background hover:border-primary hover:bg-surface transition-colors"
                >
                  <div className="font-display text-lg font-bold mb-1 text-foreground">{s.section}</div>
                  <p className="text-muted text-sm line-clamp-3">{s.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {ctaTitle}
            </h2>
            <p className="text-muted mb-8">
              {tc("ctaSubtitle", "30 dagars provperiod — därefter Start från 2 995 kr/mån.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity"
              >
                {tc("ctaStart", "Starta konto")}
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-border font-bold rounded-sm hover:bg-surface transition-colors"
              >
                {tc("ctaDemo", "Prova demo-konto")}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const existingStaticDirs = new Set([
    "smart-access", "avtal", "b2b", "kalkyl", "inkasso", "prognos", "projekt",
    "order", "kma", "material", "personal", "projektering", "inkop", "faktura",
    "juridik", "maskin", "marknad-salj", "data-it", "fordon", "erbjudande",
    "ledningsstod", "appwork", "cleaning_maintenance", "coating",
    "construction_concrete", "consultant_architect", "goods", "installations",
    "land_excavation", "special_company", "yes_fasad", "about-us", "book_a_demo",
    "comparison", "cookie", "faq", "howitworks", "kunskap", "newsroom",
    "offer", "on_demand_webinar", "pricing", "roi_calculator", "support",
    "system-overview", "terms", "vehicle", "webinar", "whytimeflow"
  ]);

  const paths: Array<{ params: { slug: string } }> = [];

  for (const s of moduleSections) {
    for (const item of s.items) {
      if (item.slug && !existingStaticDirs.has(item.slug.toLowerCase())) {
        paths.push({ params: { slug: item.slug } });
      }
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const result = findModule(slug);

  if (!result) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug,
      item: result.item,
      section: result.section,
      hasHeader: false,
    },
  };
};
