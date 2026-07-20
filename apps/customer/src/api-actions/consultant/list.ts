import type { ActionResult } from "@/types/api";
import type { Consultant } from "@/features/consultant/types/consultant";
import { DUMMY_CONSULTANTS } from "@/features/consultant/constants";

export interface GetConsultantListParams {
	page?: number;
	pageSize?: number;
	search?: string;
	status?: string;
	type?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface ConsultantListPayload {
	consultants: Consultant[];
	totalItems: number;
}

export async function getConsultantListAPIAction(
	params: GetConsultantListParams = {},
): Promise<ActionResult<ConsultantListPayload>> {
	const {
		page = 1,
		pageSize = 10,
		search,
		status,
		type,
		sortBy,
		sortOrder = "asc",
	} = params;

	try {
		let rows = [...DUMMY_CONSULTANTS];

		const q = search?.trim().toLowerCase();
		if (q) {
			rows = rows.filter(
				(c) =>
					c.name.toLowerCase().includes(q) ||
					c.project.toLowerCase().includes(q) ||
					c.type.toLowerCase().includes(q),
			);
		}

		if (status) {
			rows = rows.filter((c) => c.status === status);
		}

		if (type) {
			rows = rows.filter((c) => c.type === type);
		}

		const dir = sortOrder === "desc" ? -1 : 1;
		if (sortBy === "name") {
			rows.sort((a, b) => a.name.localeCompare(b.name) * dir);
		} else if (sortBy === "updatedAt") {
			rows.sort((a, b) => (a.updatedAt < b.updatedAt ? -1 : 1) * dir);
		} else {
			rows.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
		}

		const totalItems = rows.length;
		const start = (page - 1) * pageSize;
		const consultants = rows.slice(start, start + pageSize);

		return {
			success: true,
			data: { consultants, totalItems },
			error: null,
		};
	} catch (error) {
		return {
			success: false,
			data: null,
			error:
				error instanceof Error
					? error.message
					: "Failed to load consultants",
		};
	}
}
