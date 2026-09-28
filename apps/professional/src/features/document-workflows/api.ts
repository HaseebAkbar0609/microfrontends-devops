import client from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { Flow, HistoryPage, Target, WorkflowContext, Write } from "./types";

const root = (target: Target) => `/document-workflows/professional_project_document/${encodeURIComponent(target.id)}`;
const params = (target: Target) => ({ parent_id: target.projectId });

export async function getContext(target: Target): Promise<WorkflowContext> {
  const response = await client.get<ApiResponse<WorkflowContext>>(`${root(target)}/context`, { params: params(target) });
  if (!response.data.data) throw new Error("WORKFLOW_CONTEXT_INVALID");
  return response.data.data;
}
export async function getHistory(target: Target, flow: Flow, page: number): Promise<HistoryPage> {
  const response = await client.get<ApiResponse<HistoryPage>>(`${root(target)}/${flow}/history`, { params: { ...params(target), page, page_size: 10 } });
  if (!response.data.data) throw new Error("WORKFLOW_HISTORY_INVALID");
  return response.data.data;
}
export async function writeWorkflow(target: Target, current: WorkflowContext, write: Write) {
  const workflow = current[write.flow];
  const url = `${root(target)}/${write.flow}`;
  const body = { correlation_id: crypto.randomUUID(), reason: write.reason || "",
    ...(workflow ? { expected_version: workflow.version } : {}),
    ...(write.command ? { command: write.command } : { policy: write.policy }) };
  if (write.command) return client.post(`${url}/transitions`, body, { params: params(target) });
  return workflow ? client.put(`${url}/policy`, body, { params: params(target) }) : client.post(url, body, { params: params(target) });
}
