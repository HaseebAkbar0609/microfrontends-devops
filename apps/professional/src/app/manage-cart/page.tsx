"use client";

import { useEffect, useState } from "react";

import {
	deleteCartItemAction,
	getCartAction,
	updateCartItemQuantityAction,
} from "@/api-actions";
import { CartItemsPanel } from "@/features/manage-cart/components/CartItemsPanel";
import { CartSummaryPanel } from "@/features/manage-cart/components/CartSummaryPanel";
import { ConfirmSubscription } from "@/features/manage-cart/components/ConfirmSubscription";
import { CartItem, CartStep } from "@/features/manage-cart/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export default function ManageCartPage() {
	const [isPlanChange, setIsPlanChange] = useState(false);
	const [items, setItems] = useState<CartItem[]>([]);
	const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);
	const [removingItemIds, setRemovingItemIds] = useState<string[]>([]);
	const [totalCartAmount, setTotalCartAmount] = useState(0);

	const [discountCode, setDiscountCode] = useState("");
	const [step, setStep] = useState<CartStep>("cart");

	const fetchCart = async () => {
		const result = await getCartAction();
		if (!result.success || !result.data) {
			setItems([]);
			setTotalCartAmount(0);
			return;
		}

		const mappedItems: CartItem[] = result.data.items.map((item) => {
			const planKey = item.subscription_plan.plan_key;
			const description = item.subscription_plan.is_license
				? "Licenses"
				: "Plans";
			return {
				id: item.id,
				name: `TimeFlow - ${planKey.charAt(0).toUpperCase()}${planKey.slice(
					1,
				)}`,
				description,
				planKey,
				unitPrice: item.subscription_plan_price.price,
				interval: item.subscription_plan_price.interval,
				quantity: item.quantity,
				itemTotalAmount: item.item_total_amount ?? 0,
			};
		});

		setItems(mappedItems);
		setTotalCartAmount(
			result.data.total_cart_amount
				? result.data.total_cart_amount
				: mappedItems.reduce(
						(sum, item) => sum + item.unitPrice * item.quantity,
						0,
					),
		);
	};

	useEffect(() => {
		setIsPlanChange(
			new URLSearchParams(window.location.search).get("mode") === "change",
		);
		fetchCart();
	}, []);

	const subtotal = totalCartAmount;
	const total = totalCartAmount;

	const updateQuantity = async (id: string, delta: number) => {
		if (updatingItemIds.includes(id)) return;

		const selectedItem = items.find((item) => item.id === id);
		if (!selectedItem) return;

		const nextQuantity = Math.max(1, selectedItem.quantity + delta);
		if (nextQuantity === selectedItem.quantity) return;

		setUpdatingItemIds((prev) => [...prev, id]);
		try {
			const result = await updateCartItemQuantityAction(id, nextQuantity);
			if (!result.success) return;

			await fetchCart();
		} finally {
			setUpdatingItemIds((prev) =>
				prev.filter((itemId) => itemId !== id),
			);
		}
	};

	const removeItem = async (id: string) => {
		if (removingItemIds.includes(id)) return;

		setRemovingItemIds((prev) => [...prev, id]);
		const result = await deleteCartItemAction(id);
		setRemovingItemIds((prev) => prev.filter((itemId) => itemId !== id));

		if (!result.success) return;

		await fetchCart();
	};

	return (
		<>
			<main className="flex-1 bg-background p-6 md:p-8 md:px-12 h-[calc(100vh-72px)] overflow-y-auto">
				<div className="mx-auto space-y-4">
					<h1 className="text-2xl font-bold text-secondary">
						<Translate
							text={localizationConstants.manageCartTitle}
						/>
					</h1>

					{step === "cart" ? (
						<div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
							<CartItemsPanel
								items={items}
								subtotal={subtotal}
								onUpdateQuantity={updateQuantity}
								onRemoveItem={removeItem}
								updatingItemIds={updatingItemIds}
								removingItemIds={removingItemIds}
							/>
							<CartSummaryPanel
								subtotal={subtotal}
								total={total}
								discountCode={discountCode}
								onDiscountCodeChange={setDiscountCode}
								onProceed={() => setStep("confirm")}
								disabled={items.length === 0}
							/>
						</div>
					) : (
						<ConfirmSubscription
							items={items}
							subtotal={subtotal}
							total={total}
							onBackToCart={() => setStep("cart")}
							isPlanChange={isPlanChange}
						/>
					)}
				</div>
			</main>
		</>
	);
}
