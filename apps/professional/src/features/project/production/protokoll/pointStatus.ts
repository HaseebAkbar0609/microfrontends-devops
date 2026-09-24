import { POINT_STATUSES } from "./projectProtocol.config";
import type { PointStatus } from "./types";

/*
 * How an Action point's status looks — the colours my-pages' protocol draws,
 * kept here rather than imported across modules.
 */

/** The chosen toggle: filled, its check showing. */
export const POINT_STATUS_ACTIVE_CLASS: Record<PointStatus, string> = {
	ongoing: "border-orange-500 bg-orange-500 text-white",
	done: "border-green-600 bg-green-600 text-white",
	notDone: "border-red-500 bg-red-500 text-white",
};

/** The others: a pale square of the same colour, its check hidden. */
export const POINT_STATUS_INACTIVE_CLASS: Record<PointStatus, string> = {
	ongoing: "border-orange-300 bg-orange-100 text-transparent",
	done: "border-green-300 bg-green-100 text-transparent",
	notDone: "border-red-300 bg-red-100 text-transparent",
};

/** The legend's swatches. */
export const POINT_STATUS_SWATCH_CLASS: Record<PointStatus, string> = {
	ongoing: "bg-orange-500",
	done: "bg-green-600",
	notDone: "bg-red-500",
};

/**
 * ⋮ Ändra status: the next status in the toggles' order, round again after
 * the last; a point with none starts at the first. Clearing is the toggle's.
 */
export function nextPointStatus(status: PointStatus | null): PointStatus {
	const index = status ? POINT_STATUSES.indexOf(status) : -1;
	return POINT_STATUSES[(index + 1) % POINT_STATUSES.length];
}
