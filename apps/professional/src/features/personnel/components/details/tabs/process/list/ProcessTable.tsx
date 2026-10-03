"use client";

import React from "react";
import { ProcessTableHeader } from "./ProcessTableHeader";
import { ProcessTableRow } from "./ProcessTableRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PersonalProcessItem } from "@/features/personnel/types/personalProcess.types";

interface ProcessTableProps {
	processes: PersonalProcessItem[];
	onView: (proc: PersonalProcessItem) => void;
	onEdit: (proc: PersonalProcessItem) => void;
	onDelete: (proc: PersonalProcessItem) => void;
}

export function ProcessTable({
	processes,
	onView,
	onEdit,
	onDelete,
}: ProcessTableProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<ProcessTableHeader />
					<tbody className="divide-y divide-slate-100">
						{processes.map((proc) => (
							<ProcessTableRow
								key={proc.id}
								process={proc}
								onView={onView}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						))}

						{processes.length === 0 && (
							<tr>
								<td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
									<p className="font-semibold text-slate-700 mb-1">
										<Translate text={localizationConstants.processEmptyTitle} />
									</p>
									<p className="text-slate-400">
										<Translate text={localizationConstants.processEmptyDesc} />
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
