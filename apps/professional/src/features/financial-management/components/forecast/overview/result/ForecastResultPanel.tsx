"use client";

import { TablePagination } from "@/components/table/TablePagination";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	FORECAST_RESULT_SIGN_LABELS,
	FORECAST_RESULT_VIEWS,
} from "../../../../constants/forecastResult.constants";
import { useForecastResult } from "../../../../hooks/useForecastResult";
import { ForecastToolbar, forecastFilterGroup } from "../../ForecastToolbar";
import { ForecastResultMonthlyTable } from "./ForecastResultMonthlyTable";
import { ForecastResultYearlyTable } from "./ForecastResultYearlyTable";

/** Resultat prognos: Årlig or Månad, its toolbar, its table and the centred pagination. */
export function ForecastResultPanel() {
	const t = useTranslate();
	const result = useForecastResult();

	return (
		<div className="flex flex-col gap-5">
			<SegmentedToggle
				options={FORECAST_RESULT_VIEWS}
				value={result.view}
				onChange={result.setView}
				ariaLabel={t(localizationConstants.forecastResultViewLabel)}
				className="self-start"
			/>

			<ForecastToolbar
				search={result.search}
				onSearchChange={result.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.forecastResultFilterGroup,
						FORECAST_RESULT_SIGN_LABELS,
						result.sign,
						result.setSign,
					),
				]}
			/>

			{result.view === "yearly" ? (
				<ForecastResultYearlyTable
					rows={result.yearlyPage}
					totals={result.yearlyTotals}
					sortField={result.yearlySortField}
					sortDir={result.yearlySortDir}
					onSort={result.onSortYearly}
					emptyKey={result.emptyKey}
				/>
			) : (
				<ForecastResultMonthlyTable
					rows={result.monthlyPage}
					totals={result.monthlyTotals}
					sortField={result.monthlySortField}
					sortDir={result.monthlySortDir}
					onSort={result.onSortMonthly}
					emptyKey={result.emptyKey}
				/>
			)}

			<TablePagination
				currentPage={result.currentPage}
				totalPages={result.totalPages}
				pageSize={result.pageSize}
				onPageChange={result.setPage}
				onPageSizeChange={result.setPageSize}
				className="justify-center sm:justify-center"
			/>
		</div>
	);
}

export default ForecastResultPanel;
