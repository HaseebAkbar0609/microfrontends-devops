"use client";

import React from "react";
import type { PriceListDetail } from "../../../../types/priceLists.types";
import { PriceListGrundInfoCard } from "../cards/PriceListGrundInfoCard";
import { PriceListSettingsCard } from "../cards/PriceListSettingsCard";

interface PriceListGrundInfoTabProps {
	readonly priceList: PriceListDetail;
	readonly isEditingGrundInfo: boolean;
	readonly editGrundInfoData: {
		code: string;
		name: string;
		date: string;
		createdBy: string;
		comment: string;
	};
	readonly setEditGrundInfoData: React.Dispatch<
		React.SetStateAction<{
			code: string;
			name: string;
			date: string;
			createdBy: string;
			comment: string;
		}>
	>;
	readonly startEditGrundInfo: () => void;
	readonly cancelEditGrundInfo: () => void;
	readonly saveGrundInfo: () => void;

	readonly isEditingSettings: boolean;
	readonly editSettingsData: {
		category: string;
		unit: string;
	};
	readonly setEditSettingsData: React.Dispatch<
		React.SetStateAction<{
			category: string;
			unit: string;
		}>
	>;
	readonly startEditSettings: () => void;
	readonly cancelEditSettings: () => void;
	readonly saveSettings: () => void;
}

export function PriceListGrundInfoTab({
	priceList,
	isEditingGrundInfo,
	editGrundInfoData,
	setEditGrundInfoData,
	startEditGrundInfo,
	cancelEditGrundInfo,
	saveGrundInfo,
	isEditingSettings,
	editSettingsData,
	setEditSettingsData,
	startEditSettings,
	cancelEditSettings,
	saveSettings,
}: PriceListGrundInfoTabProps) {
	return (
		<div className="space-y-6">
			{/* Card 1: Grund Information */}
			<PriceListGrundInfoCard
				priceList={priceList}
				isEditing={isEditingGrundInfo}
				editData={editGrundInfoData}
				setEditData={setEditGrundInfoData}
				onStartEdit={startEditGrundInfo}
				onCancelEdit={cancelEditGrundInfo}
				onSave={saveGrundInfo}
			/>

			{/* Card 2: Inställning (including linked customers & suppliers) */}
			<PriceListSettingsCard
				priceList={priceList}
				isEditing={isEditingSettings}
				editData={editSettingsData}
				setEditData={setEditSettingsData}
				onStartEdit={startEditSettings}
				onCancelEdit={cancelEditSettings}
				onSave={saveSettings}
			/>
		</div>
	);
}
