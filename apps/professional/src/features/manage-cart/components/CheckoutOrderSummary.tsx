import { FormInput } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

import type { CheckoutOrderSummaryProps } from "../types";
import { formatCartCurrencyFromOre } from "../utils/currency";

export function CheckoutOrderSummary({
	mainItem,
	subtotal,
	total,
	showDiscountCode = false,
	control,
}: CheckoutOrderSummaryProps) {
	return (
		<aside className="h-fit min-w-0 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-secondary">
					<Translate
						text={
							localizationConstants.manageCartCheckoutOrderSummaryTitle
						}
					/>
				</h2>
			</div>

			{/* <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
				<div className="flex items-start gap-3">
					<div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
						<span className="text-sm font-semibold">TF</span>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-semibold text-secondary">
							<Translate
								text={
									localizationConstants.manageCartCheckoutMembershipTitle
								}
							/>
						</p>
						<p className="text-xs text-gray-500">
							{mainItem?.name ?? "—"}
						</p>
						<p className="text-xs text-gray-500">
							{formatCartCurrencyFromOre(mainItem?.unitPrice ?? 0)} · Billing{" "}
							{mainItem?.interval ?? "—"}
						</p>
					</div>
				</div>
				<p className="text-sm font-semibold text-secondary">
					{formatCartCurrencyFromOre(subtotal)}
				</p>
			</div> */}

			{mainItem?.map((item) => (
				<div
					key={item.id}
					className="flex items-start justify-between gap-3 border-b border-border pb-4"
				>
					<div className="flex min-w-0 items-start gap-3">
						<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<span className="text-sm font-semibold">TF</span>
						</div>

						<div className="min-w-0 space-y-1 break-words">
							<p className="text-sm font-semibold text-secondary">
								<Translate
									text={
										localizationConstants.manageCartCheckoutMembershipTitle
									}
								/>
							</p>

							<p className="text-xs text-gray-500">
								{item.name ?? "—"}
							</p>

							<p className="text-xs text-gray-500">
								{formatCartCurrencyFromOre(item.unitPrice ?? 0)} ·
								Billing {item.interval ?? "—"}
							</p>
						</div>
					</div>

					<p className="shrink-0 text-sm font-semibold tabular-nums text-secondary">
						{formatCartCurrencyFromOre(item.itemTotalAmount ?? 0)}
					</p>
				</div>
			))}

			{showDiscountCode && control ? (
				<div className="flex flex-col gap-2">
					<p className="text-sm text-secondary font-semibold">
						<Translate
							text={
								localizationConstants.manageCartCheckoutDiscountCodeTitle
							}
						/>
					</p>
					<FormInput
						control={control}
						name="discountCode"
						placeholder={
							localizationConstants.manageCartCheckoutDiscountCodePlaceholder
						}
						className="h-11 w-full"
					/>
				</div>
			) : null}

			<div className="pt-1 text-sm text-foreground">
				<div className="flex items-center justify-between border-b border-t border-border py-2">
					<span className="text-gray-700">
						<Translate
							text={localizationConstants.manageCartSubtotalLabel}
						/>
					</span>
					<span className="text-secondary">
						{formatCartCurrencyFromOre(subtotal)}
					</span>
				</div>
				<div className="flex items-center justify-between font-semibold border-b border-border py-2">
					<span className="text-base text-gray-700">
						<Translate
							text={localizationConstants.manageCartTotalLabel}
						/>
					</span>
					<span className="text-base text-secondary">
						{formatCartCurrencyFromOre(total)}
					</span>
				</div>
			</div>
		</aside>
	);
}
