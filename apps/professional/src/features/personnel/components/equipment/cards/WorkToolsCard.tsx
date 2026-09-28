"use client";

import React from "react";
import { User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { WorkToolItem } from "../../../types/equipment.types";

interface WorkToolsCardProps {
	items: WorkToolItem[];
	onEdit: () => void;
}

export function WorkToolsCard({ items, onEdit }: WorkToolsCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300">
			<div>
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b border-slate-100">
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
							<User className="w-4 h-4" />
						</div>
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.cardWorkToolsTitle} />
						</h3>
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onEdit}
						className="h-8 px-3 text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs gap-1.5 cursor-pointer"
					>
						<Pencil className="w-3.5 h-3.5 text-slate-500" />
						<Translate text={localizationConstants.btnEditCard} />
					</Button>
				</div>

				{/* Table */}
				<div className="pt-4 overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="text-slate-800 font-semibold border-b border-transparent">
								<th className="pb-2.5 pr-4 font-semibold">
									<Translate text={localizationConstants.colObject} />
								</th>
								<th className="pb-2.5 px-4 font-semibold">
									<Translate text={localizationConstants.colDesignation} />
								</th>
								<th className="pb-2.5 pl-4 font-semibold">
									<Translate text={localizationConstants.colMarkingId} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-transparent">
							{items.length === 0 ? (
								<tr>
									<td colSpan={3} className="py-4 text-center text-slate-400">
										<Translate text={localizationConstants.noAssetsFound} />
									</td>
								</tr>
							) : (
								items.map((item) => (
									<tr key={item.id} className="text-slate-500">
										<td className="py-2 pr-4 font-normal text-slate-500 whitespace-nowrap">
											{item.object}
										</td>
										<td className="py-2 px-4 font-normal text-slate-500 whitespace-nowrap">
											{item.designation}
										</td>
										<td className="py-2 pl-4 font-normal text-slate-500 whitespace-nowrap">
											{item.markingId}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
