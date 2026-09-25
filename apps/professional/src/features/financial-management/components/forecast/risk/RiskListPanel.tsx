"use client";

import { useRouter } from "next/navigation";

import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_RISK_BASE_ROUTE,
	RISK_CLIENT_STATUS_LABELS,
	RISK_LEVEL_LABELS,
	riskRoutes,
} from "../../../constants/forecastRisk.constants";
import { useForecastRiskList } from "../../../hooks/useForecastRiskList";
import { ForecastToolbar, forecastFilterGroup } from "../ForecastToolbar";
import { RiskListTable } from "./RiskListTable";
import { RiskSummaryCards } from "./RiskSummaryCards";

export interface RiskListPanelProps {
	/** Which module the register is mounted in; the eye's link is built from it. */
	basePath?: string;
}

/**
 * Riskhanteringlista: the four figures over the clients the filters leave,
 * then Sök and Filter, the register, and the frame's centred pagination.
 */
export function RiskListPanel({ basePath = FORECAST_RISK_BASE_ROUTE }: RiskListPanelProps) {
	const router = useRouter();
	const routes = riskRoutes(basePath);
	const list = useForecastRiskList();

	return (
		<div className="flex flex-col gap-5">
			<RiskSummaryCards summary={list.summary} />

			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.forecastRiskFilterLevel,
						RISK_LEVEL_LABELS,
						list.filters.level,
						(value) => list.setFilter("level", value),
					),
					forecastFilterGroup(
						localizationConstants.forecastRiskFilterStatus,
						RISK_CLIENT_STATUS_LABELS,
						list.filters.status,
						(value) => list.setFilter("status", value),
					),
				]}
			/>

			<RiskListTable
				clients={list.pageRows}
				sortField={list.sortField}
				sortDir={list.sortDir}
				onSort={list.onSort}
				emptyKey={list.emptyKey}
				onView={(client) => router.push(routes.detail(client.id))}
			/>

			<TablePagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>
		</div>
	);
}

export default RiskListPanel;
