import type { TranslationKeys } from "@/utils/translation/constants";

/**
 * One message in a Fråga/Svar thread, in the shape every caller needs.
 *
 * Deliberately domain-neutral: the b2b project market, the purchase module's
 * board and complaint record, and the project record draw the same card, so the
 * type describes the card rather than any one feature.
 */
export interface QAThreadMessage {
	id: string;
	/** Who asked. */
	sender: string;
	/** Sub-label under the name — a company, or the sender's role. */
	company?: string;
	role?: string;
	/** Role chip beside the name, e.g. "UE". */
	badge?: string;
	message: string;
	date: string;
	/** `"answered"` shows the reply instead of the compose box. */
	answered?: boolean;
	answerUser?: string;
	answerBadge?: string;
	answerText?: string;
	answerDate?: string;
	/** Prefills the compose box when a draft reply exists. */
	replyText?: string;
}

/**
 * Labels, as translation keys.
 *
 * Passed in rather than fixed, because the callers already ship different
 * wording for the same actions — b2b's `b2bPMQAMarkAsRead` reads "Mark as read"
 * even in Swedish. Hard-coding one set here would silently rewrite a merged
 * screen's copy.
 */
export interface QAThreadLabels {
	/** Row-menu wording. Only read when the matching handler is supplied. */
	markAsRead?: TranslationKeys;
	archive?: TranslationKeys;
	delete?: TranslationKeys;
	leaveComment: TranslationKeys;
	send: TranslationKeys;
	cancel: TranslationKeys;
	/**
	 * Chip beside the answering user's name. Leave it out where the screen
	 * cannot know the answerer's role — no chip is better than a wrong one.
	 */
	answerBadge?: TranslationKeys;
	/** Sub-label under the answering user, e.g. "You". Left out, nothing shows. */
	answerSubLabel?: TranslationKeys;
	/** Role-chip wording, keyed by the badge value carried on a message. */
	badges?: Record<string, TranslationKeys>;
}

/**
 * Chip colours by role, from the Figma "Q&A" component's info-strong,
 * warning-strong and success-strong fills. Anything unmapped is slate.
 */
export const QA_BADGE_STYLES: Record<string, string> = {
	UE: "bg-blue-600 text-white",
	Fråga: "bg-yellow-500 text-white",
	Beställare: "bg-emerald-600 text-white",
};

export const QA_BADGE_FALLBACK_STYLE = "bg-slate-600 text-white";

/**
 * "Anna Svensson" → "AS". Re-implemented in four features before this; one copy
 * now lives beside the component that needs it most.
 */
export function initialsOf(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((part) => part[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

/** What the dialog hands back: the raw option values and the trimmed text. */
export interface QAThreadDraft {
	type: string;
	subject: string;
	description: string;
}

export interface QAThreadOption<T extends string = string> {
	value: T;
	label: TranslationKeys;
}

export interface QAThreadCreateDialogLabels {
	title: TranslationKeys;
	type: TranslationKeys;
	subject: TranslationKeys;
	subjectPlaceholder: TranslationKeys;
	description: TranslationKeys;
	descriptionPlaceholder?: TranslationKeys;
	cancel: TranslationKeys;
	send: TranslationKeys;
	submit?: TranslationKeys;
}
