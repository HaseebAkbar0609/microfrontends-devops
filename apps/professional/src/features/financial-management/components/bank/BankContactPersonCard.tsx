"use client";

import React from "react";
import { FileText, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankContactPerson } from "../../types/bank.types";

interface BankContactPersonCardProps {
	contactPerson?: BankContactPerson;
	onEdit: () => void;
}

export function BankContactPersonCard({
	contactPerson,
	onEdit,
}: BankContactPersonCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			{/* Header */}
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
						<FileText className="w-5 h-5" />
					</div>
					<h3 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.contactPersonHeader} />
					</h3>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onEdit}
					className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
				>
					<Edit2 className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.btnEdit} />
				</Button>
			</div>

			{/* Grid Content */}
			<div className="p-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldContactName} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{contactPerson?.name || "Karl Andersson"}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldContactRole} />
						</span>
						<span className="text-sm font-medium text-slate-600">
							{contactPerson?.role || "info"}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldContactEmail} />
						</span>
						<a
							href={`mailto:${contactPerson?.email || "karl.andersson@seb.se"}`}
							className="text-sm font-medium text-blue-600 hover:underline"
						>
							{contactPerson?.email || "karl.andersson@seb.se"}
						</a>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldContactPhone} />
						</span>
						<span className="text-sm font-medium text-slate-800 font-mono">
							{contactPerson?.phone || "+46 8 763 80 00"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
