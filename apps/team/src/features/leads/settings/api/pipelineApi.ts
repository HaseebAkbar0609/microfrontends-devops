import axiosInstance from "@/lib/axiosInstance";
import type { 
  PipelineApiData, 
  StageCreatePayload, 
  StageUpdatePayload 
} from "../types/pipelineApi";

export const fetchPipelines = async (): Promise<PipelineApiData[]> => {
  const { data } = await axiosInstance.get<{ data: PipelineApiData[] }>("/api/v1/teams/pipelines");
  return data.data || [];
};

export const createPipeline = async (name: string): Promise<PipelineApiData> => {
  const { data } = await axiosInstance.post<{ data: PipelineApiData }>("/api/v1/teams/pipelines", { name });
  return data.data;
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
