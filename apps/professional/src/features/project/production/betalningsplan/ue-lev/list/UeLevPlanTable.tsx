"use client";

import Link from "next/link";
import { CircleCheck, Eye, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectColumnPicker } from "../../../../components/ProjectColumnPicker";
import { paymentPlanUrls } from "../../paymentPlanNav";
import { SortableHead } from "../../../components/SortableHead";
import { SupplierStatusBadge } from "../SupplierStatusBadge";
import { approveBlockedReason, SUPPLIER_LIST_COLUMNS } from "../supplierPlan.config";
import type { SupplierPaymentPlan } from "../types";
import type { SupplierPlanListState } from "./useSupplierPlanList";

const CELL = "px-4 py-3 text-sm text-slate-900";
const ITEM = "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900";

export interface UeLevPlanTableProps {
	list: SupplierPlanListState;
	onApprove: (plan: SupplierPaymentPlan) => void;
}

/**
 * The UE / Lev table. Hand-rolled on the table primitives, like the Tidsplan
 * list, because `DataTable` has no slot for the header + column picker.
 */
export function UeLevPlanTable({ list, onApprove }: UeLevPlanTableProps) {
	const t = useTranslate();
	const columns = SUPPLIER_LIST_COLUMNS.filter((column) => list.visibleColumns.has(column.key));

	const cell = (plan: SupplierPaymentPlan, key: (typeof columns)[number]["key"]) => {
		if (key === "companyName") return <span className="font-medium">{plan.companyName}</span>;
		if (key === "totalAmount") return <span className="tabular-nums">{formatCurrency(plan.totalAmount)}</span>;
		return <SupplierStatusBadge status={plan.status} />;
	};

	return (
		<div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
			<Table className="min-w-[40rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{columns.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => list.onSort(column.key)}
								active={list.sortField === column.key}
								dir={list.sortDir}
							/>
						))}
						<TableHead className="w-40" />
						<TableHead className="w-16 border-l border-slate-200 px-2 text-center">
							<ProjectColumnPicker
								columns={SUPPLIER_LIST_COLUMNS}
								visibleColumns={list.visibleColumns}
								onToggleColumn={list.toggleColumn}
								ariaLabelKey={localizationConstants.projectSupplierPlanColumnPicker}
							/>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{list.rows.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns.length + 2} className="py-12 text-center text-sm text-slate-500">
								<Translate
									text={
										list.isEmpty
											? localizationConstants.projectSupplierPlanEmpty
											: localizationConstants.projectSupplierPlanNoMatches
									}
								/>
							</TableCell>
						</TableRow>
					) : (
						list.rows.map((plan) => {
							const blocked = approveBlockedReason(plan);
							/* From the list an unreviewed plan has to be opened first. */
							const reason =
								blocked === localizationConstants.projectSupplierPlanReviewFirst
									? localizationConstants.projectSupplierPlanOpenToReview
									: blocked;
							const href = paymentPlanUrls.supplierView(plan.projectId, plan.id);

							return (
								<TableRow key={plan.id}>
									{columns.map((column) => (
										<TableCell key={column.key} className={CELL}>
											{cell(plan, column.key)}
										</TableCell>
									))}
									<TableCell className="px-4 py-3">
										<Button asChild variant="secondary" className="h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200">
											<Link href={href}>
												<Translate text={localizationConstants.btnVisaDetaljer} />
											</Link>
										</Button>
									</TableCell>
									<TableCell className="border-l border-slate-200 px-2 py-3 text-center">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													aria-label={`${t(localizationConstants.actions)} ${plan.companyName}`}
													className="h-9 w-9 cursor-pointer text-slate-700"
												>
													<MoreVertical className="h-4 w-4" aria-hidden />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-48 border border-slate-200 bg-white p-1 shadow-md">
												<DropdownMenuItem asChild className={ITEM}>
													<Link href={href}>
														<Eye className="h-4 w-4 shrink-0" aria-hidden />
														<Translate text={localizationConstants.btnVisaDetaljer} />
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													disabled={Boolean(reason)}
													title={reason ? t(reason) : undefined}
													onClick={() => onApprove(plan)}
													className={ITEM}
												>
													<CircleCheck className="h-4 w-4 shrink-0" aria-hidden />
													<Translate text={localizationConstants.projectSupplierPlanApprove} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default UeLevPlanTable;
