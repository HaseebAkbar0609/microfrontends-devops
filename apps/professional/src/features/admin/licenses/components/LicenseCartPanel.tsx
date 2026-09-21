"use client";

import { useState } from "react";
import {
	Briefcase,
	Car,
	ChevronUp,
	Landmark,
	Mail,
	MessageCircle,
	Minus,
	Plus,
	Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	LICENSE_TABS,
	LicenseCartItem,
	LicenseTabId,
	PAYMENT_CYCLES,
	PaymentCycleId,
} from "../constants/licenseCatalog.constants";

const BADGE_CLASS: Record<LicenseTabId, string> = {
	system: "border-blue-300 text-blue-600",
	addonSystem: "border-amber-300 text-amber-600",
	addonApp: "border-green-300 text-green-600",
	addonCommunication: "border-red-300 text-red-600",
};

const ITEM_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	drive: Car,
	"storage-standard": Car,
	metric: Ruler,
	"bankid-sign": Landmark,
	"sms-service": MessageCircle,
	"mail-service": Mail,
};

const tabLabel = (tabId: LicenseTabId) =>
	LICENSE_TABS.find((tab) => tab.id === tabId)?.label ??
	localizationConstants.licensesCartSystemBadge;

const LicenseCartPanel = ({
	items,
	total,
	paymentCycle,
	onPaymentCycleChange,
	onQuantityChange,
}: {
	items: LicenseCartItem[];
	total: number;
	paymentCycle: PaymentCycleId;
	onPaymentCycleChange: (cycle: PaymentCycleId) => void;
	onQuantityChange: (itemId: string, delta: number) => void;
}) => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<button
				type="button"
				onClick={() => setCollapsed((value) => !value)}
				className="flex w-full cursor-pointer items-center justify-between bg-slate-200/60 px-5 py-3.5"
			>
				<span className="text-lg font-semibold text-slate-800">
					<Translate text={localizationConstants.licensesCartTitle} />
				</span>
				<ChevronUp
					className={cn(
						"h-4 w-4 text-slate-600 transition-transform",
						collapsed && "rotate-180",
					)}
				/>
			</button>

			{!collapsed && (
				<div className="space-y-5 px-5 py-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.licensesCartTotal}
							/>
						</span>
						<span className="text-lg font-bold text-slate-900">
							{total}{" "}
							<Translate
								text={
									localizationConstants.licensesCartCurrency
								}
							/>
						</span>
					</div>

					<div className="space-y-1.5">
						<p className="text-sm font-semibold text-slate-900">
							<Translate
								text={
									localizationConstants.licensesCartPaymentLabel
								}
							/>
						</p>
						<p className="text-xs text-slate-500">
							<Translate
								text={
									localizationConstants.licensesCartPaymentHint
								}
							/>
						</p>
						<Select
							value={paymentCycle}
							onValueChange={(value) =>
								onPaymentCycleChange(value as PaymentCycleId)
							}
						>
							<SelectTrigger className="mt-1 h-9 w-full border-slate-200 bg-white text-sm font-medium text-slate-900 focus:ring-0">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PAYMENT_CYCLES.map((cycle) => (
									<SelectItem key={cycle.id} value={cycle.id}>
										<Translate text={cycle.label} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{items.length === 0 ? (
						<p className="py-4 text-center text-sm text-slate-500">
							<Translate
								text={localizationConstants.licensesCartEmpty}
							/>
						</p>
					) : (
						items.map((item) => {
							const Icon = ITEM_ICONS[item.id] ?? Briefcase;
							return (
								<div
									key={item.id}
									className="space-y-3 border-t border-slate-100 pt-4"
								>
									<div className="flex items-center justify-between gap-2">
										<span className="flex items-center gap-2 text-sm font-medium text-slate-900">
											<Icon className="h-4 w-4 shrink-0 text-slate-600" />
											{item.name}
										</span>
										<span
											className={cn(
												"whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
												BADGE_CLASS[item.sourceTab],
											)}
										>
											<Translate
												text={tabLabel(item.sourceTab)}
											/>
										</span>
									</div>
									{item.showPrice && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-slate-600">
												<Translate
													text={
														localizationConstants.licensesPriceLabel
													}
												/>
											</span>
											<span className="font-bold text-slate-900">
												{item.price}
											</span>
										</div>
									)}
									<div className="flex items-center justify-between text-sm">
										<span className="text-slate-600">
											<Translate
												text={
													localizationConstants.licensesCartQuantity
												}
											/>
										</span>
										<div className="flex items-center gap-1.5">
											<Button
												type="button"
												variant="outline"
												size="icon"
												className="h-8 w-8 rounded-md border-slate-200"
												onClick={() =>
													onQuantityChange(
														item.id,
														-1,
													)
												}
											>
												<Minus className="h-3.5 w-3.5" />
											</Button>
											<span className="flex h-8 w-10 items-center justify-center rounded-md border border-slate-200 text-sm font-medium text-slate-900">
												{String(item.quantity).padStart(
													2,
													"0",
												)}
											</span>
											<Button
												type="button"
												variant="outline"
												size="icon"
												className="h-8 w-8 rounded-md border-slate-200"
												onClick={() =>
													onQuantityChange(item.id, 1)
												}
											>
												<Plus className="h-3.5 w-3.5" />
											</Button>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			)}
		</div>
	);
};

export default LicenseCartPanel;
