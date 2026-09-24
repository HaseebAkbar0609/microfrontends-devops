import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

/**
 * Month names as they read inside a date — "12 augusti" in Swedish, where the
 * month is lower-case, and "12 August" in English. The title-case
 * `monthJanuary` set is for headings and would print "12 Augusti".
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
 * UTC getters — the approach `formatLedgerDate` documents, so the day and the
 * month come from the same language source as every other label.
 *
 * @param isoDate `yyyy-MM-dd`; anything else is returned unchanged.
 */
export function formatQaDate(
	isoDate: string,
	t: (key: TranslationKeys) => string,
): string {
	const date = new Date(`${isoDate}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return isoDate;

	return `${date.getUTCDate()} ${t(MONTH_KEYS[date.getUTCMonth()])}`;
}
