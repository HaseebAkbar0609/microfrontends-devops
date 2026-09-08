"use client";

import { useState } from "react";
import { INITIAL_PERSONNEL_DASHBOARD_DATA } from "../mock/personnelDashboard.mock";
import { PersonnelDashboardState } from "../types/personnelDashboard.types";

export function usePersonnelDashboard() {
	const [state, setState] = useState<PersonnelDashboardState>(
		INITIAL_PERSONNEL_DASHBOARD_DATA,
	);
	const [isRearranging, setIsRearranging] = useState(false);

	return {
		state,
		setState,
		isRearranging,
		setIsRearranging,
	};
}
