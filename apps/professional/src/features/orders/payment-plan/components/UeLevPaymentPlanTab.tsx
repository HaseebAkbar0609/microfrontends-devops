"use client";

import React, { useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	Plus,
	Check,
	Clock,
	PencilLine,
	Trash2,
	Send,
} from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/table/TablePagination";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { UeLevPaymentPlan, UeLevStatus } from "../types/paymentPlan.types";
import { ConfirmModal } from "./PaymentPlanModals";

export interface UeLevPaymentPlanTabProps {
	plans: UeLevPaymentPlan[];
	rawCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onOpenAddModal: () => void;
	onDelete: (planId: string) => void;
	onSend: (planId: string) => void;
}

function StatusBadge({ status }: { status: UeLevStatus }) {
	const t = useTranslate();

	if (status === "approved") {
		return (
			<span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
				<Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
				<span>{t(localizationConstants.statusGodkand)}</span>
			</span>
		);
	}

	if (status === "under_review") {
		return (
			<span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
				<Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
				<span>{t(localizationConstants.statusGranskas)}</span>
			</span>
		);
	}

	return (
		<span className="inline-flex items-center text-xs font-normal text-slate-700 px-1 py-0.5">
			{t(localizationConstants.statusEjKlar)}
		</span>
	);
}

export function UeLevPaymentPlanTab({
	plans,
	currentPage,
	pageSize,
	totalPages,
	onPageChange,
	onPageSizeChange,
	onOpenAddModal,
	onDelete,
	onSend,
}: UeLevPaymentPlanTabProps) {
	const t = useTranslate();

	const [sortBy, setSortBy] = useState<keyof UeLevPaymentPlan>("companyName");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [planToDelete, setPlanToDelete] = useState<UeLevPaymentPlan | null>(null);
	const [planToSend, setPlanToSend] = useState<UeLevPaymentPlan | null>(null);

	const handleSort = (field: keyof UeLevPaymentPlan) => {
		if (sortBy === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const renderSortIcon = (field: keyof UeLevPaymentPlan) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	const sortedPlans = [...plans].sort((a, b) => {
		const aVal = a[sortBy];
		const bVal = b[sortBy];
		if (typeof aVal === "number" && typeof bVal === "number") {
			return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
		}
		const strA = String(aVal || "").toLowerCase();
		const strB = String(bVal || "").toLowerCase();
		if (strA < strB) return sortOrder === "asc" ? -1 : 1;
		if (strA > strB) return sortOrder === "asc" ? 1 : -1;
		return 0;
	});

	return (
		<div className="w-full space-y-4">
			<div className="w-full max-w-[720px] overflow-x-auto relative bg-white">
				<Table className="w-full table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead
								onClick={() => handleSort("companyName")}
								className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
							>
								<div className="flex items-center gap-1">
									<span>{t(localizationConstants.colForetagsNamn)}</span>
									{renderSortIcon("companyName")}
								</div>
							</TableHead>
							<TableHead
								onClick={() => handleSort("totalAmount")}
								className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
							>
								<div className="flex items-center gap-1">
									<span>{t(localizationConstants.colTotal)}</span>
									{renderSortIcon("totalAmount")}
								</div>
							</TableHead>
							<TableHead
								onClick={() => handleSort("status")}
								className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
							>
								<div className="flex items-center gap-1">
									<span>{t(localizationConstants.colStatus)}</span>
									{renderSortIcon("status")}
								</div>
							</TableHead>
							<TableHead className="w-28 px-2 py-3.5 text-center font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]" />
							<TableHead className="w-10 px-2 py-3.5 text-right">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={onOpenAddModal}
									className="h-7 w-7 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
									title={t(localizationConstants.btnLaggTill)}
									aria-label={t(localizationConstants.btnLaggTill)}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedPlans.length === 0 ? (
							<TableRow className="h-[56px]">
								<TableCell colSpan={5} className="h-[56px] text-center text-xs text-slate-400 py-6">
									{t(localizationConstants.noRecordsFound)}
								</TableCell>
							</TableRow>
						) : (
							sortedPlans.map((plan) => (
								<TableRow
									key={plan.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
										{plan.companyName}
									</TableCell>
									<TableCell className="px-4 py-3.5 font-sans font-normal text-sm text-slate-800 whitespace-nowrap">
										{plan.totalAmount.toLocaleString("sv-SE")}
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<StatusBadge status={plan.status} />
									</TableCell>
									<TableCell className="px-2 py-3.5 text-center whitespace-nowrap">
										<Button
											type="button"
											variant="secondary"
											className="h-8 px-3 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-none cursor-pointer"
										>
											{t(localizationConstants.btnVisaDetaljer)}
										</Button>
									</TableCell>
									<TableCell className="px-3 py-3.5 text-right whitespace-nowrap">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
													aria-label={t(localizationConstants.actions)}
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
												<DropdownMenuItem
													className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
												>
													<PencilLine className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
													<span>{t(localizationConstants.btnRedigera)}</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setPlanToSend(plan)}
													className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
												>
													<Send className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
													<span>{t(localizationConstants.btnSkicka)}</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setPlanToDelete(plan)}
													className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
												>
													<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
													<span>{t(localizationConstants.btnRadera)}</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="w-full flex justify-center pt-2">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					className="justify-center sm:justify-center"
				/>
			</div>

			{/* Safe Confirmation Modals */}
			<ConfirmModal
				isOpen={!!planToDelete}
				onClose={() => setPlanToDelete(null)}
				onConfirm={() => {
					if (planToDelete) onDelete(planToDelete.id);
				}}
				itemName={planToDelete?.companyName}
				type="delete"
			/>

			<ConfirmModal
				isOpen={!!planToSend}
				onClose={() => setPlanToSend(null)}
				onConfirm={() => {
					if (planToSend) onSend(planToSend.id);
				}}
				planName={planToSend?.companyName}
				type="send"
			/>
		</div>
	);
}
