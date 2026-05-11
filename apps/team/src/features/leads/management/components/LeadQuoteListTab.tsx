"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LeadQuoteRow } from "@/features/leads/types";
import { QuoteStatusPill, SortLabel } from "@/features/leads/management/components/LeadDetailShared";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { showToast } from "@/lib/toast";
import { ActionsToolbar, type FilterConfig } from "@/components/table/ActionsToolbar";

type LeadQuoteListTabProps = {
	leadId: string;
	rows: LeadQuoteRow[];
	sourceParam?: string;
};

export default function LeadQuoteListTab({ leadId, rows, sourceParam }: LeadQuoteListTabProps) {
	const t = useTranslate();
	const router = useRouter();
	const [quoteSearch, setQuoteSearch] = useState("");
	const [quoteFilter, setQuoteFilter] = useState("all");
	const [quoteRows, setQuoteRows] = useState<LeadQuoteRow[]>(rows);
	const quoteFilterConfig = useMemo<FilterConfig>(
		() => ({
			label: localizationConstants.filterLabel,
			options: [
				{ value: "all", label: localizationConstants.allStatusesLabel },
				{ value: "received", label: localizationConstants.receivedQuoteLabel },
				{ value: "invited", label: localizationConstants.invitedLabel },
				{ value: "estimated", label: localizationConstants.estimatedLabel },
				{ value: "waiting", label: localizationConstants.waitingForQuoteLabel },
			],
			onFilterChange: (value) => setQuoteFilter(value || "all"),
			value: quoteFilter === "all" ? null : quoteFilter,
		}),
		[quoteFilter]
	);

	useEffect(() => {
		setQuoteRows(rows);
	}, [rows]);

	const handleDelete = (id: string) => {
		setQuoteRows((prev) => prev.filter((row) => row.id !== id));
		showToast("success", t(localizationConstants.quoteDeletedToast));
	};

	const filteredRows = useMemo(() => {
		const query = quoteSearch.trim().toLowerCase();
		return quoteRows.filter((row) => {
			const matchesQuery =
				query.length === 0 ||
				[row.companyName, row.contactPerson, row.orgNumber, row.quotePrice]
					.join(" ")
					.toLowerCase()
					.includes(query);
			const matchesStatus =
				quoteFilter === "all" || row.status === quoteFilter;
			return matchesQuery && matchesStatus;
		});
	}, [quoteRows, quoteSearch, quoteFilter]);

	return (
		<div className="space-y-6 mb-10">
			<ActionsToolbar
				searchValue={quoteSearch}
				onSearchChange={setQuoteSearch}
				filters={[quoteFilterConfig]}
				className="px-0 py-0"
			/>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
				<Table className="text-sm">
					<TableHeader>
						<TableRow>
							<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
								<Translate text={localizationConstants.companyNameLabel} />
							</TableHead>
							<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
								<Translate text={localizationConstants.contactPersonLabel} />
							</TableHead>
							<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
								<Translate text={localizationConstants.orgNumberLabel} />
							</TableHead>
							<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
								<SortLabel label={t(localizationConstants.quotePriceLabel)} />
							</TableHead>
							<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
								<SortLabel label={t(localizationConstants.statusLabel)} />
							</TableHead>
							<TableHead className="border-l px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
								<span className="sr-only"></span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredRows.map((row) => (
							<TableRow key={row.id} className="hover:bg-slate-50/70">
								<TableCell className="px-4 py-4 font-medium text-slate-800">
									{row.companyName}
								</TableCell>
								<TableCell className="px-4 py-4 text-slate-600">
									{row.contactPerson}
								</TableCell>
								<TableCell className="px-4 py-4 text-slate-600">
									{row.orgNumber}
								</TableCell>
								<TableCell className="px-4 py-4 text-slate-700">
									{row.quotePrice}
								</TableCell>
								<TableCell className="px-4 py-4">
									<QuoteStatusPill status={row.status} />
								</TableCell>
								<TableCell className="border-l px-3 py-4 text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-9 w-9 rounded-md text-slate-700 hover:bg-slate-100"
											>
												<EllipsisVertical className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="min-w-[140px]">
											<DropdownMenuItem
												className="gap-2"
												onClick={() => {
													const source = sourceParam ? `?source=${sourceParam}` : "";
													router.push(`/leads/management/${leadId}/quotes/${row.id}${source}`);
												}}
											>
												<Eye size={12} />
												<Translate text={localizationConstants.open} />
											</DropdownMenuItem>
											<ConfirmDialog
												title="Delete quote?"
												description="This will remove the quote from the list."
												confirmText={t(localizationConstants.delete)}
												cancelText={t(localizationConstants.cancelLabel)}
												onConfirm={() => handleDelete(row.id)}
												trigger={
													<DropdownMenuItem
														className="gap-2"
														onSelect={(event) => event.preventDefault()}
													>
														<Trash2 size={12} />
														<Translate text={localizationConstants.delete} />
													</DropdownMenuItem>
												}
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
						{filteredRows.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.noLeadsFound} />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
