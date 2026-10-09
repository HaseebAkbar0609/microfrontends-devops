"use client";

import React from "react";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AVAILABLE_SYSTEM_ASSIGNEES } from "@/features/data-it/constants/dataItSystem.mock";
import type { SystemAssignee } from "@/features/data-it/types/dataItSystem.types";

interface SystemCreateAssignmentCardProps {
	assignedUsers: SystemAssignee[];
	onAssignUser: (candidateId: string) => void;
	onRemoveAssignee: (id: string) => void;
}

export const SystemCreateAssignmentCard: React.FC<
	SystemCreateAssignmentCardProps
> = ({ assignedUsers, onAssignUser, onRemoveAssignee }) => {
	const t = useTranslate();

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			<h2 className="border-b border-slate-100 pb-4 text-base font-semibold text-slate-900">
				{t(localizationConstants.dataItSystemAssignmentTitle)}
			</h2>

			{/* Assignee Selection matching Figma View 2 */}
			<div className="mt-5 max-w-md space-y-1.5">
				<label
					htmlFor="system-create-assignee-select"
					className="block text-xs font-semibold text-slate-700"
				>
					{t(localizationConstants.dataItSystemCreateAssignedTo)}
				</label>
				<div className="relative">
					<select
						id="system-create-assignee-select"
						onChange={(e) => {
							if (e.target.value) {
								onAssignUser(e.target.value);
								e.target.value = "";
							}
						}}
						defaultValue=""
						className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-xs text-slate-700 transition-colors focus:border-slate-400 focus:outline-hidden"
					>
						<option value="" disabled>
							{t(localizationConstants.dataItSystemCreateAssignedToPlaceholder)}
						</option>
						{AVAILABLE_SYSTEM_ASSIGNEES.map((user: SystemAssignee) => {
							const isAlreadyAssigned = assignedUsers.some(
								(u: SystemAssignee) => u.name === user.name,
							);
							return (
								<option
									key={user.id}
									value={user.id}
									disabled={isAlreadyAssigned}
								>
									{user.name} &bull; {user.role}{" "}
									{isAlreadyAssigned
										? `(${t(localizationConstants.dataItSystemAlreadyAssigned)})`
										: ""}
								</option>
							);
						})}
					</select>
				</div>
			</div>

			{/* Assignees Table */}
			<div className="mt-6 overflow-x-auto">
				<table
					className="w-full text-left border-collapse"
					aria-label={t(localizationConstants.dataItSystemAriaAssignmentsTable)}
				>
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
							<th className="px-4 py-3">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColAssigneePhone)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="py-3 pl-4 text-right">
								<span className="sr-only">
									{t(localizationConstants.dataItSystemColActions)}
								</span>
							</th>
						</tr>
					</thead>

					<tbody>
						{assignedUsers.length === 0 ? (
							<tr>
								<td colSpan={5} className="py-8 text-center text-xs text-slate-500">
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
									<td className="px-4 py-3.5 text-slate-600">{user.phone}</td>
									<td className="py-3.5 pl-4 text-right">
										<button
											type="button"
											onClick={() => onRemoveAssignee(user.id)}
											className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
											aria-label={`${t(localizationConstants.dataItSystemAssigneesRemoveBtn)} ${user.name}`}
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SystemCreateAssignmentCard;
