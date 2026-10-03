"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PersonalkortTabType } from "../../types/equipment.types";
import { PERSONNEL_MODULE_BASE_URL } from "../../constants/personnelNav.config";

interface PersonalkortHeaderProps {
	employeeName?: string;
	activeTab: PersonalkortTabType;
	onTabChange: (tab: PersonalkortTabType) => void;
	onBack?: () => void;
}

const PERSONALKORT_TABS: { id: PersonalkortTabType; labelKey: string }[] = [
	{ id: "information", labelKey: localizationConstants.personnelProfileTabPersonalInfo },
	{ id: "kompetens", labelKey: localizationConstants.personnelProfileTabCompetence },
	{ id: "utrustning_fordon", labelKey: localizationConstants.personnelProfileTabEquipment },
	{ id: "arbetstid", labelKey: localizationConstants.personnelProfileTabWorktime },
	{ id: "friskvard", labelKey: localizationConstants.personnelProfileTabWellness },
	{ id: "personal_process", labelKey: localizationConstants.personnelProfileTabProcess },
	{ id: "dokument", labelKey: localizationConstants.personnelProfileTabDocuments },
];

export function PersonalkortHeader({
	employeeName = "Anna Svensson",
	activeTab,
	onTabChange,
	onBack,
}: PersonalkortHeaderProps) {
	return (
		<div className="space-y-4">
			{/* Breadcrumb / Title Bar */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
				<div className="flex items-center gap-2">
					{onBack && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={onBack}
							className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
						>
							<ArrowLeft className="w-4 h-4" />
						</Button>
					)}
					<h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
						<span className="text-slate-400 font-normal">
							<Translate text={localizationConstants.personalkortTitle} /> /{" "}
						</span>
						{employeeName}
					</h1>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-9 px-3.5 text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
						asChild
					>
						<Link href={`${PERSONNEL_MODULE_BASE_URL}/overview`}>
							<ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
							<Translate text={localizationConstants.btnBackToPersonnelOverview} />
						</Link>
					</Button>
				</div>
			</div>

			{/* Personalkort SubTabs */}
			<div className="flex items-center border-b border-slate-200 bg-white px-2 rounded-t-lg h-[44px] shadow-xs">
				<Tabs
					value={activeTab}
					onValueChange={(val) => onTabChange(val as PersonalkortTabType)}
					className="w-full"
				>
					<TabsList variant="line" className="h-[36px] overflow-x-auto gap-1 sm:gap-2">
						{PERSONALKORT_TABS.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="cursor-pointer text-xs font-medium px-3 py-1.5 whitespace-nowrap data-[state=active]:font-semibold"
							>
								<Translate text={tab.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>
		</div>
	);
}
