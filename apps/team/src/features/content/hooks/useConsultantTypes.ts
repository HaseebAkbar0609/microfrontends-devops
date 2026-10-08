"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	createConsultantType,
	deleteConsultantType,
	listConsultantTypes,
	patchConsultantType,
} from "../api/consultantTypesApi";
import { CONSULTANT_TYPES_QUERY_KEY } from "../constants/content.constants";
import type { ConsultantType, ConsultantTypeInput } from "../types";
import { apiErrorStatus, apiErrorText } from "../utils/apiErrors";

const EMPTY_TYPES: ConsultantType[] = [];

function deleteFailedKey(status: number | undefined): TranslationKeys {
	if (status === 404) return localizationConstants.contentConsultantTypeNotFound;
	if (status === 409) return localizationConstants.contentConsultantTypeInUse;
	return localizationConstants.contentConsultantTypeDeleteFailed;
}

/**
 * The consultant types the customer's "Hitta hjälp › Konsult" page lists.
 * Unlike the other Kund sections these live on the server, not in the provider.
 */
export function useConsultantTypes() {
	const client = useQueryClient();
	const t = useTranslate();
	const query = useQuery({
		queryKey: CONSULTANT_TYPES_QUERY_KEY,
		queryFn: listConsultantTypes,
	});

	const upsert = useCallback((saved: ConsultantType) => {
		client.setQueryData<ConsultantType[]>(CONSULTANT_TYPES_QUERY_KEY, (current = []) =>
			current.some((type) => type.id === saved.id)
				? current.map((type) => (type.id === saved.id ? saved : type))
				: [...current, saved],
		);
	}, [client]);

	// Refetched after every write, without holding up the caller: the server
	// owns the order and `in_use`.
	const refresh = useCallback(() => {
		void client.invalidateQueries({ queryKey: CONSULTANT_TYPES_QUERY_KEY });
	}, [client]);

	const create = useMutation({
		mutationFn: (input: ConsultantTypeInput) => createConsultantType(input),
		onSuccess: upsert,
		onSettled: refresh,
	});

	const update = useMutation({
		mutationFn: ({ id, input }: { id: string; input: ConsultantTypeInput }) =>
			patchConsultantType(id, input),
		onSuccess: upsert,
		onSettled: refresh,
	});

	const remove = useMutation({
		mutationFn: (id: string) => deleteConsultantType(id),
		onSuccess: (_data, id) => {
			client.setQueryData<ConsultantType[]>(CONSULTANT_TYPES_QUERY_KEY, (current = []) =>
				current.filter((type) => type.id !== id),
			);
		},
		onSettled: refresh,
	});
	const { mutateAsync: removeAsync } = remove;

	/** Resolves true once the type is gone; a refusal is shown as a toast. */
	const deleteType = useCallback(async (id: string) => {
		try {
			await removeAsync(id);
			showToast("success", t(localizationConstants.contentConsultantTypeDeletedToast));
			return true;
		} catch (error) {
			const status = apiErrorStatus(error);
			showToast("error", apiErrorText(error, t(deleteFailedKey(status))));
			// A 404 means it is gone already, which is what the user asked for.
			return status === 404;
		}
	}, [removeAsync, t]);

	return {
		types: query.data ?? EMPTY_TYPES,
		isLoading: query.isPending,
		// Only a failed first load: a failed background refetch keeps the cached list.
		isError: query.isLoadingError,
		refetch: query.refetch,
		create,
		update,
		deleteType,
		deletingId: remove.isPending ? remove.variables : undefined,
	};
}

export type ConsultantTypesState = ReturnType<typeof useConsultantTypes>;
