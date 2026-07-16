import { useEffect, useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OfferDetailsCard } from "../OfferDetailsCard";
import { SpecificationTable } from "../SpecificationTable";
import { QuoteItemsTable } from "../QuoteItemsTable";
import { getQuoteDetailsAPIAction } from "@/api-actions/quote/details";
import type { QuoteDocument, QuoteSupplier } from "../../../types/form";
import type { SpecificationDocument } from "../../../types/types";

interface QuoteTabProps {
	supplier?: QuoteSupplier | null;
	documents?: QuoteDocument[];
	quoteId?: string;
}

export function QuoteTab({ supplier, documents = [], quoteId }: QuoteTabProps) {
	const [quoteDetails, setQuoteDetails] = useState<Record<string, unknown> | null>(null);
	const [loadedQuoteId, setLoadedQuoteId] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setQuoteDetails(null);
		setLoadedQuoteId(undefined);
		setError(null);
		if (!quoteId) {
			setLoading(false);
			return;
		}
		let active = true;
		setLoading(true);
		getQuoteDetailsAPIAction(quoteId)
			.then((res) => {
				if (!active) return;
				setLoading(false);
				if (res.success && res.data) {
					setQuoteDetails(res.data as Record<string, unknown>);
					setLoadedQuoteId(quoteId);
				} else {
					setError(res.error || "Failed to load quote details");
				}
			})
			.catch((err: unknown) => {
				if (!active) return;
				setLoading(false);
				setError(err instanceof Error ? err.message : "Failed to load quote details");
			});
		return () => {
			active = false;
		};
	}, [quoteId]);

	const specDocs: SpecificationDocument[] = useMemo(() => {
		return documents.map((doc, idx) => ({
			id: doc.id || String(idx),
			date: doc.date || "-",
			name: doc.name || "Specification Document",
		}));
	}, [documents]);

	const contactName =
		`${supplier?.contactFirstName || ""} ${supplier?.contactLastName || ""}`.trim() || "-";

	const isCurrentQuoteLoaded = loadedQuoteId === quoteId && quoteDetails !== null && !loading && !error;

	const items = isCurrentQuoteLoaded && Array.isArray(quoteDetails?.items) ? (quoteDetails.items as Array<Record<string, unknown>>).map((item, idx) => ({
		id: (item.id as string) || String(idx),
		no: String(idx + 1),
		description: (item.description as string) || "-",
		amount: `${(item.amount as number) ?? 0} ${(quoteDetails?.currency as string) || "SEK"}`,
	})) : [];

	const currency = (isCurrentQuoteLoaded && (quoteDetails?.currency as string)) || "SEK";
	const totalPriceNum = isCurrentQuoteLoaded && typeof quoteDetails?.total_quote_price === "number" ? quoteDetails.total_quote_price : Number(quoteDetails?.total_quote_price) || 0;
	const vatNum = isCurrentQuoteLoaded && typeof quoteDetails?.vat === "number" ? quoteDetails.vat : Number(quoteDetails?.vat) || 0;
	const rotDiscountNum = isCurrentQuoteLoaded && typeof quoteDetails?.rot_discount === "number" ? quoteDetails.rot_discount : Number(quoteDetails?.rot_discount) || 0;

	const quoteTotal = isCurrentQuoteLoaded ? `${totalPriceNum} ${currency}` : "0 SEK";
	const vat = isCurrentQuoteLoaded ? `${vatNum} ${currency}` : "0 SEK";
	const rotDeduction = isCurrentQuoteLoaded ? (rotDiscountNum > 0 ? `-${rotDiscountNum} ${currency}` : Boolean(quoteDetails?.is_tax_deducted)) : false;
	const finalTotal = isCurrentQuoteLoaded ? `${totalPriceNum + vatNum - rotDiscountNum} ${currency}` : "0 SEK";

	const effectiveQuoteId = isCurrentQuoteLoaded
		? (typeof quoteDetails?.mapping_id === "string" ? quoteDetails.mapping_id : typeof quoteDetails?.id === "string" ? quoteDetails.id : undefined)
		: undefined;

	return (
		<TabsContent
			value="quote"
			className="mt-0 space-y-8 animate-in fade-in duration-300"
		>
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
				<div className="lg:col-span-3">
					<OfferDetailsCard
						company={supplier?.companyName || "-"}
						orgNo={supplier?.orgNumber || "-"}
						address="-"
						postalNo="-"
						contactPerson={contactName}
						mobile={supplier?.mobileNumber || "-"}
						email={supplier?.emailAddress || "-"}
					/>
				</div>
				<div className="lg:col-span-2">
					<SpecificationTable documents={specDocs} />
				</div>
			</div>

			<QuoteItemsTable
				quoteId={effectiveQuoteId}
				items={items}
				quoteTotal={quoteTotal}
				vat={vat}
				rotDeduction={rotDeduction}
				finalTotal={finalTotal}
			/>
		</TabsContent>
	);
}
