import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export interface DiaryEntry {
	id: string;
	date: string;
	title: string;
	projectName: string;
	description: string;
	read: boolean;
}

export const MONTH_KEYS = [
	localizationConstants.monthJanuary,
	localizationConstants.monthFebruary,
	localizationConstants.monthMarch,
	localizationConstants.monthApril,
	localizationConstants.monthMay,
	localizationConstants.monthJune,
	localizationConstants.monthJuly,
	localizationConstants.monthAugust,
	localizationConstants.monthSeptember,
	localizationConstants.monthOctober,
	localizationConstants.monthNovember,
	localizationConstants.monthDecember,
] as const;

export const WEEKDAY_KEYS = [
	localizationConstants.weekdayShortSun,
	localizationConstants.weekdayShortMon,
	localizationConstants.weekdayShortTue,
	localizationConstants.weekdayShortWed,
	localizationConstants.weekdayShortThu,
	localizationConstants.weekdayShortFri,
	localizationConstants.weekdayShortSat,
] as const;

const ENTRY_DESCRIPTION =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

const entryDefaults = {
	projectName: "Projekt 00001",
	description: ENTRY_DESCRIPTION,
};

export const DIARY_ENTRIES: DiaryEntry[] = [
	{
		id: "d-1",
		date: mockDate(-1),
		title: `Arbetsdagbok den ${mockDate(-1)}`,
		read: false,
		...entryDefaults,
	},
	{
		id: "d-2",
		date: mockDate(-3),
		title: "Att göra idag",
		read: true,
		...entryDefaults,
	},
	{
		id: "d-3",
		date: mockDate(-4),
		title: "Påminnelse",
		read: false,
		...entryDefaults,
	},
	{
		id: "d-4",
		date: mockDate(-7),
		title: "Viktigt ärende",
		read: true,
		...entryDefaults,
	},
	{
		id: "d-5",
		date: mockDate(-13),
		title: `Dagbok ${mockDate(-13)}`,
		read: true,
		...entryDefaults,
	},
	{
		id: "d-6",
		date: mockDate(-34),
		title: "Möte med beställare",
		read: true,
		...entryDefaults,
	},
];
