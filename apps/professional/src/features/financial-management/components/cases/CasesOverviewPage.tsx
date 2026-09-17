"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import { useCases } from "../../hooks/useCases";
import {
	CASES_BASE_ROUTE,
	CREATE_CASE_ROUTE,
	DEFAULT_CASES_PAGE_SIZE,
} from "../../constants/cases.constants";
import type { CaseCategory, CaseStatus } from "../../types/cases.types";
import { CasesTable } from "./CasesTable";
import { CasesToolbar } from "./CasesToolbar";
import { CasesTablePagination } from "./CasesTablePagination";
import { CaseDeleteDialog } from "./CaseDeleteDialog";

export function CasesOverviewPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { cases, isLoading, deleteCase } = useCases();

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

	return (
		<div className="p-6 space-y-6">
			{/* Top Bar matching Figma */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<h1 className="text-xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.casesOverviewTitle} />
				</h1>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

					<Button
						type="button"
						onClick={() => router.push(CREATE_CASE_ROUTE)}
						className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold gap-2 rounded-lg cursor-pointer transition-colors shrink-0"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.casesCreateButton} />
					</Button>
				</div>
			</div>

			{/* Main Table Card */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<CasesTable
					items={paginatedCases}
					isLoading={isLoading}
					onView={(id) => router.push(`${CASES_BASE_ROUTE}/${id}`)}
					onEdit={(id) => router.push(`${CREATE_CASE_ROUTE}?edit=${id}`)}
					onDelete={(id) => setDeleteTargetId(id)}
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
