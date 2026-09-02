"use client";

import React, { useState } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	InvoiceDetailData,
	InvoiceDetailCalculations,
} from "../../types/invoiceDetail.types";
import { PrintDocumentHeader } from "./print/PrintDocumentHeader";
import { PrintMetadataGrid } from "./print/PrintMetadataGrid";
import { PrintPartyCards } from "./print/PrintPartyCards";
import { PrintProjectCard } from "./print/PrintProjectCard";
import { PrintLineItemsTable } from "./print/PrintLineItemsTable";
import { PrintSummarySection } from "./print/PrintSummarySection";
import { PrintCompanyFooter } from "./print/PrintCompanyFooter";
import { PrintTimeReportAppendix } from "./print/PrintTimeReportAppendix";
import { PrintUnderlagAppendix } from "./print/PrintUnderlagAppendix";

interface InvoicePrintDocumentViewProps {
	data: InvoiceDetailData;
	calculations: InvoiceDetailCalculations;
	onBack: () => void;
}

export function InvoicePrintDocumentView({
	data,
	calculations,
	onBack,
}: InvoicePrintDocumentViewProps) {
	const [tidrapportOpen, setTidrapportOpen] = useState(true);
	const [underlagOpen, setUnderlagOpen] = useState(true);

	return (
		<div className="bg-slate-100 min-h-screen pb-16">
			{/* Top Action Bar (hidden when printing) */}
			<div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between print:hidden">
				<Button
					variant="ghost"
					size="sm"
					onClick={onBack}
					className="text-xs gap-1.5 text-slate-700 hover:text-slate-900 cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>
						<Translate text={localizationConstants.invoiceDetailBack} />
					</span>
				</Button>

				<Button
					size="sm"
					onClick={() => window.print()}
					className="h-8 text-xs gap-1.5 bg-zinc-900 hover:bg-slate-800 text-white cursor-pointer"
				>
					<Printer className="h-3.5 w-3.5" />
					<span>
						<Translate text={localizationConstants.createInvoiceModalPrint} />
					</span>
				</Button>
			</div>

			{/* Main Printable Document */}
			<div className="max-w-4xl mx-auto my-6 bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:m-0 print:p-0">
				{/* 1. Document Header */}
				<PrintDocumentHeader data={data} />

				{/* 2. Metadata Grid */}
				<PrintMetadataGrid data={data} />

				{/* 3. Customer & Supplier Information Cards */}
				<PrintPartyCards data={data} />

				{/* 4. Project Card */}
				<PrintProjectCard data={data} />

				{/* 5. Line Items Table */}
				<PrintLineItemsTable lineItems={data.lineItems} />

				{/* 6. Comments & Summary Section */}
				<PrintSummarySection comments={data.comments} calculations={calculations} />

				{/* 7. Thank You Note & Company Credentials */}
				<PrintCompanyFooter data={data} />

				{/* 8. Collapsible Appendix: Tidrapport */}
				{data.timeReportItems && data.timeReportItems.length > 0 && (
					<PrintTimeReportAppendix
						isOpen={tidrapportOpen}
						onToggle={() => setTidrapportOpen(!tidrapportOpen)}
						items={data.timeReportItems}
					/>
				)}

				{/* 9. Collapsible Appendix: Faktura underlag */}
				{data.underlagItems && data.underlagItems.length > 0 && (
					<PrintUnderlagAppendix
						isOpen={underlagOpen}
						onToggle={() => setUnderlagOpen(!underlagOpen)}
						items={data.underlagItems}
					/>
				)}
			</div>
		</div>
	);
}

export default InvoicePrintDocumentView;
