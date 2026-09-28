"use client";

import React from "react";
import { User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ClothesItem } from "../../../types/equipment.types";

interface ClothesCardProps {
	items: ClothesItem[];
	onEdit: () => void;
}

export function ClothesCard({ items, onEdit }: ClothesCardProps) {
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
							<Translate text={localizationConstants.cardWorkClothesTitle} />
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

				{/* Clothes Items Grid */}
				<div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
					{items.map((item) => (
						<div key={item.id} className="space-y-1">
							<span className="font-semibold text-slate-800 block">{item.label}</span>
							<p className="text-slate-500 font-normal">
								{item.frequency} {item.unit}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
