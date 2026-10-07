"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDataItDetail } from "../../hooks/useDataItDetail";
import { DataItDetailBasicInfoCard } from "./DataItDetailBasicInfoCard";
import { DataItDetailEquipmentCard } from "./DataItDetailEquipmentCard";
import { DataItDetailSystemCard } from "./DataItDetailSystemCard";
import { DATA_IT_MODULE_BASE_URL } from "../../constants/dataItNav.config";

interface DataItDetailViewProps {
	id: string;
}

export function DataItDetailView({ id }: DataItDetailViewProps) {
	const t = useTranslate();
	const { employee, updateEmployee, activeTab, setActiveTab } = useDataItDetail(id);

	return (
		<div className="flex flex-1 flex-col gap-6 px-6 pt-4 pb-12">
			{/* Back Button & Title Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<Link
						href={`${DATA_IT_MODULE_BASE_URL}/overview`}
						className="inline-flex items-center gap-1.5 text-lg font-bold text-slate-900 transition-colors hover:text-slate-600"
						aria-label={t(localizationConstants.dataItBackToOverview)}
					>
						<ArrowLeft size={20} />
						<span>{t(localizationConstants.dataItDetails)}</span>
					</Link>
				</div>
				<p className="pl-6 text-xs font-semibold text-slate-400">
					{employee.id.startsWith("#") ? employee.id : `#${employee.id}`}
				</p>
			</div>

			{/* Sub-Tabs (Grundläggande info | Utrustning | System) */}
			<div className="border-b border-slate-200">
				<nav className="flex space-x-8" aria-label="Detail tabs">
					<button
						type="button"
						onClick={() => setActiveTab("basic")}
						className={`relative pb-3 text-sm font-semibold transition-colors ${
							activeTab === "basic"
								? "text-slate-950"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						{t(localizationConstants.dataItTabBasicInfo)}
						{activeTab === "basic" && (
							<span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950" />
						)}
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("equipment")}
						className={`relative pb-3 text-sm font-semibold transition-colors ${
							activeTab === "equipment"
								? "text-slate-950"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						{t(localizationConstants.dataItTabEquipment)}
						{activeTab === "equipment" && (
							<span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950" />
						)}
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("system")}
						className={`relative pb-3 text-sm font-semibold transition-colors ${
							activeTab === "system"
								? "text-slate-950"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						{t(localizationConstants.dataItTabSystem)}
						{activeTab === "system" && (
							<span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950" />
						)}
					</button>
				</nav>
			</div>

			{/* Tab Content Cards */}
			<div>
				{activeTab === "basic" && (
					<DataItDetailBasicInfoCard
						employee={employee}
						onUpdateEmployee={updateEmployee}
					/>
				)}
				{activeTab === "equipment" && (
					<DataItDetailEquipmentCard
						employee={employee}
						onUpdateEmployee={updateEmployee}
					/>
				)}
				{activeTab === "system" && (
					<DataItDetailSystemCard
						employee={employee}
						onUpdateEmployee={updateEmployee}
					/>
				)}
			</div>
		</div>
	);
}
