"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import { AssetStatus } from "../../types/equipment.types";
import { ASSET_STATUS_STYLE_MAP } from "../../constants/equipment.constants";

interface EquipmentStatusBadgeProps {
	status: AssetStatus;
	className?: string;
}

export function EquipmentStatusBadge({ status, className = "" }: EquipmentStatusBadgeProps) {
	const config = ASSET_STATUS_STYLE_MAP[status] || ASSET_STATUS_STYLE_MAP.in_stock;

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${className}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
			<Translate text={config.labelKey} />
		</span>
	);
}
