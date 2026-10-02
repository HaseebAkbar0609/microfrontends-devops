"use client";

import React from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProcessChecklistItem } from "@/features/personnel/types/personalProcess.types";
import { cn } from "@/lib/utils";

interface ProcessChecklistCardProps {
	checklist: ProcessChecklistItem[];
	onToggleItem: (id: string) => void;
	onUpdateTitle: (id: string, newTitle: string) => void;
	onAddRow: () => void;
	onDeleteRow: (id: string) => void;
}

export function ProcessChecklistCard({
	checklist,
	onToggleItem,
	onUpdateTitle,
	onAddRow,
	onDeleteRow,
}: ProcessChecklistCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
			<h3 className="text-xs font-bold text-slate-900">
				<Translate text={localizationConstants.processSectionChecklist} />
			</h3>

			<div className="space-y-2">
				{checklist.map((item) => (
					<div
						key={item.id}
						className={cn(
							"flex items-center justify-between p-2.5 rounded-lg border transition-colors group",
							item.isCompleted
								? "bg-slate-50/70 border-slate-200"
								: "bg-white border-slate-200 hover:border-slate-300"
						)}
					>
						<div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
							{/* Checkbox circle button */}
							<button
								type="button"
								onClick={() => onToggleItem(item.id)}
								className={cn(
									"w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0",
									item.isCompleted
										? "bg-slate-900 text-white"
										: "border border-slate-300 bg-white hover:border-slate-500"
								)}
							>
								{item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
							</button>

							{/* Title or Inline Input */}
							{item.title ? (
								<span
									onClick={() => onToggleItem(item.id)}
									className={cn(
										"text-xs font-medium cursor-pointer select-none truncate",
										item.isCompleted ? "text-slate-800" : "text-slate-700"
									)}
								>
									{item.title}
								</span>
							) : (
								<Input
									autoFocus
									placeholder={localizationConstants.processChecklistPlaceholder}
									value={item.title}
									onChange={(e) => onUpdateTitle(item.id, e.target.value)}
									className="h-7 text-xs border-0 border-b border-dashed border-slate-300 focus-visible:ring-0 px-1 rounded-none"
								/>
							)}
						</div>

						<div className="flex items-center gap-2 shrink-0">
							{item.completedDate && (
								<span className="text-[11px] font-mono text-slate-400">
									{item.completedDate}
								</span>
							)}
							<button
								type="button"
								onClick={() => onDeleteRow(item.id)}
								className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer p-1"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Add Row Button */}
			<div className="pt-1">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onAddRow}
					className="w-full h-8 text-xs font-medium border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer gap-1.5"
				>
					<Plus className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.processBtnAddRow} />
				</Button>
			</div>
		</div>
	);
}
