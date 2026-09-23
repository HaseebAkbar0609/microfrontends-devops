import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WidgetTag } from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_PROJECT_STATUSES } from "../../../constants/forecastDashboard.constants";
import type { ForecastProjectRow } from "../../../types/forecastDashboard.types";
import { formatHours } from "../../../utils/economyFormatters";

const COLUMNS: { key: TranslationKeys; numeric?: boolean }[] = [
	{ key: localizationConstants.forecastColProjectOrder },
	{ key: localizationConstants.forecastColPlannedTime, numeric: true },
	{ key: localizationConstants.forecastColWorkedTime, numeric: true },
	{ key: localizationConstants.forecast, numeric: true },
	{ key: localizationConstants.status },
];

const HEAD = "h-9 px-3 text-xs font-medium text-slate-500";
const CELL = "px-3 py-2.5 text-sm text-slate-900";

/**
 * Projektstatus: each project's planned, worked and forecast hours, and Risk
 * when the forecast runs over the plan. A half-width card scrolls the table
 * sideways inside itself.
 */
export function ForecastProjectStatusTable({ projects }: { projects: ForecastProjectRow[] }) {
	return (
		<Table className="min-w-[28rem]">
			<TableHeader>
				<TableRow className="border-slate-200 hover:bg-transparent">
					{COLUMNS.map((column) => (
						<TableHead key={column.key} className={`${HEAD} ${column.numeric ? "text-right" : ""}`}>
							<Translate text={column.key} />
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => {
					const status = FORECAST_PROJECT_STATUSES[project.status];
					return (
						<TableRow key={project.projectNo} className="border-slate-200 hover:bg-white/60">
							<TableCell className={CELL}>{project.projectNo}</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>{formatHours(project.plannedHours)}</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>{formatHours(project.workedHours)}</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>{formatHours(project.forecastHours)}</TableCell>
							<TableCell className={CELL}>
								<WidgetTag label={status.labelKey} color={status.className} />
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

export default ForecastProjectStatusTable;
