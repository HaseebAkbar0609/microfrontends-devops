"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { SupplierQuoteDetail } from "@/features/quote/components/detail/SupplierQuoteDetail";
import { getProjectByIdAPIAction } from "@/api-actions/project/get";
import { getProjectQuotesAPIAction, type ProjectQuoteItem } from "@/api-actions/quote/list";
import { mapProjectDetailToFormHydration } from "@/features/quote/utils/projectDetailToForm";
import type { CreateOfferFormValues, QuoteSupplier } from "@/features/quote/types/form";

export default function SupplierQuotePage() {
	const params = useParams();
	const id = params.id as string;
	const supplierId = params.supplierId as string;

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [projectData, setProjectData] = useState<Partial<CreateOfferFormValues>>({});
	const [selectedQuote, setSelectedQuote] = useState<ProjectQuoteItem | null>(null);

	const fetchProject = useCallback(async (activeGuard?: { active: boolean }) => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			const [res, quoteRes] = await Promise.all([
				getProjectByIdAPIAction(id),
				getProjectQuotesAPIAction(id),
			]);
			if (activeGuard && !activeGuard.active) return;
			if (!quoteRes.success) {
				setError(quoteRes.error || "Failed to load project offers");
			} else if (res.success && res.data) {
				const hydration = mapProjectDetailToFormHydration(res.data);
				setProjectData(hydration.values);
				setSelectedQuote(quoteRes.data?.find((quote) => quote.id === supplierId && Boolean(quote.quote_id)) || null);
			} else {
				setError(res.error || "Failed to load project details");
			}
		} catch (err: unknown) {
			if (activeGuard && !activeGuard.active) return;
			const msg = err instanceof Error ? err.message : "An unexpected error occurred";
			setError(msg);
		} finally {
			if (!activeGuard || activeGuard.active) {
				setLoading(false);
			}
		}
	}, [id, supplierId]);

	useEffect(() => {
		const guard = { active: true };
		void fetchProject(guard);
		return () => {
			guard.active = false;
		};
	}, [fetchProject]);

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center p-12 min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-slate-600" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col flex-1 items-center justify-center p-12 min-h-screen gap-4">
				<p className="text-red-600 font-medium">{error}</p>
				<button
					type="button"
					onClick={() => void fetchProject()}
					className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700"
				>
					Retry
				</button>
			</div>
		);
	}

	const [contactFirstName = "", ...contactLastName] = (selectedQuote?.contact_person || "").split(" ");
	const matchedSupplier: QuoteSupplier | null = selectedQuote ? {
		id: selectedQuote.company_id,
		companyName: selectedQuote.company_name,
		category: "",
		orgNumber: selectedQuote.organization_number || "",
		contactFirstName,
		contactLastName: contactLastName.join(" "),
		emailAddress: selectedQuote.email || "",
		mobileNumber: "",
	} : null;

	if (!matchedSupplier) {
		return (
			<div className="flex flex-1 items-center justify-center p-12 min-h-screen">
				<p className="text-slate-500 text-base">Supplier quote not found.</p>
			</div>
		);
	}

	const projectName = projectData.projectName || "Project";

	return (
		<SupplierQuoteDetail
			projectName={projectName}
			supplier={matchedSupplier}
			supplierId={supplierId}
			projectId={id}
			quoteId={selectedQuote?.quote_id || undefined}
			documents={projectData.documents}
		/>
	);
}
