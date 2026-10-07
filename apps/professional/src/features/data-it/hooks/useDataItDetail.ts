"use client";

import { useState, useMemo, useEffect } from "react";
import type {
	DataItEmployeeOverview,
	DataItDetailTab,
} from "../types/dataItOverview.types";
import { DATA_IT_STORAGE_KEY } from "../constants/dataItOverview.constants";
import { initialDataItEmployees } from "../constants/dataItOverview.mock";

export function useDataItDetail(id: string) {
	const [activeTab, setActiveTab] = useState<DataItDetailTab>("basic");
	const [employees, setEmployees] = useState<DataItEmployeeOverview[]>(initialDataItEmployees);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(DATA_IT_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					if (parsed.length < initialDataItEmployees.length) {
						setEmployees(initialDataItEmployees);
						localStorage.setItem(
							DATA_IT_STORAGE_KEY,
							JSON.stringify(initialDataItEmployees),
						);
						return;
					}
					setEmployees(parsed);
					return;
				}
			}
		} catch {
			// Fallback silently
		}
	}, []);

	const employee = useMemo(() => {
		const cleanId = decodeURIComponent(id).trim();
		const match = employees.find(
			(e) =>
				e.id === cleanId ||
				e.personCode === cleanId ||
				e.id.replace(/\s+/g, "") === cleanId.replace(/\s+/g, ""),
		);
		return match ?? employees[0] ?? initialDataItEmployees[0];
	}, [employees, id]);

	const updateEmployee = (updated: DataItEmployeeOverview) => {
		setEmployees((prev) => {
			const next = prev.map((e) => (e.id === updated.id ? updated : e));
			try {
				localStorage.setItem(DATA_IT_STORAGE_KEY, JSON.stringify(next));
			} catch {
				// Silently ignore storage errors
			}
			return next;
		});
	};

	const totalMonthlyCost = useMemo(() => {
		if (!employee) return 0;
		const eqCost = employee.equipment.reduce((sum, item) => sum + item.monthlyCost, 0);
		const sysCost = employee.systems.reduce((sum, item) => sum + item.monthlyCost, 0);
		return eqCost + sysCost;
	}, [employee]);

	return {
		employee,
		updateEmployee,
		activeTab,
		setActiveTab,
		totalMonthlyCost,
		equipmentCount: employee?.equipment.length ?? 0,
		systemCount: employee?.systems.length ?? 0,
	};
}
