"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderStatus, OrderType } from "../types/order.types";

interface OrderStatusBadgeProps {
	status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
	switch (status) {
		case "assigned":
			return (
				<span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-3 py-0.5 text-xs font-medium text-[#92400E]">
					<Translate text={localizationConstants.statusAssigned} />
				</span>
			);
		case "ongoing":
			return (
				<span className="inline-flex items-center rounded-full bg-[#E0F2FE] px-3 py-0.5 text-xs font-medium text-[#0369A1]">
					<Translate text={localizationConstants.statusOngoing} />
				</span>
			);
		case "completed":
			return (
				<span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-0.5 text-xs font-medium text-[#15803D]">
					<Translate text={localizationConstants.statusCompleted} />
				</span>
			);
		case "cancelled":
			return (
				<span className="inline-flex items-center rounded-full bg-[#FEE2E2] px-3 py-0.5 text-xs font-medium text-[#B91C1C]">
					<Translate text={localizationConstants.statusCancelled} />
				</span>
			);
		default:
			return null;
	}
}

interface OrderTypeBadgeProps {
	type: OrderType;
}

export function OrderTypeBadge({ type }: OrderTypeBadgeProps) {
	const labelKey =
		type === "ongoing"
			? localizationConstants.typeOngoing
			: localizationConstants.typeFixedPrice;

	return (
		<span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-3 py-0.5 text-xs font-medium text-slate-700">
			<Translate text={labelKey} />
		</span>
	);
}
