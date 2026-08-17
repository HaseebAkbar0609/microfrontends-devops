"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROJECT_ECONOMY_BREADCRUMBS } from "../constants";
import { useProjectEconomyFilters } from "../hooks/useProjectEconomyFilters";
import ProjectEconomyTable from "./ProjectEconomyTable";

const PROJECT_ECONOMY_TAB_TB = "tb";

const TOTAL_TB_FORMAT = new Intl.NumberFormat("en-US");

const ProjectEconomyPage = () => {
	const filters = useProjectEconomyFilters();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.projectEconomicOverview}
				breadcrumbs={PROJECT_ECONOMY_BREADCRUMBS}
			/>
			<div className="flex-1 p-6">
				<Tabs value={PROJECT_ECONOMY_TAB_TB} className="w-full">
					<div className="border-b border-slate-200 mb-6">
						<TabsList
							variant="line"
							className="h-auto gap-6 rounded-none px-0 p-0 -mb-px"
						>
							<TabsTrigger
								value={PROJECT_ECONOMY_TAB_TB}
								className="cursor-pointer px-0 text-slate-600 data-[state=active]:px-3 data-[state=active]:text-slate-900"
							>
								<Translate
									text={
										localizationConstants.projectEconomyTbTab
									}
								/>
							</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value={PROJECT_ECONOMY_TAB_TB}>
						<div className="flex flex-col gap-5">
							<p className="text-base font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.projectEconomyTotalTb
									}
								/>
								{": "}
								{TOTAL_TB_FORMAT.format(
									filters.totalTbContribution,
								)}
							</p>

							<div className="rounded-md border border-slate-200 bg-white">
								<ProjectEconomyTable
									rows={filters.paged}
									sortField={filters.sortField}
									onToggleSort={filters.toggleSort}
								/>
							</div>

							<TablePagination
								currentPage={filters.page}
								totalPages={filters.totalPages}
								pageSize={filters.pageSize}
								onPageChange={filters.setPage}
								onPageSizeChange={filters.setPageSize}
								className="justify-center sm:justify-center"
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ProjectEconomyPage;
