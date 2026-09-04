import type { BudgetItem, Invoice, PaymentPlan, ATAItem, BudgetSection } from "./types";

export const DUMMY_BUDGETS: BudgetItem[] = [];

export const DUMMY_INVOICES: Invoice[] = [];

export const DUMMY_PAYMENT_PLANS: PaymentPlan[] = [];

export const DUMMY_ATA_ITEMS: ATAItem[] = [];

export const DEFAULT_BUDGET_SECTIONS: BudgetSection[] = [
  { id: "konsulter", type: "konsulter", collapsed: false, rows: [] },
  { id: "arbete", type: "arbete", collapsed: false, rows: [] },
  { id: "material", type: "material", collapsed: false, rows: [] },
  { id: "ue", type: "ue", collapsed: false, rows: [] },
];
