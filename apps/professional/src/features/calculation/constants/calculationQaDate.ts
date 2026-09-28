import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

/**
 * Month names as they read inside a date — "12 augusti" in Swedish, where the
 * month is lower-case, and "12 August" in English.
 */
const MONTH_KEYS: TranslationKeys[] = [
	localizationConstants.projectQaMonthJanuary,
	localizationConstants.projectQaMonthFebruary,
	localizationConstants.projectQaMonthMarch,
	localizationConstants.projectQaMonthApril,
	localizationConstants.projectQaMonthMay,
	localizationConstants.projectQaMonthJune,
	localizationConstants.projectQaMonthJuly,
	localizationConstants.projectQaMonthAugust,
	localizationConstants.projectQaMonthSeptember,
	localizationConstants.projectQaMonthOctober,
	localizationConstants.projectQaMonthNovember,
	localizationConstants.projectQaMonthDecember,
];

/**
 * The board's date format, "12 augusti", composed from translation keys with
 * UTC getters.
 *
 * @param isoDate `yyyy-MM-dd`; anything else is returned unchanged.
 */
export function formatQaDate(
	isoDate: string,
	t: (key: TranslationKeys) => string,
): string {
	if (!isoDate) return "";
	const date = new Date(`${isoDate.split(" ")[0]}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return isoDate;

	const monthKey = MONTH_KEYS[date.getUTCMonth()];
	const monthStr = monthKey ? t(monthKey) : "";
	return `${date.getUTCDate()} ${monthStr}`.trim();
}
