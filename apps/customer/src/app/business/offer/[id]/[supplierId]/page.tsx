"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { SupplierQuoteDetail } from "@/features/quote/components/detail/SupplierQuoteDetail";
import { getProjectByIdAPIAction } from "@/api-actions/project/get";
import { mapProjectDetailToFormHydration } from "@/features/quote/utils/projectDetailToForm";
import type { CreateOfferFormValues, QuoteSupplier } from "@/features/quote/types/form";

export default function SupplierQuotePage() {
	const params = useParams();
	const id = params.id as string;
	const supplierId = params.supplierId as string;

	const [loading, setLoading] = useState(true);
	const [projectData, setProjectData] = useState<Partial<CreateOfferFormValues>>({});

	useEffect(() => {
		let isMounted = true;
		async function fetchProject() {
			if (!id) return;
			setLoading(true);
			const res = await getProjectByIdAPIAction(id);
			if (isMounted && res.success && res.data) {
				const hydration = mapProjectDetailToFormHydration(res.data);
				setProjectData(hydration.values);
			}
			if (isMounted) setLoading(false);
		}
		void fetchProject();
		return () => {
			isMounted = false;
		};
	}, [id]);

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center p-12 min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-slate-600" />
			</div>
		);
	}

	const suppliers: QuoteSupplier[] = projectData.invitedSuppliers || [];
	const matchedSupplier =
		suppliers.find((s) => s.id === supplierId || s.companyName === decodeURIComponent(supplierId)) ||
		suppliers[0] ||
		null;

	const projectName = projectData.projectName || "Project";

	return (
		<SupplierQuoteDetail
			projectName={projectName}
			supplier={matchedSupplier}
			supplierId={supplierId}
			documents={projectData.documents}
		/>
	);
}
