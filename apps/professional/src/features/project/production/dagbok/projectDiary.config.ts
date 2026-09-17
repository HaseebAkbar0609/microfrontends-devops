import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	DeviationStatus,
	DeviationType,
	DiaryRowKind,
	DiarySignerRole,
	DiaryStatus,
	TemperatureUnit,
	WeatherCondition,
	WorkStatus,
} from "./types";

/** The query parameter holding the selected day, `yyyy-MM-dd`. */
export const DIARY_DATE_PARAM = "datum";

type BadgeVariant = "success" | "warning" | "typeDark" | "typeLight" | "typeOutline";

export interface EnumMeta {
	labelKey: TranslationKeys;
	badge: BadgeVariant;
	/** Sort order, so a status column sorts by progress rather than by its label. */
	rank: number;
}

export const DIARY_STATUS_META: Record<DiaryStatus, EnumMeta> = {
	utkast: { labelKey: localizationConstants.projectDiaryStatusDraft, badge: "warning", rank: 0 },
	publicerad: { labelKey: localizationConstants.projectDiaryStatusPublished, badge: "success", rank: 1 },
};

/* Tuples, so the zod enums and the selects read the same list. */
export const TEMPERATURE_UNITS = ["celsius", "fahrenheit"] as const satisfies readonly TemperatureUnit[];
export const WEATHER_CONDITIONS = ["soligt", "mulet", "regn", "sno", "blasigt"] as const satisfies readonly WeatherCondition[];
export const WORK_STATUSES = ["ej_paborjad", "pagar", "klar"] as const satisfies readonly WorkStatus[];
export const DEVIATION_TYPES = ["ata", "fel", "hinder"] as const satisfies readonly DeviationType[];
export const DEVIATION_STATUSES = ["pagar", "atgardas", "klar"] as const satisfies readonly DeviationStatus[];

export const TEMPERATURE_UNIT_LABELS: Record<TemperatureUnit, TranslationKeys> = {
	celsius: localizationConstants.projectDiaryUnitCelsius,
	fahrenheit: localizationConstants.projectDiaryUnitFahrenheit,
};

/** The symbol shown after a reading's value. */
export const TEMPERATURE_UNIT_SYMBOLS: Record<TemperatureUnit, string> = { celsius: "°C", fahrenheit: "°F" };

/** A plausible outdoor range per unit; −60…60 °C is −76…140 °F. */
export const TEMPERATURE_RANGE: Record<TemperatureUnit, { min: number; max: number }> = {
	celsius: { min: -60, max: 60 },
	fahrenheit: { min: -76, max: 140 },
};

export const WEATHER_CONDITION_LABELS: Record<WeatherCondition, TranslationKeys> = {
	soligt: localizationConstants.projectDiaryConditionSunny,
	mulet: localizationConstants.projectDiaryConditionCloudy,
	regn: localizationConstants.projectDiaryConditionRain,
	sno: localizationConstants.projectDiaryConditionSnow,
	blasigt: localizationConstants.projectDiaryConditionWindy,
};

export const WORK_STATUS_META: Record<WorkStatus, EnumMeta> = {
	ej_paborjad: { labelKey: localizationConstants.projectDiaryWorkStatusNotStarted, badge: "typeOutline", rank: 0 },
	pagar: { labelKey: localizationConstants.projectDiaryWorkStatusInProgress, badge: "typeDark", rank: 1 },
	klar: { labelKey: localizationConstants.projectDiaryWorkStatusDone, badge: "success", rank: 2 },
};

export const DEVIATION_TYPE_META: Record<DeviationType, EnumMeta> = {
	ata: { labelKey: localizationConstants.projectDiaryDeviationTypeAta, badge: "typeDark", rank: 0 },
	fel: { labelKey: localizationConstants.projectDiaryDeviationTypeFault, badge: "typeLight", rank: 1 },
	hinder: { labelKey: localizationConstants.projectDiaryDeviationTypeObstacle, badge: "typeLight", rank: 2 },
};

export const DEVIATION_STATUS_META: Record<DeviationStatus, EnumMeta> = {
	pagar: { labelKey: localizationConstants.projectDiaryDeviationStatusInProgress, badge: "typeOutline", rank: 0 },
	atgardas: { labelKey: localizationConstants.projectDiaryDeviationStatusResolving, badge: "typeLight", rank: 1 },
	klar: { labelKey: localizationConstants.projectDiaryDeviationStatusDone, badge: "success", rank: 2 },
};

export const DIARY_SIGNER_ROLES = ["platschef", "bestallare"] as const satisfies readonly DiarySignerRole[];

export const DIARY_SIGNER_LABELS: Record<DiarySignerRole, TranslationKeys> = {
	platschef: localizationConstants.projectDiaryRoleSiteManager,
	bestallare: localizationConstants.projectDiaryRoleClient,
};

export const DIARY_ROW_KINDS = ["workforce", "works", "machines", "deviations"] as const satisfies readonly DiaryRowKind[];

export interface DiaryRowKindMeta {
	cardKey: TranslationKeys;
	filterKey: TranslationKeys;
	addTitleKey: TranslationKeys;
	editTitleKey: TranslationKeys;
}

export const DIARY_ROW_KIND_META: Record<DiaryRowKind, DiaryRowKindMeta> = {
	workforce: {
		cardKey: localizationConstants.projectDiaryCardWorkforce,
		filterKey: localizationConstants.projectDiaryFilterWorkforce,
		addTitleKey: localizationConstants.projectDiaryRowDialogWorkforceAdd,
		editTitleKey: localizationConstants.projectDiaryRowDialogWorkforceEdit,
	},
	works: {
		cardKey: localizationConstants.projectDiaryCardWorks,
		filterKey: localizationConstants.projectDiaryFilterWorks,
		addTitleKey: localizationConstants.projectDiaryRowDialogWorksAdd,
		editTitleKey: localizationConstants.projectDiaryRowDialogWorksEdit,
	},
	machines: {
		cardKey: localizationConstants.projectDiaryCardMachines,
		filterKey: localizationConstants.projectDiaryFilterMachines,
		addTitleKey: localizationConstants.projectDiaryRowDialogMachinesAdd,
		editTitleKey: localizationConstants.projectDiaryRowDialogMachinesEdit,
	},
	deviations: {
		cardKey: localizationConstants.projectDiaryCardDeviations,
		filterKey: localizationConstants.projectDiaryFilterDeviations,
		addTitleKey: localizationConstants.projectDiaryRowDialogDeviationsAdd,
		editTitleKey: localizationConstants.projectDiaryRowDialogDeviationsEdit,
	},
};

export const DIARY_LIMITS = {
	text: 120,
	note: 500,
	notes: 4000,
	/** People of one trade on site in a day. */
	people: 999,
	/** A row's total hours, across all its people. */
	hours: 99_999,
	machines: 99,
	machineHours: 24,
	/** Rows per table, and readings per day. */
	rows: 50,
} as const;

/** Average hours per person at or above which a day counts as a full workday. */
export const FULL_WORKDAY_HOURS = 8;
