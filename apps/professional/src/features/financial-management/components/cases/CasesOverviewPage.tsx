"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCasesList } from "../../hooks/useCasesList";
import { casesRoutes } from "../../constants/cases.constants";
import { EconomySubTabs } from "../common/EconomySubTabs";

const CASES_SUB_TABS = [
	{ id: "cases-list", labelKey: localizationConstants.casesOverviewTabList },
];
import { CasesTable } from "./CasesTable";
import { CasesToolbar } from "./CasesToolbar";
import { CasesTablePagination } from "./CasesTablePagination";
import { CaseDeleteDialog } from "./CaseDeleteDialog";

export interface CasesOverviewPageProps {
	/** Which module the register is mounted in; every link is built from it. */
	basePath?: string;
	/**
	 * Whether to offer the import screen. Ekonomi does; the Prognos frame draws
	 * only Skapa Fall, and no import route is mounted there.
	 */
	showImport?: boolean;
}

export function CasesOverviewPage({ basePath, showImport = true }: CasesOverviewPageProps) {
	const router = useRouter();
	const routes = casesRoutes(basePath);
	const list = useCasesList();

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
					searchQuery={list.search}
					onSearchChange={list.setSearch}
					statusFilter={list.statusFilter}
					onStatusFilterChange={list.setStatusFilter}
					categoryFilter={list.categoryFilter}
					onCategoryFilterChange={list.setCategoryFilter}
				/>

				<div className="flex items-center gap-3 shrink-0">
					{showImport && (
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push(routes.import)}
							className="h-9 px-3.5 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-semibold gap-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
						>
							<Download className="w-3.5 h-3.5 text-slate-600" />
							<Translate text={localizationConstants.casesBtnImportCase} />
						</Button>
					)}

					{/* + Skapa Fall button */}
					<Button
						type="button"
						onClick={() => router.push(routes.create)}
						className="h-9 px-4 bg-[#111721] hover:bg-slate-800 text-white text-xs font-semibold gap-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.casesBtnCreateCase} />
					</Button>
				</div>
			</div>

			{/* Main Table Card matching Figma Image 1 */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<CasesTable
					items={list.pageRows}
					isLoading={list.isLoading}
					sortField={list.sortField}
					sortDir={list.sortDir}
					onSort={list.onSort}
					onView={(id) => router.push(routes.detail(id))}
					onConversation={(id) => router.push(routes.conversation(id))}
					onEdit={(id) => router.push(routes.edit(id))}
					onDelete={(id) => list.setDeleteTargetId(id)}
					onStatusChange={list.changeStatus}
				/>

				<CasesTablePagination
					totalItems={list.totalItems}
					page={list.currentPage}
					pageSize={list.pageSize}
					onPageChange={list.setPage}
					onPageSizeChange={list.setPageSize}
				/>
			</div>

			{/* Delete Confirmation Dialog */}
			<CaseDeleteDialog
				isOpen={list.deleteTargetId !== null}
				onClose={() => list.setDeleteTargetId(null)}
				onConfirm={list.confirmDelete}
			/>
		</div>
	);
}

export default CasesOverviewPage;
