"use client";

import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ATA_CONSTANTS } from "../../constants/ata.constants";
import type { CreateAtaSummary } from "../../types/ata.types";
import { formatAtaCurrency, formatAtaCount } from "../../utils/ata.utils";

export interface ViewAtaSummarySidebarProps {
	ataNumber: string;
	summary: CreateAtaSummary;
	activeBadge?: string;
	tagBadges?: readonly string[];
	linkedLevAta?: string;
	linkedAtaOptions?: readonly string[];
	onLinkedAtaChange: (value: string) => void;
	onApprove: () => void;
	isApproving?: boolean;
}

export function ViewAtaSummarySidebar({
	ataNumber,
	summary,
	activeBadge = ATA_CONSTANTS.VIEW_DEFAULTS.ACTIVE_BADGE,
	tagBadges = ATA_CONSTANTS.VIEW_DEFAULTS.TAG_BADGES,
	linkedLevAta = ATA_CONSTANTS.VIEW_DEFAULTS.LINKED_LEV_ATA,
	linkedAtaOptions = ATA_CONSTANTS.VIEW_DEFAULTS.LINKED_ATA_OPTIONS,
	onLinkedAtaChange,
	onApprove,
	isApproving = false,
}: ViewAtaSummarySidebarProps) {
	return (
		<div className="w-full lg:w-[333px] overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
			<div className="p-4 sm:p-5 flex flex-col gap-3">
				{/* Top title & badge */}
				<div className="flex items-center justify-between gap-2">
					<span className="font-sans text-base sm:text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.createAtaNumberPrefix} /> {ataNumber}
					</span>
					<Badge
						variant="outline"
						className="border-slate-200 bg-white text-slate-800 font-sans text-xs px-2 py-0.5 rounded-md shadow-2xs font-semibold"
					>
						{activeBadge}
					</Badge>
				</div>

				{/* Sub tag badges with dot indicators */}
				<div className="flex flex-wrap items-center gap-2">
					{tagBadges.map((tag, idx) => {
						const isGreen =
							tag.toLowerCase().includes("godkänd") ||
							tag.toLowerCase().includes("approved") ||
							tag.toLowerCase().includes("tillkommande") ||
							tag.toLowerCase().includes("addition");
						return (
							<span
								key={idx}
								className={
									isGreen
										? "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/50"
										: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/50"
								}
							>
								<span
									className={`w-1.5 h-1.5 rounded-full ${
										isGreen ? "bg-emerald-600" : "bg-amber-600"
									}`}
								/>
								<span>{tag}</span>
							</span>
						);
					})}
				</div>

				{/* Financial metrics rows */}
				<div className="flex flex-col gap-2.5 pt-1">
					<div className="flex items-center justify-between text-sm">
						<span className="font-sans font-normal text-slate-600">
							<Translate text={localizationConstants.createAtaOwnStaff} />
						</span>
						<span className="font-sans font-semibold text-slate-900 text-base">
							{formatAtaCount(summary.ownStaffCount)}
						</span>
					</div>

					<div className="flex items-center justify-between text-sm">
						<span className="font-sans font-normal text-slate-600">
							<Translate text={localizationConstants.createAtaTotalMaterial} />
						</span>
						<span className="font-sans font-semibold text-slate-900 text-base">
							{formatAtaCurrency(summary.totalMaterial)}
						</span>
					</div>

					<div className="flex items-center justify-between text-sm">
						<span className="font-sans font-normal text-slate-600">
							<Translate text={localizationConstants.createAtaTotalMachines} />
						</span>
						<span className="font-sans font-semibold text-slate-900 text-base">
							{formatAtaCurrency(summary.totalMachines)}
						</span>
					</div>

					<div className="flex items-center justify-between text-sm">
						<span className="font-sans font-normal text-slate-600">
							<Translate text={localizationConstants.createAtaTotalUe} />
						</span>
						<span className="font-sans font-semibold text-slate-900 text-base">
							{formatAtaCurrency(summary.totalUe)}
						</span>
					</div>

					<div className="flex items-center justify-between text-sm">
						<span className="font-sans font-normal text-slate-600">
							<Translate text={localizationConstants.createAtaTotalAtaSupplier} />
						</span>
						<span className="font-sans font-semibold text-slate-900 text-base">
							{formatAtaCurrency(summary.totalAtaSupplier)}
						</span>
					</div>
				</div>

				{/* Koppla Äta selector */}
				<div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200">
					<Label className="font-sans text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.viewAtaLinkAtaLabel} />
					</Label>
					<Select value={linkedLevAta} onValueChange={onLinkedAtaChange}>
						<SelectTrigger className="w-full h-10 bg-white border border-slate-200 rounded-lg font-sans text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400">
							<SelectValue placeholder={linkedLevAta} />
						</SelectTrigger>
						<SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg">
							{linkedAtaOptions.map((opt) => (
								<SelectItem key={opt} value={opt} className="font-sans text-sm cursor-pointer">
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Bottom Approve Button Section with full-width border-t */}
			<div className="p-4 border-t border-slate-200 bg-white">
				<Button
					type="button"
					onClick={onApprove}
					disabled={isApproving}
					className="w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-none transition-colors"
				>
					<Check className="h-4 w-4" />
					<Translate text={localizationConstants.viewAtaBtnApprove} />
				</Button>
			</div>
		</div>
	);
}

export default ViewAtaSummarySidebar;
