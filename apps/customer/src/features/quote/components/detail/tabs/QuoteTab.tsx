import { useMemo } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OfferDetailsCard } from "../OfferDetailsCard";
import { SpecificationTable } from "../SpecificationTable";
import { QuoteItemsTable } from "../QuoteItemsTable";
import type { QuoteDocument, QuoteSupplier } from "../../../types/form";
import type { SpecificationDocument } from "../../../types/types";

interface QuoteTabProps {
	supplier?: QuoteSupplier | null;
	documents?: QuoteDocument[];
}

export function QuoteTab({ supplier, documents = [] }: QuoteTabProps) {
	const specDocs: SpecificationDocument[] = useMemo(() => {
		return documents.map((doc, idx) => ({
			id: doc.id || String(idx),
			date: doc.date || "-",
			name: doc.name || "Specification Document",
		}));
	}, [documents]);

	const contactName =
		`${supplier?.contactFirstName || ""} ${supplier?.contactLastName || ""}`.trim() || "-";

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
				quoteId={supplier?.id}
				items={[]}
				quoteTotal="0 SEK"
				vat="0 SEK"
				rotDeduction={false}
				finalTotal="0 SEK"
			/>
		</TabsContent>
	);
}
