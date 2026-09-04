import { useState, useCallback, useEffect } from "react";
import type {
	PriceListRegisterRow,
	GetPriceListRegisterListParams,
} from "../types";
import {
	getPriceListRegisterListAPIAction,
	togglePriceListFavoriteAPIAction,
	deletePriceListAPIAction,
} from "../api/priceListRegister";

export function usePriceListRegister(initialParams?: GetPriceListRegisterListParams) {
	const [data, setData] = useState<PriceListRegisterRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [params, setParams] = useState<GetPriceListRegisterListParams>(initialParams ?? { page: 1, limit: 10 });

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setHasError(false);
		try {
			const res = await getPriceListRegisterListAPIAction(params);
			setData(res.data);
			setTotalItems(res.total);
		} catch {
			setHasError(true);
		} finally {
			setIsLoading(false);
		}
	}, [params]);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	const toggleFavorite = useCallback(async (id: string) => {
		setData((prev) =>
			prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
		);
		try {
			const success = await togglePriceListFavoriteAPIAction(id);
			if (!success) {
				setData((prev) =>
					prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
				);
			}
		} catch {
			setData((prev) =>
				prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
			);
		}
	}, []);

	const deletePriceList = useCallback(async (id: string) => {
		try {
			const success = await deletePriceListAPIAction(id);
			if (success) {
				setData((prev) => prev.filter((item) => item.id !== id));
				setTotalItems((prev) => prev - 1);
			}
		} catch {
			// Catch unhandled rejection
		}
	}, []);

	return {
		data,
		totalItems,
		isLoading,
		hasError,
		params,
		setParams,
		toggleFavorite,
		deletePriceList,
		refetch: fetchData,
	};
}
