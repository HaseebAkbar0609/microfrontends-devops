import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface StepProgressCardProps {
	activeTab: "info" | "docs";
}

export function StepProgressCard({ activeTab }: StepProgressCardProps) {
	return (
		<div className="w-full lg:w-80 shrink-0">
			<div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
				<div className="text-xs font-semibold text-slate-800 mb-2.5">
					{activeTab === "info" ? (
						<Translate text={localizationConstants.machinePurchaseStep1Indicator} />
					) : (
						<Translate text={localizationConstants.machinePurchaseStep2Indicator} />
					)}
				</div>
				<div
					className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden"
					role="progressbar"
					aria-valuenow={activeTab === "info" ? 20 : 40}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label="Framsteg"
				>
					<div
						className={`h-full bg-slate-900 transition-all duration-300 ${
							activeTab === "info" ? "w-1/5" : "w-2/5"
						}`}
					/>
				</div>
			</div>
		</div>
	);
}
