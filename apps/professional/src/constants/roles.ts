export const ROLES = {
  MANAGER: "manager",
  WORKER: "worker",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];