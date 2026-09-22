"use client";

import { useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Ban, Eye, EllipsisVertical, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsToolbar } from "@/components/table/ActionsToolbar";
import { TablePagination } from "@/components/table/TablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ProfessionalRow } from "@/api-actions/customers/professionals/list";

type SortField = keyof Omit<ProfessionalRow, "id" | "status"> | null;

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

interface ActiveProfessionalsTabProps {
	readonly rows: ProfessionalRow[];
	readonly isLoading: boolean;
	readonly totalPages: number;
	readonly currentPage: number;
	readonly pageSize: number;
	readonly sortBy: SortField;
	readonly sortOrder: "asc" | "desc";
	readonly searchInput: string;
	readonly onSearchChange: (value: string) => void;
	readonly onSort: (field: SortField) => void;
	readonly onPageChange: (page: number) => void;
	readonly onPageSizeChange: (size: number) => void;
	readonly onDelete: (id: string) => void;
	readonly onToggleStatus: (id: string) => void;
	readonly onCreateClick?: () => void;
	readonly onOpenClick?: (id: string) => void;
}

export function ActiveProfessionalsTab({
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
	onToggleStatus,
	onCreateClick,
	onOpenClick,
}: ActiveProfessionalsTabProps) {
	const t = useTranslate();

	const columns = useMemo(() => [
		{ id: "contactUserId", key: "contactUserId" as SortField, label: localizationConstants.professionalColCustomerNo, sortable: true },
		{ id: "companyName",   key: "companyName" as SortField,   label: localizationConstants.professionalColCompanyName, sortable: true },
		{ id: "orgNo",         key: "orgNo" as SortField,         label: localizationConstants.orgNumberLabel,            sortable: true },
		{ id: "category",      key: "category" as SortField,      label: localizationConstants.categoryLabel,             sortable: true },
		{ id: "contactPerson", key: "contactPerson" as SortField, label: localizationConstants.contactPersonLabel,        sortable: true },
		{ id: "email",         key: "email" as SortField,         label: localizationConstants.emailLabel,                sortable: true },
		{ id: "phone",         key: "phone" as SortField,         label: localizationConstants.phoneLabel,                sortable: true },
		{ id: "city",          key: "city" as SortField,          label: localizationConstants.cityLabel,                 sortable: true },
		{ id: "status",        key: null,                         label: localizationConstants.statusLabel,               sortable: false },
		{ id: "actions",       key: null,                         label: "",                                              sortable: false },
	], []);

	return (
		<>
			<ActionsToolbar
				searchValue={searchInput}
				onSearchChange={onSearchChange}
				searchPlaceholder={localizationConstants.searchPlaceholder}
				onCreateClick={onCreateClick}
				createButtonLabel={localizationConstants.professionalCreateButton}
				className="flex-col items-stretch px-0 py-4 sm:flex-row sm:items-center [&>button]:w-full sm:[&>button]:w-auto"
			/>

			<div className="min-w-0 rounded-md border border-slate-200 bg-white">
				<Table>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{columns.map((col) => (
								<TableHead
									key={col.id}
									className={`whitespace-nowrap py-3.5 px-4 text-sm font-medium text-slate-500 ${col.sortable ? "cursor-pointer select-none" : ""} ${col.id === "contactUserId" ? "hidden xl:table-cell" : ""} ${col.id === "actions" ? "border-l border-slate-200 w-16" : ""}`}
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
								<TableCell colSpan={columns.length}>
									<div className="flex min-h-[240px] items-center justify-center text-slate-500">
										<Loader2 className="h-8 w-8 animate-spin" aria-hidden />
									</div>
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
						{!isLoading && rows.map((row) => (
							<TableRow key={row.id} className="hover:bg-slate-50/70 odd:bg-white even:bg-slate-50/40">
								<TableCell className="hidden whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-900 xl:table-cell">{row.contactUserId}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-900">
									<button type="button" className="text-left hover:underline focus-visible:underline" onClick={() => onOpenClick?.(row.id)}>{row.companyName}</button>
								</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.orgNo}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.category}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.contactPerson}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.email}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.phone}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">{row.city}</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-3.5">
									{row.status === "active" ? (
										<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
											<Translate text={localizationConstants.professionalStatusActive} />
										</span>
									) : (
										<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
											<Translate text={localizationConstants.professionalActionDeactivate} />
										</span>
									)}
								</TableCell>
								<TableCell className="border-l border-slate-200 px-4 py-3.5 text-center">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-white text-slate-700 hover:bg-slate-100">
												<EllipsisVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="min-w-37.5">
											<DropdownMenuItem
												className="gap-2 cursor-pointer py-2"
												onClick={() => onOpenClick?.(row.id)}
											>
												<Eye className="h-4 w-4" />
												<Translate text={localizationConstants.open} />
											</DropdownMenuItem>
											<ConfirmDialog
												title={row.status === "active"
													? t(localizationConstants.professionalActionDeactivate) + "?"
													: t(localizationConstants.professionalActionActivate) + "?"}
												onConfirm={() => onToggleStatus(row.id)}
												confirmText={row.status === "active"
													? t(localizationConstants.professionalActionDeactivate)
													: t(localizationConstants.professionalActionActivate)}
												cancelText={t(localizationConstants.cancelLabel)}
												confirmClassName={row.status === "active" ? "bg-amber-600 hover:bg-amber-700" : ""}
												trigger={
													<DropdownMenuItem className="gap-2 cursor-pointer py-2" onSelect={(e) => e.preventDefault()}>
														<Ban className="h-4 w-4" />
														{row.status === "active"
															? <Translate text={localizationConstants.professionalActionDeactivate} />
															: <Translate text={localizationConstants.professionalActionActivate} />}
													</DropdownMenuItem>
												}
											/>
											<ConfirmDialog
												title={t(localizationConstants.delete) + "?"}
												description={t(localizationConstants.deleteCannotUndoneLabel)}
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
						))}
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
