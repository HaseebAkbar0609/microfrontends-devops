"use client";

import React from "react";
import { FileText, Edit } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEmployeeOverview } from "../../types/dataItOverview.types";
import { showToast } from "@/lib/toast";

interface DataItDetailBasicInfoCardProps {
	employee: DataItEmployeeOverview;
}

export function DataItDetailBasicInfoCard({ employee }: DataItDetailBasicInfoCardProps) {
	const t = useTranslate();

	const handleEdit = () => {
		showToast("info", t(localizationConstants.dataItToastComingSoon));
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white shadow-sm">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<FileText size={18} className="text-slate-600" />
					<h3 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItBasicInfoCardTitle)}
					</h3>
				</div>
				<button
					type="button"
					onClick={handleEdit}
					className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none"
				>
					<Edit size={13} />
					<span>{t(localizationConstants.dataItBtnEdit)}</span>
				</button>
			</div>

			{/* Card Fields Grid */}
			<div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-4">
				<div>
					<p className="text-xs font-medium text-slate-400">
						{t(localizationConstants.dataItFieldId)}
					</p>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{employee.personCode}
					</p>
				</div>
				<div>
					<p className="text-xs font-medium text-slate-400">
						{t(localizationConstants.dataItFieldPerson)}
					</p>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{employee.name}
					</p>
				</div>
				<div>
					<p className="text-xs font-medium text-slate-400">
						{t(localizationConstants.dataItFieldName)}
					</p>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{employee.name}
					</p>
				</div>
				<div>
					<p className="text-xs font-medium text-slate-400">
						{t(localizationConstants.dataItFieldEmail)}
					</p>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{employee.email}
					</p>
				</div>
				<div>
					<p className="text-xs font-medium text-slate-400">
						{t(localizationConstants.dataItFieldRole)}
					</p>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{employee.role}
					</p>
				</div>
				<div>
					<p className="text-xs font-medium text-slate-400">
						{t(localizationConstants.dataItFieldPhone)}
					</p>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{employee.phone}
					</p>
				</div>
			</div>
		</div>
	);
}
