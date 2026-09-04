import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";

export interface UpdateRotRutOwnerParams {
	projectId: string;
	id: string;
	isCoOwner: boolean;
	coOwnerPersonalId?: string | null;
}

export interface UpdateRotRutOwnerResult {
	success: boolean;
	error?: string;
}

const digitsOnly = (v: string) => v.replace(/\D/g, "");

export const updateRotRutOwnerAPIAction = async (
	params: UpdateRotRutOwnerParams
): Promise<UpdateRotRutOwnerResult> => {
	try {
		const normalizedCoOwnerId = params.isCoOwner && params.coOwnerPersonalId
			? digitsOnly(params.coOwnerPersonalId) || null
			: null;

		const res = await axiosInstance.patch<{ success: boolean; message?: string }>(
			API_PATH.ROT_RUT.update(params.projectId, params.id),
			{
				is_co_owner: params.isCoOwner,
				co_owner_personnummer: normalizedCoOwnerId,
			}
		);
		if (res.data.success) {
			return { success: true };
		}
		return {
			success: false,
			error: res.data.message || "Failed to update owner",
		};
	} catch (err: unknown) {
		let message = "Failed to update owner";
		if (axios.isAxiosError(err) && err.response?.data?.detail) {
			message = String(err.response.data.detail);
		} else if (err instanceof Error) {
			message = err.message;
		}
		return { success: false, error: message };
	}
};
