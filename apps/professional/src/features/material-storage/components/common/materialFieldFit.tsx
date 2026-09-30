/**
 * Keeps a long value ("PRJ-2026-0158 – Kontorsombyggnad Kungsgatan 8") inside
 * its column. A form item's grid track otherwise grows to the unwrapped text and
 * pushes the field past the column; with these it shrinks and the text ends in "…".
 */

/** For a FormItem (or FormSelect's className): a single track that may shrink below its content. */
export const FIT_FIELD_CLASS = "grid-cols-[minmax(0,1fr)]";

/** For a FormSelect's trigger: lets the shown value shrink next to the chevron. */
export const FIT_SELECT_TRIGGER_CLASS = "*:data-[slot=select-value]:min-w-0";

/** A select option label that is cut with "…" in the trigger when it does not fit. */
export const fitOptionLabel = (text: string) => <span className="min-w-0 truncate">{text}</span>;
