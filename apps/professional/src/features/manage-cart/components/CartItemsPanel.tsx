"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { MANAGE_PLANS_PLAN_IDS } from "@/features/manage-plans";
import { CartItemsPanelProps } from "../types";
import { formatCurrency } from "@/lib/utils";

export function CartItemsPanel({
	items,
	subtotal,
	onUpdateQuantity,
	onRemoveItem,
	updatingItemIds = [],
	removingItemIds = [],
}: CartItemsPanelProps) {
	return (
		<div className="space-y-4 rounded-[10px] bg-white p-6">
			<div className="flex items-center justify-between text-sm font-semibold text-foreground">
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
					{formatCurrency(subtotal / 100)}
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
							<div className="flex items-center justify-between">
								<div>
									<p className="font-semibold text-gray-700">
										{item.name}
									</p>
									{item.description ? (
										<p className="text-xs text-muted-foreground">
											{item.description}
										</p>
									) : null}
								</div>
								<p className="text-sm font-medium text-secondary">
									{formatCurrency(item.unitPrice / 100)}
								</p>
							</div>

							<div className="flex items-center justify-between pt-1">
								{item.planKey === MANAGE_PLANS_PLAN_IDS.FREE ||
								item.planKey ===
									MANAGE_PLANS_PLAN_IDS.START ? null : (
									<div className="inline-flex items-center overflow-hidden rounded-md border border-input">
										<button
											type="button"
											className="border-r border-input px-3 py-1.5 text-sm hover:bg-accent"
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
										<span className="px-4 py-1.5 text-sm">
											{item.quantity}
										</span>
										<button
											type="button"
											className="border-l border-input px-3 py-1.5 text-sm hover:bg-accent"
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
