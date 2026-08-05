export type ModuleRichStep = {
  title: string;
  desc?: string;
  items?: string[];
  note?: string;
  groups?: ModuleRichGroup[];
};

export type ModulePriceObj = {
  amount: number;
  currency?: string;
  unit?: string;
};

export type ModuleRichCard = {
  title?: string;
  desc?: string;
  icon?: string;
  emoji?: string;
  range?: string;
  price?: string | ModulePriceObj;
  name?: string;
  items?: Array<string | ModuleRichCard>;
  note?: string;
  groups?: ModuleRichGroup[];
};
export type ModuleRichPricing = {
  trialDays?: number;
  planName?: string;
  price?: ModulePriceObj;
};
export type ModuleRichGroup = {
  heading?: string;
  label?: string;
  items: Array<string | ModuleRichCard>;
};

export type ModuleRichSection = {
  label?: string;
  title?: string;
  intro?: string;
  text?: string;
  items?: Array<string | ModuleRichCard>;
  groups?: ModuleRichGroup[];
  example?: string | { label?: string; text?: string };
  note?: string | { label?: string; text?: string };
  cards?: Array<string | ModuleRichCard>;
  scoreLevels?: ModuleRichCard[];
  itemsHeading?: string;
  factors?: string[];
  factorsTitle?: string;
};

export type ModuleSmartFeature = {
  title: string;
  desc?: string;
  bullets?: string[];
};

export type ModuleRichContent = {
  heroTitle?: string;
  heroTitleSpan?: string;
  heroDesc?: string;
  heroAction?: { label: string; href?: string } | string;
  subhero?: string;
  steps?: { label?: string; title?: string; steps: ModuleRichStep[] };
  smart?: { label?: string; title?: string; features: ModuleSmartFeature[] };
  features?: { label?: string; title?: string; items: Array<string | { title: string; desc?: string }> };
  integrations?: { label?: string; title?: string; items: Array<string | { name?: string; title?: string; desc?: string }> };
  sections?: ModuleRichSection[];
  pricing?: ModuleRichPricing;
  summary?: { label?: string; title?: string; text: string };
  ctaTitle?: string;
};

