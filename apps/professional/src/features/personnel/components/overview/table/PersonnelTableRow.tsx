"use client";

import React from "react";
import { MoreVertical, User, Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import { EmployeeOverviewItem } from "../../../types/personnelOverview.types";
import {
	STATUS_STYLE_MAP,
	STATUS_LABEL_KEY_MAP,
	TYPE_LABEL_KEY_MAP,
} from "../../../constants/personnelOverview.constants";

interface PersonnelTableRowProps {
	employee: EmployeeOverviewItem;
	onViewProfile: (employee: EmployeeOverviewItem) => void;
	onDeactivate: (employee: EmployeeOverviewItem) => void;
}

export function PersonnelTableRow({
	employee,
	onViewProfile,
	onDeactivate,
}: PersonnelTableRowProps) {
	const { t } = useTranslation();
	const statusStyle = STATUS_STYLE_MAP[employee.status] || STATUS_STYLE_MAP.not_started;
	const statusLabelKey = STATUS_LABEL_KEY_MAP[employee.status] || localizationConstants.statusNotStarted;
	const typeLabelKey = TYPE_LABEL_KEY_MAP[employee.employmentType] || localizationConstants.typeFullTime;

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700">
			<td className="py-3.5 px-4 font-mono font-medium text-slate-800">
				{employee.contractNumber}
			</td>
			<td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
				{employee.name || "—"}
			</td>
			<td className="py-3.5 px-4 text-slate-700 whitespace-nowrap max-w-[140px] truncate" title={employee.role}>
				{employee.role}
			</td>
			<td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
				{employee.idNumber}
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-none ${statusStyle.bg} ${statusStyle.text}`}
				>
					<Translate text={statusLabelKey} />
				</span>
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
				<Translate text={typeLabelKey} />
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
				{employee.startDate}
			</td>
			<td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
				{employee.location}
			</td>
			<td className="py-3.5 px-4 text-right whitespace-nowrap">
				<div className="inline-flex items-center gap-1.5 justify-end">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onViewProfile(employee)}
						className="h-7 px-2.5 text-xs font-medium bg-slate-100/80 hover:bg-slate-200 border-slate-200 text-slate-800 cursor-pointer shadow-2xs"
					>
						<Translate text={localizationConstants.viewProfileBtn} />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer"
								aria-label={t(localizationConstants.actionsMenuLabel)}
							>
								<MoreVertical className="w-3.5 h-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onClick={() => onViewProfile(employee)}
								className="cursor-pointer gap-2 text-xs"
							>
								<User className="w-3.5 h-3.5 text-slate-600" />
								<Translate text={localizationConstants.menuViewProfile} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onViewProfile(employee)}
								className="cursor-pointer gap-2 text-xs"
							>
								<Pencil className="w-3.5 h-3.5 text-slate-600" />
								<Translate text={localizationConstants.menuEdit} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDeactivate(employee)}
								className="cursor-pointer gap-2 text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50"
							>
								<UserX className="w-3.5 h-3.5 text-rose-600" />
								<Translate text={localizationConstants.menuDeactivate} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</td>
		</tr>
	);
}
