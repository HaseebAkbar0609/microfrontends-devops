export type FinanceSubTab = "budget" | "invoices" | "payment-plan" | "add-eat";

export type FinanceView =
  | { sub: "budget"; mode: "list" }
  | { sub: "budget"; mode: "create" }
  | { sub: "invoices"; mode: "list" }
  | { sub: "payment-plan"; mode: "list" }
  | { sub: "payment-plan"; mode: "create" }
  | { sub: "payment-plan"; mode: "view"; planId: string }
  | { sub: "payment-plan"; mode: "edit"; planId: string }
  | { sub: "add-eat"; mode: "list" }
  | { sub: "add-eat"; mode: "create" };

export type InvoiceStatus = "paid" | "unpaid";
export type ATAStatus = "godkand" | "granskning";
export type SectionType = "konsulter" | "arbete" | "material" | "ue";
export type PaymentPlanStatus = "draft" | "pending" | "approved" | "declined";

export interface BudgetItem {
  id: string;
  projectName: string;
  date: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface PaymentPlanRow {
  id: string;
  date: string;
  paymentItem: string;
  description: string;
  amount: number;
  withheldFunds: number;
  rgt: number;
}

export interface PaymentPlan {
  id: string;
  idNo: string;
  designation: string;
  date: string;
  projectNo: string;
  status: PaymentPlanStatus;
  rows: PaymentPlanRow[];
}

export interface ATAItem {
  id: string;
  ataNr: string;
  datum: string;
  benamning: string;
  source: string;
  belopp: number;
  status: ATAStatus;
}

export interface BudgetRow {
  id: string;
  artikelNr: string;
  benamning: string;
  antal: number;
  enhet: string;
  aPris: number;
  palagg: number;
  leverantor?: string;
  varunr?: string;
}

export interface BudgetSection {
  id: string;
  type: SectionType;
  collapsed: boolean;
  rows: BudgetRow[];
}
