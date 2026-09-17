import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { CONSTRUCTION_LOG_CONSTANTS } from "@/features/orders/construction-log/constants/constructionLog.constants";
import {
	INITIAL_MOCK_CONSTRUCTION_LOG,
	MOCK_CALENDAR_DAYS,
} from "@/features/orders/construction-log/data/constructionLog.mock";
import type {
	ConstructionLogEntry,
	ConstructionCalendarDay,
} from "@/features/orders/construction-log/types/constructionLog.types";

function getStorageLogs(): ConstructionLogEntry[] {
	if (typeof window === "undefined") return [INITIAL_MOCK_CONSTRUCTION_LOG];
	try {
		const raw = localStorage.getItem(CONSTRUCTION_LOG_CONSTANTS.STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(
				CONSTRUCTION_LOG_CONSTANTS.STORAGE_KEY,
				JSON.stringify([INITIAL_MOCK_CONSTRUCTION_LOG])
			);
			return [INITIAL_MOCK_CONSTRUCTION_LOG];
		}
		return JSON.parse(raw) as ConstructionLogEntry[];
	} catch (e) {
		console.error("[constructionLog.api] Failed to read storage:", e);
		return [INITIAL_MOCK_CONSTRUCTION_LOG];
	}
}

function setStorageLogs(logs: ConstructionLogEntry[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(
			CONSTRUCTION_LOG_CONSTANTS.STORAGE_KEY,
			JSON.stringify(logs)
		);
	} catch (e) {
		console.error("[constructionLog.api] Failed to write storage:", e);
	}
}

export async function getConstructionLogs(orderId?: string): Promise<ConstructionLogEntry[]> {
	const targetOrderId = orderId || CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID;
	try {
		const res = await axiosInstance.get<{ data?: ConstructionLogEntry[] }>(
			API_PATH.ORDERS.CONSTRUCTION_LOGS(targetOrderId),
			{ timeout: 5000 }
		);
		const items = res.data?.data;
		if (Array.isArray(items) && items.length > 0) {
			setStorageLogs(items);
			return items;
		}
	} catch (err) {
		console.warn("[constructionLog.api] Fetching from API failed, using storage cache:", err);
	}
	return getStorageLogs();
}

export async function getConstructionLogByDate(
	date: string,
	orderId?: string
): Promise<ConstructionLogEntry> {
	const logs = await getConstructionLogs(orderId);
	const found = logs.find((l) => l.date === date);
	if (found) return found;

	return {
		...INITIAL_MOCK_CONSTRUCTION_LOG,
		id: `log-${orderId || CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID}-${date.replace(/-/g, "")}`,
		date,
		weather: {
			...INITIAL_MOCK_CONSTRUCTION_LOG.weather,
			date,
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

export async function saveConstructionLog(
	log: ConstructionLogEntry,
	orderId?: string
): Promise<ConstructionLogEntry> {
	const targetOrderId = orderId || CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID;
	const logs = getStorageLogs();
	const index = logs.findIndex((l) => l.id === log.id || l.date === log.date);

	const updatedLog: ConstructionLogEntry = {
		...log,
		orderId: targetOrderId,
		updatedAt: new Date().toISOString(),
	};

	try {
		const res = await axiosInstance.post<{ data?: ConstructionLogEntry }>(
			API_PATH.ORDERS.CONSTRUCTION_LOGS(targetOrderId),
			updatedLog,
			{ timeout: 5000 }
		);
		if (res.data?.data) {
			const saved = res.data.data;
			const updated = index >= 0
				? logs.map((l, i) => (i === index ? saved : l))
				: [saved, ...logs];
			setStorageLogs(updated);
			return saved;
		}
	} catch (err) {
		console.warn("[constructionLog.api] API save failed, updating locally:", err);
	}

	const updated = index >= 0
		? logs.map((l, i) => (i === index ? updatedLog : l))
		: [updatedLog, ...logs];
	setStorageLogs(updated);
	return updatedLog;
}

export async function getCalendarDays(
	year: number,
	month: number,
	orderId?: string
): Promise<ConstructionCalendarDay[]> {
	const logs = await getConstructionLogs(orderId);
	const monthStr = String(month).padStart(2, "0");
	const monthPrefix = `${year}-${monthStr}`;

	const logDates = new Set(logs.map((l) => l.date));

	const days: ConstructionCalendarDay[] = MOCK_CALENDAR_DAYS.filter((d) =>
		d.date.startsWith(monthPrefix)
	);

	for (const date of logDates) {
		if (date.startsWith(monthPrefix) && !days.some((d) => d.date === date)) {
			days.push({ date, type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.SELECTED });
		}
	}

	return days;
}
