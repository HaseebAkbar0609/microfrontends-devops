"use client";

import React from "react";
import { UserPlus, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CostCenterItem } from "../../../../types/costCenters.types";

interface CostCenterDetailInfoCardProps {
	readonly costCenter: CostCenterItem;
	readonly isEditing: boolean;
	readonly editData: {
		kod: string;
		benamning: string;
		anteckningar: string;
	};
	readonly setEditData: React.Dispatch<
		React.SetStateAction<{
			kod: string;
			benamning: string;
			anteckningar: string;
		}>
	>;
	readonly onStartEdit: () => void;
	readonly onCancelEdit: () => void;
	readonly onSave: () => void;
}

export function CostCenterDetailInfoCard({
	costCenter,
	isEditing,
	editData,
	setEditData,
	onStartEdit,
	onCancelEdit,
	onSave,
}: CostCenterDetailInfoCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Card Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<UserPlus className="h-5 w-5 text-slate-800 stroke-[1.75]" />
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.grundInformationSection} />
					</h3>
				</div>
				{isEditing ? (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={onCancelEdit}
							className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
						>
							<X className="h-3.5 w-3.5 mr-1" />
							<Translate text={localizationConstants.cancelButton} />
						</Button>
						<Button
							size="sm"
							onClick={onSave}
							className="h-8 px-3 text-xs bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
						>
							<Check className="h-3.5 w-3.5 mr-1" />
							<Translate text={localizationConstants.saveButton} />
						</Button>
					</div>
				) : (
					<Button
						size="sm"
						variant="outline"
						onClick={onStartEdit}
						className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer rounded-md"
					>
						<Edit2 className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.editLabel} />
					</Button>
				)}
			</div>

			{/* Body: 3 Columns matching Figma Image 3 */}
			{isEditing ? (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-900 uppercase block">
							<Translate text={localizationConstants.costCenterCodeHeader} />
						</label>
						<Input
							value={editData.kod}
							onChange={(e) => setEditData((prev) => ({ ...prev, kod: e.target.value }))}
							className="h-9 text-xs"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-900 block">
							<Translate text={localizationConstants.costCenterNameHeader} />
						</label>
						<Input
							value={editData.benamning}
							onChange={(e) =>
								setEditData((prev) => ({ ...prev, benamning: e.target.value }))
							}
							className="h-9 text-xs"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-900 block">
							<Translate text={localizationConstants.costCenterNotesHeader} />
						</label>
						<Input
							value={editData.anteckningar}
							onChange={(e) =>
								setEditData((prev) => ({ ...prev, anteckningar: e.target.value }))
							}
							className="h-9 text-xs"
						/>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
					<div>
						<span className="font-semibold text-slate-900 uppercase block mb-1">
							<Translate text={localizationConstants.costCenterCodeHeader} />
						</span>
						<p className="text-slate-500 font-normal">{costCenter.kod || "info"}</p>
					</div>
					<div>
						<span className="font-semibold text-slate-900 block mb-1">
							<Translate text={localizationConstants.costCenterNameHeader} />
						</span>
						<p className="text-slate-500 font-normal">{costCenter.benamning || "info"}</p>
					</div>
					<div>
						<span className="font-semibold text-slate-900 block mb-1">
							<Translate text={localizationConstants.costCenterNotesHeader} />
						</span>
						<p className="text-slate-500 font-normal">
							{costCenter.anteckningar || "info"}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
