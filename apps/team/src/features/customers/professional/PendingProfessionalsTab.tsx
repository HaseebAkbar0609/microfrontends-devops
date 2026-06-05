"use client";

import { useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, EllipsisVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsToolbar } from "@/components/table/ActionsToolbar";
import { TablePagination } from "@/components/table/TablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PendingProfessionalRow, PendingProfessionalStatus, PendingSortField } from "@/api-actions/customers/professionals/list";

const STATUS_CONFIG: Record<PendingProfessionalStatus, { label: string; className: string }> = {
	sent:     { label: localizationConstants.professionalStatusSent,     className: "bg-blue-100 text-blue-700" },
	accepted: { label: localizationConstants.professionalStatusAccepted, className: "bg-yellow-100 text-yellow-700" },
	paid:     { label: localizationConstants.professionalStatusPaid,     className: "bg-emerald-100 text-emerald-700" },
};

interface SortIconProps {
	readonly field: string;
	readonly sortBy: string | null;
	readonly sortOrder: "asc" | "desc";
}

function SortIcon({ field, sortBy, sortOrder }: SortIconProps) {
	if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />;
	if (sortOrder === "asc") return <ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-700" />;
	return <ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-700" />;
}

interface PendingProfessionalsTabProps {
	readonly rows: PendingProfessionalRow[];
	readonly isLoading: boolean;
	readonly totalPages: number;
	readonly currentPage: number;
	readonly pageSize: number;
	readonly sortBy: PendingSortField;
	readonly sortOrder: "asc" | "desc";
	readonly searchInput: string;
	readonly onSearchChange: (value: string) => void;
	readonly onSort: (field: PendingSortField) => void;
	readonly onPageChange: (page: number) => void;
	readonly onPageSizeChange: (size: number) => void;
	readonly onDelete: (id: string) => void;
}

export function PendingProfessionalsTab({
	rows,
	isLoading,
	totalPages,
	currentPage,
	pageSize,
	sortBy,
	sortOrder,
	searchInput,
	onSearchChange,
	onSort,
	onPageChange,
	onPageSizeChange,
	onDelete,
}: PendingProfessionalsTabProps) {
	const t = useTranslate();

	const columns = useMemo(() => [
		{ id: "customerNo",    key: "customerNo" as PendingSortField,    label: localizationConstants.professionalColCustomerNo, sortable: true },
		{ id: "companyName",   key: "companyName" as PendingSortField,   label: localizationConstants.companyNameLabel,          sortable: true },
		{ id: "category",      key: "category" as PendingSortField,      label: localizationConstants.categoryLabel,             sortable: true },
		{ id: "city",          key: "city" as PendingSortField,          label: localizationConstants.cityLabel,                 sortable: true },
		{ id: "contactPerson", key: "contactPerson" as PendingSortField, label: localizationConstants.contactPersonLabel,        sortable: true },
		{ id: "amount",        key: "amount" as PendingSortField,        label: localizationConstants.amountLabel,               sortable: true },
		{ id: "dueDate",       key: "dueDate" as PendingSortField,       label: localizationConstants.dueDateLabel,              sortable: true },
		{ id: "status",        key: null,                                label: localizationConstants.statusLabel,               sortable: false },
		{ id: "actions",       key: null,                                label: "",                                              sortable: false },
	], []);

	return (
		<>
			<ActionsToolbar
				searchValue={searchInput}
				onSearchChange={onSearchChange}
				searchPlaceholder={localizationConstants.searchPlaceholder}
				onCreateClick={() => {}}
				createButtonLabel={localizationConstants.professionalCreateButton}
				className="px-0 py-4"
			/>

			<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
				<Table>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{columns.map((col) => (
								<TableHead
									key={col.id}
									className={`whitespace-nowrap py-3.5 px-4 text-sm font-medium text-slate-500 ${col.sortable ? "cursor-pointer select-none" : ""} ${col.id === "actions" ? "border-l border-slate-200 w-16" : ""}`}
									onClick={() => col.sortable && col.key && onSort(col.key)}
								>
									<span className="inline-flex items-center gap-1">
										{col.label && <Translate text={col.label} />}
										{col.sortable && col.key && (
											<SortIcon field={col.key} sortBy={sortBy} sortOrder={sortOrder} />
										)}
									</span>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading && (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-32 text-center text-sm text-slate-400">
									Loading...
								</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-32 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.professionalNoDataFound} />
								</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.map((row) => {
							const statusCfg = STATUS_CONFIG[row.status];
							return (
								<TableRow key={row.id} className="hover:bg-slate-50/70 odd:bg-white even:bg-slate-50/40">
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-900">{row.customerNo}</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-900">{row.companyName}</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.category}</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.city}</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.contactPerson}</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
										{row.amount.toLocaleString("sv-SE")} kr
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.dueDate}</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5">
										<span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.className}`}>
											<Translate text={statusCfg.label} />
										</span>
									</TableCell>
									<TableCell className="border-l border-slate-200 px-4 py-3.5 text-center">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-white text-slate-700 hover:bg-slate-100">
													<EllipsisVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="min-w-37.5">
												<DropdownMenuItem className="gap-2 cursor-pointer py-2">
													<Eye className="h-4 w-4" />
													<Translate text={localizationConstants.open} />
												</DropdownMenuItem>
												<ConfirmDialog
													title={t(localizationConstants.delete) + "?"}
													description="This action cannot be undone."
													onConfirm={() => onDelete(row.id)}
													confirmText={t(localizationConstants.delete)}
													cancelText={t(localizationConstants.cancelLabel)}
													confirmClassName="bg-red-600 hover:bg-red-700"
													trigger={
														<DropdownMenuItem className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700" onSelect={(e) => e.preventDefault()}>
															<Trash2 className="h-4 w-4" />
															<Translate text={localizationConstants.delete} />
														</DropdownMenuItem>
													}
												/>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</>
	);
}
