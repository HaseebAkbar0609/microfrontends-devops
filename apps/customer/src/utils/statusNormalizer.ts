import type { ActiveProject } from "@/features/projects/types";

/**
 * Normalizes raw status strings from backend APIs to strongly typed frontend project status values.
 * Handles typos like "recieved", underscore formatting, and hyphen variations.
 */
export function normalizeProjectStatus(raw?: string): ActiveProject["status"] {
  if (!raw) return "active";
  const s = raw.toLowerCase().trim().replace(/_/g, "-");
  
  if (s.includes("recieved") || s.includes("received") || s.includes("under-review") || s.includes("waiting")) {
    return "received-quote";
  }
  if (s === "in-progress" || s === "active") return "active";
  if (s === "completed") return "completed";
  if (s === "on-hold") return "on-hold";
  if (s === "draft") return "draft";

  return "active";
}
