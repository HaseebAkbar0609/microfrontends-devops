"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WarrantyDetailView } from "./components/WarrantyDetailView";
import { useWarranty } from "./hooks/useWarranty";

export interface OrderWarrantyDetailPageProps {
	id: string;
}

export function OrderWarrantyDetailPage({ id }: OrderWarrantyDetailPageProps) {
	const { rows, inspectionDates, addInspectionDate } = useWarranty();

	const targetWarranty = rows.find(
		(r) => r.id === id || r.orderNo.replace("#", "").trim() === id.replace("#", "").trim()
	);

	// Explicit Not-Found Case handling instead of silent fallback
	if (!targetWarranty) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-12 text-slate-500 bg-slate-50/50">
				<p className="text-sm font-medium">
					<Translate text={localizationConstants.noOrdersFound} />
				</p>
			</div>
		);
	}

	return (
		<WarrantyDetailView
			warranty={targetWarranty}
			inspectionDates={inspectionDates}
			onAddInspectionDate={addInspectionDate}
		/>
	);
}
