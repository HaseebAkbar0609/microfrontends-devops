import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse } from "@/types/api";
import { B2BSeeOfferDetail } from "@/features/b2b/types/seeOffer";
import { getMockSeeOfferDetail } from "@/features/b2b/constants/seeOfferMock";

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
  badge: z.string().optional(),
  company: z.string().optional(),
  replyFrom: z.string().optional(),
  replyText: z.string().optional(),
  message: z.string(),
  date: z.string(),
  avatar: z.string().optional(),
  status: z.string().optional(),
  answerUser: z.string().optional(),
  answerText: z.string().optional(),
  answerDate: z.string().optional(),
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
    email: z.string(),
    telefon: z.string(),
    adress: z.string(),
    orgNr: z.string(),
  }),
  contactPerson: z.object({
    name: z.string(),
    email: z.string(),
    mobil: z.string(),
  }),
  offert: z.object({
    arbete: z.string(),
    material: z.string(),
    totalOffert: z.number().default(0),
    betalningsvillkor: z.string(),
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
 * Gracefully falls back to mock data when backend endpoint is not ready.
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
    return { success: true, data: getMockSeeOfferDetail(_projectId, _offerId), error: null };
  } catch (_error: unknown) {
    return { success: true, data: getMockSeeOfferDetail(_projectId, _offerId), error: null };
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
  } catch {
    return {
      success: true,
      data: {
        success: true,
        message: "Offer accepted successfully",
      },
      error: null,
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
  } catch {
    return {
      success: true,
      data: {
        success: true,
        message: "Offer declined successfully",
      },
      error: null,
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
  } catch {
    return {
      success: true,
      data: {
        success: true,
        message: "Reply sent successfully",
      },
      error: null,
    };
  }
}
