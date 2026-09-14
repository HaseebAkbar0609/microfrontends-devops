"use client";

import React from "react";
import { ChevronUp, Users, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ViewAtaOrdererInfo, ViewAtaGeneralInfo } from "../../types/ata.types";

export interface ViewAtaInfoCardsProps {
	ordererInfo: ViewAtaOrdererInfo;
	generalInfo: ViewAtaGeneralInfo;
	isOrdererExpanded: boolean;
	isGeneralExpanded: boolean;
	onToggleOrderer: () => void;
	onToggleGeneral: () => void;
}

function InfoItem({ label, value }: { label: string; value?: string | number }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				{label}
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
				{value !== undefined && value !== null && String(value).trim() !== "" ? String(value) : "-"}
			</span>
		</div>
	);
}

export function ViewAtaInfoCards({
	ordererInfo,
	generalInfo,
	isOrdererExpanded,
	isGeneralExpanded,
	onToggleOrderer,
	onToggleGeneral,
}: ViewAtaInfoCardsProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4 w-full">
			{/* 1. Beställare Card */}
			<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
				<Button
					type="button"
					variant="ghost"
					onClick={onToggleOrderer}
					className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
					aria-expanded={isOrdererExpanded}
				>
					<div className="flex items-center gap-2.5 min-w-0">
						<Users className="size-6 text-slate-700 shrink-0" />
						<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
							<Translate text={localizationConstants.createAtaOrderer} />
						</span>
					</div>
					<ChevronUp
						size={18}
						className={cn(
							"text-zinc-500 transition-transform duration-200 shrink-0",
							!isOrdererExpanded && "rotate-180"
						)}
						aria-hidden={true}
					/>
				</Button>

				{isOrdererExpanded && (
					<CardContent className="px-6 sm:px-8 pt-4 pb-6 border-t border-slate-200">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
							<div className="flex flex-col gap-4">
								<InfoItem
									label={t(localizationConstants.createAtaOrderer)}
									value={ordererInfo.orderer}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaAddress)}
									value={ordererInfo.address}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaCity)}
									value={ordererInfo.city}
								/>
							</div>
							<div className="flex flex-col gap-4">
								<InfoItem
									label={t(localizationConstants.createAtaOrdererName)}
									value={ordererInfo.ordererName}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaPostalCode)}
									value={ordererInfo.postalCode}
								/>
							</div>
						</div>
					</CardContent>
				)}
			</Card>

			{/* 2. ÄTA information Card */}
			<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
				<Button
					type="button"
					variant="ghost"
					onClick={onToggleGeneral}
					className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
					aria-expanded={isGeneralExpanded}
				>
					<div className="flex items-center gap-2.5 min-w-0">
						<Info className="size-6 text-slate-700 shrink-0" />
						<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
							<Translate text={localizationConstants.createAtaOrderInformation} />
						</span>
					</div>
					<ChevronUp
						size={18}
						className={cn(
							"text-zinc-500 transition-transform duration-200 shrink-0",
							!isGeneralExpanded && "rotate-180"
						)}
						aria-hidden={true}
					/>
				</Button>

				{isGeneralExpanded && (
					<CardContent className="px-6 sm:px-8 pt-4 pb-6 border-t border-slate-200">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
							<div className="flex flex-col gap-4">
								<InfoItem
									label={t(localizationConstants.createAtaColSupplier)}
									value={generalInfo.supplier}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaColPosition)}
									value={generalInfo.location}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaFieldTitle)}
									value={generalInfo.title}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaCreatedBy)}
									value={generalInfo.responsible}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaColDate)}
									value={generalInfo.date}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaDescription)}
									value={generalInfo.description}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaProposedAction)}
									value={generalInfo.proposedAction}
								/>
							</div>

							<div className="flex flex-col gap-4">
								<InfoItem
									label={t(localizationConstants.createAtaEconomicStatus)}
									value={generalInfo.economicStatus}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaReason)}
									value={generalInfo.reason}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaFieldTitle)}
									value={generalInfo.subTitle}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaQualityStatus)}
									value={generalInfo.qualityStatus}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaRevisedDate)}
									value={generalInfo.revisedDate}
								/>
								<InfoItem
									label={t(localizationConstants.createAtaAction)}
									value={generalInfo.action}
								/>
							</div>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}

export default ViewAtaInfoCards;
