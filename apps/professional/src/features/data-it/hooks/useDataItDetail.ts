"use client";

import { useState, useCallback, useEffect } from "react";
import type {
	DataItEmployeeOverview,
	DataItDetailTab,
} from "../types/dataItOverview.types";
import { dataItRepository } from "../utils/dataItRepository";

export function useDataItDetail(id: string) {
	const [activeTab, setActiveTab] = useState<DataItDetailTab>("basic");
	const [employee, setEmployee] = useState<DataItEmployeeOverview | null>(() => {
		return dataItRepository.getById(id) ?? null;
	});

	useEffect(() => {
		setEmployee(dataItRepository.getById(id) ?? null);
		const unsubscribe = dataItRepository.subscribe(() => {
			setEmployee(dataItRepository.getById(id) ?? null);
		});
		return unsubscribe;
	}, [id]);

	const updateEmployee = useCallback((updated: DataItEmployeeOverview) => {
		dataItRepository.update(updated);
	}, []);

	return {
		employee,
		updateEmployee,
		activeTab,
		setActiveTab,
	};
}
