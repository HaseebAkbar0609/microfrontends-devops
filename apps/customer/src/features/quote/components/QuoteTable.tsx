"use client";

import { useCallback, useMemo, useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	Pencil,
	Archive,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Quote, QuoteColumnField } from "../types/types";
import { formatProjectTypeLabel } from "../utils/formatProjectType";
import { QUOTE_COLUMNS, PROJECT_STATUS_VALUE_TO_LABEL_KEY } from "../constants";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import useModal from "@/features/auth/hooks/useModal";
import { MODAL_CONSTANTS, ModalType } from "@/constants/constant";
import {
	patchProjectStatusAPIAction,
	type ProjectStatusPatchValue,
} from "@/api-actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuoteTableProps {
	data: Quote[];
	/** Called after archive/delete succeeds so the list can reload */
	onRefresh?: () => void;
}

const getStatusVariant = (quoteStatus: string) => {
	switch (quoteStatus) {
		case "recieved_quote":
		case "accepted":
		case "approved":
			return "success";
		case "opened":
		case "under_review":
			return "info";
		case "waiting_for_quote":
			return "warning";
		case "rejected":
			return "destructive";
		case "not_reviewd":
			return "outline";
		default:
			return "outline";
	}
};

const getSortableValue = (quote: Quote, field: string) => {
	switch (field) {
		case "type":
			return quote.project_type ?? quote.type ?? "";
		case "category":
			return quote.category ?? "";
		case "actions":
			return "";
		default:
			return String(quote[field as keyof Quote] ?? "");
	}
};

/** Table columns only (not every `Quote` key such as `id` / `project_type`) */
type QuoteTableColumnField = (typeof QUOTE_COLUMNS)[number]["field"];

/** Layout: avoid table-fixed equal columns + nowrap overflow into adjacent cells */
const COLUMN_LAYOUT: Record<
	QuoteTableColumnField,
	{ head: string; cell: string }
> = {
	refNo: {
		head: "w-[9rem] min-w-[7.5rem]",
		cell: "whitespace-nowrap align-top",
	},
	projectName: {
		head: "min-w-[12rem] w-[26%]",
		cell: "min-w-[12rem] max-w-[28rem] whitespace-normal break-words align-top text-left leading-snug",
	},
	type: {
		head: "w-[4.5rem] min-w-[4rem]",
		cell: "whitespace-nowrap align-top",
	},
	category: {
		head: "min-w-[10rem] w-[14%]",
		cell: "min-w-[12rem] max-w-[18rem] whitespace-normal break-words align-top leading-snug",
	},
	receivedQuotes: {
		head: "w-[7.25rem] min-w-[6.5rem]",
		cell: "whitespace-nowrap align-top",
	},
	lowestPrice: {
		head: "w-[6.5rem] min-w-[6rem]",
		cell: "whitespace-nowrap align-top tabular-nums",
	},
	highestPrice: {
		head: "w-[6.5rem] min-w-[6rem]",
		cell: "whitespace-nowrap align-top tabular-nums",
	},
	quote_status: {
		head: "w-[9.5rem] min-w-[8.5rem]",
		cell: "whitespace-nowrap align-top",
	},
	actions: {
		head: "w-20 min-w-[5rem]",
		cell: "whitespace-nowrap align-top",
	},
};

const SortIconElement = ({
	field,
	sortBy,
	sortOrder,
}: {
	field: string;
	sortBy: string;
	sortOrder: string;
}) => {
	if (sortBy !== field)
		return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
	return sortOrder === "asc" ? (
		<ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
	) : (
		<ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
	);
};

