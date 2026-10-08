"use client";

import React from "react";
import { FileText, Pencil, ArrowUpDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SystemAssignee } from "@/features/data-it/types/dataItSystem.types";

interface SystemAssignmentCardProps {
	assignedUsers: SystemAssignee[];
	onEdit?: () => void;
}

export const SystemAssignmentCard: React.FC<SystemAssignmentCardProps> = ({
	assignedUsers,
	onEdit,
}) => {
	const t = useTranslate();

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-2.5">
					<FileText className="h-5 w-5 text-slate-700" />
					<h2 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItSystemAssignmentTitle)}
					</h2>
				</div>
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
					>
						<Pencil className="h-3.5 w-3.5 text-slate-500" />
						<span>{t(localizationConstants.dataItSystemBtnEdit)}</span>
					</button>
				)}
			</div>

			{/* Assignees Table */}
			<div className="mt-4 overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
							<th className="py-3 pr-4">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColAssigneeName)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="px-4 py-3">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColAssigneeRole)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="px-4 py-3">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColAssigneeEmail)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="py-3 pl-4">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColAssigneePhone)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
						</tr>
					</thead>

					<tbody>
						{assignedUsers.length === 0 ? (
							<tr>
								<td colSpan={4} className="py-8 text-center text-xs text-slate-500">
									{t(localizationConstants.dataItSystemEmptyAssignments)}
								</td>
							</tr>
						) : (
							assignedUsers.map((user) => (
								<tr
									key={user.id}
									className="border-b border-slate-100 text-sm transition-colors hover:bg-slate-50/70"
								>
									<td className="py-3.5 pr-4 font-semibold text-slate-900">
										{user.name}
									</td>
									<td className="px-4 py-3.5 text-slate-600">{user.role}</td>
									<td className="px-4 py-3.5 text-slate-600">{user.email}</td>
									<td className="py-3.5 pl-4 text-slate-600">{user.phone}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SystemAssignmentCard;
