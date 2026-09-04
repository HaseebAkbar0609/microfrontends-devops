export const START_BASE = 2995;
export const STANDARD_PER_USER = 995;
export const PRO_PER_USER = 1295;
export const WORK_APP_PER_USER = 159;
export const AUTOEKO_PRICE = 199;
export const CURRENCY = "SEK";

export type PlanKey = "Start" | "Standard" | "PRO";
export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface Addon {
  code: string;
  name: string;
  category: string;
  price: number;
  unit: "per_user" | "flat" | "per_scan";
  desc: string;
}

export const ADDONS: Addon[] = [
  { code: "1601", name: "Calculation PRO Bas", category: "Kalkyl", price: 199, unit: "flat", desc: "Målning, Golvläggning, Undertak, Relining, Golvavjämning, Städ, Fasad-Puts, Plåt, Håltagning, Mark, Plattsättning" },
  { code: "1602", name: "Calculation PRO Advance", category: "Kalkyl", price: 599, unit: "flat", desc: "Bygg, El, Rör och Vent" },
  { code: "1650", name: "QuickAICalc", category: "Kalkyl", price: 2995, unit: "flat", desc: "AI-kalkylator" },
  { code: "1660", name: "Metric", category: "Kalkyl", price: 59, unit: "per_user", desc: "Ytmätning via mobilkamera, AI+AR, rumsanalys, materialberäkning (per användare)" },
  { code: "1701", name: "Order-Direkt", category: "Order", price: 199, unit: "flat", desc: "Direktorder via kunddashboard" },
  { code: "1910", name: "Smart Inköp", category: "Inköp", price: 199, unit: "flat", desc: "Integration till leverantörer" },
  { code: "2291", name: "Drive", category: "Maskin", price: 199, unit: "per_user", desc: "Live-GPS, Körjournal, fordonsdata, GPS-historik, Kartstöd, Export till bokföring (per användare med Drive)" },
  { code: "2292", name: "Ruttplan", category: "Maskin", price: 1295, unit: "flat", desc: "AI-optimerad ruttplanering, väderdata, GPS-koppling" },
  { code: "2301", name: "AutoEkonomi", category: "Ekonomi", price: 199, unit: "flat", desc: "Integration till bokföringssystem (Fortnox, Visma, Björn Lundén m.fl.)" },
  { code: "3101", name: "TalkFlow", category: "Marknad", price: 299, unit: "flat", desc: "AI-receptionist för inkommande samtal, bokning, lead-hantering" },
];

export const CYCLE_DISCOUNT: Record<BillingCycle, number> = {
  monthly: 0,
  quarterly: 0.05,
  yearly: 0.20,
};

export interface CalcInput {
  plan: PlanKey;
  users: number;
  workApps?: number;
}

// Re-export shared formatter for backwards compatibility
export { formatSEK } from "./formatters";

/**
 * Månadskostnad ex. moms för plan + användare + ev. TimeFlow Work-appar.
 * Standard/PRO kräver Start-licens som alltid läggs till basen.
 */
export function calculatePrice({ plan, users, workApps = 0 }: CalcInput): number {
  if (plan === "Start") return START_BASE;
  const perUser = plan === "PRO" ? PRO_PER_USER : STANDARD_PER_USER;
  const u = Math.max(1, Math.floor(users));
  const w = Math.max(0, Math.min(u, Math.floor(workApps)));
  return START_BASE + perUser * u + WORK_APP_PER_USER * w;
}

/** Applicerar rabatt utifrån betalfrekvens. Returnerar månadssnitt. */
export function applyCycle(monthly: number, cycle: BillingCycle): number {
  return Math.round(monthly * (1 - CYCLE_DISCOUNT[cycle]));
}

