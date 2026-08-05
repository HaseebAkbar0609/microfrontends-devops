import { Fragment } from "react";
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

function CardView({ card }: { card: ModuleRichCard }) {
  const { i18n } = useTranslation("modulePages");
  const priceLabel = formatModulePrice(card.price, i18n.language || "sv-SE");

  // Tillval-style pricing card (e.g. Kalkyl — Calculation PRO / QuickAICalc™)
  if (card.name || (Array.isArray(card.groups) && card.groups.length > 0)) {
    return (
      <div className="p-6 border border-border bg-surface flex flex-col">
        {card.name && (
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">{card.name}</p>
        )}
        {card.title && <h3 className="font-display text-2xl font-bold mb-2">{card.title}</h3>}
        {priceLabel && <p className="text-muted mb-4">{priceLabel}</p>}
        {card.desc && <p className="text-sm text-muted mb-6 leading-relaxed">{card.desc}</p>}
        {Array.isArray(card.items) && (
          <ul className="space-y-2 text-sm mt-auto">
            {card.items.map((it, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">→</span>
                <span>{typeof it === "string" ? it : it.title ?? it.desc}</span>
              </li>
            ))}
          </ul>
        )}
        {Array.isArray(card.groups) && card.groups.length > 0 && (
          <div className="mt-auto space-y-4">
            {card.groups.map((g, gi) => (
              <div key={gi}>
                {g.label && (
                  <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">{g.label}</p>
                )}
                <ul className={`text-sm ${g.items.length <= 4 ? "grid grid-cols-2 gap-2" : "space-y-1"}`}>
                  {g.items.map((it, ii) => (
                    <li key={ii} className="flex items-center gap-2">
                      <span className="text-primary">→</span>
                      <span>{typeof it === "string" ? it : it.title ?? it.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

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

function hasScoreKeywords(section: ModuleRichSection): boolean {
  const fields = [section.label, section.title, section.factorsTitle, section.itemsHeading, section.intro];
  return fields.some((f) => f && (/Health Score/i.test(f) || /Poängen/i.test(f)));
}

function isScoreLevelString(item: any): boolean {
  return typeof item === "string" && /^[\u{1F300}-\u{1F9FF}🟢🟡🔴]/u.test(item.trim());
}

function parseScoreCard(item: ModuleRichCard | string): ModuleRichCard {
  if (typeof item !== "string") return item;
  const match = item.match(/^(\S+)\s+([\d–-]+)\s*[—–-]\s*(.*)$/u) || item.match(/^(\S+)\s*(.*)$/u);
  if (match) {
    if (match.length >= 4) {
      return { emoji: match[1], range: match[2], desc: match[3] };
    } else {
      return { title: match[1], desc: match[2] };
    }
  }
  return { title: item };
}

/** Health Score sections ("… Health Score™") render emoji/range cards like the reference site. */
function isScoreSection(section: ModuleRichSection): boolean {
  if (hasScoreKeywords(section)) return true;
  if (section.label === "Färgkodning" || section.title === "Färgkodning") return true;
  if (Array.isArray(section.scoreLevels) && section.scoreLevels.length > 0) return true;
  if (
    Array.isArray(section.items) &&
    (section.items.some(isScoreLevelString) ||
      section.items.some((it) => typeof it === "object" && it !== null && (it as any).title && /[\d–-]+/.test((it as any).title)))
  )
    return true;
  if (isFactorsOnlySection(section)) return true;
  return false;
}

function isTimeFlowWorkSection(section: ModuleRichSection): boolean {
  if (!section.label) return false;
  return /timeflow work/i.test(section.label);
}

/** "Fördelar för hantverkaren" / "…företagsfördelar" sections render as numbered benefit cards. */
function isBenefitsSection(section: ModuleRichSection): boolean {
  if (!section.title) return false;
  if (section.label === "Fördelar för hantverkaren") return true;
  return !!(section.label && /fördelar/i.test(section.label));
}

/** Label-only or score factor sections with string items (e.g. "Poängen baseras bland annat på") render as heading + chips. */
function isFactorsOnlySection(section: ModuleRichSection): boolean {
  if (Array.isArray(section.scoreLevels) && section.scoreLevels.length > 0) return false;
  if (section.intro) return false;

  const hasStringItems =
    Array.isArray(section.items) &&
    section.items.length > 0 &&
    section.items.every((it) => typeof it === "string");
  if (!hasStringItems) return false;

  if (section.items?.some(isScoreLevelString)) return false;

  return !section.title || section.title === section.label;
}

function ScoreCardView({ card, highlight }: { card: ModuleRichCard; highlight?: boolean }) {
  let emoji = card.emoji ?? "";
  let range = card.range ?? "";
  if (!range && card.title) {
    const chars = Array.from(card.title);
    if (chars.length > 0 && /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u.test(chars[0])) {
      emoji = chars[0];
      range = chars.slice(1).join("").trim();
    } else {
      range = card.title;
    }
  }
  return (
    <div className="p-6 border border-border bg-background">
      {emoji && <div className="text-2xl mb-2">{emoji}</div>}
      {range && <div className={`font-mono font-bold mb-2 ${highlight ? "text-primary" : ""}`}>{range}</div>}
      {card.desc && <p className="text-sm text-muted">{card.desc}</p>}
    </div>
  );
}

function FactorChips({ items }: { items: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((f, i) => (
        <div key={i} className="p-3 border border-border bg-background flex items-center gap-2 text-sm">
          <span className="text-primary">→</span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}

function RichSectionContent({ section }: { section: ModuleRichSection }) {
  const score = isScoreSection(section);
  const benefits = isBenefitsSection(section);
  const factorsOnly = isFactorsOnlySection(section);

  const scoreLevelsPresent =
    score && Array.isArray(section.scoreLevels) && section.scoreLevels.length > 0;
  const scoreItems: ModuleRichCard[] = scoreLevelsPresent
    ? section.scoreLevels ?? []
    : (section.items ?? [])
        .filter((it) => typeof it !== "string" || isScoreLevelString(it))
        .map(parseScoreCard);
  const chipsHeading = section.factorsTitle ?? section.itemsHeading;
  const chips =
    score && (section.factors ?? []).length > 0
      ? section.factors ?? []
      : section.items && section.items.every((it) => typeof it === "string") && !factorsOnly && !section.items.some(isScoreLevelString)
        ? (section.items as string[])
        : factorsOnly && section.items && section.items.every((it) => typeof it === "string")
          ? (section.items as string[])
          : [];

  return (
    <div>
      {section.label && !factorsOnly && (
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{section.label}</p>
      )}
      {section.title && !factorsOnly && (
        <h2
          className={`font-display ${score || benefits ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"} font-bold ${benefits ? "mb-12" : "mb-6"} tracking-tight`}
        >
          {section.title}
        </h2>
      )}
      {section.intro && (
        <p className={`text-lg text-muted text-pretty max-w-3xl ${score ? "mb-12" : "mb-10"}`}>
          {section.intro}
        </p>
      )}
      {section.text && (
        <p className="text-lg text-muted text-pretty mb-10 max-w-3xl leading-relaxed">{section.text}</p>
      )}

      {score && scoreItems.filter((c) => c.emoji || c.range || c.title).length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {scoreItems.map((card, i) => (
            <ScoreCardView key={i} card={card} highlight={i === 0} />
          ))}
        </div>
      )}

      {(factorsOnly || (score && chips.length > 0)) && (
        <>
          {factorsOnly && (
            <h3 className="font-display text-xl md:text-2xl font-bold mb-6 tracking-tight text-foreground">
              {section.label || section.title || chipsHeading}
            </h3>
          )}
          {score && chipsHeading && !factorsOnly && (
            <h3 className="font-display text-xl md:text-2xl font-bold mb-6 tracking-tight text-foreground">{chipsHeading}</h3>
          )}
          <FactorChips items={chips} />
        </>
      )}

      {benefits && Array.isArray(section.items) && section.items.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items.map((it, i) => (
            <div key={i} className="p-6 border border-border bg-background">
              <div className="font-mono text-xs text-primary mb-2">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display text-lg font-bold mb-2">
                {typeof it === "string" ? it : it.title}
              </h3>
              {typeof it !== "string" && it.desc && (
                <p className="text-sm text-muted leading-relaxed">{it.desc}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!score && !benefits && !factorsOnly && Array.isArray(section.items) && section.items.length > 0 && (
        <RichItems items={section.items} />
      )}
      {section.itemsHeading && !score && (
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4 mt-8">{section.itemsHeading}</p>
      )}

      {Array.isArray(section.groups) && section.groups.length > 0 && (
        <div className="space-y-10 mt-8">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {section.groups.slice(0, 2).map((g, i) => {
              const isEmojiList = g.items.some((it) => {
                const text = typeof it === "string" ? it : (it as any).title ?? "";
                return /^[\u{1F300}-\u{1F9FF}🟢🟡🔴📊📈📉💵👷⚠️🦺❤️➕⏱📦📅🔁📸📑💰🏢👤💳🧾📝📍📱🛰📌🕒🚨🏷💬🛎🔨🔧🔒🔑]/u.test(
                  text.trim()
                );
              });
              const isLongTextList = isEmojiList && g.items.some((it) => {
                const text = typeof it === "string" ? it : (it as any).title ?? "";
                return text.length > 42;
              });

              return (
                <div key={i}>
                  {g.heading && <h3 className="font-display text-lg font-bold mb-4 text-foreground">{g.heading}</h3>}
                  <div className={isLongTextList ? "space-y-2.5" : "grid grid-cols-2 gap-2.5"}>
                    {g.items.map((it, idx) => {
                      const text = typeof it === "string" ? it : (it as any).title ?? (it as any).name ?? "";
                      const hasIcon = /^[\u{1F300}-\u{1F9FF}🟢🟡🔴📊📈📉💵👷⚠️🦺❤️➕⏱📦📅🔁📸📑💰🏢👤💳🧾📝📍📱🛰📌🕒🚨🏷💬🛎🔨🔧🔒🔑]/u.test(
                        text.trim()
                      );
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-background border border-border text-xs font-semibold text-foreground rounded-sm flex items-center gap-2.5"
                        >
                          {!hasIcon && <span className="text-primary font-bold shrink-0">–</span>}
                          <span className="leading-snug">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {(section.note || section.example) && (
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-md">
              <p className="font-mono text-xs text-primary font-bold uppercase tracking-widest mb-2">
                {typeof (section.note || section.example) === "object" && (section.note || (section.example as any))?.label
                  ? (section.note || (section.example as any)).label
                  : "EXEMPEL"}
              </p>
              <p className="text-xs text-muted leading-relaxed max-w-4xl">
                {typeof (section.note || section.example) === "string"
                  ? (section.note || section.example)
                  : ((section.note || section.example) as any).text}
              </p>
            </div>
          )}

          {section.groups.slice(2).map((g, i) => (
            <div key={i}>
              {g.heading && <h3 className="font-display text-lg font-bold mb-4 text-foreground">{g.heading}</h3>}
              <div
                className={
                  g.items.length <= 7
                    ? "grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                    : "grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                }
              >
                {g.items.map((it, idx) => {
                  const text = typeof it === "string" ? it : (it as any).title ?? (it as any).name ?? "";
                  const hasIcon = /^[\u{1F300}-\u{1F9FF}🟢🟡🔴📊📈📉💵👷⚠️🦺❤️➕⏱📦📅🔁📸📑💰🏢👤💳🧾📝📍📱🛰📌🕒🚨🏷💬🛎🔨🔧🔒🔑]/u.test(
                    text.trim()
                  );
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-background border border-border text-xs font-semibold text-foreground rounded-sm flex items-center gap-2.5"
                    >
                      {!hasIcon && <span className="text-primary font-bold shrink-0">–</span>}
                      <span className="leading-snug">{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {(!section.groups || section.groups.length === 0) && (section.note || section.example) && (
        <div className="mt-10 bg-primary/5 border-l-4 border-primary p-6 rounded-r-md">
          <p className="font-mono text-xs text-primary font-bold uppercase tracking-widest mb-2">
            {typeof (section.note || section.example) === "object" && (section.note || (section.example as any))?.label
              ? (section.note || (section.example as any)).label
              : "EXEMPEL"}
          </p>
          <p className="text-xs text-muted leading-relaxed max-w-4xl">
            {typeof (section.note || section.example) === "string"
              ? (section.note || section.example)
              : ((section.note || section.example) as any).text}
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
  );
}

function HealthScoreBlock({ sections }: { sections: ModuleRichSection[] }) {
  const factorsSection = sections.find(
    (s) => Array.isArray(s.items) && s.items.every((it) => typeof it === "string") && !s.items.some(isScoreLevelString)
  );
  const färgkodningSection = sections.find(
    (s) =>
      s.label === "Färgkodning" ||
      s.title === "Färgkodning" ||
      (Array.isArray(s.items) &&
        (s.items.some(isScoreLevelString) ||
          s.items.some((it) => typeof it === "object" && it !== null && (it as any).title))) ||
      (Array.isArray(s.scoreLevels) && s.scoreLevels.length > 0)
  );

  if (factorsSection && färgkodningSection) {
    // Always use the first section for label/title/intro (it has the score section heading)
    const headerSection = sections[0];
    const factorItems = (factorsSection.items ?? []) as string[];
    const rawScoreItems =
      färgkodningSection.scoreLevels && färgkodningSection.scoreLevels.length > 0
        ? färgkodningSection.scoreLevels
        : färgkodningSection.items ?? [];

    const scoreItems: ModuleRichCard[] = rawScoreItems.map(parseScoreCard);

    return (
      <div>
        {headerSection.label && (
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{headerSection.label}</p>
        )}
        {headerSection.title && (
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 tracking-tight">{headerSection.title}</h2>
        )}
        {headerSection.intro && (
          <p className="text-lg text-muted text-pretty max-w-3xl mb-12">{headerSection.intro}</p>
        )}

        {/* 3 Horizontal Score Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {scoreItems.map((card, idx) => {
            const emoji = card.emoji || (typeof card.title === "string" && card.title.match(/^([\u{1F300}-\u{1F9FF}🟢🟡🔴])/u)?.[1]) || (idx === 0 ? "🟢" : idx === 1 ? "🟡" : "🔴");
            const rawTitle = card.range || card.title || "";
            const cleanTitle = typeof rawTitle === "string" ? rawTitle.replace(/^[\u{1F300}-\u{1F9FF}🟢🟡🔴]\s*/u, "") : rawTitle;

            return (
              <div key={idx} className="bg-background p-6 rounded-lg border border-border/60 flex flex-col items-start shadow-sm">
                <span className="text-2xl mb-3">{emoji}</span>
                <div className="font-bold text-xl text-primary mb-2">{cleanTitle}</div>
                <div className="text-sm text-muted leading-relaxed">{card.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Factor Items in 3-column grid */}
        <div>
          <h3 className="font-display text-xl font-bold mb-6 tracking-tight text-foreground">
            Poängen baseras bland annat på
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {factorItems.map((item, idx) => (
              <div key={idx} className="bg-background p-4 rounded-md border border-border/50 flex items-center gap-3">
                <span className="text-muted font-bold">—</span>
                <span className="text-sm font-medium text-foreground">
                  {typeof item === "string" ? item : (item as any).title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sections.map((s, i) => (
        <RichSectionContent key={`health-${i}`} section={s} />
      ))}
    </div>
  );
}

function RichSectionBlock({ section }: { section: ModuleRichSection }) {
  return (
    <section className="py-24 px-6 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto">
        <RichSectionContent section={section} />
      </div>
    </section>
  );
}

function TimeFlowWorkSectionBlock({ section }: { section: ModuleRichSection }) {
  return (
    <section className="py-24 px-6 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
            {section.label ?? "TIMEFLOW WORK"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {section.title}
          </h2>
          {section.intro && (
            <p className="text-muted text-base leading-relaxed mb-6">
              {section.intro}
            </p>
          )}
          <div className="mt-6">
            <Link
              href="/support#demo"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              Boka demo
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Array.isArray(section.items) &&
            section.items.map((it, i) => {
              const title = typeof it === "string" ? it : it.title ?? it.name ?? "";
              const icon = typeof it === "object" && it !== null ? ((it as any).icon || (it as any).emoji) : null;
              return (
                <div key={i} className="p-4 bg-surface rounded-md flex items-center gap-3 border border-border/40">
                  {icon ? (
                    <span className="text-xl shrink-0 leading-none">{icon}</span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary grid place-items-center text-xs shrink-0 font-bold">
                      ✓
                    </span>
                  )}
                  <span className="font-bold text-xs text-foreground">{title}</span>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function formatSubheroText(text: string) {
  if (!text) return text;
  const regex = /(Smart-[A-ZÅÄÖa-zåäö™]+|[A-Za-z0-9]+Flow™|SecureCheck™|[A-ZÅÄÖa-zåäö\s]+Health Score™)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (
      /^Smart-/i.test(part) ||
      /Flow™$/i.test(part) ||
      /SecureCheck™/i.test(part) ||
      /Health Score™/i.test(part)
    ) {
      return (
        <span key={i} className="text-primary font-bold">
          {part}
        </span>
      );
    }
    return part;
  });
}

/**
 * Build translated rich content for a module slug.
 * Uses the modulePages i18n namespace; falls back to the hardcoded Swedish moduleContent.
 */
function useTranslatedContent(slug: string): ModuleRichContent | undefined {
  const { t, i18n } = useTranslation("modulePages");

  // Check if this namespace has content for the current language + slug
  const hasTranslation =
    i18n.exists(`${slug}.heroTitle`, { ns: "modulePages" }) ||
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

/**
 * Overview sections — "Detta ingår", "Allt som ingår" and "För hantverkaren" —
 * render as compact numbered / icon grids directly after the sub-hero,
 * mirroring the reference site layout.
 */
const OVERVIEW_LABELS = ["Detta ingår", "Allt som ingår", "För hantverkaren"];

function OverviewSection({ section }: { section: ModuleRichSection }) {
  const isForHantverkaren = section.label === "För hantverkaren";
  const isDettaIngar = section.label === "Detta ingår";
  const items = Array.isArray(section.items) ? section.items : [];

  if (isForHantverkaren) {
    return (
      <section className="py-20 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          {section.label && (
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{section.label}</p>
          )}
          {section.title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight max-w-3xl">
              {section.title}
            </h2>
          )}
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((it, i) =>
              typeof it === "string" ? (
                <div key={i} className="p-6 border border-border bg-background">
                  <div className="font-bold mb-2">{it}</div>
                </div>
              ) : (
                <div key={i} className="p-6 border border-border bg-background">
                  {(it.icon || it.emoji) && <div className="text-3xl mb-3">{it.icon ?? it.emoji}</div>}
                  {it.title && <div className="font-bold mb-2">{it.title}</div>}
                  {it.desc && <p className="text-sm text-muted leading-relaxed">{it.desc}</p>}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`px-6 border-b border-border bg-background ${isDettaIngar ? "py-16 bg-surface" : "py-20"}`}>
      <div className="max-w-6xl mx-auto">
        {section.label && (
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{section.label}</p>
        )}
        {section.title && (
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight">{section.title}</h2>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <div key={i} className="p-4 border border-border bg-surface">
              <div className="font-mono text-xs text-primary mb-1">{String(i + 1).padStart(2, "0")}</div>
              <div className="font-bold text-sm">{typeof it === "string" ? it : it.title ?? it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DynamicModulePage({ slug, item, section }: PageProps) {
  const router = useRouter();
  const { t } = useTranslation("modulePages");
  const rich = useTranslatedContent(slug);
  const hasRich = !!rich;

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
        title: tc("stepsDefaultTitle", "Från förfrågan till färdigt projekt."),
        steps: item.steps.map((s): ModuleRichStep => ({ title: s.title, desc: s.desc })),
      }
      : null);
  const smart = rich?.smart ?? null;

  // Features stored as an overview ("Allt som ingår" / "Detta ingår") render as overview grids.
  const featureOverview: ModuleRichSection | undefined =
    rich?.features && rich.features.label && OVERVIEW_LABELS.includes(rich.features.label)
      ? { label: rich.features.label, title: rich.features.title, items: rich.features.items }
      : undefined;

  const heroQuestionSection = (rich?.sections ?? []).find(
    (s) => !s.title && !s.label && Array.isArray(s.items) && s.items.length > 0
  );

  const overviews: ModuleRichSection[] = [
    ...(rich?.sections ?? []).filter((s) => s !== heroQuestionSection && s.label && OVERVIEW_LABELS.includes(s.label)),
    ...(featureOverview ? [featureOverview] : []),
  ];
  const bodySections = (rich?.sections ?? []).filter(
    (s) => s !== heroQuestionSection && !(s.label && OVERVIEW_LABELS.includes(s.label)) && !(s.text && (s.text.includes("30 dagars") || s.text.includes("provperiod")))
  );
  const timeflowWorkSections = bodySections.filter(isTimeFlowWorkSection);
  const nonWorkBodySections = bodySections.filter((s) => !isTimeFlowWorkSection(s));
  const healthScoreSections = nonWorkBodySections.filter(isScoreSection);
  const otherBodySections = nonWorkBodySections.filter((s) => !isScoreSection(s));

  const benefitFeatures = hasRich && !featureOverview ? rich?.features ?? null : null;
  const featuresData = benefitFeatures ?? (item.features && item.features.length > 0
    ? {
      label: tc("featuresDefaultLabel", "Funktioner"),
      title: item.steps && item.steps.length > 0
        ? `Funktioner som förenklar hela ${item.name.toLowerCase()}flödet.`
        : tc("featuresDefaultTitle", "Vad du får med modulen."),
      items: item.features.map((f) => f),
    }
    : null);
  const integrationsData = rich?.integrations ?? (item.integrations && item.integrations.length > 0
    ? { label: tc("integrationsDefaultLabel", "Integrationer"), title: tc("integrationsDefaultTitle", "Integrerat med hela TimeFlow."), items: item.integrations }
    : null);
  const summary = rich?.summary ?? null;

  // Simple modules without steps (e.g. Fakturering) render the Lovable fallback layout.
  const lovableFallback = !hasRich && !item.steps?.length;

  const showCta = true;
  const ctaModuleName = item.steps && item.steps.length > 0 ? `${item.name}modulen` : item.name;
  const ctaTitle = rich?.ctaTitle ?? t("common.ctaTitle", { name: ctaModuleName, defaultValue: `Redo att testa ${ctaModuleName}?`, ns: "modulePages" });
  const localizedTitle = rich?.heroTitle
    ? rich.heroTitle + (rich.heroTitleSpan ?? "")
    : item.name;
  const localizedDescription = rich?.heroDesc ?? item.desc;
  const title = `${localizedTitle} — ${section.section} · TimeFlow`;

  const hasIntegrationDescriptions = integrationsData?.items.some((item) => {
    if (typeof item === "string") return item.includes(" – ") || item.includes(" — ");
    return !!(item as any).desc;
  });

  const integrationsSection = integrationsData && integrationsData.items.length > 0 ? (
    <section className="py-24 px-6 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
            {integrationsData.label ?? tc("integrationsDefaultLabel", "Integrationer")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            {integrationsData.title ?? tc("integrationsDefaultTitle", "Integrerat med hela TimeFlow.")}
          </h2>
        </div>
        <div className={hasIntegrationDescriptions ? "lg:col-span-7 space-y-3.5" : "lg:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-3"}>
          {integrationsData.items.map((integration, i) => {
            let title = "";
            let desc = "";
            if (typeof integration === "string") {
              const parts = integration.split(" — ");
              if (parts.length > 1) {
                title = parts[0];
                desc = parts.slice(1).join(" — ");
              } else {
                const dashParts = integration.split(" – ");
                title = dashParts[0];
                desc = dashParts.slice(1).join(" – ");
              }
            } else {
              title = integration.name ?? integration.title ?? "";
              desc = integration.desc ?? "";
            }

            return (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/15 text-primary grid place-items-center text-xs shrink-0 font-bold">
                  ✓
                </span>
                <div className="text-foreground leading-snug">
                  <span className="font-semibold">{title}</span>
                  {desc ? <span className="text-muted font-normal"> – {desc}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ) : null;

  const featuresSection = featuresData && featuresData.items.length > 0 ? (
    <section className="py-24 px-6 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
          {featuresData.label ?? tc("featuresDefaultLabel", "Funktioner")}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight">
          {featuresData.title ?? tc("featuresDefaultTitle", "Vad du får med modulen.")}
        </h2>
        {hasRich ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.items.map((f, i) => (
              typeof f === "string" ? (
                <div key={f} className="p-6 border border-border bg-background">
                  <div className="font-mono text-xs text-primary mb-2">{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-bold text-base text-foreground">{f}</div>
                </div>
              ) : (
                <div key={i} className="p-6 border border-border bg-background">
                  <div className="font-mono text-xs text-primary mb-2">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                  {f.desc && <p className="text-sm text-muted leading-relaxed">{f.desc}</p>}
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {featuresData.items.map((f, i) => (
              <div key={typeof f === "string" ? f : i} className="p-6 border border-border bg-surface">
                <div className="flex items-center gap-2 font-bold mb-3">
                  <span className="text-primary">→</span>
                  <span className="text-foreground">{typeof f === "string" ? f : f.title}</span>
                </div>
                {typeof f !== "string" && f.desc && <p className="text-muted text-sm leading-relaxed">{f.desc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  ) : null;

  // Lovable fallback layout for simple modules without steps (e.g. Fakturering).
  const lovableFallbackFeaturesSection = lovableFallback && featuresData && featuresData.items.length > 0 ? (
    <section className="py-16 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
            {featuresData.label ?? tc("featuresDefaultLabel", "Funktioner")}
          </p>
          <h2 className="font-display text-2xl font-bold">Vad du får</h2>
        </div>
        <ul className="md:col-span-2 space-y-3">
          {featuresData.items.map((f, i) => (
            <li key={typeof f === "string" ? f : i} className="flex items-start gap-3 text-sm md:text-base">
              <span className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary grid place-items-center text-xs shrink-0">✓</span>
              <span className="text-foreground">{typeof f === "string" ? f : f.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  ) : null;

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

        {/* Header — modules without steps (e.g. Fakturering) use the simple Lovable fallback layout */}
        {lovableFallback ? (
          <header className="pt-20 pb-16 px-6 border-b border-border">
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
              <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance">
                {item.name}
              </h1>
              <p className="text-lg md:text-xl text-muted max-w-3xl text-pretty">{item.long}</p>
            </div>
          </header>
        ) : (
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
                {rich?.heroTitle ? (
                  <>
                    {rich.heroTitle}{" "}
                    {rich.heroTitleSpan && (
                      <span className="text-primary italic">{rich.heroTitleSpan}</span>
                    )}
                  </>
                ) : (
                  t("common.heroTitle", { name: item.name, defaultValue: `${item.name}modul för hantverkare`, ns: "modulePages" }).split(item.name).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <span className="text-primary italic">{item.name}</span>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
                )}
              </h1>
              {(() => {
                if (!heroDesc) return null;
                if (heroDesc.includes("\n\n")) {
                  const parts = heroDesc.split("\n\n");
                  return (
                    <div className="max-w-3xl mb-8 space-y-4">
                      <p className="text-lg md:text-xl text-muted text-pretty">{parts[0]}</p>
                      {parts.slice(1).map((p, i) => (
                        <p key={i} className="text-xs md:text-sm text-muted/80 leading-relaxed text-pretty">
                          {p}
                        </p>
                      ))}
                    </div>
                  );
                }
                const match = heroDesc.match(/(^.*?)(?=\s+(?:Utvecklad|Full spårbarhet|Digital signering)\b)([\s\S]*)/);
                if (match) {
                  return (
                    <div className="max-w-3xl mb-8 space-y-4">
                      <p className="text-lg md:text-xl text-muted text-pretty">{match[1].trim()}</p>
                      <p className="text-base text-muted leading-relaxed text-pretty">
                        {match[2].trim()}
                      </p>
                    </div>
                  );
                }
                const sentences = heroDesc.match(/[^.!?]+[.!?]+/g);
                if (sentences && sentences.length >= 3) {
                  const mainText = sentences.slice(0, 2).join(" ").trim();
                  const subText = sentences.slice(2).join(" ").trim();
                  return (
                    <div className="max-w-3xl mb-8 space-y-4">
                      <p className="text-lg md:text-xl text-muted text-pretty">{mainText}</p>
                      <p className="text-base text-muted leading-relaxed text-pretty">
                        {subText}
                      </p>
                    </div>
                  );
                }
                return (
                  <p className="text-lg md:text-xl text-muted max-w-3xl text-pretty mb-8">
                    {heroDesc}
                  </p>
                );
              })()}

              {heroQuestionSection && Array.isArray(heroQuestionSection.items) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-4xl">
                  {heroQuestionSection.items.map((q, qi) => (
                    <div
                      key={qi}
                      className="p-3.5 border border-border bg-surface text-center font-bold text-xs md:text-sm text-foreground rounded-sm flex items-center justify-center min-h-[48px]"
                    >
                      {typeof q === "string" ? q : (q as any).title ?? (q as any).name}
                    </div>
                  ))}
                </div>
              )}

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
                {rich?.heroAction && (
                  <a
                    href={typeof rich.heroAction === "object" ? rich.heroAction.href ?? "#steg" : "#steg"}
                    className="px-6 py-3 border border-primary text-primary font-bold rounded-sm hover:bg-primary/10 text-center transition-colors flex items-center justify-center gap-2"
                  >
                    {typeof rich.heroAction === "object" ? rich.heroAction.label : rich.heroAction}
                  </a>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Sub-hero description */}
        {rich?.subhero ? (
          <section className="py-16 px-6 border-b border-border bg-surface">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg md:text-xl text-muted leading-relaxed">
                {formatSubheroText(rich.subhero)}
              </p>
            </div>
          </section>
        ) : !hasRich && item.steps && item.steps.length > 0 ? (
          <section className="py-16 px-6 border-b border-border bg-surface">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg md:text-xl text-muted">
                {t("common.stepsSubhero", { name: item.name.toLowerCase(), defaultValue: `Se stegen nedanför hur ${item.name.toLowerCase()}modulen fungerar – från första förfrågan till färdigt projekt.`, ns: "modulePages" })}
              </p>
            </div>
          </section>
        ) : null}

        {/* Overview sections */}
        {overviews.map((s, i) => (
          <OverviewSection key={i} section={s} />
        ))}

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
                      /spårbarhet/i.test(step.title) ? (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {(step.items as string[]).map((it: string, idx: number, arr: string[]) => (
                            <Fragment key={idx}>
                              <span className="px-2.5 py-1.5 border border-border bg-surface text-xs font-medium flex items-center gap-1.5 text-foreground">
                                {it}
                              </span>
                              {idx < arr.length - 1 && (
                                <span className="text-primary text-xs font-bold shrink-0">↓</span>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      ) : (
                        <ul className="space-y-2 mb-4">
                          {step.items.map((it: string) => (
                            <li key={it} className="flex items-start gap-2 text-sm text-muted">
                              <span className="text-primary mt-0.5">→</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                    {Array.isArray(step.groups) && step.groups.length > 0 && (
                      <div className="space-y-4 mb-4">
                        {step.groups.map((g, gi) => (
                          <div key={gi}>
                            {g.label && (
                              <p className="font-mono text-[11px] text-primary uppercase tracking-widest mb-2">{g.label}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {g.items.map((it, ii) => (
                                <span key={ii} className="px-2 py-1 text-xs border border-border bg-surface">
                                  {typeof it === "string" ? it : it.title ?? it.desc}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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

        {/* Smart features Section (AI-funktioner) */}
        {smart && smart.features.length > 0 && (
          <section className="py-24 px-6 border-b border-border bg-surface">
            <div className="max-w-6xl mx-auto">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                {smart.label ?? tc("smartDefaultLabel", "Smarta funktioner")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-16 tracking-tight">
                {smart.title ?? tc("smartDefaultTitle", "Automatisering som spar tid och minskar fel.")}
              </h2>
              <div
                className={`grid gap-6 ${
                  smart.features.length === 1
                    ? "grid-cols-1 max-w-2xl mx-auto"
                    : smart.features.length === 2 || smart.features.length === 4
                    ? "md:grid-cols-2"
                    : smart.features.length === 3
                    ? "md:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {smart.features.map((f) => (
                  <div key={f.title} className="p-6 border border-border bg-background">
                    <h3 className="font-display text-lg font-bold mb-3">{f.title}</h3>
                    {f.desc && <p className="text-muted text-sm leading-relaxed mb-4">{f.desc}</p>}
                    {Array.isArray(f.bullets) && f.bullets.length > 0 && (
                      <ul className="space-y-2">
                        {f.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm text-muted">
                            <span className="text-primary mt-0.5">✓</span>
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

        {/* TimeFlow Work */}
        {timeflowWorkSections.map((s, i) => (
          <TimeFlowWorkSectionBlock key={`tfw-${i}`} section={s} />
        ))}

        {/* Health Score sections */}
        {healthScoreSections.length > 0 && (
          <section className="py-24 px-6 border-b border-border bg-background">
            <div className="max-w-6xl mx-auto">
              <HealthScoreBlock sections={healthScoreSections} />
            </div>
          </section>
        )}

        {/* Integrations */}
        {integrationsSection}

        {/* Other body sections (e.g. Kritiska fördelar) */}
        {otherBodySections.map((s, i) => (
          <RichSectionBlock key={`other-${i}`} section={s} />
        ))}

        {lovableFallback ? lovableFallbackFeaturesSection : featuresSection}

        {/* Summary */}
        {summary && (
          <section className="py-24 px-6 border-b border-border bg-background">
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

        {/* Tillval for fallback modules without steps */}
        {!hasRich && !item.steps?.length && item.extra && (
          <section className="py-10 px-6 border-b border-border bg-surface">
            <div className="max-w-5xl mx-auto">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
                {tc("addonsLabel", "Tillval")}
              </p>
              <p className="text-base">{item.extra}</p>
            </div>
          </section>
        )}

        {/* Siblings / Recommendations — only for fallback modules without steps */}
        {!hasRich && !item.steps?.length && siblings.length > 0 && (
          <section className="py-16 px-6 border-b border-border">
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

        {/* Other Sections — only for fallback modules without steps */}
        {!hasRich && !item.steps?.length && (
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
        )}

        {/* Bottom CTA */}
        {showCta && (
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
        )}

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
