"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { personnelBreadcrumbs } from "../../constants/personnelNav.config";
import { PersonalkortHeader } from "../equipment/PersonalkortHeader";
import { EquipmentCardsGrid } from "../equipment/EquipmentCardsGrid";
import { PersonalkortTabType } from "../../types/equipment.types";

export function EmployeeDetailsPage() {
	const [activeTab, setActiveTab] = useState<PersonalkortTabType>("utrustning_fordon");
	const employeeName = "Anna Svensson";

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.personalOverviewTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 py-4 space-y-6">
				{/* Personalkort Header & Tabs */}
				<PersonalkortHeader
					employeeName={employeeName}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				{/* Active Subtab Content */}
				{activeTab === "utrustning_fordon" && (
					<EquipmentCardsGrid
						employeeName={employeeName}
					/>
				)}

				{activeTab !== "utrustning_fordon" && (
					<div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-xs">
						<p className="text-sm">
							<Translate text={localizationConstants.personalkortTitle} /> —{" "}
							<span className="font-semibold text-slate-700">{activeTab}</span>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default EmployeeDetailsPage;
