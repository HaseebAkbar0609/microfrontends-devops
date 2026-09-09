"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { MANAGE_PLANS_PLAN_IDS } from "@/features/manage-plans";
import { CartItemsPanelProps } from "../types";
import { formatCartCurrencyFromOre } from "../utils/currency";

export function CartItemsPanel({
	items,
	subtotal,
	onUpdateQuantity,
	onRemoveItem,
	updatingItemIds = [],
	removingItemIds = [],
}: CartItemsPanelProps) {
	return (
		<div className="min-w-0 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-foreground">
				<span className="text-gray-700">
					<Translate
						text={localizationConstants.manageCartLicensesTitle}
					/>
				</span>
				<span className="text-secondary">
					<Translate
						text={
							localizationConstants.manageCartLicensesTotalLabel
						}
					/>
					:&nbsp;
					{formatCartCurrencyFromOre(subtotal)}
				</span>
			</div>

			<div className="space-y-4 pt-2 text-sm">
				{items.length === 0 ? (
					<p className="text-gray-500">
						<Translate
							text={localizationConstants.manageCartEmptyMessage}
						/>
					</p>
				) : (
					items.map((item) => (
						<div
							key={item.id}
							className="flex flex-col gap-2 border-b border-border pb-4 last:border-b-0 last:pb-0"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0 break-words">
									<p className="font-semibold text-gray-700">
										{item.name}
									</p>
									{item.description ? (
										<p className="text-xs text-muted-foreground">
											{item.description}
										</p>
									) : null}
								</div>
								<p className="shrink-0 text-sm font-medium tabular-nums text-secondary">
									{formatCartCurrencyFromOre(item.unitPrice)}
								</p>
							</div>

							<div className="flex items-center justify-between pt-1">
								{item.planKey === MANAGE_PLANS_PLAN_IDS.FREE ||
								item.planKey ===
									MANAGE_PLANS_PLAN_IDS.START ? null : (
									<div className="inline-flex items-center overflow-hidden rounded-md border border-input">
										<button
											type="button"
											className="h-10 w-10 border-r border-input text-sm hover:bg-accent disabled:opacity-40"
											onClick={() =>
												onUpdateQuantity(item.id, -1)
											}
											disabled={
												item.quantity <= 1 ||
												updatingItemIds.includes(
													item.id,
												)
											}
										>
											-
										</button>
										<span className="min-w-12 px-3 py-2 text-center text-sm font-medium tabular-nums">
											{item.quantity}
										</span>
										<button
											type="button"
											className="h-10 w-10 border-l border-input text-sm hover:bg-accent disabled:opacity-40"
											onClick={() =>
												onUpdateQuantity(item.id, 1)
											}
											disabled={updatingItemIds.includes(
												item.id,
											)}
										>
											+
										</button>
									</div>
								)}

								<Button
									type="button"
									variant="link"
									className="h-auto p-0 text-xs ml-auto"
									onClick={() => onRemoveItem(item.id)}
									disabled={removingItemIds.includes(item.id)}
								>
									<Translate
										text={
											localizationConstants.manageCartRemoveItem
										}
									/>
								</Button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
