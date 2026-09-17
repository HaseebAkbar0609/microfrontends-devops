export const CONSTRUCTION_LOG_CONSTANTS = {
	STORAGE_KEY: "tfs_order_construction_logs_records",
	DEFAULT_ORDER_ID: "5000-001",
	DEFAULT_PROJECT_NAME: "Kv Skatan",
	DEFAULT_CONSTRUCTION_DAY: "156/285",
	DEFAULT_ADDRESS: "Storgatan 11 B, 171 63 Solna",
	DEFAULT_LOCATION: "Solna",
	DEFAULT_TEMP: 32,
	FALLBACK_DASH: "-",
	FILTER_ALL: "ALL",
	FILTER_NORMAL: "normal",
	FILTER_DEVIATION: "deviation",

	TEMP_UNITS: {
		CELSIUS: "celsius",
		FAHRENHEIT: "fahrenheit",
	} as const,

	WEATHER_CONDITIONS: {
		SUNNY: "sunny",
		CLOUDY: "cloudy",
		RAIN: "rain",
		SNOW: "snow",
		WINDY: "windy",
	} as const,

	WORKDAY_TYPES: {
		SELECTED: "selected",
		FULL_TIME: "full_time",
		PART_TIME: "part_time",
		OFF: "off",
	} as const,

	ACTIVITY_STATUS: {
		IN_PROGRESS: "in_progress",
		DONE: "done",
	} as const,

	DEVIATION_STATUS: {
		IN_PROGRESS: "in_progress",
		PENDING: "pending",
		DONE: "done",
	} as const,

	DEVIATION_TYPES: {
		ATA: "ata",
		ERROR: "error",
		OBSTACLE: "obstacle",
	} as const,

	DEFAULT_SITE_MANAGER: {
		NAME: "Kalle Andersson",
		ROLE: "Platschef",
	} as const,

	DEFAULT_CLIENT: {
		NAME: "Stina Svensson",
		ROLE: "Beställare",
	} as const,
} as const;

export type WeatherConditionKey =
	(typeof CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS)[keyof typeof CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS];

export type TempUnitKey =
	(typeof CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS)[keyof typeof CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS];

export type WorkdayTypeKey =
	(typeof CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES)[keyof typeof CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES];

export type ActivityStatusKey =
	(typeof CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS)[keyof typeof CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS];

export type DeviationStatusKey =
	(typeof CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS)[keyof typeof CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS];

export type DeviationTypeKey =
	(typeof CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES)[keyof typeof CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES];
