"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import { JobRef, OfferList, OfferListColumn, OfferListTableProps } from "../types";
import { OFFER_LIST_COLUMNS } from "../constants";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BusinessOfferModal } from "./BusinessOfferModal";
import { BusinessExpressModal } from "./BusinessExpressModal";
import { BusinessRentModal } from "./BusinessRentModal";
import { OfferConfirmationModal } from "./OfferConfirmationModal";
import { MODAL_CONSTANTS, type ModalType } from "@/constants/constant";
import useModal from "@/features/auth/hooks/useModal";
import { toggleOfferFavoriteAPIAction } from "@/api-actions/offers";
import { showToast } from "@/lib/toast";

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
		return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-400 opacity-70" />;
	return sortOrder === "asc" ? (
		<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900" />
	) : (
		<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900" />
	);
};

function renderTypeBadge(type: string) {
	const lower = type.toLowerCase();
	if (lower.includes("express")) {
		return (
			<span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 shadow-xs whitespace-nowrap">
				{type}
			</span>
		);
	}
	if (lower.includes("b2c")) {
		return (
			<span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-xs whitespace-nowrap">
				{type}
			</span>
		);
	}
	return (
		<span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60 shadow-xs whitespace-nowrap">
			{type}
		</span>
	);
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

	useEffect(() => {
		setFavoriteIds(new Set(data.filter((item) => item.isFavorite).map((item) => item.id)));
	}, [data]);

	const handleFavorite = useCallback(async (quote: OfferList) => {
		const wasFavorite = favoriteIds.has(quote.id);
		setFavoriteIds((prev) => {
			const next = new Set(prev);
			if (wasFavorite) next.delete(quote.id);
			else next.add(quote.id);
			return next;
		});
		const result = await toggleOfferFavoriteAPIAction(quote.projectId || quote.id, !wasFavorite);
		if (!result.success) {
			setFavoriteIds((prev) => {
				const next = new Set(prev);
				if (wasFavorite) next.add(quote.id);
				else next.delete(quote.id);
				return next;
			});
			showToast("error", result.error || "Failed to update favorite");
		}
	}, [favoriteIds]);

	const selectedBusinessQuote = useMemo(() => {
		if (!modalId) return null;
		return data.find((q) => q.id === modalId) ?? null;
	}, [data, modalId]);
	const handleTakeJobConfirmed = useCallback(
		(quote: JobRef | null | undefined) => {
			const selectedQuote = data.find((item) => item.id === quote?.id) ?? selectedBusinessQuote;
			if (!selectedQuote) return;
			const typeName = selectedQuote.type.toLowerCase();
			const formType =
				typeName.includes("rent") ||
				typeName.includes("hyra") ||
				typeName.includes("b2b")
					? "rent"
					: typeName.includes("express")
						? "express"
						: "b2c";
			router.push(
				`/module/business/offer/send/${selectedQuote.projectId || selectedQuote.id}?type=${formType}`,
			);
		},
		[data, router, selectedBusinessQuote],
	);

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
						<span className="text-slate-600 text-xs font-normal">{quote.idNumber}</span>
					);
				case "jobName":
					return (
						<span className="text-slate-900 text-xs font-bold">
							{quote.jobName}
						</span>
					);
				case "date":
					return (
						<span className="text-slate-600 text-xs font-normal">
							{quote[columnKey]}
						</span>
					);
				case "type":
					return renderTypeBadge(quote.type);
				case "request":
				case "municipality":
					return (
						<span className="text-slate-600 text-xs font-normal">
							{quote[columnKey]}
						</span>
					);
				case "category":
					return (
						<span className="text-slate-600 text-xs font-normal">{quote.category}</span>
					);
				case "actions": {
					const isFavorite = favoriteIds.has(quote.id);

					return (
						<div className="flex items-center justify-end gap-2.5">
							<Button
								variant="ghost"
								className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 rounded-md cursor-pointer transition-colors"
								onClick={() => router.push(`/module/business/offer/list/${quote.id}`)}
							>
								<Translate
									text={localizationConstants.viewProject}
								/>
							</Button>
							<Button
								variant="outline"
								className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-800 bg-white rounded-md cursor-pointer transition-colors"
								onClick={() => {
									const typeStr = quote.type.toLowerCase();
									const isExpress = typeStr.includes("express");
									const isRent = typeStr.includes("rent") || typeStr.includes("hyra");
									const isConfirmation =
										typeStr.includes("confirm") ||
										typeStr.includes("direkt") ||
										typeStr.includes("direct");

									if (isConfirmation) {
										openModal(
											MODAL_CONSTANTS.OFFER_CONFIRMATION,
											quote.id,
										);
										return;
									}

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
								className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
								aria-label="Toggle favorite"
								onClick={() => void handleFavorite(quote)}
							>
								<Heart
									className={cn(
										"h-4 w-4 stroke-[1.75]",
										isFavorite
											? "text-slate-900 fill-slate-900"
											: "text-slate-600 fill-none",
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
		[favoriteIds, router, openModal, handleFavorite],
	);

	const totalPages = useMemo(
		() => Math.ceil(totalItems / pageSize),
		[totalItems, pageSize],
	);

	return (
		<div className="flex flex-col gap-4 font-sans">
			<div className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
				<Table className="table-auto w-full">
					<TableHeader className="bg-slate-50/70 border-b border-slate-200">
						<TableRow className="hover:bg-transparent border-slate-200">
							{OFFER_LIST_COLUMNS.map((col) => (
								<TableHead
									key={col.field}
									className={cn(
										"cursor-pointer select-none text-slate-500 font-medium py-3.5 px-4 h-auto whitespace-nowrap text-xs text-left",
										col.field === "actions" &&
											"cursor-default text-right w-60",
									)}
									onClick={() => handleSort(col.field)}
								>
									<div
										className={cn(
											"flex items-center gap-1",
											col.field === "actions" && "justify-end",
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
					<TableBody className="divide-y divide-slate-100">
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={OFFER_LIST_COLUMNS.length}
									className="h-32 text-center text-slate-400 text-xs"
								>
									<Translate text={localizationConstants.noQuotesFound} />
								</TableCell>
							</TableRow>
						) : (
							data.map((quote) => (
								<TableRow
									key={quote.id}
									className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
								>
									{OFFER_LIST_COLUMNS.map((col) => (
										<TableCell
											key={col.field}
											className="py-3 px-4 text-left"
										>
											{renderCell(quote, col.field)}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<TablePagination
				currentPage={page}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={(nextPage) => changeQueries({ page: String(nextPage) })}
				onPageSizeChange={(newPageSize) =>
					changeQueries({ page_size: String(newPageSize), page: "1" })
				}
			/>

			{/* Modal Dialogs */}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_OFFER && (
				<BusinessOfferModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={selectedBusinessQuote}
					onConfirm={handleTakeJobConfirmed}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_EXPRESS && (
				<BusinessExpressModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={selectedBusinessQuote}
					onConfirm={handleTakeJobConfirmed}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_RENT && (
				<BusinessRentModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={selectedBusinessQuote}
					onConfirm={handleTakeJobConfirmed}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.OFFER_CONFIRMATION && (
				<OfferConfirmationModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					onConfirm={() => handleTakeJobConfirmed(selectedBusinessQuote)}
				/>
			)}
		</div>
	);
}

export default OfferListTable;
