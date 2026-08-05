import localizationConstants from "@/utils/translation/constants";

const WEEKDAY_FULL_KEYS = [
	localizationConstants.weekdayFullSun,
	localizationConstants.weekdayFullMon,
	localizationConstants.weekdayFullTue,
	localizationConstants.weekdayFullWed,
	localizationConstants.weekdayFullThu,
	localizationConstants.weekdayFullFri,
	localizationConstants.weekdayFullSat,
] as const;

export const toMinutes = (time: string): number => {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + (minutes || 0);
};

export const formatDuration = (minutes: number): string => {
	const clamped = Math.max(0, minutes);
	return `${Math.floor(clamped / 60)}:${String(clamped % 60).padStart(2, "0")}`;
};

export const diffMinutes = (start: string, end: string): number =>
	Math.max(0, toMinutes(end) - toMinutes(start));

export const weekdayKeyOf = (date: string): string => {
	const [year, month, day] = date.split("-").map(Number);
	return WEEKDAY_FULL_KEYS[new Date(year, month - 1, day).getDay()];
};

export const formatDisplayDate = (date: string): string => {
	const [year, month, day] = date.split("-");
	return `${day}/${month}/${year}`;
};
