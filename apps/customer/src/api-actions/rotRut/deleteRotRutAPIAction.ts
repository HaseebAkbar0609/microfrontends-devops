import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";

export type DeleteRotRutParams = {
	projectId: string;
	id: string;
};

export type DeleteRotRutResponse = {
	success: boolean;
	error?: string;
};

export async function deleteRotRutAPIAction(params: DeleteRotRutParams): Promise<DeleteRotRutResponse> {
	try {
		const { data: res } = await axiosInstance.delete<{
			success: boolean;
			message?: string;
		}>(API_PATH.ROT_RUT.delete(params.projectId, params.id));

		if (!res.success) {
			return { success: false, error: res.message ?? "Failed to delete" };
		}

		return { success: true };
	} catch (err: unknown) {
		let message = "Failed to delete";
		if (axios.isAxiosError(err) && err.response?.data?.detail) {
			message = String(err.response.data.detail);
		} else if (err instanceof Error) {
			message = err.message;
		}
		return { success: false, error: message };
	}
}

