"use client";

import { useParams } from "next/navigation";
import { SupplierQuoteDetail } from "@/features/quote/components/detail/SupplierQuoteDetail";
import { DUMMY_DATA } from "@/features/quote/constants";
import { useMemo } from "react";

export default function SupplierQuotePage() {
	const params = useParams();
	const id = params.id as string;

	const project = useMemo(() => {
		return DUMMY_DATA.find((q) => q.id === id) || DUMMY_DATA[0];
	}, [id]);

	// In a real app, we would fetch the supplier details using supplierId
	// For now, we'll just pass dummy names
	return (
		<SupplierQuoteDetail
			projectName={project.projectName}
			supplierName="Pelle Construction"
		/>
	);
}
