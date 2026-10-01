import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectQuotesAPIAction, type ProjectQuoteItem } from "@/api-actions/quote/list";
import { QuoteListToolbar } from "./list/QuoteListToolbar";
import { QuoteListTable } from "./list/QuoteListTable";
import type { QuoteItem, QuoteStatus } from "../types/types";

interface QuoteListTabProps {
	projectId: string;
}

const statusLabels: Record<string, QuoteStatus> = {
	approved: "Approved",
	recieved_quote: "Received Quote",
	under_review: "Received Quote",
	rejected: "Rejected",
};

export function QuoteListTab({ projectId }: QuoteListTabProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
	const [items, setItems] = useState<ProjectQuoteItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadQuotes = useCallback(async () => {
		setLoading(true);
		const result = await getProjectQuotesAPIAction(projectId);
		setLoading(false);
		if (result.success) {
			setItems(result.data ?? []);
			setError(null);
		} else {
			setError(result.error || "Failed to load project offers");
		}
	}, [projectId]);

	useEffect(() => {
		void loadQuotes();
	}, [loadQuotes]);

	const quotes: QuoteItem[] = useMemo(() => {
		return items.map((item) => {
			const published = Boolean(item.quote_id);
			return {
				id: item.id || item.company_id,
				quoteId: item.quote_id || undefined,
				isStarred: item.is_invited,
				company: item.company_name || "-",
				contact: item.contact_person || "-",
				orgNo: item.organization_number || "-",
				price: published
					? `${new Intl.NumberFormat("sv-SE").format(item.price)} ${item.currency || "SEK"}`
					: "-",
				status: statusLabels[item.status] || (item.is_invited ? "Invited" : "Waiting for Quote"),
			};
		});
	}, [items]);

	const filteredQuotes = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		return quotes.filter(
			(q) =>
				(statusFilter === "all" || q.status === statusFilter) &&
				(q.company.toLowerCase().includes(term) ||
				q.contact.toLowerCase().includes(term) ||
				q.orgNo.toLowerCase().includes(term)),
		);
	}, [quotes, searchTerm, statusFilter]);

	return (
		<div className="flex flex-col gap-4">
			<QuoteListToolbar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
			/>
			{loading ? (
				<div role="status" className="flex justify-center py-12">
					<Loader2 className="h-5 w-5 animate-spin" />
				</div>
			) : error ? (
				<div role="alert" className="flex items-center gap-3 py-8 text-sm text-red-700">
					{error}
					<Button variant="outline" onClick={() => void loadQuotes()}>Retry</Button>
				</div>
			) : (
				<QuoteListTable quotes={filteredQuotes} onChanged={() => void loadQuotes()} />
			)}
		</div>
	);
}
