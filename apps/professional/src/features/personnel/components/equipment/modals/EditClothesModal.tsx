"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ClothesItem } from "../../../types/equipment.types";

interface EditClothesModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialItems: ClothesItem[];
	onSave: (items: ClothesItem[]) => void;
}

export function EditClothesModal({
	isOpen,
	onClose,
	initialItems,
	onSave,
}: EditClothesModalProps) {
	const [items, setItems] = useState<ClothesItem[]>([]);

	useEffect(() => {
		if (isOpen) {
			setItems(initialItems.map((item) => ({ ...item })));
		}
	}, [isOpen, initialItems]);

	const handleAddRow = () => {
		const newRow: ClothesItem = {
			id: `cl_${Date.now()}_${items.length + 1}`,
			type: "other",
			label: "",
			frequency: 1,
			unit: "ggr / år",
		};
		setItems((prev) => [...prev, newRow]);
	};

	const handleRemoveRow = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleChange = (id: string, field: keyof ClothesItem, value: string | number) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const handleSave = () => {
		const validItems = items.filter((item) => item.label.trim());
		onSave(validItems);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditClothesTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-1">
					<div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600 px-1">
						<div className="col-span-6">Plagg / Utrustning</div>
						<div className="col-span-5">Frekvens (ggr / år)</div>
						<div className="col-span-1" />
					</div>

					{items.map((item) => (
						<div key={item.id} className="grid grid-cols-12 gap-2 items-center">
							<div className="col-span-6">
								<Input
									value={item.label}
									onChange={(e) => handleChange(item.id, "label", e.target.value)}
									placeholder="t.ex. Skor"
									className="h-8 text-xs bg-slate-50/50"
								/>
							</div>
							<div className="col-span-5 flex items-center gap-1.5">
								<Input
									type="number"
									min={1}
									max={50}
									value={item.frequency}
									onChange={(e) =>
										handleChange(item.id, "frequency", parseInt(e.target.value, 10) || 1)
									}
									className="h-8 text-xs bg-slate-50/50 w-16"
								/>
								<span className="text-xs text-slate-500 whitespace-nowrap">ggr / år</span>
							</div>
							<div className="col-span-1 flex justify-center">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveRow(item.id)}
									className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</Button>
							</div>
						</div>
					))}

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleAddRow}
						className="h-8 px-3 text-xs font-medium border-dashed border-slate-300 hover:bg-slate-50 text-slate-700 w-full mt-2 gap-1.5"
					>
						<Plus className="w-3.5 h-3.5 text-slate-500" />
						<Translate text={localizationConstants.btnAddCardItem} />
					</Button>
				</div>

				<DialogFooter className="pt-3 border-t border-slate-100 flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						className="h-8 px-4 text-xs"
					>
						<Translate text={localizationConstants.btnCancelCard} />
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleSave}
						className="h-8 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white shadow-2xs"
					>
						<Translate text={localizationConstants.btnSaveCard} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
