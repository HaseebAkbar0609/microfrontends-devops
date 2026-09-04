import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";

export interface RotPayload {
	propertyId: string;
	personalId: string;
	isCoOwner: boolean;
	coOwnerPersonalId?: string;
	address?: string;
	ownerName?: string;
	sharePercentage?: number;
	eligibleAmount?: number;
}

export interface Owner {
	id: string;
	name: string;
	personalId: string;
	share: string;
}

export interface RotEntry {
	id: string;
	propertyId: string;
	address: string;
	createdAt: string;
	owners: {
		id: string;
		name: string;
	}[];
}

export interface RotRutBackendItem {
	id: string;
	deduction_type: string;
	status: string;
	personnummer_masked: string;
	personnummer?: string;
	property_id: string;
	is_co_owner: boolean;
	co_owner_personnummer_masked: string | null;
	co_owner_personnummer?: string | null;
	co_owner_name?: string | null;
	eligible_amount: number;
	deduction_rate: number;
	deduction_amount: number;
	used_amount: number;
	remaining_amount: number;
	project_id: string;
	address: string | null;
	owner_name: string | null;
	share_percentage: number | null;
	notes: string | null;
	created_at: number;
	updated_at: number;
}

function formatTimestamp(ts: number | string | null | undefined): string {
	if (!ts) return "";
	const d = typeof ts === "number" ? new Date(ts > 1e11 ? ts : ts * 1000) : new Date(ts);
	if (isNaN(d.getTime())) return String(ts);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function mapBackendItemToRotEntry(item: RotRutBackendItem): RotEntry {
	const owners = [
		{
			id: `${item.id}-owner`,
			name: item.owner_name ?? item.personnummer_masked,
		},
	];
	if (item.is_co_owner && (item.co_owner_name || item.co_owner_personnummer_masked)) {
		owners.push({
			id: `${item.id}-co-owner`,
			name: item.co_owner_name ?? item.co_owner_personnummer_masked ?? "Co-owner",
		});
	}
	return {
		id: item.id,
		propertyId: item.property_id,
		address: item.address ?? item.property_id,
		createdAt: formatTimestamp(item.created_at),
		owners,
	};
}

function mapBackendItemToOwner(item: RotRutBackendItem): Owner {
	return {
		id: item.id,
		name: item.owner_name ?? item.personnummer_masked,
		personalId: item.personnummer_masked,
		share: item.share_percentage ? `${item.share_percentage}%` : "100%",
	};
}

export const getOwners = async (
	projectId: string,
	type: "rot" | "rut" = "rot",
	pageSize = 100
): Promise<Owner[]> => {
	if (!projectId) return [];
	try {
		const { data } = await axiosInstance.get<{
			success: boolean;
			data: RotRutBackendItem[];
		}>(API_PATH.ROT_RUT.list(projectId), {
			params: { type, page_size: pageSize },
		});
		if (data.success && Array.isArray(data.data)) {
			return data.data.map(mapBackendItemToOwner);
		}
		return [];
	} catch {
		return [];
	}
};

const digitsOnly = (v: string) => v.replace(/\D/g, "");

const createRotRut = async (
	projectId: string,
	deductionType: "rot" | "rut",
	payload: RotPayload
) => {
	const normalizedCoOwnerId = digitsOnly(payload.coOwnerPersonalId ?? "") || undefined;
	const isCoOwner = payload.isCoOwner;

	return axiosInstance.post(API_PATH.ROT_RUT.create(projectId), {
		deduction_type: deductionType,
		personnummer: digitsOnly(payload.personalId),
		property_id: payload.propertyId,
		eligible_amount: payload.eligibleAmount ?? 0,
		is_co_owner: isCoOwner,
		co_owner_personnummer: isCoOwner ? (normalizedCoOwnerId ?? null) : undefined,
		address: payload.address,
		owner_name: payload.ownerName,
		share_percentage: payload.sharePercentage,
	});
};

export const createRot = (projectId: string, payload: RotPayload) =>
	createRotRut(projectId, "rot", payload);

export const createRut = (projectId: string, payload: RotPayload) =>
	createRotRut(projectId, "rut", payload);

export * from "./getRotRutDetailsAPIAction";
export * from "./deleteRotRutAPIAction";
export * from "./updateRotRutOwnerAPIAction";

export const getRotEntries = async (
	projectId: string,
	params?: {
		page?: number;
		pageSize?: number;
		search?: string;
		sortBy?: string;
		sortOrder?: "asc" | "desc" | null;
	}
): Promise<{ success: boolean; data?: { rotEntries: RotEntry[]; totalItems: number }; error?: string }> => {
	try {
		if (!projectId) return { success: true, data: { rotEntries: [], totalItems: 0 } };
		const page = params?.page ?? 1;
		const pageSize = params?.pageSize ?? 10;

		const apiParams: Record<string, unknown> = { type: "rot", page, page_size: pageSize };
		if (params?.search) apiParams.search = params.search;
		if (params?.sortBy) {
			apiParams.sort_by = params.sortBy;
			if (params.sortOrder) apiParams.sort_order = params.sortOrder;
		}
		const { data: res } = await axiosInstance.get<{
			success: boolean;
			data: RotRutBackendItem[];
			total_items: number;
			message?: string;
		}>(API_PATH.ROT_RUT.list(projectId), {
			params: apiParams,
		});

		if (!res.success) {
			return { success: false, error: res.message ?? "Failed to fetch ROT entries" };
		}

		const items = (res.data ?? []).map(mapBackendItemToRotEntry);

		return {
			success: true,
			data: { rotEntries: items, totalItems: res.total_items ?? items.length },
		};
	} catch (err: unknown) {
		let message = "Failed to fetch ROT entries";
		if (axios.isAxiosError(err) && err.response?.data?.detail) {
			message = String(err.response.data.detail);
		} else if (err instanceof Error) {
			message = err.message;
		}
		return { success: false, error: message };
	}
};

export const getRutEntries = async (
	projectId: string,
	params?: {
		page?: number;
		pageSize?: number;
		search?: string;
		sortBy?: string;
		sortOrder?: "asc" | "desc" | null;
	}
): Promise<{ success: boolean; data?: { rutEntries: RotEntry[]; totalItems: number }; error?: string }> => {
	try {
		if (!projectId) return { success: true, data: { rutEntries: [], totalItems: 0 } };
		const page = params?.page ?? 1;
		const pageSize = params?.pageSize ?? 10;

		const apiParams: Record<string, unknown> = { type: "rut", page, page_size: pageSize };
		if (params?.search) apiParams.search = params.search;
		if (params?.sortBy) {
			apiParams.sort_by = params.sortBy;
			if (params.sortOrder != null) apiParams.sort_order = params.sortOrder;
		}

		const { data: res } = await axiosInstance.get<{
			success: boolean;
			data: RotRutBackendItem[];
			total_items: number;
			message?: string;
		}>(API_PATH.ROT_RUT.list(projectId), {
			params: apiParams,
		});

		if (!res.success) {
			return { success: false, error: res.message ?? "Failed to fetch RUT entries" };
		}

		const items = (res.data ?? []).map(mapBackendItemToRotEntry);

		return {
			success: true,
			data: { rutEntries: items, totalItems: res.total_items ?? items.length },
		};
	} catch (err: unknown) {
		let message = "Failed to fetch RUT entries";
		if (axios.isAxiosError(err) && err.response?.data?.detail) {
			message = String(err.response.data.detail);
		} else if (err instanceof Error) {
			message = err.message;
		}
		return { success: false, error: message };
	}
};

