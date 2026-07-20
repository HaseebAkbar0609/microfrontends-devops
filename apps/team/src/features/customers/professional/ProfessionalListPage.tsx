"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useQueryParams } from "@/components/hooks/useQueryParams";
import { useDebounce } from "@/components/hooks/useDebounce";
import { listProfessionalsAPIAction, listPendingProfessionalsAPIAction } from "@/api-actions";
import type { ProfessionalRow, PendingProfessionalRow, PendingSortField } from "@/api-actions/customers/professionals/list";
import { ActiveProfessionalsTab } from "./ActiveProfessionalsTab";
import { PendingProfessionalsTab } from "./PendingProfessionalsTab";
import { CreateAccountWizard } from "@/features/customers/CreateAccountWizard";

type ProfessionalTab = "active" | "pending" | "analytics" | "archived";
type ActiveSortField = keyof Omit<ProfessionalRow, "id" | "status"> | null;

const TABS: { key: ProfessionalTab; labelKey: string }[] = [
	{ key: "active",   labelKey: localizationConstants.professionalTabActive },
	{ key: "pending",  labelKey: localizationConstants.professionalTabPending },
	{ key: "analytics",labelKey: localizationConstants.professionalTabAnalytics },
	{ key: "archived", labelKey: localizationConstants.professionalTabArchived },
];

function ProfessionalListPageInner() {
	const { search: searchParam, page, changeQueries, setPage, query } = useQueryParams();

	const [activeTab, setActiveTab] = useState<ProfessionalTab>(
		(query.get("tab") as ProfessionalTab | null) ?? "active",
	);
	const [searchInput, setSearchInput] = useState(searchParam);
	const [pageSize, setPageSize] = useState(10);

	// Active tab state
	const [rows, setRows] = useState<ProfessionalRow[]>([]);
	const [sortBy, setSortBy] = useState<ActiveSortField>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	// Pending tab state
	const [pendingRows, setPendingRows] = useState<PendingProfessionalRow[]>([]);
	const [pendingSortBy, setPendingSortBy] = useState<PendingSortField>(null);
	const [pendingSortOrder, setPendingSortOrder] = useState<"asc" | "desc">("asc");

	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [wizardOpen, setWizardOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

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

		if (activeTab === "active") {
			void listProfessionalsAPIAction({
				page, pageSize,
				search: debouncedSearch.trim() || undefined,
				sortBy: sortBy ?? undefined,
				sortOrder: sortBy ? sortOrder : undefined,
			}).then((result) => {
				if (cancelled) return;
				setRows(result.items);
				setTotalPages(result.totalPages);
				setIsLoading(false);
			});
		} else if (activeTab === "pending") {
			void listPendingProfessionalsAPIAction({
				page, pageSize,
				search: debouncedSearch.trim() || undefined,
				sortBy: pendingSortBy ?? undefined,
				sortOrder: pendingSortBy ? pendingSortOrder : undefined,
			}).then((result) => {
				if (cancelled) return;
				setPendingRows(result.items);
				setTotalPages(result.totalPages);
				setIsLoading(false);
			});
		} else {
			setIsLoading(false);
		}

		return () => { cancelled = true; };
	}, [page, pageSize, debouncedSearch, sortBy, sortOrder, pendingSortBy, pendingSortOrder, activeTab, refreshKey]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab as ProfessionalTab);
		setSearchInput("");
		changeQueries({ tab, search: null, page: "1" });
	};

	const handleActiveSort = useCallback((field: ActiveSortField) => {
		if (!field) return;
		setSortBy((prev) => {
			if (prev !== field) { setSortOrder("asc"); return field; }
			setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
			return field;
		});
		setPage(1);
	}, [setPage]);

	const handlePendingSort = useCallback((field: PendingSortField) => {
		if (!field) return;
		setPendingSortBy((prev) => {
			if (prev !== field) { setPendingSortOrder("asc"); return field; }
			setPendingSortOrder((o) => (o === "asc" ? "desc" : "asc"));
			return field;
		});
		setPage(1);
	}, [setPage]);

	const handleActiveDelete = useCallback((id: string) => {
		setRows((prev) => prev.filter((r) => r.id !== id));
	}, []);

	const handleToggleStatus = useCallback((id: string) => {
		setRows((prev) =>
			prev.map((r) =>
				r.id === id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r,
			),
		);
	}, []);

	const handlePendingDelete = useCallback((id: string) => {
		setPendingRows((prev) => prev.filter((r) => r.id !== id));
	}, []);

	const paginationProps = {
		currentPage: page,
		totalPages,
		pageSize,
		onPageChange: setPage,
		onPageSizeChange: (size: number) => { setPageSize(size); setPage(1); },
	};

	return (
		<div className="flex h-full flex-col gap-6 px-8 pt-6 pb-8">
			<h1 className="text-2xl font-semibold text-slate-900">
				<Translate text={localizationConstants.professional} />
			</h1>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList variant="line" className="w-full justify-start gap-1 border-b border-slate-200 p-0">
					{TABS.map((tab) => (
						<TabsTrigger key={tab.key} value={tab.key} className="w-fit flex-none px-4">
							<Translate text={tab.labelKey} />
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="active" className="pt-4">
					<ActiveProfessionalsTab
						rows={rows}
						isLoading={isLoading}
						sortBy={sortBy}
						sortOrder={sortOrder}
						searchInput={searchInput}
						onSearchChange={setSearchInput}
						onSort={handleActiveSort}
						onDelete={handleActiveDelete}
						onToggleStatus={handleToggleStatus}
						onCreateClick={() => setWizardOpen(true)}
						{...paginationProps}
					/>
				</TabsContent>

				<TabsContent value="pending" className="pt-4">
					<PendingProfessionalsTab
						rows={pendingRows}
						isLoading={isLoading}
						sortBy={pendingSortBy}
						sortOrder={pendingSortOrder}
						searchInput={searchInput}
						onSearchChange={setSearchInput}
						onSort={handlePendingSort}
						onDelete={handlePendingDelete}
						onCreateClick={() => setWizardOpen(true)}
						{...paginationProps}
					/>
				</TabsContent>
			</Tabs>

			<CreateAccountWizard
				open={wizardOpen}
				onOpenChange={setWizardOpen}
				onSuccess={() => { setRefreshKey((k) => k + 1); setPage(1); }}
			/>
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
