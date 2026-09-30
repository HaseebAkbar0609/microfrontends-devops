"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ReviewFollowupAction } from "@/features/personnel/types/medarbetarsamtal.types";

interface Section6FollowupsProps {
	followups: ReviewFollowupAction[];
	onFollowupsChange: (items: ReviewFollowupAction[]) => void;
	nextCheckInDate: string;
	onNextCheckInDateChange: (val: string) => void;
}

export function Section6Followups({
	followups,
	onFollowupsChange,
	nextCheckInDate,
	onNextCheckInDateChange,
}: Section6FollowupsProps) {
	const [newTitle, setNewTitle] = useState("");

	const handleAdd = () => {
		if (!newTitle.trim()) return;
		const newItem: ReviewFollowupAction = {
			id: `fol_${Date.now()}`,
			title: newTitle.trim(),
		};
		onFollowupsChange([...followups, newItem]);
		setNewTitle("");
	};

	const handleDelete = (id: string) => {
		onFollowupsChange(followups.filter((f) => f.id !== id));
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label className="text-xs font-semibold text-slate-700 block">
					<Translate text={localizationConstants.nyIncheckningFollowupsLabel} />
				</Label>

				<div className="flex items-center gap-2">
					<Input
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						placeholder="Ny åtgärd eller uppföljningspunkt..."
						className="h-9 text-xs flex-1"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAdd();
							}
						}}
					/>
					<Button
						type="button"
						onClick={handleAdd}
						size="sm"
						className="h-9 px-3 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shrink-0 gap-1"
					>
						<Plus className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.nyIncheckningAddActionBtn} />
					</Button>
				</div>

				{followups.length > 0 && (
					<ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
						{followups.map((item) => (
							<li
								key={item.id}
								className="flex items-center justify-between px-3 py-2 text-xs text-slate-700"
							>
								<span>{item.title}</span>
								<button
									type="button"
									onClick={() => handleDelete(item.id)}
									className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="space-y-1.5 pt-2">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningScheduleNextLabel}
					/>
				</Label>
				<Input
					type="date"
					value={nextCheckInDate}
					onChange={(e) => onNextCheckInDateChange(e.target.value)}
					className="h-9 text-xs max-w-xs"
				/>
			</div>
		</div>
	);
}
