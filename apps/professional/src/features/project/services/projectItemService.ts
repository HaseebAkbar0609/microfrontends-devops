import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

export type ProjectItemKind = "timeplan" | "question";

export interface ProjectItemIdentity {
	id: string;
	projectId: string;
	version?: number;
}

interface ProjectItemPage<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
}

function url(projectId: string, kind: ProjectItemKind, itemId?: string) {
	const base = `/professionals/projects/${encodeURIComponent(projectId)}/items/${kind}`;
	return itemId ? `${base}/${encodeURIComponent(itemId)}` : base;
}

function payload(item: object) {
	const data = { ...item } as Record<string, unknown>;
	delete data.id;
	delete data.projectId;
	delete data.version;
	return { data };
}

function requireData<T>(response: ApiResponse<T>): T {
	if (response.data == null) throw new Error("PROJECT_ITEM_RESPONSE_INVALID");
	return response.data;
}

export async function listProjectItems<T extends ProjectItemIdentity>(
	projectId: string, kind: ProjectItemKind,
): Promise<T[]> {
	const rows: T[] = [];
	for (let page = 1; page <= 100; page++) {
		const response = await axiosInstance.get<ApiResponse<ProjectItemPage<T>>>(url(projectId, kind), {
			params: { page, page_size: 500 },
		});
		const result = requireData(response.data);
		rows.push(...result.items);
		if (rows.length >= result.total) return rows;
	}
	throw new Error("PROJECT_ITEMS_TOO_MANY");
}

export async function getProjectItem<T extends ProjectItemIdentity>(
	projectId: string, kind: ProjectItemKind, itemId: string,
): Promise<T> {
	const response = await axiosInstance.get<ApiResponse<T>>(url(projectId, kind, itemId));
	return requireData(response.data);
}

export async function createProjectItem<T extends ProjectItemIdentity>(
	projectId: string, kind: ProjectItemKind, item: object,
): Promise<T> {
	const response = await axiosInstance.post<ApiResponse<T>>(url(projectId, kind), payload(item));
	return requireData(response.data);
}

export async function updateProjectItem<T extends ProjectItemIdentity>(
	projectId: string, kind: ProjectItemKind, item: T,
): Promise<T> {
	if (item.version == null) throw new Error("PROJECT_ITEM_VERSION_MISSING");
	const response = await axiosInstance.put<ApiResponse<T>>(
		url(projectId, kind, item.id), payload(item), { params: { version: item.version } },
	);
	return requireData(response.data);
}

export async function deleteProjectItem(
	projectId: string, kind: ProjectItemKind, item: ProjectItemIdentity,
): Promise<void> {
	if (item.version == null) throw new Error("PROJECT_ITEM_VERSION_MISSING");
	await axiosInstance.delete(url(projectId, kind, item.id), {
		params: { version: item.version },
	});
}
