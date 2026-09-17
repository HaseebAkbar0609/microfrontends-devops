"use client";

import { useAuthStatus } from "@/context/AuthContext";
import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/**
 * The signed-in user's full name, for a card that shows who is replying.
 *
 * `useAuthStatus` types the user as `unknown`, so three Fråga/Svar screens each
 * cast it and joined the names themselves; this is that snippet, once.
 *
 * @param fallbackKey read when the account carries no name — "Du" / "You".
 */
export function useCurrentUserName(fallbackKey: TranslationKeys): string {
	const t = useTranslate();
	const { user } = useAuthStatus();

	const account =
		(user as { first_name?: string; last_name?: string } | null) ?? {};

	return (
		[account.first_name, account.last_name].filter(Boolean).join(" ") ||
		t(fallbackKey)
	);
}
