"use client";

import { useMemo, useState } from "react";
import {
	LicenseCartItem,
	LicensePackage,
	PAYMENT_CYCLES,
	PaymentCycleId,
} from "../constants/mockData";
import { getInitialCartItems } from "../services/licenseService";

export function useLicenseCart() {
	const [items, setItems] = useState<LicenseCartItem[]>(() =>
		getInitialCartItems(),
	);
	const [paymentCycle, setPaymentCycle] = useState<PaymentCycleId>("monthly");

	const changeQuantity = (packageId: string, delta: number) => {
		setItems((current) =>
			current
				.map((item) =>
					item.packageId === packageId
						? { ...item, quantity: item.quantity + delta }
						: item,
				)
				.filter((item) => item.quantity > 0),
		);
	};

	const addPackage = (pkg: LicensePackage) => {
		setItems((current) => {
			const existing = current.find((item) => item.packageId === pkg.id);
			if (existing)
				return current.map((item) =>
					item.packageId === pkg.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				);
			return [
				...current,
				{
					packageId: pkg.id,
					name: pkg.name,
					price: pkg.price,
					quantity: 1,
				},
			];
		});
	};

	const clearCart = () => setItems([]);

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

	return {
		items,
		paymentCycle,
		setPaymentCycle,
		changeQuantity,
		addPackage,
		clearCart,
		total,
	};
}
