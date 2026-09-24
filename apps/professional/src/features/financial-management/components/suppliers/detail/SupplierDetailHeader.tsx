"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SupplierDetailHeaderProps {
	levNr: string;
	onBack: () => void;
}

export function SupplierDetailHeader({
	levNr,
	onBack,
}: SupplierDetailHeaderProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onBack}
					className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.supplierDetailBackTitle} />
				</button>
			</div>
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.supplierDetailHeaderTitle} />
				</h1>
				<span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
					{levNr}
				</span>
			</div>
		</div>
	);
}
