import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse } from "@/types/api";
import { ProjectMarket, ProjectMarketDetail } from "@/features/b2b/types/projectMarket";

const B2B_BASE_PATH = "/professionals/b2b";

export const projectMarketStatusSchema = z.enum([
  "contract_signed",
  "waiting",
  "open",
  "closing_soon",
  "declined",
  "archived",
]);
export const offerStatusSchema = z.enum(["accepted", "deny", "waiting"]);
export const qaStatusSchema = z.enum(["new", "opened", "answered"]);

/**
 * An optional text field as the API actually sends it: absent, or an explicit
 * `null` for "not answered yet". Plain `.optional()` rejects that `null` and
 * fails the whole response — so unanswered questions are normalised to
 * `undefined` here, which is what the view models expect.
 */
export const optionalApiText = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);

export const projectMarketItemSchema = z.object({
  id: z.string(),
  refNr: z.string(),
  project: z.string(),
  date: z.string(),
  type: z.string(),
  requests: z.number().default(0),
  municipality: z.string(),
  lowestOffer: z.number().default(0),
  status: projectMarketStatusSchema,
});

export const projectMarketOfferSchema = z.object({
  id: z.string(),
  company: z.string(),
  date: z.string(),
  contactPerson: z.string(),
  mobile: z.string(),
  email: z.string(),
  status: offerStatusSchema,
  offerAmount: z.number().default(0),
});

export const qaMessageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  role: z.string(),
  company: optionalApiText,
  badge: optionalApiText,
  replyFrom: optionalApiText,
  replyText: optionalApiText,
  answerUser: optionalApiText,
  answerBadge: optionalApiText,
  answerRole: optionalApiText,
  answerDate: optionalApiText,
  answerText: optionalApiText,
  message: z.string(),
  date: z.string(),
  status: qaStatusSchema,
  avatar: optionalApiText,
});

export const projectMarketDetailSchema = z.object({
  id: z.string(),
  refNr: z.string(),
  title: z.string(),
  latestOfferDate: z.string(),
  type: z.string(),
  municipality: z.string(),
  city: z.string(),
  lowestOfferCompany: z.string(),
  lowestOfferValue: z.number().default(0),
  contractCount: z.number().default(0),
  offers: z.array(projectMarketOfferSchema).default([]),
  customerInfo: z.object({
    companyName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    contactPerson: z.string(),
    postalAddress: z.string(),
  }),
  projectInfo: z.object({
    projectName: z.string(),
    projectNr: z.string(),
    offerPlace: z.string(),
    clientName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    address: z.string(),
  }),
  documents: z.object({
    images: z.array(z.object({ id: z.string(), label: z.string() })).default([]),
    docs: z.array(z.object({ id: z.string(), label: z.string(), type: z.string() })).default([]),
    drawings: z.array(z.object({ id: z.string(), label: z.string(), type: z.string() })).default([]),
  }),
  qa: z.array(qaMessageSchema).default([]),
});

/**
 * Fetch all Project Market projects.
 */
export async function getProjectMarketListAction(): Promise<ActionResult<ProjectMarket[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${B2B_BASE_PATH}/project-market`);
    const rawData = response.data?.data ?? response.data;
    const parsed = z.array(projectMarketItemSchema).safeParse(rawData);
    if (parsed.success) {
      return { success: true, data: parsed.data, error: null };
    }
    return { success: false, data: null, error: "Unexpected response from server" };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load projects",
    };
  }
}

/**
 * Post a new question into a project's shared Q&A thread.
 *
 * The same thread the Offer screen replies into — a question posted here is
 * visible from both views, so the detail response is re-fetched afterwards
 * rather than patched locally.
 */
export async function postProjectMarketQuestionAction(
  projectId: string,
  message: string,
): Promise<ActionResult<null>> {
  try {
    await axiosInstance.post(`${B2B_BASE_PATH}/project-market/${projectId}/qa`, { message });
    return { success: true, data: null, error: null };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to post question",
    };
  }
}

/**
 * Mark a question in a project's shared Q&A thread as read (new → opened).
 * The backend leaves an answered question as it is, so this is safe to call
 * on any message; the screens only offer it on new ones.
 */
export async function markProjectMarketQuestionReadAction(
  projectId: string,
  messageId: string,
): Promise<ActionResult<null>> {
  try {
    await axiosInstance.post(`${B2B_BASE_PATH}/project-market/${projectId}/qa/${messageId}/read`);
    return { success: true, data: null, error: null };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to mark question as read",
    };
  }
}

/**
 * Fetch Project Market detail by ID.
 */
export async function getProjectMarketDetailAction(id: string): Promise<ActionResult<ProjectMarketDetail>> {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${B2B_BASE_PATH}/project-market/${id}`);
    const rawData = response.data?.data ?? response.data;
    const parsed = projectMarketDetailSchema.safeParse(rawData);
    if (parsed.success) {
      return { success: true, data: parsed.data, error: null };
    }
    return { success: false, data: null, error: "Unexpected response from server" };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load project",
    };
  }
}
