"use client";

import React from "react";
import { HeartPulse, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { FriskvardData } from "@/features/personnel/types/halsa.types";

interface FriskvardCardViewProps {
	data: FriskvardData;
	onEdit: () => void;
}

export function FriskvardCardView({ data, onEdit }: FriskvardCardViewProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
						<HeartPulse className="w-5 h-5" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-base font-bold text-slate-900">
								<Translate text={localizationConstants.friskvardCardTitle} />
							</h3>
							<Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-xs px-2 py-0.5">
								<Translate text={localizationConstants.friskvardStatusActive} />
							</Badge>
						</div>
					</div>
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
				>
					<Pencil className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
					<Translate text={localizationConstants.friskvardBtnEdit} />
				</Button>
			</div>

			{/* Info Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Eligible */}
				<div className="space-y-1">
					<p className="text-xs text-slate-500 font-medium">
						<Translate text={localizationConstants.friskvardFieldEligible} />
					</p>
					<p className="text-sm font-bold text-slate-900">
						{data.isEligible ? (
							<Translate text={localizationConstants.friskvardRadioYes} />
						) : (
							<Translate text={localizationConstants.friskvardRadioNo} />
						)}
					</p>
				</div>

				{/* Amount */}
				<div className="space-y-1">
					<p className="text-xs text-slate-500 font-medium">
						<Translate text={localizationConstants.friskvardFieldAmount} />
					</p>
					<p className="text-sm font-bold text-slate-900">
						{data.allowanceAmount} kr{" "}
						<span className="text-slate-500 font-normal text-xs">
							{data.period === "month" ? (
								<Translate text={localizationConstants.friskvardAmountUnitMonth} />
							) : (
								<Translate text={localizationConstants.friskvardAmountUnitYear} />
							)}
						</span>
					</p>
				</div>

				{/* Providers */}
				<div className="space-y-1.5 md:col-span-1">
					<p className="text-xs text-slate-500 font-medium">
						<Translate text={localizationConstants.friskvardFieldProviders} />
					</p>
					<div className="flex items-center gap-1.5 flex-wrap">
						{data.providers.map((p: string) => (
							<span
								key={p}
								className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
							>
								{p}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
