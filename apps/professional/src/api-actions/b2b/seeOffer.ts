import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import { B2BSeeOfferDetail } from "@/features/b2b/types/seeOffer";
import { optionalApiText } from "./projectMarket";

const B2B_BASE_PATH = "/professionals/b2b";

export const b2bOfferDocumentSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["pdf", "doc", "other"]).optional().default("other"),
  url: z.string().optional(),
});

export const b2bOfferImageSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string().optional(),
});

export const b2bOfferQAMessageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  role: z.string(),
  badge: optionalApiText,
  company: optionalApiText,
  replyFrom: optionalApiText,
  replyText: optionalApiText,
  message: z.string(),
  date: z.string(),
  avatar: optionalApiText,
  status: optionalApiText,
  answerUser: optionalApiText,
  answerText: optionalApiText,
  answerDate: optionalApiText,
});

export const b2bSeeOfferDetailSchema = z.object({
  id: z.string(),
  projectId: z.string().optional(),
  title: z.string(),
  refNr: z.string(),
  postedDate: z.string(),
  city: z.string(),
  municipality: z.string(),
  totalOffert: z.number().default(0),
  statusBadge: z.string().optional(),
  company: z.object({
    id: z.string(),
    name: z.string(),
    email: optionalApiText.pipe(z.string().default("")).catch(""),
    telefon: optionalApiText.pipe(z.string().default("")).catch(""),
    adress: optionalApiText.pipe(z.string().default("")).catch(""),
    orgNr: optionalApiText.pipe(z.string().default("")).catch(""),
  }),
  contactPerson: z.object({
    name: optionalApiText.pipe(z.string().default("")).catch(""),
    email: optionalApiText.pipe(z.string().default("")).catch(""),
    mobil: optionalApiText.pipe(z.string().default("")).catch(""),
  }),
  offert: z.object({
    arbete: optionalApiText.pipe(z.string().default("")).catch(""),
    material: optionalApiText.pipe(z.string().default("")).catch(""),
    totalOffert: z.number().default(0),
    betalningsvillkor: optionalApiText.pipe(z.string().default("")).catch(""),
  }),
  documents: z.object({
    images: z.array(b2bOfferImageSchema).default([]),
    docs: z.array(b2bOfferDocumentSchema).default([]),
    drawings: z.array(b2bOfferDocumentSchema).default([]),
  }),
  qa: z.array(b2bOfferQAMessageSchema).default([]),
});

/**
 * Fetch B2B Offer Detail for See Offer view.
 */
export async function getB2BOfferDetailAction(
  _projectId: string,
  _offerId: string
): Promise<ActionResult<B2BSeeOfferDetail>> {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(
      `${B2B_BASE_PATH}/offers/${_offerId}`
    );
    const rawData = response.data?.data ?? response.data;
    const parsed = b2bSeeOfferDetailSchema.safeParse(rawData);
    if (parsed.success) {
      return { success: true, data: parsed.data, error: null };
    }
    return { success: false, data: null, error: "Unexpected response from server" };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load offer",
    };
  }
}

/**
 * Accept a B2B Offer
 */
export async function acceptB2BOfferAction(
  offerId: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
  try {
    const response = await axiosInstance.post(
      `${B2B_BASE_PATH}/offers/${offerId}/accept`
    );
    return {
      success: true,
      data: {
        success: true,
        message: response.data?.message || "Offer accepted successfully",
      },
      error: null,
    };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to accept offer",
    };
  }
}

/**
 * Decline a B2B Offer
 */
export async function declineB2BOfferAction(
  offerId: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
  try {
    const response = await axiosInstance.post(
      `${B2B_BASE_PATH}/offers/${offerId}/decline`
    );
    return {
      success: true,
      data: {
        success: true,
        message: response.data?.message || "Offer declined successfully",
      },
      error: null,
    };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to decline offer",
    };
  }
}

/**
 * Send a reply in Offer Q&A thread
 */
export async function sendB2BOfferQAReplyAction(
  offerId: string,
  messageId: string,
  replyText: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
  try {
    const response = await axiosInstance.post(
      `${B2B_BASE_PATH}/offers/${offerId}/qa/${messageId}/reply`,
      { replyText }
    );
    return {
      success: true,
      data: {
        success: true,
        message: response.data?.message || "Reply sent successfully",
      },
      error: null,
    };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorMessage =
      apiError.response?.data?.message ||
      (error instanceof Error ? error.message : "Failed to send reply");
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
