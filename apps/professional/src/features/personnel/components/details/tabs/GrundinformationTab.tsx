"use client";

import React from "react";
import { CreateEmployeeFormData } from "../../../types/createEmployee.types";
import { ViewPersonalInfoCard } from "../cards/ViewPersonalInfoCard";
import { ViewBankInfoCard } from "../cards/ViewBankInfoCard";
import { ViewTaxUnionCard } from "../cards/ViewTaxUnionCard";
import { ViewWorkDutiesCard } from "../cards/ViewWorkDutiesCard";

interface GrundinformationTabProps {
	profileData: CreateEmployeeFormData;
	onEditSection: (section: "personalInfo" | "bankInfo" | "taxUnion" | "workDuties") => void;
}

export function GrundinformationTab({
	profileData,
	onEditSection,
}: GrundinformationTabProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Top Left: Personliga detaljer */}
			<ViewPersonalInfoCard
				data={profileData.personalInfo}
				onEdit={() => onEditSection("personalInfo")}
			/>

			{/* Top Right: Bankinformation */}
			<ViewBankInfoCard
				data={profileData.bankInfo}
				onEdit={() => onEditSection("bankInfo")}
			/>

			{/* Bottom Left: Skatteinformation - Kollektivavtal */}
			<ViewTaxUnionCard
				data={profileData.taxUnion}
				onEdit={() => onEditSection("taxUnion")}
			/>

			{/* Bottom Right: Arbetsuppgifter */}
			<ViewWorkDutiesCard
				data={profileData.workDuties}
				onEdit={() => onEditSection("workDuties")}
			/>
		</div>
	);
}
