"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import { useCases } from "../../hooks/useCases";
import {
	CASES_BASE_ROUTE,
	CREATE_CASE_ROUTE,
	CASES_IMPORT_ROUTE,
	DEFAULT_CASES_PAGE_SIZE,
} from "../../constants/cases.constants";
import type { CaseCategory, CaseStatus } from "../../types/cases.types";
import { EconomySubTabs } from "../common/EconomySubTabs";

const CASES_SUB_TABS = [
	{ id: "cases-list", labelKey: localizationConstants.casesOverviewTabList },
];
import { CasesTable } from "./CasesTable";
import { CasesToolbar } from "./CasesToolbar";
import { CasesTablePagination } from "./CasesTablePagination";
import { CaseDeleteDialog } from "./CaseDeleteDialog";

export function CasesOverviewPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { cases, isLoading, deleteCase, updateCaseStatus } = useCases();

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<CaseCategory | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_CASES_PAGE_SIZE);
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	const filteredCases = useMemo(() => {
		return cases.filter((item) => {
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchesTitle = item.title.toLowerCase().includes(query);
				const matchesNumber = item.caseNumber.toLowerCase().includes(query);
				const matchesCreator = item.createdBy.toLowerCase().includes(query);
				if (!matchesTitle && !matchesNumber && !matchesCreator) return false;
			}
			if (statusFilter !== "all" && item.status !== statusFilter) return false;
			if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
			return true;
		});
	}, [cases, searchQuery, statusFilter, categoryFilter]);

	const paginatedCases = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredCases.slice(start, start + pageSize);
	}, [filteredCases, page, pageSize]);

	const handleDeleteConfirm = () => {
		if (deleteTargetId) {
			deleteCase(deleteTargetId);
			setDeleteTargetId(null);
			showToast("success", t(localizationConstants.casesToastDeleted));
		}
	};

	const handleStatusChange = (id: string, newStatus: CaseStatus) => {
		updateCaseStatus(id, newStatus);
		showToast("success", t(localizationConstants.casesToastStatusChanged));
	};

	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub-navigation tabs */}
			<EconomySubTabs
				tabs={CASES_SUB_TABS}
				activeTab="cases-list"
				onTabChange={() => {}}
			/>

			{/* Toolbar & Action */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				<CasesToolbar
					searchQuery={searchQuery}
					onSearchChange={(q) => {
						setSearchQuery(q);
						setPage(1);
					}}
					statusFilter={statusFilter}
					onStatusFilterChange={(s) => {
						setStatusFilter(s);
						setPage(1);
					}}
					categoryFilter={categoryFilter}
					onCategoryFilterChange={(c) => {
						setCategoryFilter(c);
						setPage(1);
					}}
				/>

				<div className="flex items-center gap-3 shrink-0">
					{/* Importera fall button */}
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push(CASES_IMPORT_ROUTE)}
						className="h-10 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors"
					>
						<Download className="w-4 h-4 text-slate-600" />
						<Translate text={localizationConstants.casesBtnImportCase} />
					</Button>

					{/* + Skapa Fall button */}
					<Button
						type="button"
						onClick={() => router.push(CREATE_CASE_ROUTE)}
						className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white text-sm font-medium gap-2 rounded-lg cursor-pointer transition-colors shadow-2xs"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.casesBtnCreateCase} />
					</Button>
				</div>
			</div>

			{/* Main Table Card matching Figma Image 1 */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<CasesTable
					items={paginatedCases}
					isLoading={isLoading}
					onView={(id) => router.push(`${CASES_BASE_ROUTE}/${id}`)}
					onConversation={(id) =>
						router.push(`${CASES_BASE_ROUTE}/${id}/conversation`)
					}
					onEdit={(id) => router.push(`${CREATE_CASE_ROUTE}?edit=${id}`)}
					onDelete={(id) => setDeleteTargetId(id)}
					onStatusChange={handleStatusChange}
				/>

				<CasesTablePagination
					totalItems={filteredCases.length}
					page={page}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={(sz) => {
						setPageSize(sz);
						setPage(1);
					}}
				/>
			</div>

			{/* Delete Confirmation Dialog */}
			<CaseDeleteDialog
				isOpen={deleteTargetId !== null}
				onClose={() => setDeleteTargetId(null)}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}

export default CasesOverviewPage;
