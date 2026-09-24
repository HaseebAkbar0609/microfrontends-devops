"use client";

import React from "react";
import { UserPlus, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListDetail } from "../../../../types/priceLists.types";

interface PriceListGrundInfoCardProps {
	readonly priceList: PriceListDetail;
	readonly isEditing: boolean;
	readonly editData: {
		code: string;
		name: string;
		date: string;
		createdBy: string;
		comment: string;
	};
	readonly setEditData: React.Dispatch<
		React.SetStateAction<{
			code: string;
			name: string;
			date: string;
			createdBy: string;
			comment: string;
		}>
	>;
	readonly onStartEdit: () => void;
	readonly onCancelEdit: () => void;
	readonly onSave: () => void;
}

export function PriceListGrundInfoCard({
	priceList,
	isEditing,
	editData,
	setEditData,
	onStartEdit,
	onCancelEdit,
	onSave,
}: PriceListGrundInfoCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<UserPlus className="h-5 w-5 text-slate-800 stroke-[1.75]" />
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.priceListDetailGrundInfoSection} />
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
							<Translate text={localizationConstants.priceListSaveButton} />
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
						<Translate text={localizationConstants.priceListEditButton} />
					</Button>
				)}
			</div>

			{/* Body: 4 columns + Comment row */}
			{isEditing ? (
				<div className="space-y-4 text-xs">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-1">
							<label className="font-semibold text-slate-900 block">
								<Translate text={localizationConstants.priceListDetailCodeLabel} />
							</label>
							<Input
								value={editData.code}
								onChange={(e) => setEditData((prev) => ({ ...prev, code: e.target.value }))}
								className="h-9 text-xs"
							/>
						</div>
						<div className="space-y-1">
							<label className="font-semibold text-slate-900 block">
								<Translate text={localizationConstants.priceListDetailNameLabel} />
							</label>
							<Input
								value={editData.name}
								onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
								className="h-9 text-xs"
							/>
						</div>
						<div className="space-y-1">
							<label className="font-semibold text-slate-900 block">
								<Translate text={localizationConstants.priceListDetailDateLabel} />
							</label>
							<Input
								type="date"
								value={editData.date}
								onChange={(e) => setEditData((prev) => ({ ...prev, date: e.target.value }))}
								className="h-9 text-xs"
							/>
						</div>
						<div className="space-y-1">
							<label className="font-semibold text-slate-900 block">
								<Translate text={localizationConstants.priceListDetailCreatedByLabel} />
							</label>
							<Input
								value={editData.createdBy}
								onChange={(e) => setEditData((prev) => ({ ...prev, createdBy: e.target.value }))}
								className="h-9 text-xs"
							/>
						</div>
					</div>
					<div className="space-y-1">
						<label className="font-semibold text-slate-900 block">
							<Translate text={localizationConstants.priceListDetailCommentLabel} />
						</label>
						<Textarea
							value={editData.comment}
							onChange={(e) => setEditData((prev) => ({ ...prev, comment: e.target.value }))}
							rows={2}
							className="text-xs"
						/>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
						<div>
							<span className="font-semibold text-slate-900 block mb-1">
								<Translate text={localizationConstants.priceListDetailCodeLabel} />
							</span>
							<p className="text-slate-500 font-normal">{priceList.code || "info"}</p>
						</div>
						<div>
							<span className="font-semibold text-slate-900 block mb-1">
								<Translate text={localizationConstants.priceListDetailNameLabel} />
							</span>
							<p className="text-slate-500 font-normal">{priceList.name || "info"}</p>
						</div>
						<div>
							<span className="font-semibold text-slate-900 block mb-1">
								<Translate text={localizationConstants.priceListDetailDateLabel} />
							</span>
							<p className="text-slate-500 font-normal">{priceList.date || "info"}</p>
						</div>
						<div>
							<span className="font-semibold text-slate-900 block mb-1">
								<Translate text={localizationConstants.priceListDetailCreatedByLabel} />
							</span>
							<p className="text-slate-500 font-normal">{priceList.createdBy || "info"}</p>
						</div>
					</div>
					<div className="text-xs">
						<span className="font-semibold text-slate-900 block mb-1">
							<Translate text={localizationConstants.priceListDetailCommentLabel} />
						</span>
						<p className="text-slate-500 font-normal">{priceList.comment || "info"}</p>
					</div>
				</div>
			)}
		</div>
	);
}
