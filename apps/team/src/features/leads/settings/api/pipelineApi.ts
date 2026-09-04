import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { 
  PipelineApiData, 
  StageCreatePayload, 
  StageUpdatePayload 
} from "../types/pipelineApi";

export const StageApiSchema = z.object({
  id: z.string(),
  pipeline_id: z.string().optional().default(""),
  name: z.string(),
  mode: z.enum(["automatic", "manual"]).optional().default("manual"),
  order_index: z.number().optional().default(0),
  is_default: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  schedule_config: z.record(z.any()).optional().nullable(),
  reshipment_days: z.number().optional().nullable(),
}).passthrough();

export const PipelineApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean().optional().default(true),
  is_default: z.boolean().optional().default(false),
  stages: z.array(StageApiSchema).optional().default([]),
}).passthrough();

export const PipelinesApiResponseSchema = z.object({
  data: z.array(PipelineApiSchema).optional().default([]),
}).passthrough();

export const SinglePipelineApiResponseSchema = z.object({
  data: PipelineApiSchema,
}).passthrough();

export const fetchPipelines = async (): Promise<PipelineApiData[]> => {
  const { data } = await axiosInstance.get("/api/v1/teams/pipelines");
  const parsed = PipelinesApiResponseSchema.parse(data);
  return (parsed.data || []) as PipelineApiData[];
};

export const createPipeline = async (name: string): Promise<PipelineApiData> => {
  const { data } = await axiosInstance.post("/api/v1/teams/pipelines", { name });
  const parsed = SinglePipelineApiResponseSchema.parse(data);
  return parsed.data as PipelineApiData;
};

export const createStage = async (pipelineId: string, payload: StageCreatePayload): Promise<Record<string, unknown>> => {
  const { data } = await axiosInstance.post<{ data: Record<string, unknown> }>(
    `/api/v1/teams/pipelines/${pipelineId}/stages`, 
    payload
  );
  return data.data;
};

export const updateStage = async (pipelineId: string, stageId: string, payload: StageUpdatePayload): Promise<Record<string, unknown>> => {
  const { data } = await axiosInstance.patch<{ data: Record<string, unknown> }>(
    `/api/v1/teams/pipelines/${pipelineId}/stages/${stageId}`, 
    payload
  );
  return data.data;
};

export const deleteStage = async (pipelineId: string, stageId: string): Promise<boolean> => {
  const { data } = await axiosInstance.delete<{ success: boolean }>(
    `/api/v1/teams/pipelines/${pipelineId}/stages/${stageId}`
  );
  return data.success;
};
