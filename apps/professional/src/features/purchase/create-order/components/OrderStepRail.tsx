"use client";

import Link from "next/link";
import { Check, Send, Store } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PURCHASE_MODULE_BASE_URL } from "../../data/purchaseNav.config";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { TOTAL_ORDER_STEPS, type OrderStep } from "../useCreatePurchaseOrderForm";

export interface OrderStepRailProps {
	step: OrderStep;
	onSend: () => void;
	/** Supplier picked on step 1; enables the "Öppna leverantör" link. */
	supplierId?: string;
}

const STEP_LABELS: TranslationKeys[] = [
	localizationConstants.purchaseOrderTabObject,
	localizationConstants.purchaseOrderTabContact,
	localizationConstants.purchaseOrderTabSpecification,
];

/**
 * The right-hand progress rail.
 *
 * The frames disagree on the step count — one subtitle reads "Step 2/4" while
 * its own rail reads "Step 2/3" — so three is used throughout, matching the
 * three tabs that actually exist.
 */
export function OrderStepRail({
	step,
	onSend,
	supplierId,
}: OrderStepRailProps) {
	const t = useTranslate();

	return (
		<div className="w-full shrink-0 xl:w-72">
			<div className="sticky top-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-none">
				<div className="space-y-2.5">
					<p className="text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.stepLabel} />{" "}
						{step}/{TOTAL_ORDER_STEPS}
					</p>
					<div
						className="h-1.5 w-full rounded-full bg-slate-200"
						role="progressbar"
						aria-valuenow={step}
						aria-valuemin={1}
						aria-valuemax={TOTAL_ORDER_STEPS}
						aria-label={t(localizationConstants.stepLabel)}
					>
						<div
							className="h-1.5 rounded-full bg-slate-900 transition-all"
							style={{
								width: `${(step / TOTAL_ORDER_STEPS) * 100}%`,
							}}
						/>
					</div>
				</div>

				<ol className="space-y-1">
					{STEP_LABELS.map((label, index) => {
						const value = index + 1;
						const done = value < step;
						const current = value === step;

						return (
							<li
								key={label}
								aria-current={current ? "step" : undefined}
								className={cn(
									"flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
									current
										? "bg-slate-100 font-semibold text-slate-900"
										: done
											? "text-slate-500"
											: "text-slate-400",
								)}
							>
								<span
									className={cn(
										"flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
										current
											? "bg-slate-900 text-white"
											: done
												? "bg-emerald-100 text-emerald-700"
												: "bg-slate-200 text-slate-500",
									)}
								>
									{done ? (
										<Check className="h-3 w-3" aria-hidden />
									) : (
										value
									)}
								</span>
								<Translate text={label} />
							</li>
						);
					})}
				</ol>

				{step === TOTAL_ORDER_STEPS && (
					<div className="space-y-2 border-t border-slate-100 pt-3">
						<PermissionGate permission="CREATE_PURCHASE">
							<Button
								type="button"
								onClick={onSend}
								className="h-10 w-full cursor-pointer gap-2 rounded-md bg-[#111721] text-sm font-medium text-white hover:bg-slate-800"
							>
								<Send className="h-4 w-4" aria-hidden />
								<Translate
									text={localizationConstants.purchaseOrderSend}
								/>
							</Button>
						</PermissionGate>

						{/* Opens the supplier picked on step 1. Disabled only
						    while none is chosen — the supplier record route
						    exists, so this is a real destination. */}
						{supplierId ? (
							<Button
								asChild
								className="h-10 w-full cursor-pointer gap-2 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-700"
							>
								<Link
									href={`${PURCHASE_MODULE_BASE_URL}/suppliers/${encodeURIComponent(supplierId)}`}
								>
									<Store className="h-4 w-4" aria-hidden />
									<Translate
										text={
											localizationConstants.purchaseOrderOpenSupplier
										}
									/>
								</Link>
							</Button>
						) : (
							<Button
								type="button"
								disabled
								title={t(
									localizationConstants.purchaseSupplierColName,
								)}
								className="h-10 w-full gap-2 rounded-md bg-green-600 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
							>
								<Store className="h-4 w-4" aria-hidden />
								<Translate
									text={
										localizationConstants.purchaseOrderOpenSupplier
									}
								/>
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default OrderStepRail;
