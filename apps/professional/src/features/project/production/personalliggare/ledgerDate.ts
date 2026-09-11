import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

/** Sunday first, to index straight off `Date.prototype.getUTCDay()`. */
const WEEKDAY_KEYS: TranslationKeys[] = [
	localizationConstants.sunday,
	localizationConstants.monday,
	localizationConstants.tuesday,
	localizationConstants.wednesday,
	localizationConstants.thursday,
	localizationConstants.friday,
	localizationConstants.saturday,
];

/** The abbreviated set — "Okt" in Swedish, "Oct" in English. */
const MONTH_SHORT_KEYS: TranslationKeys[] = [
	localizationConstants.monthJan,
	localizationConstants.monthFeb,
	localizationConstants.monthMar,
	localizationConstants.monthApr,
	localizationConstants.monthMay,
	localizationConstants.monthJun,
	localizationConstants.monthJul,
	localizationConstants.monthAug,
	localizationConstants.monthSep,
	localizationConstants.monthOct,
	localizationConstants.monthNov,
	localizationConstants.monthDec,
];

/**
 * The frame's date format — "Måndag 10 Dec, 2025" — built from translation
 * keys rather than a date library's locale.
 *
 * The obvious approach is date-fns `format(d, "EEEE", { locale: isSv ? sv : enUS })`,
 * which `PersonnelCreateTaskModal` uses. That is a hydration bug here:
 * `utils/userLanguage.ts` returns "sv" unconditionally on the server but reads
 * `localStorage` and `navigator.language` on the client, so an English user
 * gets one locale server-side and another client-side and the markup disagrees.
 *
 * Composing from `monday`–`sunday` and `monthJan`–`monthDec` puts the weekday
 * and the month on exactly the same footing as every other label on the page —
 * one language source instead of two — and uses no `Intl`, no
 * `toLocaleDateString` and no date-fns locale. UTC getters throughout, matching
 * how `mockDate` builds the seeded dates.
 *
 * @param isoDate `yyyy-MM-dd`
 * @param t the caller's `useTranslate()`
 */
export function formatLedgerDate(
	isoDate: string,
	t: (key: TranslationKeys) => string,
): string {
	const date = new Date(`${isoDate}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return isoDate;

	const weekday = t(WEEKDAY_KEYS[date.getUTCDay()]);
	const month = t(MONTH_SHORT_KEYS[date.getUTCMonth()]);

	return `${weekday} ${date.getUTCDate()} ${month}, ${date.getUTCFullYear()}`;
}
