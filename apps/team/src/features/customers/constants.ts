export const customerTabs = [
  { value: "active", labelKey: "activeCustomersTab" as const },
  { value: "pending", labelKey: "pendingCustomersTab" as const },
  { value: "analytics", labelKey: "analyticsTab" as const },
  { value: "archived", labelKey: "archivedCustomersTab" as const },
] as const;

export type CustomerTabValue = (typeof customerTabs)[number]["value"];
