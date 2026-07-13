import type { BudgetItem, Invoice, PaymentPlan, ATAItem, BudgetSection } from "./types";

export const DUMMY_BUDGETS: BudgetItem[] = [
  { id: "1", projectName: "Bathroom Budget", date: "2026-01-21" },
  { id: "2", projectName: "Kitchen Budget", date: "2026-01-21" },
  { id: "3", projectName: "Main Budget", date: "2026-01-21" },
];

export const DUMMY_INVOICES: Invoice[] = [
  { id: "1", invoiceNumber: "31747", invoiceDate: "2026-01-21", dueDate: "2026-01-21", status: "unpaid" },
  { id: "2", invoiceNumber: "31748", invoiceDate: "2026-01-21", dueDate: "2026-01-21", status: "paid" },
];

export const DUMMY_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: "1", idNo: "001", designation: "Payment Plan 1", date: "2026-01-21",
    projectNo: "2024-01", status: "pending",
    rows: [
      { id: "r1", date: "2026-01-21", paymentItem: "Installment 1", description: "Concrete Slab Completed", amount: 155000, withheldFunds: 15500, rgt: 0 },
      { id: "r2", date: "2026-01-21", paymentItem: "Installment 2", description: "Concrete Slab Completed", amount: 295000, withheldFunds: 29500, rgt: 0 },
      { id: "r3", date: "2026-05-01", paymentItem: "Installment 3", description: "Concrete Slab Completed", amount: 50000, withheldFunds: 5000, rgt: 0 },
    ],
  },
  {
    id: "2", idNo: "002", designation: "Payment Plan 2", date: "2026-01-21",
    projectNo: "2024-01", status: "pending",
    rows: [
      { id: "r4", date: "2026-02-01", paymentItem: "Installment 1", description: "Foundation Complete", amount: 120000, withheldFunds: 12000, rgt: 0 },
      { id: "r5", date: "2026-04-01", paymentItem: "Installment 2", description: "Framing Complete", amount: 200000, withheldFunds: 20000, rgt: 0 },
    ],
  },
];

export const DUMMY_ATA_ITEMS: ATAItem[] = [
  { id: "1", ataNr: "001", datum: "2026-01-21", benamning: "Kök", source: "You", belopp: 155000, status: "godkand" },
  { id: "2", ataNr: "KP 2025-12", datum: "2026-01-21", benamning: "Badrum tillägg", source: "Company Name", belopp: 350000, status: "granskning" },
  { id: "3", ataNr: "KP 2025-12", datum: "2024-04-01", benamning: "Extra vid altan", source: "Company Name", belopp: 50000, status: "granskning" },
];

export const DEFAULT_BUDGET_SECTIONS: BudgetSection[] = [
  {
    id: "konsulter",
    type: "konsulter",
    collapsed: false,
    rows: [
      { id: "k1", artikelNr: "1001", benamning: "Arkitekt", antal: 50, enhet: "tim", aPris: 750, palagg: 10 },
      { id: "k2", artikelNr: "1002", benamning: "Konsult", antal: 30, enhet: "tim", aPris: 650, palagg: 10 },
    ],
  },
  {
    id: "arbete",
    type: "arbete",
    collapsed: false,
    rows: [
      { id: "a1", artikelNr: "1001", benamning: "Snickare", antal: 80, enhet: "tim", aPris: 500, palagg: 10 },
      { id: "a2", artikelNr: "1002", benamning: "Projektledare", antal: 20, enhet: "tim", aPris: 800, palagg: 10 },
    ],
  },
  {
    id: "material",
    type: "material",
    collapsed: false,
    rows: [
      { id: "m1", artikelNr: "1001", benamning: "Byggmaterial", antal: 5, enhet: "st", aPris: 8500, palagg: 10, leverantor: "Bauhaus", varunr: "BH-1001" },
      { id: "m2", artikelNr: "1002", benamning: "Kakel 30x60", antal: 40, enhet: "m²", aPris: 450, palagg: 10, leverantor: "Tile House", varunr: "TH-4502" },
    ],
  },
  {
    id: "ue",
    type: "ue",
    collapsed: false,
    rows: [
      { id: "u1", artikelNr: "1001", benamning: "Elektriker", antal: 1, enhet: "st", aPris: 32000, palagg: 10 },
      { id: "u2", artikelNr: "1002", benamning: "VVS", antal: 1, enhet: "st", aPris: 48000, palagg: 10 },
    ],
  },
];
