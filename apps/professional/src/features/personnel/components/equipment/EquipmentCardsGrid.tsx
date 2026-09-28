"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useEmployeeEquipment } from "../../hooks/useEmployeeEquipment";
import { WorkToolsCard } from "./cards/WorkToolsCard";
import { ClothesCard } from "./cards/ClothesCard";
import { KeysCardsCard } from "./cards/KeysCardsCard";
import { VehicleCard } from "./cards/VehicleCard";
import { EditWorkToolsModal } from "./modals/EditWorkToolsModal";
import { EditClothesModal } from "./modals/EditClothesModal";
import { EditKeysCardsModal } from "./modals/EditKeysCardsModal";
import { EditVehicleModal } from "./modals/EditVehicleModal";

interface EquipmentCardsGridProps {
	employeeId?: string;
	employeeName?: string;
}

export function EquipmentCardsGrid({
	employeeId = "emp_anna_svensson",
	employeeName = "Anna Svensson",
}: EquipmentCardsGridProps) {
	const {
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
	} = useEmployeeEquipment(employeeId, employeeName);

	const showWorkTools = categoryFilter === "all" || categoryFilter === "work_tools";
	const showClothes = categoryFilter === "all" || categoryFilter === "clothes";
	const showKeysCards = categoryFilter === "all" || categoryFilter === "keys_cards";
	const showVehicles = categoryFilter === "all" || categoryFilter === "vehicle";

	return (
		<div className="space-y-4">
			{/* Top Category Filter Selector matching Figma dropdown */}
			<div className="flex items-center justify-between">
				<div className="w-48">
					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className="h-9 text-xs bg-white border-slate-200 text-slate-700 shadow-2xs font-medium cursor-pointer">
							<SelectValue placeholder="Utrustning" />
						</SelectTrigger>
						<SelectContent className="text-xs">
							<SelectItem value="all" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.equipmentCategoryFilterAll} />
							</SelectItem>
							<SelectItem value="work_tools" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.equipmentCategoryWorkTools} />
							</SelectItem>
							<SelectItem value="clothes" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.equipmentCategoryClothes} />
							</SelectItem>
							<SelectItem value="keys_cards" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.equipmentCategoryKeysCards} />
							</SelectItem>
							<SelectItem value="vehicle" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.equipmentCategoryVehicles} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* 2x2 Responsive Cards Grid matching Figma screenshot 1:1 */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{showWorkTools && (
					<WorkToolsCard
						items={profile.workTools}
						onEdit={() => setIsWorkToolsModalOpen(true)}
					/>
				)}

				{showClothes && (
					<ClothesCard
						items={profile.clothes}
						onEdit={() => setIsClothesModalOpen(true)}
					/>
				)}

				{showKeysCards && (
					<KeysCardsCard
						items={profile.keysCards}
						onEdit={() => setIsKeysCardsModalOpen(true)}
					/>
				)}

				{showVehicles && (
					<VehicleCard
						items={profile.vehicles}
						onEdit={() => setIsVehicleModalOpen(true)}
					/>
				)}
			</div>

			{/* Edit Modals */}
			<EditWorkToolsModal
				isOpen={isWorkToolsModalOpen}
				onClose={() => setIsWorkToolsModalOpen(false)}
				initialItems={profile.workTools}
				onSave={handleSaveWorkTools}
			/>

			<EditClothesModal
				isOpen={isClothesModalOpen}
				onClose={() => setIsClothesModalOpen(false)}
				initialItems={profile.clothes}
				onSave={handleSaveClothes}
			/>

			<EditKeysCardsModal
				isOpen={isKeysCardsModalOpen}
				onClose={() => setIsKeysCardsModalOpen(false)}
				initialItems={profile.keysCards}
				onSave={handleSaveKeysCards}
			/>

			<EditVehicleModal
				isOpen={isVehicleModalOpen}
				onClose={() => setIsVehicleModalOpen(false)}
				initialItems={profile.vehicles}
				onSave={handleSaveVehicles}
			/>
		</div>
	);
}
