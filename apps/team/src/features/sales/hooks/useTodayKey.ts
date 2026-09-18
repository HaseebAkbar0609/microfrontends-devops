"use client";

import { useEffect, useState } from "react";
import { SALES_REFERENCE_DATE } from "../constants/sales.constants";
import { toLocalDateKey } from "../utils/meetingBooker";

/**
 * Today's local calendar day as `yyyy-mm-dd`. The seed data's fixed date
 * renders first so server and client markup match, then the real day takes
 * over once mounted.
 */
export function useTodayKey(): string {
	const [todayKey, setTodayKey] = useState(() => SALES_REFERENCE_DATE.slice(0, 10));
	useEffect(() => {
		setTodayKey(toLocalDateKey(new Date()));
	}, []);
	return todayKey;
}
