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
import { VehicleItem } from "../../../types/equipment.types";

interface EditVehicleModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialItems: VehicleItem[];
	onSave: (items: VehicleItem[]) => void;
}

export function EditVehicleModal({
	isOpen,
	onClose,
	initialItems,
	onSave,
}: EditVehicleModalProps) {
	const [items, setItems] = useState<VehicleItem[]>([]);

	useEffect(() => {
		if (isOpen) {
			setItems(
				initialItems.length > 0
					? initialItems.map((item) => ({ ...item }))
					: [
							{
								id: `veh_${Date.now()}`,
								vehicle: "",
								regNo: "",
								status: "active_in_use",
							},
						]
			);
		}
	}, [isOpen, initialItems]);

	const handleAddVehicle = () => {
		const newRow: VehicleItem = {
			id: `veh_${Date.now()}_${items.length + 1}`,
			vehicle: "",
			regNo: "",
			status: "active_in_use",
		};
		setItems((prev) => [...prev, newRow]);
	};

	const handleRemoveRow = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleChange = (id: string, field: keyof VehicleItem, value: string) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const handleSave = () => {
		const validItems = items.filter(
			(item) => item.vehicle.trim() || item.regNo.trim()
		);
		onSave(validItems);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditVehicleTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
					{items.map((item, index) => (
						<div
							key={item.id}
							className="p-4 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50 relative"
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-semibold text-slate-800">
									Fordon #{index + 1}
								</span>
								{items.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveRow(item.id)}
										className="h-6 w-6 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								)}
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<label className="text-xs font-medium text-slate-600">
										<Translate text={localizationConstants.colVehicle} />
									</label>
									<Input
										value={item.vehicle}
										onChange={(e) => handleChange(item.id, "vehicle", e.target.value)}
										placeholder="t.ex. Volkswagen Caddy"
										className="h-8 text-xs bg-white"
									/>
								</div>

								<div className="space-y-1">
									<label className="text-xs font-medium text-slate-600">
										<Translate text={localizationConstants.colRegNo} />
									</label>
									<Input
										value={item.regNo}
										onChange={(e) => handleChange(item.id, "regNo", e.target.value)}
										placeholder="t.ex. HKH455"
										className="h-8 text-xs font-mono bg-white uppercase"
									/>
								</div>
							</div>
						</div>
					))}

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleAddVehicle}
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
