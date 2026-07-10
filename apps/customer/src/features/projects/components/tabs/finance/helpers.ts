import type { BudgetRow, BudgetSection } from "./types";

export function fmtAmount(n: number) {
  if (n === 0) return "0";
  return n.toLocaleString("sv-SE") + " kr";
}

export function delsumma(row: BudgetRow) {
  return Math.round(row.antal * row.aPris * (1 + row.palagg / 100));
}

export function sectionSum(section: BudgetSection) {
  return section.rows.reduce((acc, r) => acc + delsumma(r), 0);
}

export function newRowId() {
  return crypto.randomUUID();
}
