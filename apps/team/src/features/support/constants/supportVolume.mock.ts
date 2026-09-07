import type { CountryLoad, VolumePoint, VolumeRange } from "../types";

/**
 * Ticket volume per channel. Bucket labels are short weekday / week / month
 * markers kept as literals: translating them would desynchronise the axis from
 * the underlying series.
 */
const DAILY_VOLUME: VolumePoint[] = [
	{ label: "Mån", phone: 24, email: 31, chat: 18 },
	{ label: "Tis", phone: 28, email: 26, chat: 22 },
	{ label: "Ons", phone: 19, email: 34, chat: 27 },
	{ label: "Tors", phone: 31, email: 29, chat: 24 },
	{ label: "Fre", phone: 35, email: 38, chat: 30 },
	{ label: "Lör", phone: 9, email: 12, chat: 7 },
	{ label: "Sön", phone: 6, email: 10, chat: 5 },
];

const WEEKLY_VOLUME: VolumePoint[] = [
	{ label: "v.31", phone: 132, email: 158, chat: 96 },
	{ label: "v.32", phone: 145, email: 162, chat: 112 },
	{ label: "v.33", phone: 128, email: 149, chat: 121 },
	{ label: "v.34", phone: 161, email: 174, chat: 133 },
	{ label: "v.35", phone: 152, email: 180, chat: 128 },
	{ label: "v.36", phone: 148, email: 171, chat: 141 },
];

const MONTHLY_VOLUME: VolumePoint[] = [
	{ label: "Apr", phone: 512, email: 611, chat: 388 },
	{ label: "Maj", phone: 548, email: 654, chat: 421 },
	{ label: "Jun", phone: 601, email: 702, chat: 469 },
	{ label: "Jul", phone: 432, email: 501, chat: 352 },
	{ label: "Aug", phone: 596, email: 688, chat: 502 },
	{ label: "Sep", phone: 214, email: 259, chat: 188 },
];

export const SUPPORT_VOLUME_BY_RANGE: Record<VolumeRange, VolumePoint[]> = {
	day: DAILY_VOLUME,
	week: WEEKLY_VOLUME,
	month: MONTHLY_VOLUME,
};

/** Open tickets and staffed agents per country. Finland is deliberately unstaffed. */
export const SUPPORT_COUNTRY_LOAD: CountryLoad[] = [
	{ country: "Sverige", open: 38, agents: 2 },
	{ country: "Norge", open: 21, agents: 1 },
	{ country: "Danmark", open: 14, agents: 1 },
	{ country: "Finland", open: 11, agents: 0 },
];
