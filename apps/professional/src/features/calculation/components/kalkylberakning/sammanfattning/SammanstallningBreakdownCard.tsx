"use client";

import { useState } from "react";
import { Check, PencilLine, Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";

interface SammanstallningBreakdownCardProps {
	summaKalkyl: number;
	summaOverhead: number;
	delsumma: number;
	vinstPct: string;
	finalOfferSum: number;
	onChangeVinstPct?: (val: string) => void;
}

export function SammanstallningBreakdownCard({
	summaKalkyl,
	summaOverhead,
	delsumma,
	vinstPct,
	finalOfferSum,
	onChangeVinstPct,
}: SammanstallningBreakdownCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [tempVal, setTempVal] = useState(vinstPct);

	const handleCommitVinst = () => {
		if (tempVal.trim()) {
			onChangeVinstPct?.(tempVal.trim());
		}
		setIsEditing(false);
	};

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none gap-0 pb-0 p-0">
			{/* Card Header Bar */}
			<div className="flex h-14 items-center bg-[#E5EAEF] px-5 border-b border-slate-200">
				<span className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.calcBerSammanstallning} />
				</span>
			</div>

			<div className="divide-y divide-slate-100">
				{/* Summa Kalkyl */}
				<div className="flex h-12 items-center justify-between px-5">
					<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Sigma className="h-4 w-4 text-slate-800 shrink-0" />
						<span>
							<Translate text={localizationConstants.calcBerSummaKalkyl} />
						</span>
					</div>
					<span className="text-sm font-bold tabular-nums text-slate-950">
						{formatCurrency(summaKalkyl)}
					</span>
				</div>

				{/* Summa Overhead */}
				<div className="flex h-12 items-center justify-between px-5">
					<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Sigma className="h-4 w-4 text-slate-800 shrink-0" />
						<span>
							<Translate text={localizationConstants.calcBerSummaOverhead} />
						</span>
					</div>
					<span className="text-sm font-bold tabular-nums text-slate-950">
						{formatCurrency(summaOverhead)}
					</span>
				</div>

				{/* Delsumma */}
				<div className="flex h-12 items-center justify-between px-5">
					<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Sigma className="h-4 w-4 text-slate-800 shrink-0" />
						<span>
							<Translate text={localizationConstants.calcBerDelsumma} />
						</span>
					</div>
					<span className="text-sm font-bold tabular-nums text-slate-950">
						{formatCurrency(delsumma)}
					</span>
				</div>

				{/* Vinst % */}
				<div className="flex h-12 items-center justify-between px-5">
					<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Sigma className="h-4 w-4 text-slate-800 shrink-0" />
						<span>
							<Translate text={localizationConstants.calcBerVinstProcent} />
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						{isEditing ? (
							<div className="flex items-center gap-1">
								<Input
									type="text"
									value={tempVal}
									onChange={(e) => setTempVal(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleCommitVinst();
										if (e.key === "Escape") setIsEditing(false);
									}}
									className="h-7 w-16 px-2 text-xs font-semibold tabular-nums border-slate-300"
									autoFocus
								/>
								<span className="text-sm font-bold text-slate-950">%</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={handleCommitVinst}
									className="h-6 w-6 cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
								>
									<Check className="h-3.5 w-3.5" />
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-1.5">
								<span className="text-sm font-bold text-slate-950 tabular-nums">{vinstPct} %</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => {
										setTempVal(vinstPct);
										setIsEditing(true);
									}}
									className="h-6 w-6 cursor-pointer text-slate-500 hover:text-slate-900 hover:bg-slate-100"
								>
									<PencilLine className="h-3.5 w-3.5" />
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* OFFERT */}
				<div className="flex h-14 items-center justify-between bg-[#E5EAEF] px-5 border-t border-slate-200">
					<div className="flex items-center gap-2 text-sm font-bold uppercase text-slate-950">
						<Sigma className="h-4 w-4 text-slate-950 shrink-0" />
						<span>
							<Translate text={localizationConstants.calcBerOffert} />
						</span>
					</div>
					<span className="text-sm font-bold tabular-nums text-slate-950">
						{formatCurrency(finalOfferSum)}
					</span>
				</div>
			</div>
		</Card>
	);
}
