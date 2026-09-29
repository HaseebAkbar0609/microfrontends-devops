/**
 * The slot arithmetic behind the home widget board and the parsing of the
 * layout stored in the browser. Follows admin-user-contract.spec.ts: no browser.
 */
import { expect, test } from "@playwright/test";
import { DEFAULT_HOME_WIDGET_IDS, HOME_BOARD_COLUMNS } from "../src/features/dashboard/constants/dashboard.constants";
import {
	clearSlot,
	makeSlot,
	padDraft,
	parseLayout,
	placeInSlot,
	swapSlots,
	type BoardSlot,
} from "../src/features/dashboard/hooks/useWidgetBoard";

const ids = (slots: BoardSlot[]) => slots.map((slot) => slot.widgetId);

test("the draft always ends in an empty slot and fills its last row", () => {
	for (const count of [0, 1, 2, 3, 4]) {
		const slots = padDraft(Array.from({ length: count }, () => makeSlot("stats")));
		expect(slots.length % HOME_BOARD_COLUMNS).toBe(0);
		expect(slots.at(-1)?.widgetId).toBeNull();
	}
});

test("a placed widget takes the first empty slot, and only once", () => {
	const slots = padDraft([makeSlot("stats")]);
	const once = placeInSlot(slots, "news");
	expect(ids(once).slice(0, 2)).toEqual(["stats", "news"]);
	expect(placeInSlot(once, "news")).toBe(once);
});

test("a dropped widget lands in the slot it was dropped on, never on a taken one", () => {
	const slots = padDraft([makeSlot("stats")]);
	const last = slots.at(-1)!.uid;
	expect(ids(placeInSlot(slots, "news", last))).toEqual(["stats", null, "news", null, null, null]);
	expect(placeInSlot(slots, "news", slots[0].uid)).toBe(slots);
});

test("moving swaps two widgets, and onto an empty slot leaves the old one empty", () => {
	const slots = padDraft([makeSlot("stats"), makeSlot("news")]);
	expect(ids(swapSlots(slots, slots[0].uid, slots[1].uid)).slice(0, 2)).toEqual(["news", "stats"]);
	expect(ids(swapSlots(slots, slots[0].uid, slots[2].uid)).slice(0, 3)).toEqual([null, "news", "stats"]);
	expect(swapSlots(slots, slots[2].uid, slots[0].uid)).toBe(slots); // an empty slot is not dragged
});

test("removing empties the slot without shifting the others", () => {
	const slots = padDraft([makeSlot("stats"), makeSlot("news")]);
	expect(ids(clearSlot(slots, slots[0].uid)).slice(0, 2)).toEqual([null, "news"]);
});

test("a stored layout drops unknown and repeated ids, and falls back when unreadable", () => {
	expect(parseLayout(JSON.stringify(["news", "hacked", "news", 7, "stats"]))).toEqual(["news", "stats"]);
	expect(parseLayout("[]")).toEqual([]); // the user removed everything on purpose
	for (const raw of [null, "not json", '{"a":1}']) {
		expect(parseLayout(raw)).toEqual([...DEFAULT_HOME_WIDGET_IDS]);
	}
});
