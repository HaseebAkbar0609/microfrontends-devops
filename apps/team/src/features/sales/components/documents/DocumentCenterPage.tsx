"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { SalesDocumentType } from "../../constants/salesDocumentTypes";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { useSalesDocuments } from "../../hooks/useSalesDocuments";
import {
	countByType,
	filterSalesDocuments,
	getDocumentTotals,
	getSalesDocuments,
} from "../../utils/salesDocuments";
import { AddDocumentForm } from "./AddDocumentForm";
import { DocumentFilterBar } from "./DocumentFilterBar";
import { DocumentKpis } from "./DocumentKpis";
import { DocumentTable } from "./DocumentTable";

/** Quotes, order confirmations, invoices and documents added by hand. */
export default function DocumentCenterPage() {
	const { companies } = useSalesCompanies();
	const { documents: customDocuments, removeDocument } = useSalesDocuments();
	const t = useTranslate();
	const [type, setType] = useState<SalesDocumentType | "all">("all");
	const [query, setQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);

	const allDocuments = useMemo(
		() => getSalesDocuments(companies, customDocuments),
		[companies, customDocuments],
	);
	// Pills count the whole set, so picking one does not zero out the others.
	const counts = useMemo(() => countByType(allDocuments), [allDocuments]);
	const visibleDocuments = useMemo(
		() => filterSalesDocuments(allDocuments, { type, query }),
		[allDocuments, type, query],
	);
	const totals = useMemo(
		() => getDocumentTotals(visibleDocuments),
		[visibleDocuments],
	);

	const handleRemove = (documentId: string) => {
		removeDocument(documentId);
		showToast("success", t(localizationConstants.salesDocRemovedToast));
	};

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						<Translate text={localizationConstants.salesNavDocumentCenter} />
					</h1>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.salesDocCenterSubtitle} />
					</p>
				</div>

				<Button
					type="button"
					className={`h-10 cursor-pointer gap-2 active:scale-[0.98] ${SALES_PRIMARY_BUTTON_CLASS}`}
					onClick={() => setIsAddOpen(true)}
				>
					<Upload className="h-4 w-4" />
					<Translate text={localizationConstants.salesDocAddButton} />
				</Button>
			</header>

			<div className="flex flex-col gap-5 p-6">
				<DocumentKpis totals={totals} />

				{isAddOpen && <AddDocumentForm onClose={() => setIsAddOpen(false)} />}

				<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
					<DocumentFilterBar
						type={type}
						onTypeChange={setType}
						counts={counts}
						query={query}
						onQueryChange={setQuery}
					/>
					<DocumentTable
						documents={visibleDocuments}
						onRemove={handleRemove}
					/>
				</section>
			</div>
		</div>
	);
}
