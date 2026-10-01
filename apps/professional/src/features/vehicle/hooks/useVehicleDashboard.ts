"use client";

import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	getVehicleDashboardKpisAction,
	createVehicleAPIAction,
	createVehicleServiceAPIAction,
	type VehicleDashboardData,
	type VehicleServiceItem,
} from "@/api-actions";
import { DEFAULT_VEHICLE_DASHBOARD_DATA } from "../constants/vehicleDashboard.constants";
import type { VehicleModalType } from "../types/vehicleDashboard.types";

export function useVehicleDashboard() {
	const t = useTranslate();
	const [data, setData] = useState<VehicleDashboardData>(
		DEFAULT_VEHICLE_DASHBOARD_DATA,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [activeModal, setActiveModal] = useState<VehicleModalType>(null);
	const [isRearranging, setIsRearranging] = useState(false);

	const fetchDashboardData = useCallback(async () => {
		setIsLoading(true);
		const result = await getVehicleDashboardKpisAction();
		if (result.success && result.data) {
			setData(result.data);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	const handleOpenModal = useCallback((type: VehicleModalType) => {
		setActiveModal(type);
	}, []);

	const handleCloseModal = useCallback(() => {
		setActiveModal(null);
	}, []);

	const handleAddVehicle = useCallback(
		async (payload: {
			regNumber: string;
			brandModel: string;
			driver?: string;
			notes?: string;
		}) => {
			const res = await createVehicleAPIAction(payload);
			if (res.success) {
				setData((prev) => ({
					...prev,
					kpis: {
						...prev.kpis,
						totalVehicles: prev.kpis.totalVehicles + 1,
						inOperation: prev.kpis.inOperation + 1,
					},
					drive: {
						...prev.drive,
						activeVehiclesCount: prev.drive.activeVehiclesCount + 1,
					},
				}));
				showToast("success", t(localizationConstants.vehicleSuccessAdded));
				handleCloseModal();
			}
		},
		[t, handleCloseModal],
	);

	const handleRegisterService = useCallback(
		async (payload: {
			vehicleNumber: string;
			title: string;
			scheduledDate: string;
			estimatedCost?: number;
			notes?: string;
		}) => {
			const res = await createVehicleServiceAPIAction(payload);
			if (res.success && res.data) {
				setData((prev) => ({
					...prev,
					kpis: {
						...prev.kpis,
						upcomingService: prev.kpis.upcomingService + 1,
						servicePending: prev.kpis.servicePending + 1,
					},
					services: [res.data as VehicleServiceItem, ...prev.services],
				}));
				showToast(
					"success",
					t(localizationConstants.vehicleSuccessServiceSaved),
				);
				handleCloseModal();
			}
		},
		[t, handleCloseModal],
	);

	const handleAssignKey = useCallback(
		(driverName: string, keyNumber: string) => {
			if (!driverName || !keyNumber) return;
			showToast("success", t(localizationConstants.vehicleSuccessKeyAssigned));
			handleCloseModal();
		},
		[t, handleCloseModal],
	);

	const handleApproveLogbooks = useCallback(() => {
		setData((prev) => ({
			...prev,
			kpis: {
				...prev.kpis,
				logbookNotCompleted: Math.max(0, prev.kpis.logbookNotCompleted - 1),
			},
			drive: {
				...prev.drive,
				unapprovedLogbooksCount: Math.max(
					0,
					prev.drive.unapprovedLogbooksCount - 1,
				),
			},
		}));
		showToast("success", t(localizationConstants.vehicleSuccessLogbookSaved));
	}, [t]);

	return {
		data,
		isLoading,
		activeModal,
		isRearranging,
		setIsRearranging,
		handleOpenModal,
		handleCloseModal,
		handleAddVehicle,
		handleRegisterService,
		handleAssignKey,
		handleApproveLogbooks,
		refreshData: fetchDashboardData,
	};
}
