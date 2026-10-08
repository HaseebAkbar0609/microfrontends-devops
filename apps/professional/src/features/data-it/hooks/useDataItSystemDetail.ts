"use client";

import { useCallback, useEffect, useState } from "react";
import type { SystemDetailTabId } from "../constants/dataItSystem.constants";
import { SYSTEM_DETAIL_TAB_BASIC } from "../constants/dataItSystem.constants";
import type { SystemItem } from "../types/dataItSystem.types";
import { dataItSystemRepository } from "../utils/dataItSystemRepository";

export function useDataItSystemDetail(systemId: string) {
	const [system, setSystem] = useState<SystemItem | undefined>(() =>
		dataItSystemRepository.getById(systemId),
	);
	const [activeTab, setActiveTab] =
		useState<SystemDetailTabId>(SYSTEM_DETAIL_TAB_BASIC);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const handleUpdate = () => {
			setSystem(dataItSystemRepository.getById(systemId));
		};

		handleUpdate();
		const unsubscribe = dataItSystemRepository.subscribe(handleUpdate);
		return () => {
			unsubscribe();
		};
	}, [systemId]);

	const updateSystem = useCallback(
		(updates: Partial<SystemItem>) => {
			if (!system) return;
			dataItSystemRepository.update(system.id, updates);
		},
		[system],
	);

	const deleteSystem = useCallback(() => {
		if (!system) return;
		dataItSystemRepository.delete(system.id);
	}, [system]);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return {
		system,
		activeTab,
		setActiveTab,
		showPassword,
		togglePasswordVisibility,
		updateSystem,
		deleteSystem,
	};
}
