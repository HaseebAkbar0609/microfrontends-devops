import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetWageTypeListParams, CreateWageTypeFormData } from "../types";
import {
	getWageTypeListAPIAction,
	getWageTypeDetailAPIAction,
	createWageTypeAPIAction,
	updateWageTypeAPIAction,
	toggleWageTypeStatusAPIAction,
} from "../api/wageTypeRegister";

export function useWageTypeListQuery(params?: GetWageTypeListParams) {
	return useQuery({
		queryKey: ["wageTypeList", params],
		queryFn: () => getWageTypeListAPIAction(params),
	});
}

export function useWageTypeDetailQuery(id: string, enabled = true) {
	return useQuery({
		queryKey: ["wageTypeDetail", id],
		queryFn: () => getWageTypeDetailAPIAction(id),
		enabled: Boolean(id) && enabled,
	});
}

export function useCreateWageTypeMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateWageTypeFormData) => createWageTypeAPIAction(data),
		onSuccess: (res) => {
			if (res.success) {
				queryClient.invalidateQueries({ queryKey: ["wageTypeList"] });
			}
		},
	});
}

export function useUpdateWageTypeMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<CreateWageTypeFormData> }) =>
			updateWageTypeAPIAction(id, data),
		onSuccess: (res, variables) => {
			if (res.success) {
				queryClient.invalidateQueries({ queryKey: ["wageTypeList"] });
				queryClient.invalidateQueries({ queryKey: ["wageTypeDetail", variables.id] });
			}
		},
	});
}

export function useToggleWageTypeStatusMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "inactive" }) =>
			toggleWageTypeStatusAPIAction(ids, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["wageTypeList"] });
		},
	});
}
