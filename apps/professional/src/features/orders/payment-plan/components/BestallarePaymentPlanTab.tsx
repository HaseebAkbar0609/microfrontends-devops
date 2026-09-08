"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	PencilLine,
	Send,
	Trash2,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BestallarePaymentPlan } from "../types/paymentPlan.types";
import { ConfirmModal } from "./PaymentPlanModals";

function DocTypeBadge({ type, label }: { type?: string; label?: string }) {
	if (type === "doc" || (!type && label?.endsWith(".doc")) || label?.endsWith(".docx")) {
		return <DocFileIcon className="h-11 w-9 shrink-0" />;
	}
	return <PdfFileIcon className="h-11 w-9 shrink-0" />;
}

export interface BestallarePaymentPlanTabProps {
	plans: BestallarePaymentPlan[];
	orderId: string;
	onDelete: (planId: string) => void;
	onSend: (planId: string) => void;
}

export function BestallarePaymentPlanTab({
	plans,
	orderId,
	onDelete,
	onSend,
}: BestallarePaymentPlanTabProps) {
	const t = useTranslate();
	const router = useRouter();

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<keyof BestallarePaymentPlan>("planNumber");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const [planToDelete, setPlanToDelete] = useState<BestallarePaymentPlan | null>(null);
	const [planToSend, setPlanToSend] = useState<BestallarePaymentPlan | null>(null);

	const handleSort = (field: keyof BestallarePaymentPlan) => {
		if (sortBy === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const renderSortIcon = (field: keyof BestallarePaymentPlan) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	const toggleSelectAll = () => {
		if (selectedIds.length === plans.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(plans.map((p) => p.id));
		}
	};

	const toggleSelectRow = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

	const handleNavigateDetail = (planId: string) => {
		router.push(`/module/production/order/${orderId}/payment-plan/${planId}`);
	};

	return (
		<div className="w-full">
			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead className="w-12 px-4 py-3.5">
								<Checkbox
									checked={plans.length > 0 && selectedIds.length === plans.length}
									onCheckedChange={toggleSelectAll}
									aria-label="Select all"
									className="border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white focus-visible:ring-slate-900 cursor-pointer"
								/>
							</TableHead>
							<TableHead
								onClick={() => handleSort("planNumber")}
								className="w-28 px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
							>
								<div className="flex items-center gap-1">
									<span>{t(localizationConstants.colPlan)}</span>
									{renderSortIcon("planNumber")}
								</div>
							</TableHead>
							<TableHead
								onClick={() => handleSort("name")}
								className="w-[35%] px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
							>
								<div className="flex items-center gap-1">
									<span>{t(localizationConstants.colBetalningsplan)}</span>
									{renderSortIcon("name")}
								</div>
							</TableHead>
							<TableHead
								onClick={() => handleSort("fileName")}
								className="w-[40%] px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
							>
								<div className="flex items-center gap-1">
									<span>{t(localizationConstants.colFil)}</span>
									{renderSortIcon("fileName")}
								</div>
							</TableHead>
							<TableHead className="w-[140px] px-4 py-3.5 text-center font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]" />
							<TableHead className="w-12 px-3 py-3.5 text-right" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedPlans.length === 0 ? (
							<TableRow className="h-[56px]">
								<TableCell colSpan={6} className="h-[56px] text-center text-xs text-slate-400 py-6">
									{t(localizationConstants.noRecordsFound)}
								</TableCell>
							</TableRow>
						) : (
							sortedPlans.map((plan) => (
								<TableRow
									key={plan.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="w-12 px-4 py-3.5">
										<Checkbox
											checked={selectedIds.includes(plan.id)}
											onCheckedChange={() => toggleSelectRow(plan.id)}
											aria-label={`Select plan ${plan.planNumber}`}
											className="border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white focus-visible:ring-slate-900 cursor-pointer"
										/>
									</TableCell>
									<TableCell className="w-28 px-4 py-3.5 font-sans font-normal text-sm text-slate-700 whitespace-nowrap">
										{plan.planNumber}
									</TableCell>
									<TableCell className="w-[35%] px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
										{plan.name}
									</TableCell>
									<TableCell className="w-[40%] px-4 py-3.5">
										<div className="flex items-center gap-2 min-w-0">
											<DocTypeBadge label={plan.fileName} />
											<span className="font-sans text-xs font-normal text-slate-900 truncate min-w-0 flex-1">
												{plan.fileName}
											</span>
										</div>
									</TableCell>
									<TableCell className="w-[140px] px-4 py-3.5 text-center whitespace-nowrap">
										<Button
											type="button"
											variant="secondary"
											onClick={() => handleNavigateDetail(plan.id)}
											className="h-8 px-4 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-none cursor-pointer"
										>
											{t(localizationConstants.btnSePlan)}
										</Button>
									</TableCell>
									<TableCell className="w-12 px-3 py-3.5 text-right whitespace-nowrap">
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
													onClick={() => handleNavigateDetail(plan.id)}
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

			{/* Safe Confirmation Modals */}
			<ConfirmModal
				isOpen={!!planToDelete}
				onClose={() => setPlanToDelete(null)}
				onConfirm={() => {
					if (planToDelete) onDelete(planToDelete.id);
				}}
				itemName={planToDelete?.name}
				type="delete"
			/>

			<ConfirmModal
				isOpen={!!planToSend}
				onClose={() => setPlanToSend(null)}
				onConfirm={() => {
					if (planToSend) onSend(planToSend.id);
				}}
				planName={planToSend?.name}
				type="send"
			/>
		</div>
	);
}
