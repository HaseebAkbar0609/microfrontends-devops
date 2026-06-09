"use client";

import { Suspense, useCallback, useEffect, useRef, useMemo, useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Ban,
	Eye,
	EllipsisVertical,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionsToolbar } from "@/components/table/ActionsToolbar";
import { TablePagination } from "@/components/table/TablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useQueryParams } from "@/components/hooks/useQueryParams";
import { useDebounce } from "@/components/hooks/useDebounce";
import { listProfessionalsAPIAction } from "@/api-actions";
import type { ProfessionalRow } from "@/api-actions/customers/professionals/list";

type ProfessionalTab = "active" | "pending" | "analytics" | "archived";

const TABS: { key: ProfessionalTab; labelKey: string }[] = [
	{ key: "active", labelKey: localizationConstants.professionalTabActive },
	{ key: "pending", labelKey: localizationConstants.professionalTabPending },
	{ key: "analytics", labelKey: localizationConstants.professionalTabAnalytics },
	{ key: "archived", labelKey: localizationConstants.professionalTabArchived },
];


type SortField = keyof Omit<ProfessionalRow, "id" | "status"> | null;

interface SortIconProps {
	readonly field: string;
	readonly sortBy: SortField;
	readonly sortOrder: "asc" | "desc";
}

function SortIcon({ field, sortBy, sortOrder }: SortIconProps) {
	if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />;
	if (sortOrder === "asc") return <ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-700" />;
	return <ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-700" />;
}

function ProfessionalListPageInner() {
	const t = useTranslate();
	const { search: searchParam, page, changeQueries, setPage } = useQueryParams();

	const [activeTab, setActiveTab] = useState<ProfessionalTab>("active");
	const [searchInput, setSearchInput] = useState(searchParam);
	const [pageSize, setPageSize] = useState(10);
	const [sortBy, setSortBy] = useState<SortField>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [rows, setRows] = useState<ProfessionalRow[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);

	const debouncedSearch = useDebounce(searchInput, 400);
	const prevDebouncedSearch = useRef(debouncedSearch);

	useEffect(() => {
		setSearchInput(searchParam);
	}, [searchParam]);

	useEffect(() => {
		if (prevDebouncedSearch.current === debouncedSearch) return;
		prevDebouncedSearch.current = debouncedSearch;
		changeQueries({ search: debouncedSearch || null, page: "1" });
	}, [debouncedSearch, changeQueries]);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);

		void listProfessionalsAPIAction({
			page,
			pageSize,
			search: debouncedSearch.trim() || undefined,
			sortBy: sortBy ?? undefined,
			sortOrder: sortBy ? sortOrder : undefined,
		}).then((result) => {
			if (cancelled) return;
			setRows(result.items);
			setTotalPages(result.totalPages);
			setIsLoading(false);
		});

		return () => { cancelled = true; };
	}, [page, pageSize, debouncedSearch, sortBy, sortOrder, activeTab]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab as ProfessionalTab);
		setSearchInput("");
		changeQueries({ search: null, page: "1" });
	};

	const handleSort = useCallback((field: SortField) => {
		if (!field) return;
		setSortBy((prev) => {
			if (prev !== field) {
				setSortOrder("asc");
				return field;
			}
			setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
			return field;
		});
		setPage(1);
	}, [setPage]);

	const handleDelete = useCallback((id: string) => {
		setRows((prev) => prev.filter((r) => r.id !== id));
	}, []);

	const handleToggleStatus = useCallback((id: string) => {
		setRows((prev) =>
			prev.map((r) =>
				r.id === id
					? { ...r, status: r.status === "active" ? "inactive" : "active" }
					: r,
			),
		);
	}, []);

	const currentPage = page;

	const columns = useMemo(() => [
		{ id: "customerNo",    key: "customerNo" as SortField,    label: localizationConstants.professionalColCustomerNo, sortable: true },
		{ id: "companyName",   key: "companyName" as SortField,   label: localizationConstants.companyNameLabel,          sortable: true },
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
		<div className="flex h-full flex-col gap-6 px-8 pt-6 pb-8">
			<h1 className="text-2xl font-semibold text-slate-900">
				<Translate text={localizationConstants.professional} />
			</h1>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList
					variant="line"
					className="w-full justify-start gap-1 border-b border-slate-200 p-0"
				>
					{TABS.map((tab) => (
						<TabsTrigger key={tab.key} value={tab.key} className="w-fit flex-none px-4">
							<Translate text={tab.labelKey} />
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={activeTab} className="pt-4">
					<ActionsToolbar
						searchValue={searchInput}
						onSearchChange={setSearchInput}
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
											onClick={() => col.sortable && col.key && handleSort(col.key)}
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
								{!isLoading && rows.length > 0 && rows.map((row) => (
										<TableRow key={row.id} className="hover:bg-slate-50/70 odd:bg-white even:bg-slate-50/40">
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-900">
												{row.customerNo}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-900">
												{row.companyName}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
												{row.orgNo}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
												{row.category}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
												{row.contactPerson}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
												{row.email}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
												{row.phone}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
												{row.city}
											</TableCell>
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
														<Button
															variant="ghost"
															size="icon"
															className="h-9 w-9 rounded-md bg-white text-slate-700 hover:bg-slate-100"
														>
															<EllipsisVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="min-w-37.5">
														<DropdownMenuItem className="gap-2 cursor-pointer py-2">
															<Eye className="h-4 w-4" />
															<Translate text={localizationConstants.open} />
														</DropdownMenuItem>
														<ConfirmDialog
															title={row.status === "active"
																? t(localizationConstants.professionalActionDeactivate) + "?"
																: t(localizationConstants.professionalActionActivate) + "?"}
															onConfirm={() => handleToggleStatus(row.id)}
															confirmText={row.status === "active"
																? t(localizationConstants.professionalActionDeactivate)
																: t(localizationConstants.professionalActionActivate)}
															cancelText={t(localizationConstants.cancelLabel)}
															confirmClassName={row.status === "active" ? "bg-amber-600 hover:bg-amber-700" : ""}
															trigger={
																<DropdownMenuItem
																	className="gap-2 cursor-pointer py-2"
																	onSelect={(e) => e.preventDefault()}
																>
																	<Ban className="h-4 w-4" />
																	{row.status === "active"
																		? <Translate text={localizationConstants.professionalActionDeactivate} />
																		: <Translate text={localizationConstants.professionalActionActivate} />}
																</DropdownMenuItem>
															}
														/>
														<ConfirmDialog
															title={t(localizationConstants.delete) + "?"}
															description="This action cannot be undone."
															onConfirm={() => handleDelete(row.id)}
															confirmText={t(localizationConstants.delete)}
															cancelText={t(localizationConstants.cancelLabel)}
															confirmClassName="bg-red-600 hover:bg-red-700"
															trigger={
																<DropdownMenuItem
																	className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700"
																	onSelect={(e) => e.preventDefault()}
																>
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
						onPageChange={setPage}
						onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export function ProfessionalListPage() {
	return (
		<Suspense fallback={<div className="min-h-screen" />}>
			<ProfessionalListPageInner />
		</Suspense>
	);
}
