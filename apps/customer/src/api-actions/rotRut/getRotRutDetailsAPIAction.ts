import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { RotRutBackendItem } from "./index";

export type RotOwner = {
	id: string;
	isCoOwner: boolean;
	name: string;
	personalNumber: string;
	sharePercentage: number;
};

export type RotDetails = {
	id: string;
	deductionType: string;
	designation: string;
	address: string;
	created: string;
	owners: RotOwner[];
};

export type GetRotRutDetailsParams = {
	projectId: string;
	id: string;
};

export type GetRotRutDetailsResponse = {
	success: boolean;
	data?: RotDetails;
	error?: string;
};

function formatTimestamp(ts: number | string | null | undefined): string {
	if (!ts) return "";
	const d = typeof ts === "number" ? new Date(ts > 1e11 ? ts : ts * 1000) : new Date(ts);
	if (isNaN(d.getTime())) return String(ts);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export async function getRotRutDetailsAPIAction(params: GetRotRutDetailsParams): Promise<GetRotRutDetailsResponse> {
	try {
		const { data: res } = await axiosInstance.get<{
			success: boolean;
			data: RotRutBackendItem;
			message?: string;
		}>(API_PATH.ROT_RUT.detail(params.projectId, params.id));

		if (!res.success || !res.data) {
			return { success: false, error: res.message ?? "Rot-Rut property not found." };
		}

		const item = res.data;

		const primaryShare = item.share_percentage ?? (item.is_co_owner ? 50 : 100);
		const owners: RotOwner[] = [
			{
				id: `${item.id}-owner`,
				isCoOwner: false,
				name: item.owner_name ?? item.personnummer_masked,
				personalNumber: item.personnummer ?? item.personnummer_masked,
				sharePercentage: primaryShare,
			},
		];

		if (item.is_co_owner && (item.co_owner_personnummer ?? item.co_owner_personnummer_masked)) {
			const coOwnerShare = item.share_percentage != null ? Math.max(0, 100 - item.share_percentage) : 50;
			owners.push({
				id: `${item.id}-co-owner`,
				isCoOwner: true,
				name: item.co_owner_name ?? "Co-owner",
				personalNumber: item.co_owner_personnummer ?? item.co_owner_personnummer_masked ?? "",
				sharePercentage: coOwnerShare,
			});
		}

		return {
			success: true,
			data: {
				id: item.id,
				deductionType: item.deduction_type,
				designation: item.property_id,
				address: item.address ?? item.property_id,
				created: formatTimestamp(item.created_at),
				owners,
			},
		};
	} catch (err: unknown) {
		if (axios.isAxiosError(err) && err.response?.status === 404) {
			return { success: false, error: "Rot-Rut property not found." };
		}
		const message = err instanceof Error ? err.message : "Failed to fetch details";
		return { success: false, error: message };
	}
}
