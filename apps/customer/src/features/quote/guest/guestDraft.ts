import { z } from "zod";

export const GUEST_QUOTE_KEY = "timeflow:guest-quote:v1";

export const guestQuoteValuesSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(50),
  address: z.string().trim().min(1).max(255),
  personalCity: z.string().uuid(),
  postalCode: z.string().trim().min(3).max(20),
  projectName: z.string().trim().min(1).max(255),
  projectType: z.enum(["b2c", "express"]),
  projectAddress: z.string().trim().min(1).max(255),
  projectCity: z.string().uuid(),
  projectPostalCode: z.string().trim().min(3).max(20),
  description: z.string().trim().min(10).max(20000),
});

export type GuestQuoteValues = z.infer<typeof guestQuoteValuesSchema>;

const storedValuesSchema = z.object({
  firstName: z.string().max(100), lastName: z.string().max(100),
  email: z.string().max(255), phone: z.string().max(50),
  address: z.string().max(255), personalCity: z.string().max(36),
  postalCode: z.string().max(20), projectName: z.string().max(255),
  projectType: z.enum(["b2c", "express"]),
  projectAddress: z.string().max(255), projectCity: z.string().max(36),
  projectPostalCode: z.string().max(20), description: z.string().max(20000),
});

export const guestQuoteDraftSchema = z.object({
  version: z.literal(1),
  step: z.number().int().min(1).max(4),
  completed: z.boolean(),
  projectId: z.string().uuid().optional(),
  values: storedValuesSchema,
});

export type GuestQuoteDraft = z.infer<typeof guestQuoteDraftSchema>;

export const guestQuoteDefaults: GuestQuoteValues = {
  firstName: "", lastName: "", email: "", phone: "", address: "",
  personalCity: "", postalCode: "", projectName: "", projectType: "b2c",
  projectAddress: "", projectCity: "", projectPostalCode: "", description: "",
};

export function readGuestQuote(): GuestQuoteDraft | null {
  try {
    const raw = sessionStorage.getItem(GUEST_QUOTE_KEY);
    if (!raw) return null;
    const parsed = guestQuoteDraftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeGuestQuote(draft: GuestQuoteDraft): boolean {
  try {
    sessionStorage.setItem(GUEST_QUOTE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearGuestQuote(): void {
  sessionStorage.removeItem(GUEST_QUOTE_KEY);
}
