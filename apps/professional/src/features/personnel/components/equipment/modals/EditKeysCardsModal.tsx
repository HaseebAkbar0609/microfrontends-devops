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
import { KeyCardItem } from "../../../types/equipment.types";

interface EditKeysCardsModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialItems: KeyCardItem[];
	onSave: (items: KeyCardItem[]) => void;
}

export function EditKeysCardsModal({
	isOpen,
	onClose,
	initialItems,
	onSave,
}: EditKeysCardsModalProps) {
	const [items, setItems] = useState<KeyCardItem[]>([]);

	useEffect(() => {
		if (isOpen) {
			setItems(initialItems.map((item) => ({ ...item })));
		}
	}, [isOpen, initialItems]);

	const handleAddRow = () => {
		const newRow: KeyCardItem = {
			id: `kc_${Date.now()}_${items.length + 1}`,
			object: "",
			designation: "",
			markingId: "",
		};
		setItems((prev) => [...prev, newRow]);
	};

	const handleRemoveRow = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleChange = (id: string, field: keyof KeyCardItem, value: string) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const handleSave = () => {
		const validItems = items.filter(
			(item) => item.object.trim() || item.designation.trim() || item.markingId.trim()
		);
		onSave(validItems);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-xl p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditKeysCardsTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-1">
					<div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600 px-1">
						<div className="col-span-4">
							<Translate text={localizationConstants.colObject} />
						</div>
						<div className="col-span-4">
							<Translate text={localizationConstants.colDesignation} />
						</div>
						<div className="col-span-3">
							<Translate text={localizationConstants.colMarkingId} />
						</div>
						<div className="col-span-1" />
					</div>

					{items.map((item) => (
						<div key={item.id} className="grid grid-cols-12 gap-2 items-center">
							<div className="col-span-4">
								<Input
									value={item.object}
									onChange={(e) => handleChange(item.id, "object", e.target.value)}
									placeholder="t.ex. Mastercard"
									className="h-8 text-xs bg-slate-50/50"
								/>
							</div>
							<div className="col-span-4">
								<Input
									value={item.designation}
									onChange={(e) => handleChange(item.id, "designation", e.target.value)}
									placeholder="t.ex. Inköp"
									className="h-8 text-xs bg-slate-50/50"
								/>
							</div>
							<div className="col-span-3">
								<Input
									value={item.markingId}
									onChange={(e) => handleChange(item.id, "markingId", e.target.value)}
									placeholder="t.ex. 44665952"
									className="h-8 text-xs bg-slate-50/50"
								/>
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
