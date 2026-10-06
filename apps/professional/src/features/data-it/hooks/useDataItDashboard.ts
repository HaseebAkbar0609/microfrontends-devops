"use client";

import { useState, useCallback } from "react";
import { initialDataItDashboardState } from "../constants/dataItDashboard.mock";
import { DATA_IT_REFRESH_DELAY_MS } from "../constants/dataItDashboard.constants";
import type { DataItDashboardState } from "../types/dataIt.types";

export function useDataItDashboard() {
	const [state, setState] = useState<DataItDashboardState>(
		initialDataItDashboardState,
	);
	const [isRearranging, setIsRearranging] = useState(false);

	const handleRefresh = useCallback(async () => {
		await new Promise((resolve) =>
			setTimeout(resolve, DATA_IT_REFRESH_DELAY_MS),
		);
		setState((prev) => ({
			...prev,
			kpi: {
				...prev.kpi,
				openTickets: Math.max(0, prev.kpi.openTickets),
			},
		}));
	}, []);

	return {
		state,
		setState,
		isRearranging,
		setIsRearranging,
		handleRefresh,
	};
}

export default useDataItDashboard;
