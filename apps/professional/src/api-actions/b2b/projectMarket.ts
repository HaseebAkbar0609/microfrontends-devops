import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse } from "@/types/api";
import { ProjectMarket, ProjectMarketDetail } from "@/features/b2b/types/projectMarket";
import { DUMMY_PROJECTS, getMockProjectDetail } from "@/features/b2b/constants/projectMarketMock";

const B2B_BASE_PATH = "/professionals/b2b";

export const projectMarketStatusSchema = z.enum(["contract_signed", "waiting", "open", "closing_soon"]);
export const offerStatusSchema = z.enum(["accepted", "deny", "waiting"]);
export const qaStatusSchema = z.enum(["new", "opened", "answered"]);

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
  company: z.string().optional(),
  badge: z.string().optional(),
  replyFrom: z.string().optional(),
  replyText: z.string().optional(),
  answerUser: z.string().optional(),
  answerBadge: z.string().optional(),
  answerRole: z.string().optional(),
  answerDate: z.string().optional(),
  answerText: z.string().optional(),
  message: z.string(),
  date: z.string(),
  status: qaStatusSchema,
  avatar: z.string().optional(),
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
 * Falls back to mock data if backend route is not ready.
 */
export async function getProjectMarketListAction(): Promise<ActionResult<ProjectMarket[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${B2B_BASE_PATH}/project-market`);
    const rawData = response.data?.data ?? response.data;
    const parsed = z.array(projectMarketItemSchema).safeParse(rawData);
    if (parsed.success) {
      return { success: true, data: parsed.data, error: null };
    }
    return { success: true, data: DUMMY_PROJECTS, error: null };
  } catch (_error: unknown) {
    // Fallback to mock data gracefully until backend endpoint is deployed
    return { success: true, data: DUMMY_PROJECTS, error: null };
  }
}

/**
 * Fetch Project Market detail by ID.
 * Falls back to mock data if backend route is not ready.
 */
export async function getProjectMarketDetailAction(id: string): Promise<ActionResult<ProjectMarketDetail>> {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${B2B_BASE_PATH}/project-market/${id}`);
    const rawData = response.data?.data ?? response.data;
    const parsed = projectMarketDetailSchema.safeParse(rawData);
    if (parsed.success) {
      return { success: true, data: parsed.data, error: null };
    }
    return { success: true, data: getMockProjectDetail(id), error: null };
  } catch (_error: unknown) {
    // Fallback to mock data gracefully until backend endpoint is deployed
    return { success: true, data: getMockProjectDetail(id), error: null };
  }
}
