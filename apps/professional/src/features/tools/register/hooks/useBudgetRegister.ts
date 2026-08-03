import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetBudgetListParams } from "../types";
import {
	getBudgetListAPIAction,
	toggleBudgetStatusAPIAction,
	toggleBudgetFavoriteAPIAction,
} from "../api/budgetRegister";

export function useBudgetListQuery(params?: GetBudgetListParams) {
	return useQuery({
		queryKey: ["budgetList", params],
		queryFn: () => getBudgetListAPIAction(params),
	});
}

export function useToggleBudgetStatusMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "inactive" }) =>
			toggleBudgetStatusAPIAction(ids, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgetList"] });
		},
	});
}

export function useToggleBudgetFavoriteMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
			toggleBudgetFavoriteAPIAction(id, isFavorite),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgetList"] });
		},
	});
}
