"use client";

import { WarrantyDetailView } from "./components/WarrantyDetailView";
import { useWarranty } from "./hooks/useWarranty";

export interface OrderWarrantyDetailPageProps {
	id: string;
}

export function OrderWarrantyDetailPage({ id }: OrderWarrantyDetailPageProps) {
	const { rows, inspectionDates, addInspectionDate } = useWarranty();

	const targetWarranty =
		rows.find((r) => r.id === id || r.orderNo.replace("#", "").trim() === id.replace("#", "").trim()) ||
		rows[0];

	return (
		<WarrantyDetailView
			warranty={targetWarranty}
			inspectionDates={inspectionDates}
			onAddInspectionDate={addInspectionDate}
		/>
	);
}
