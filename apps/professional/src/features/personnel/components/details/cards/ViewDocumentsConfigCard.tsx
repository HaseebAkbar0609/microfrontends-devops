"use client";

import React from "react";
import { BookOpen, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmployeeDocumentsForm } from "../../../types/createEmployee.types";

interface ViewDocumentsConfigCardProps {
	config: EmployeeDocumentsForm;
	onEdit?: () => void;
}

export function ViewDocumentsConfigCard({
	config,
	onEdit,
}: ViewDocumentsConfigCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
						<BookOpen className="w-4 h-4" />
					</div>
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.sectionPersonalDocs} />
					</h2>
				</div>

				{onEdit && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onEdit}
						className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 rounded-md cursor-pointer shadow-2xs gap-1.5"
					>
						<Pencil className="w-3.5 h-3.5 text-slate-500" />
						<Translate text={localizationConstants.btnEditCard} />
					</Button>
				)}
			</div>

			<div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
				<div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40">
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldHandbook} />
					</span>
					<span className="font-semibold text-slate-900 text-sm">
						{config.employeeHandbook || "Personal bok 1"}
					</span>
				</div>

				<div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40">
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldPolicy} />
					</span>
					<span className="font-semibold text-slate-900 text-sm">
						{config.policy || "Bil-policy"}
					</span>
				</div>

				<div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40">
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldJobDescription} />
					</span>
					<span className="font-semibold text-slate-900 text-sm">
						{config.jobDescription || "Projektledare"}
					</span>
				</div>
			</div>
		</div>
	);
}
