export type StageMode = "automatic" | "manual";

export interface PipelineStageApiData {
  id: string;
  pipeline_id: string;
  name: string;
  order_index: number;
  is_default: boolean;
  mode: StageMode;
  schedule_config: Record<string, string> | null;
  reshipment_days: number | null;
}

export interface PipelineApiData {
  id: string;
  name: string;
  is_active: boolean;
  stages: PipelineStageApiData[];
}

export interface StageUpdatePayload {
  name?: string;
  order_index?: number;
  mode?: StageMode;
  schedule_config?: Record<string, string> | null;
  reshipment_days?: number | null;
  is_default?: boolean;
}

export interface StageCreatePayload {
  name: string;
  mode?: StageMode;
  schedule_config?: Record<string, string> | null;
  reshipment_days?: number | null;
  is_default?: boolean;
}
