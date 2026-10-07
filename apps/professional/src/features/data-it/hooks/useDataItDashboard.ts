"use client";

import { useState, useMemo } from "react";
import { initialRawDataItDashboardState } from "../constants/dataItDashboard.mock";
import { DATA_IT_EXPIRY_THRESHOLD_DAYS } from "../constants/dataItDashboard.constants";
import type {
	DataItDashboardState,
	RawDataItDashboardState,
} from "../types/dataIt.types";

export function useDataItDashboard() {
	const [rawState] = useState<RawDataItDashboardState>(
		initialRawDataItDashboardState,
	);
	const [isRearranging, setIsRearranging] = useState(false);

	const state: DataItDashboardState = useMemo(() => {
		const totalDevices = rawState.categories.reduce(
			(acc, cat) => acc + cat.count,
			0,
		);

		const categories = rawState.categories.map((cat) => ({
			...cat,
			percentage:
				totalDevices > 0 ? Math.round((cat.count / totalDevices) * 100) : 0,
		}));

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const warrantyDevices = rawState.warrantyDevices
			.map((device) => {
				const exp = new Date(device.expiryDate);
				exp.setHours(0, 0, 0, 0);
				const daysLeft = Math.ceil(
					(exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
				);
				return {
					...device,
					daysLeft,
				};
			})
			.filter(
				(device) =>
					device.daysLeft >= 0 &&
					device.daysLeft <= DATA_IT_EXPIRY_THRESHOLD_DAYS,
			);

		const openTickets = rawState.supportTickets.length;
		const activeSystems = rawState.systemStatusItems.length;
		const mfaItem = rawState.securityItems.find(
			(item) => typeof item.percentage === "number",
		);
		const securityScore = mfaItem?.percentage
			? Math.round(mfaItem.percentage)
			: 98;

		return {
			kpi: {
				totalDevices,
				activeSystems,
				openTickets,
				securityScore,
			},
			categories,
			warrantyDevices,
			upcomingPurchases: rawState.upcomingPurchases,
			supportTickets: rawState.supportTickets,
			securityItems: rawState.securityItems,
			systemStatusItems: rawState.systemStatusItems,
		};
	}, [rawState]);

	return {
		state,
		isRearranging,
		setIsRearranging,
	};
}

export default useDataItDashboard;

