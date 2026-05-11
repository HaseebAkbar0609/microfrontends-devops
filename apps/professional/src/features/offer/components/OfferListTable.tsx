"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import { OfferList, OfferListColumn, OfferListTableProps } from "../types";
import { OFFER_LIST_COLUMNS } from "../constants";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BusinessOfferModal } from "./BusinessOfferModal";
import { BusinessExpressModal } from "./BusinessExpressModal";
import { BusinessRentModal } from "./BusinessRentModal";
import { MODAL_CONSTANTS, type ModalType } from "@/constants/constant";
import useModal from "@/features/auth/hooks/useModal";

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

function getTypeBadgeVariant(type: string) {
	if (type.toLowerCase().includes("express")) return "typeOutline" as const;
	if (type.toLowerCase().includes("b2c")) return "typeDark" as const;
	return "typeLight" as const;
}

export function OfferListTable({ data, totalItems }: OfferListTableProps) {
	const { query, changeQueries } = useQueryParams();
	const router = useRouter();
	const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
		() =>
			new Set(
				data.filter((item) => item.isFavorite).map((item) => item.id) ??
					[],
			),
	);
	const { isOpen, openModal, closeModal, type, modalId } =
		useModal<ModalType>();

	const selectedBusinessQuote = useMemo(() => {
		if (!modalId) return null;
		return data.find((q) => q.id === modalId) ?? null;
	}, [data, modalId]);

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");

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

	const renderCell = useCallback(
		(quote: OfferList, columnKey: OfferListColumn["field"]) => {
			switch (columnKey) {
				case "idNumber":
					return (
						<span className="text-slate-600">{quote.idNumber}</span>
					);
				case "jobName":
					return (
						<span className="text-slate-950 font-semibold">
							{quote.jobName}
						</span>
					);
				case "date":
					return (
						<span className="text-slate-600">
							{quote[columnKey]}
						</span>
					);
				case "type":
					return (
						<Badge
							variant={getTypeBadgeVariant(quote.type)}
							className="rounded-full px-3 py-1 cursor-default"
						>
							{quote.type}
						</Badge>
					);
				case "request":
				case "municipality":
					return (
						<span className="text-slate-600">
							{quote[columnKey]}
						</span>
					);
				case "category":
					return (
						<span className="text-slate-600">{quote.category}</span>
					);
				case "actions": {
					const isFavorite = favoriteIds.has(quote.id);

					return (
						<div className="flex items-center justify-start gap-3">
							<Button
								variant="ghost"
								className="h-10 px-4 bg-secondary-foreground font-medium text-secondary"
								onClick={() => router.push(`${quote.id}`)}
							>
								<Translate
									text={localizationConstants.viewProject}
								/>
							</Button>
							<Button
								variant="outline"
								className="h-10 px-4 border-border font-medium bg-white text-secondary"
								onClick={() => {
									const type = quote.type.toLowerCase();
									const isExpress = type.includes("express");
									const isRent = type.includes("rent");
									const isBusinessOffer =
										type.includes("b2c") ||
										type.includes("b2b");

									if (isExpress) {
										openModal(
											MODAL_CONSTANTS.BUSINESS_EXPRESS,
											quote.id,
										);
										return;
									}

									if (isRent) {
										openModal(
											MODAL_CONSTANTS.BUSINESS_RENT,
											quote.id,
										);
										return;
									}

									if (!isBusinessOffer) return;
									openModal(
										MODAL_CONSTANTS.BUSINESS_OFFER,
										quote.id,
									);
								}}
							>
								<Translate
									text={localizationConstants.takeJob}
								/>
							</Button>
							<button
								type="button"
								className="h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-slate-50"
								aria-label="Toggle favorite"
								onClick={() =>
									setFavoriteIds((prev) => {
										const next = new Set(prev);
										if (next.has(quote.id))
											next.delete(quote.id);
										else next.add(quote.id);
										return next;
									})
								}
							>
								<Heart
									className={cn(
										"h-5 w-5",
										isFavorite
											? "text-slate-900 fill-slate-900"
											: "text-slate-400",
									)}
								/>
							</button>
						</div>
					);
				}

				default:
					return null;
			}
		},
		[favoriteIds, router, openModal],
	);

	const totalPages = useMemo(
		() => Math.ceil(totalItems / pageSize),
		[totalItems, pageSize],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full bg-white rounded-md border border-slate-200 overflow-hidden">
				<Table className="table-auto w-full">
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{OFFER_LIST_COLUMNS.map((col) => (
								<TableHead
									key={col.field}
									className={cn(
										"cursor-pointer select-none text-slate-500 font-medium py-4 px-5 h-auto whitespace-nowrap",
										col.field === "actions" &&
											"cursor-default w-[360px]",
									)}
									onClick={() => handleSort(col.field)}
								>
									<div
										className={cn(
											"flex items-center",
											col.field === "actions" &&
												"justify-start w-[270px]",
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
						{data.map((quote) => (
							<TableRow
								key={quote.id}
								className="border-slate-100 hover:bg-slate-50/50"
							>
								{OFFER_LIST_COLUMNS.map((col) => (
									<TableCell
										key={`${quote.id}-${col.field}`}
										className={cn(
											"py-3 px-4",
											col.field === "actions" &&
												"text-right w-[360px]",
										)}
									>
										{renderCell(quote, col.field)}
									</TableCell>
								))}
							</TableRow>
						))}
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={OFFER_LIST_COLUMNS.length}
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

			<TablePagination
				currentPage={page}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={(newPage) =>
					changeQueries({ page: String(newPage) })
				}
				onPageSizeChange={(newSize) =>
					changeQueries({ page: "1", page_size: String(newSize) })
				}
			/>

			<BusinessOfferModal
				open={isOpen && type === MODAL_CONSTANTS.BUSINESS_OFFER}
				onOpenChange={(open) => !open && closeModal()}
				quote={selectedBusinessQuote}
				onConfirm={(q) => {
					if (!q?.id) return;
					router.push(`/offer/send/${q.id}`);
				}}
			/>

			<BusinessExpressModal
				open={isOpen && type === MODAL_CONSTANTS.BUSINESS_EXPRESS}
				onOpenChange={(open) => !open && closeModal()}
				quote={selectedBusinessQuote}
				onConfirm={(q) => {
					if (!q?.id) return;
					router.push(`/offer/send/${q.id}`);
				}}
			/>

			<BusinessRentModal
				open={isOpen && type === MODAL_CONSTANTS.BUSINESS_RENT}
				onOpenChange={(open) => !open && closeModal()}
				quote={selectedBusinessQuote}
				onConfirm={(q) => {
					if (!q?.id) return;
					router.push(`/offer/send/${q.id}`);
				}}
			/>
		</div>
	);
}
