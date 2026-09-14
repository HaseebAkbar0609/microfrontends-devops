import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { TimeplanKind, TimeplanType } from "./types";

export const TIMEPLAN_KINDS: { value: TimeplanKind; labelKey: TranslationKeys }[] =
	[
		{ value: "main", labelKey: localizationConstants.projectTimeplanKindMain },
		{ value: "sub", labelKey: localizationConstants.projectTimeplanKindSub },
	];

/** The translation key for a kind. */
export function kindLabelKey(kind: TimeplanKind): TranslationKeys {
	return (
		TIMEPLAN_KINDS.find((entry) => entry.value === kind)?.labelKey ??
		localizationConstants.projectTimeplanKindMain
	);
}

/**
 * The plan templates. Only Standard is defined, so the select has one option —
 * enabled, as the Swedish create frame draws it, and ready for the next type.
 */
export const TIMEPLAN_TYPES: { value: TimeplanType; labelKey: TranslationKeys }[] =
	[
		{
			value: "standard",
			labelKey: localizationConstants.projectTimeplanTypeStandard,
		},
	];

/**
 * Who can be named as a plan's author.
 *
 * The same cast the project's Personal-liggare and Organisation tabs seed, so
 * the record's people-shaped sections describe one project. The frame's
 * "Rachel Meyers @rachel" is Figma placeholder copy.
 */
export const TIMEPLAN_AUTHORS: { id: string; name: string; handle: string }[] = [
	{ id: "author-kalle", name: "Kalle Svensson", handle: "@kalle" },
	{ id: "author-stefan", name: "Stefan Eriksson", handle: "@stefan" },
	{ id: "author-stina", name: "Stina Larsson", handle: "@stina" },
];

/** Looks an author up by id; an unknown id renders as its raw value. */
export function authorName(id: string): string {
	return TIMEPLAN_AUTHORS.find((author) => author.id === id)?.name ?? id;
}

/**
 * Bar colours per top-level phase, darkest at the phase row and lighter for
 * each level beneath it — the frame's gold → yellow, green and red.
 *
 * Named Tailwind classes rather than hex so the palette reads in review and
 * survives a theme change. It cycles for plans with more phases than colours.
 * The description asks for colour by *status*; the frames colour by phase, and
 * the frames are the spec here.
 */
export const PHASE_PALETTE: readonly (readonly [string, string, string])[] = [
	["bg-yellow-600", "bg-yellow-500", "bg-yellow-300"],
	["bg-green-600", "bg-green-500", "bg-green-400"],
	["bg-red-700", "bg-red-600", "bg-red-500"],
	["bg-sky-700", "bg-sky-600", "bg-sky-400"],
];

/** The bar class for a row, from its phase and depth. */
export function phaseColor(phaseIndex: number, depth: number): string {
	const shades = PHASE_PALETTE[phaseIndex % PHASE_PALETTE.length];
	return shades[Math.min(depth, shades.length - 1)];
}
