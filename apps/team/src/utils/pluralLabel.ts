import type { TranslationKeys } from "@/utils/translation/constants";

/**
 * Swedish plurals are not formed by appending a letter, so every countable
 * noun carries both forms. The prototype rendered "1 underkategorier".
 */
export function pickCountKey(
	count: number,
	singular: TranslationKeys,
	plural: TranslationKeys,
): TranslationKeys {
	return count === 1 ? singular : plural;
}
