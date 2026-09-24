import { PROTOCOL_POINT_NR_DIGITS } from "./projectProtocol.config";
import type { MeetingPoint } from "./types";

const DIGITS = /^\d+$/;

/**
 * Agenda order: by Nr as the reader counts — "002" before "010", "1.2" before
 * "1.10". Ties keep their order. A fixed locale, so the server's render and the
 * browser's agree.
 */
export function sortPoints(points: MeetingPoint[]): MeetingPoint[] {
	return [...points].sort((a, b) => a.nr.localeCompare(b.nr, "sv", { numeric: true, sensitivity: "base" }));
}

/**
 * The Nr a new point is offered: one past the highest all-digit Nr, padded as
 * the frame draws it — "001" for the first. A hand-typed "1.2" is skipped.
 */
export function nextPointNr(points: MeetingPoint[]): string {
	const highest = points.reduce((max, point) => (DIGITS.test(point.nr) ? Math.max(max, Number(point.nr)) : max), 0);
	return String(highest + 1).padStart(PROTOCOL_POINT_NR_DIGITS, "0");
}

/** The list with `point` in place of the one sharing its id, or added at the end. */
export function upsertPoint(points: MeetingPoint[], point: MeetingPoint): MeetingPoint[] {
	return points.some((item) => item.id === point.id)
		? points.map((item) => (item.id === point.id ? point : item))
		: [...points, point];
}
