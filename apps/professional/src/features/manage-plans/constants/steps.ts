export const MANAGE_PLANS_STEPS = {
  BASE: "base",
  LICENSES: "licenses",
  ADDONS: "addons",
} as const;

export type ManagePlansStep =
  (typeof MANAGE_PLANS_STEPS)[keyof typeof MANAGE_PLANS_STEPS];

export const MANAGE_PLANS_PLAN_IDS = {
  FREE: "free",
  START: "start",
  STANDARD: "standard",
  PRO: "pro",
  APP_WORK: "worker",
} as const;


