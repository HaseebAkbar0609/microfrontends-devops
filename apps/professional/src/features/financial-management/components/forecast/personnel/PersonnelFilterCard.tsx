"use client";

import { MultiTagSelect } from "@/components/ui/MultiTagSelect";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_ANALYSIS_PERIODS } from "../../../constants/forecastAnalysis.constants";
import {
	PERSONNEL_KATEGORI_LABELS,
	PERSONNEL_STATUS_LABELS,
} from "../../../constants/forecastPersonnel.constants";
import type { AnalysisPeriod } from "../../../types/forecastAnalysis.types";
import type { PersonnelFilters, PersonnelKategori } from "../../../types/forecastPersonnel.types";
import type { EmployeeStatus } from "@/features/personnel/types/personnelOverview.types";
import {
	FilterCardShell,
	FilterField,
	FilterPeriodSelect,
	FilterSelect,
	FilterStringSelect,
} from "../filters/FilterCardParts";

export interface PersonnelFilterCardProps {
	titleKey: TranslationKeys;
	filters: PersonnelFilters;
	departments: string[];
	roles: string[];
	/** Översikt picks a department; Månads-analys picks a kategori. */
	secondField: "department" | "kategori";
	onChange: <K extends keyof PersonnelFilters>(key: K, value: PersonnelFilters[K]) => void;
	onToggleRole: (role: string) => void;
	onApply: () => void;
	onReset: () => void;
}

/**
 * The selection both Personal tabs are made in. Only its second field differs:
 * Översikt narrows by department, Månads-analys by what the salary counts as.
 */
export function PersonnelFilterCard({
	titleKey,
	filters,
	departments,
	roles,
	secondField,
	onChange,
	onToggleRole,
	onApply,
	onReset,
}: PersonnelFilterCardProps) {
	const t = useTranslate();

	return (
		<FilterCardShell titleKey={titleKey} onReset={onReset} onApply={onApply}>
			<FilterPeriodSelect<AnalysisPeriod>
				labelKey={localizationConstants.forecastAnalysisPeriodLabel}
				periods={FORECAST_ANALYSIS_PERIODS}
				value={filters.period}
				onChange={(value) => onChange("period", value)}
			/>

			{secondField === "department" ? (
				<FilterStringSelect
					labelKey={localizationConstants.forecastPersonnelDepartmentLabel}
					options={departments}
					value={filters.department}
					onChange={(value) => onChange("department", value)}
				/>
			) : (
				<FilterSelect<PersonnelKategori>
					labelKey={localizationConstants.forecastPersonnelColKategori}
					labels={PERSONNEL_KATEGORI_LABELS}
					value={filters.kategori}
					onChange={(value) => onChange("kategori", value)}
				/>
			)}

			<FilterField labelKey={localizationConstants.forecastPersonnelRoleLabel}>
				<MultiTagSelect
					placeholder={t(localizationConstants.forecastPersonnelRolePlaceholder)}
					options={roles}
					selected={filters.roles}
					onToggle={onToggleRole}
				/>
			</FilterField>

			<FilterSelect<EmployeeStatus>
				labelKey={localizationConstants.status}
				labels={PERSONNEL_STATUS_LABELS}
				value={filters.status}
				onChange={(value) => onChange("status", value)}
			/>
		</FilterCardShell>
	);
}

export default PersonnelFilterCard;
