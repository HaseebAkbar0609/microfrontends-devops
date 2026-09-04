import { useMemo, useState } from "react";
import { QuoteListToolbar } from "./list/QuoteListToolbar";
import { QuoteListTable } from "./list/QuoteListTable";
import type { QuoteSupplier } from "../types/form";
import type { QuoteItem } from "../types/types";

interface QuoteListTabProps {
	suppliers?: QuoteSupplier[];
}

export function QuoteListTab({ suppliers = [] }: QuoteListTabProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const quotes: QuoteItem[] = useMemo(() => {
		if (!suppliers.length) return [];
		return suppliers.map((supplier, idx) => {
			const contact = `${supplier.contactFirstName || ""} ${supplier.contactLastName || ""}`.trim() || "-";
			return {
				id: supplier.id || String(idx),
				isStarred: true,
				company: supplier.companyName || "-",
				contact,
				orgNo: supplier.orgNumber || "-",
				price: "0 SEK",
				status: "Invited" as const,
			};
		});
	}, [suppliers]);

	const filteredQuotes = useMemo(() => {
		if (!searchTerm.trim()) return quotes;
		const term = searchTerm.toLowerCase();
		return quotes.filter(
			(q) =>
				q.company.toLowerCase().includes(term) ||
				q.contact.toLowerCase().includes(term) ||
				q.orgNo.toLowerCase().includes(term),
		);
	}, [quotes, searchTerm]);

	return (
		<div className="flex flex-col gap-4">
			<QuoteListToolbar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
			/>
			<QuoteListTable quotes={filteredQuotes} />
		</div>
	);
}