const ActionsDropdown = ({
	quote: _quote,
	onRefresh,
}: {
	quote: Quote;
	onRefresh?: () => void;
}) => {
	const { isOpen, openModal, closeModal, type, modalId } =
		useModal<ModalType>();
	const [isPending, setIsPending] = useState(false);

	const handleConfirm = async () => {
		if (!type || !modalId) return;
		const status: ProjectStatusPatchValue | null =
			type === MODAL_CONSTANTS.ARCHIVE
				? "archived"
				: type === MODAL_CONSTANTS.DELETE
					? "deleted"
					: null;
		if (!status) return;

		setIsPending(true);
		try {
			const result = await patchProjectStatusAPIAction(modalId, status);
			if (result.success) {
				onRefresh?.();
				closeModal();
			}
		} finally {
			setIsPending(false);
		}
	};

	const isArchive = type === MODAL_CONSTANTS.ARCHIVE;
	const isDelete = type === MODAL_CONSTANTS.DELETE;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 text-accent-foreground hover:text-accent-foreground bg-muted rounded-md"
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[140px]">
					<DropdownMenuItem
						asChild
						className="gap-2 cursor-pointer py-2 group"
					>
						<Link
							href={
								_quote.is_completed === false
									? `/business/offer/create?projectId=${encodeURIComponent(_quote.id)}`
									: `/business/offer/${_quote.id}`
							}
							className="flex items-center w-full"
						>
							<Pencil className="h-4 w-4 text-accent-foreground group-hover:text-accent-foreground transition-colors" />
							<Translate text={localizationConstants.open} />
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 cursor-pointer py-2 group"
						onClick={() =>
							openModal(MODAL_CONSTANTS.ARCHIVE, _quote.id)
						}
					>
						<Archive className="h-4 w-4 text-accent-foreground group-hover:text-accent-foreground transition-colors" />
						<Translate text={localizationConstants.archive} />
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700 group"
						onClick={() =>
							openModal(MODAL_CONSTANTS.DELETE, _quote.id)
						}
					>
						<Trash2 className="h-4 w-4 transition-colors text-accent-foreground" />
						<Translate text={localizationConstants.delete} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={isOpen} onOpenChange={closeModal}>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold text-slate-800">
							<Translate
								text={
									isArchive
										? localizationConstants.archiveConfirmTitle
										: isDelete
											? localizationConstants.deleteQuoteConfirmTitle
											: localizationConstants.archiveConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate
								text={
									isArchive
										? localizationConstants.archiveConfirmDescription
										: isDelete
											? localizationConstants.deleteQuoteConfirmDescription
											: localizationConstants.archiveConfirmDescription
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel
							onClick={closeModal}
							className="min-w-24"
						>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={(e) => {
								e.preventDefault();
								void handleConfirm();
							}}
							className={`min-w-24 ${
								isDelete
									? "bg-red-600 hover:bg-red-700 text-white"
									: "bg-slate-800 hover:bg-slate-900 text-white"
							}`}
						>
							<Translate
								text={
									isArchive
										? localizationConstants.archive
										: isDelete
											? localizationConstants.delete
											: localizationConstants.save
								}
							/>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export function QuoteTable({ data, onRefresh }: QuoteTableProps) {
	const { query, changeQueries } = useQueryParams();

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const handleSort = useCallback(
		(field: string) => {
			if (field === "actions") return;

			let nextOrder: string | null = "asc";
			if (sortBy === field) {
				if (sortOrder === "asc") nextOrder = "desc";
				else if (sortOrder === "desc") {
					nextOrder = null;
				}
			}

			changeQueries({
				sort_by: nextOrder ? field : null,
				sort_order: nextOrder,
			});
		},
		[sortBy, sortOrder, changeQueries],
	);

	const sortedData = useMemo(() => {
		if (!sortBy || !sortOrder) return data;

		return [...data].sort((left, right) => {
			const leftValue = getSortableValue(left, sortBy);
			const rightValue = getSortableValue(right, sortBy);
			const result = leftValue.localeCompare(rightValue, undefined, {
				numeric: true,
				sensitivity: "base",
			});

			return sortOrder === "asc" ? result : -result;
		});
	}, [data, sortBy, sortOrder]);

	const renderCell = useCallback(
		(quote: Quote, columnKey: QuoteColumnField) => {
			switch (columnKey) {
				case "refNo":
					return (
						<span className="text-slate-950 font-medium">
							{quote.refNo}
						</span>
					);
				case "projectName":
					return (
						<span className="text-slate-600 block">
							{quote.projectName}
						</span>
					);
				case "type":
					return (
						<span className="text-slate-600">
							{formatProjectTypeLabel(
								quote.project_type ?? quote.type,
							)}
						</span>
					);
				case "receivedQuotes":
				case "lowestPrice":
				case "highestPrice":
					return (
						<span className="text-slate-600">
							{quote[columnKey]}
						</span>
					);
				case "category": {
					const labels =
						(quote.categories?.length ?? 0) > 0
							? quote.categories!
							: [quote.category];
					return (
						<div className="flex flex-wrap gap-1.5 max-w-full">
							{labels.map((label, idx) => (
								<Badge
									key={`${quote.id}-cat-${idx}-${label}`}
									variant="category"
									className="inline-flex h-auto min-h-7 max-w-full rounded-lg px-3 py-1.5 bg-slate-100 text-slate-600 font-normal whitespace-normal text-left break-words leading-snug"
								>
									{label}
								</Badge>
							))}
						</div>
					);
				}
				case "quote_status": {
					const labelKey =
						PROJECT_STATUS_VALUE_TO_LABEL_KEY[quote.quote_status] ??
						localizationConstants.statusWaitingForQuote;
					return (
						<Badge
							variant={getStatusVariant(quote.quote_status)}
							className="rounded-[6px] px-2.5 py-0.5 whitespace-nowrap capitalize"
						>
							<Translate text={labelKey} />
						</Badge>
					);
				}
				case "actions":
					return (
						<ActionsDropdown quote={quote} onRefresh={onRefresh} />
					);
				default:
					return null;
			}
		},
		[onRefresh],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full bg-white rounded-md border border-slate-200 overflow-hidden">
				<Table className="w-full min-w-[56rem] table-auto">
					<colgroup>
						{QUOTE_COLUMNS.map((col) => (
							<col
								key={col.field}
								className={COLUMN_LAYOUT[col.field].head}
							/>
						))}
					</colgroup>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{QUOTE_COLUMNS.map((col) => (
								<TableHead
									key={col.field}
									className={cn(
										"cursor-pointer select-none text-slate-500 font-medium py-3.5 px-4 h-auto text-left",
										COLUMN_LAYOUT[col.field].head,
										col.field === "actions" &&
											"cursor-default",
										col.field !== "projectName" &&
											"whitespace-nowrap",
									)}
									onClick={() => handleSort(col.field)}
								>
									<div
										className={cn(
											"flex items-center gap-1 min-w-0",
											col.field === "actions" &&
												"justify-end",
										)}
									>
										<Translate text={col.label} />
										{col.field !== "actions" && (
											<SortIconElement
												field={col.field}
												sortBy={sortBy}
												sortOrder={sortOrder}
											/>
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedData.map((quote) => (
							<TableRow
								key={quote.id}
								className="border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
							>
								{QUOTE_COLUMNS.map((col) => (
									<TableCell
										key={`${quote.id}-${col.field}`}
										className={cn(
											"py-3.5 px-4",
											COLUMN_LAYOUT[col.field].cell,
											col.field === "actions" &&
												"text-right",
										)}
									>
										{renderCell(quote, col.field)}
									</TableCell>
								))}
							</TableRow>
						))}
						{sortedData.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={QUOTE_COLUMNS.length}
									className="h-32 text-center text-slate-500"
								>
									<Translate
										text={
											localizationConstants.noQuotesFound
										}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
