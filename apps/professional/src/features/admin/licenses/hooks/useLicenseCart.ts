"use client";

import { useMemo, useState } from "react";
import {
	LicenseCartItem,
	LicensePackage,
	LicenseTabId,
	LicenseVersionOption,
	PAYMENT_CYCLES,
	PaymentCycleId,
} from "../constants/licenseCatalog.constants";
import { getInitialCartItems } from "../services/licenseService";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "@/lib/toast";
import { createCheckoutSession } from "../../users/api/adminUsers.api";

export interface AddPackageSelection {
	versionOption?: LicenseVersionOption;
	checkedOptions?: LicenseVersionOption[];
}

export function useLicenseCart() {
	const [items, setItems] = useState<LicenseCartItem[]>(() =>
		getInitialCartItems(),
	);
	const [paymentCycle, setPaymentCycle] = useState<PaymentCycleId>("monthly");

	const upsert = (
		current: LicenseCartItem[],
		entry: Omit<LicenseCartItem, "quantity">,
	): LicenseCartItem[] => {
		const existing = current.find((item) => item.id === entry.id);
		if (existing)
			return current.map((item) =>
				item.id === entry.id
					? { ...item, quantity: item.quantity + 1 }
					: item,
			);
		return [{ ...entry, quantity: 1 }, ...current];
	};

	const changeQuantity = (itemId: string, delta: number) => {
		setItems((current) =>
			current
				.map((item) =>
					item.id === itemId
						? { ...item, quantity: item.quantity + delta }
						: item,
				)
				.filter((item) => item.quantity > 0),
		);
	};

	const addPackage = (
		pkg: LicensePackage,
		sourceTab: LicenseTabId,
		selection?: AddPackageSelection,
	) => {
		setItems((current) => {
			if (pkg.versionChecklist) {
				const checked = selection?.checkedOptions ?? [];
				return checked.reduce(
					(acc, option) =>
						upsert(acc, {
							id: option.id,
							name: option.label,
							price: option.price ?? 0,
							sourceTab,
							showPrice: false,
						}),
					current,
				);
			}
			if (pkg.versionOptions) {
				const option =
					selection?.versionOption ?? pkg.versionOptions[0];
				return upsert(current, {
					id: option.id,
					name: option.label,
					price: option.price ?? 0,
					sourceTab,
					showPrice: true,
				});
			}
			return upsert(current, {
				id: pkg.id,
				name: pkg.name,
				price: pkg.price ?? 0,
				sourceTab,
				showPrice: true,
			});
		});
	};

	const clearCart = () => setItems([]);

	// TODO: Final pricing must be re-validated server-side during checkout —
	// this client-side total is for UI display only and must never be
	// trusted as the transaction amount.
	const total = useMemo(() => {
		const subtotal = items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		const discount =
			PAYMENT_CYCLES.find((cycle) => cycle.id === paymentCycle)
				?.discount ?? 0;
		return Math.round(subtotal * (1 - discount));
	}, [items, paymentCycle]);

	const checkoutMutation = useMutation({
		mutationFn: createCheckoutSession,
		onSuccess: (data) => {
			if (data?.data?.url) {
				window.location.href = data.data.url;
			}
		},
		onError: (error) => {
			const message = axios.isAxiosError(error)
				? (error.response?.data as { message?: string } | undefined)?.message
				: undefined;
			showToast("error", message || "Could not start checkout. Please try again.");
		},
	});

	return {
		items,
		paymentCycle,
		setPaymentCycle,
		changeQuantity,
		addPackage,
		clearCart,
		total,
		checkoutMutation,
	};
}
