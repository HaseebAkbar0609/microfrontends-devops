"use client";

import React from "react";
import { CreateEmployeeFormData } from "../../../types/createEmployee.types";
import { ContractInfo } from "../../../types/personnelOverview.types";
import { ViewContractSection } from "../cards/ViewContractSection";
import { ViewWorkInfoCard } from "../cards/ViewWorkInfoCard";
import { ViewSalaryCompensationCard } from "../cards/ViewSalaryCompensationCard";
import { ViewWorkingHoursCard } from "../cards/ViewWorkingHoursCard";
import { ViewHealthSupportCard } from "../cards/ViewHealthSupportCard";

interface AnstallningsvillkorTabProps {
	profileData: CreateEmployeeFormData;
	signedContract: ContractInfo;
	onPreviewContract: (fileName: string) => void;
	onDownloadContract: (fileName: string) => void;
	onArchiveContract: () => void;
	onDeleteContract: () => void;
	onUploadContract: (tags: string[]) => void;
	onEditSection: (
		section: "workInfo" | "salaryCompensation" | "workingHours" | "healthSupport"
	) => void;
}

export function AnstallningsvillkorTab({
	profileData,
	signedContract,
	onPreviewContract,
	onDownloadContract,
	onArchiveContract,
	onDeleteContract,
	onUploadContract,
	onEditSection,
}: AnstallningsvillkorTabProps) {
	return (
		<div className="space-y-6">
			{/* Top Contract section matching Screenshot 5 */}
			<ViewContractSection
				contract={signedContract}
				onPreview={onPreviewContract}
				onDownload={onDownloadContract}
				onArchive={onArchiveContract}
				onDelete={onDeleteContract}
				onUpload={onUploadContract}
			/>

			{/* 4 Conditions Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ViewWorkInfoCard
					data={profileData.workInfo}
					onEdit={() => onEditSection("workInfo")}
				/>

				<ViewSalaryCompensationCard
					data={profileData.salaryCompensation}
					onEdit={() => onEditSection("salaryCompensation")}
				/>

				<ViewWorkingHoursCard
					data={profileData.workingHours}
					onEdit={() => onEditSection("workingHours")}
				/>

				<ViewHealthSupportCard
					data={profileData.healthSupport}
					onEdit={() => onEditSection("healthSupport")}
				/>
			</div>
		</div>
	);
}
