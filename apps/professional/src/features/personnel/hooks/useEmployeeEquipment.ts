"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import {
	ClothesItem,
	EmployeeEquipmentProfile,
	KeyCardItem,
	VehicleItem,
	WorkToolItem,
} from "../types/equipment.types";
import { employeeEquipmentRepository } from "../utils/employeeEquipmentRepository";

export function useEmployeeEquipment(
	employeeId = "emp_anna_svensson",
	employeeName = "Anna Svensson"
) {
	const { t } = useTranslation();
	const [profile, setProfile] = useState<EmployeeEquipmentProfile>(() =>
		employeeEquipmentRepository.getProfile(employeeId, employeeName)
	);

	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [isWorkToolsModalOpen, setIsWorkToolsModalOpen] = useState<boolean>(false);
	const [isClothesModalOpen, setIsClothesModalOpen] = useState<boolean>(false);
	const [isKeysCardsModalOpen, setIsKeysCardsModalOpen] = useState<boolean>(false);
	const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);

	const handleSaveWorkTools = useCallback(
		(workTools: WorkToolItem[]) => {
			const updated = employeeEquipmentRepository.updateWorkTools(employeeId, workTools);
			setProfile(updated);
			setIsWorkToolsModalOpen(false);
			toast.success(t(localizationConstants.toastEquipmentUpdated));
		},
		[employeeId, t]
	);

	const handleSaveClothes = useCallback(
		(clothes: ClothesItem[]) => {
			const updated = employeeEquipmentRepository.updateClothes(employeeId, clothes);
			setProfile(updated);
			setIsClothesModalOpen(false);
			toast.success(t(localizationConstants.toastEquipmentUpdated));
		},
		[employeeId, t]
	);

	const handleSaveKeysCards = useCallback(
		(keysCards: KeyCardItem[]) => {
			const updated = employeeEquipmentRepository.updateKeysCards(employeeId, keysCards);
			setProfile(updated);
			setIsKeysCardsModalOpen(false);
			toast.success(t(localizationConstants.toastEquipmentUpdated));
		},
		[employeeId, t]
	);

	const handleSaveVehicles = useCallback(
		(vehicles: VehicleItem[]) => {
			const updated = employeeEquipmentRepository.updateVehicles(employeeId, vehicles);
			setProfile(updated);
			setIsVehicleModalOpen(false);
			toast.success(t(localizationConstants.toastEquipmentUpdated));
		},
		[employeeId, t]
	);

	return {
		profile,
		categoryFilter,
		setCategoryFilter,
		isWorkToolsModalOpen,
		setIsWorkToolsModalOpen,
		isClothesModalOpen,
		setIsClothesModalOpen,
		isKeysCardsModalOpen,
		setIsKeysCardsModalOpen,
		isVehicleModalOpen,
		setIsVehicleModalOpen,
		handleSaveWorkTools,
		handleSaveClothes,
		handleSaveKeysCards,
		handleSaveVehicles,
	};
}
