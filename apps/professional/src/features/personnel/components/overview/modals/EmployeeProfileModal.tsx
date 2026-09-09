"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmployeeOverviewItem } from "../../../types/personnelOverview.types";
import {
	STATUS_STYLE_MAP,
	STATUS_LABEL_KEY_MAP,
	TYPE_LABEL_KEY_MAP,
} from "../../../constants/personnelOverview.constants";

interface EmployeeProfileModalProps {
	employee: EmployeeOverviewItem | null;
	isOpen: boolean;
	onClose: () => void;
}

export function EmployeeProfileModal({
	employee,
	isOpen,
	onClose,
}: EmployeeProfileModalProps) {
	if (!employee) return null;

	const statusStyle = STATUS_STYLE_MAP[employee.status] || STATUS_STYLE_MAP.not_started;
	const statusLabelKey = STATUS_LABEL_KEY_MAP[employee.status] || localizationConstants.statusNotStarted;
	const typeLabelKey = TYPE_LABEL_KEY_MAP[employee.employmentType] || localizationConstants.typeFullTime;

	const initials = employee.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="flex flex-row items-center gap-4 pb-4 border-b border-slate-100">
					<div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm border border-slate-200 shrink-0">
						{initials || "TF"}
					</div>
					<div className="flex-1 min-w-0">
						<DialogTitle className="text-base font-semibold text-slate-900 truncate">
							{employee.name}
						</DialogTitle>
						<p className="text-xs text-slate-500 font-medium">{employee.role}</p>
					</div>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
					>
						<Translate text={statusLabelKey} />
					</span>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-4 py-4 text-xs">
					<div>
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.profileContractLabel} />
						</span>
						<p className="font-mono text-slate-800 font-semibold">{employee.contractNumber}</p>
					</div>

					<div>
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.colIdNumber} />
						</span>
						<p className="font-mono text-slate-800">{employee.idNumber}</p>
					</div>

					<div>
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.profileDepartmentLabel} />
						</span>
						<p className="text-slate-800">{employee.department}</p>
					</div>

					<div>
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.colType} />
						</span>
						<p className="text-slate-800">
							<Translate text={typeLabelKey} />
						</p>
					</div>

					<div>
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.profileStartDateLabel} />
						</span>
						<p className="font-mono text-slate-800">{employee.startDate}</p>
					</div>

					<div>
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.colLocation} />
						</span>
						<p className="text-slate-800">{employee.location}</p>
					</div>

					<div className="col-span-2 pt-2 border-t border-slate-100">
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.profileEmailLabel} />
						</span>
						<p className="text-slate-800 font-mono">{employee.email}</p>
					</div>

					<div className="col-span-2">
						<span className="text-slate-400 font-medium block mb-1">
							<Translate text={localizationConstants.profilePhoneLabel} />
						</span>
						<p className="text-slate-800 font-mono">{employee.phone}</p>
					</div>
				</div>

				<DialogFooter className="pt-2 border-t border-slate-100 flex justify-end">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						className="h-8 px-4 text-xs"
					>
						<Translate text={localizationConstants.profileCloseBtn} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
