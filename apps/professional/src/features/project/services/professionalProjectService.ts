import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { CreateProjectFormData } from "../create/types";
import type { ProjectListItem } from "../data/projectsOverview.mock";

const URL = "/professionals/projects";
const PAGE_SIZE = 500;

export interface ProfessionalProjectRecord extends ProjectListItem {
	isDraft: boolean;
	version: number;
	data: CreateProjectFormData;
}

interface ProjectPage {
	items: ProfessionalProjectRecord[];
	total: number;
	page: number;
	pageSize: number;
}

export async function listProfessionalProjects(archived: boolean): Promise<ProfessionalProjectRecord[]> {
	const rows: ProfessionalProjectRecord[] = [];
	for (let page = 1; page <= 100; page++) {
		const response = await axiosInstance.get<ApiResponse<ProjectPage>>(URL, {
			params: { archived, page, page_size: PAGE_SIZE },
		});
		const result = response.data.data;
		if (!result) throw new Error("PROJECT_LIST_RESPONSE_INVALID");
		rows.push(...result.items);
		if (rows.length >= result.total) return rows;
	}
	throw new Error("PROJECT_LIST_TOO_LARGE");
}

export async function getProfessionalProject(id: string): Promise<ProfessionalProjectRecord> {
	const response = await axiosInstance.get<ApiResponse<ProfessionalProjectRecord>>(
		`${URL}/${encodeURIComponent(id)}`,
	);
	if (!response.data.data) throw new Error("PROJECT_RESPONSE_INVALID");
	return response.data.data;
}

export async function saveProfessionalProject(
	data: CreateProjectFormData,
	isDraft: boolean,
	existing?: { id: string; version: number },
): Promise<ProfessionalProjectRecord> {
	const response = existing
		? await axiosInstance.put<ApiResponse<ProfessionalProjectRecord>>(
			`${URL}/${encodeURIComponent(existing.id)}`,
			{ data, isDraft },
			{ params: { version: existing.version } },
		)
		: await axiosInstance.post<ApiResponse<ProfessionalProjectRecord>>(URL, { data, isDraft });
	if (!response.data.data) throw new Error("PROJECT_SAVE_RESPONSE_INVALID");
	return response.data.data;
}

export async function archiveProfessionalProject(
	project: ProjectListItem,
	archived: boolean,
): Promise<void> {
	if (project.version == null) throw new Error("PROJECT_VERSION_MISSING");
	await axiosInstance.patch(`${URL}/${encodeURIComponent(project.id)}/archive`,
		{ archived }, { params: { version: project.version } });
}

export async function deleteProfessionalProject(project: ProjectListItem): Promise<void> {
	if (project.version == null) throw new Error("PROJECT_VERSION_MISSING");
	await axiosInstance.delete(`${URL}/${encodeURIComponent(project.id)}`,
		{ params: { version: project.version } });
}
