"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEquipmentItem } from "../../types/dataItOverview.types";
import { dataItRepository } from "../../utils/dataItRepository";

interface DataItAddEquipmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	existingEquipment: DataItEquipmentItem[];
	onAdd: (item: DataItEquipmentItem) => void;
}

export function DataItAddEquipmentDialog({
	open,
	onOpenChange,
	onAdd,
}: DataItAddEquipmentDialogProps) {
	const t = useTranslate();
	const [category, setCategory] = useState("");
	const [type, setType] = useState("");
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [serialNumber, setSerialNumber] = useState("");
	const [monthlyCost, setMonthlyCost] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const resetForm = () => {
		setCategory("");
		setType("");
		setBrand("");
		setModel("");
		setSerialNumber("");
		setMonthlyCost("");
		setErrors({});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: Record<string, string> = {};
		if (!category.trim()) {
			newErrors.category = t(localizationConstants.dataItValidationRequired);
		}
		if (!type.trim()) {
			newErrors.type = t(localizationConstants.dataItValidationRequired);
		}
		if (!brand.trim()) {
			newErrors.brand = t(localizationConstants.dataItValidationRequired);
		}
		if (!model.trim()) {
			newErrors.model = t(localizationConstants.dataItValidationRequired);
		}
		if (!serialNumber.trim()) {
			newErrors.serialNumber = t(localizationConstants.dataItValidationRequired);
		}
		if (!monthlyCost.trim() || isNaN(Number(monthlyCost)) || Number(monthlyCost) < 0) {
			newErrors.monthlyCost = t(localizationConstants.dataItValidationRequired);
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// Calculate collision-free sequential ID across all repository equipment
		const allEquipment = dataItRepository.getAll().flatMap((e) => e.equipment);
		const maxNum = allEquipment.reduce((max, item) => {
			const match = item.id.match(/\d+/);
			return match ? Math.max(max, parseInt(match[0], 10)) : max;
		}, 1000);
		const newId = `EQ-${maxNum + 1}`;

		onAdd({
			id: newId,
			category: category.trim(),
			type: type.trim(),
			brand: brand.trim(),
			model: model.trim(),
			serialNumber: serialNumber.trim(),
			monthlyCost: Number(monthlyCost) || 0,
		});

		resetForm();
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) resetForm();
				onOpenChange(isOpen);
			}}
		>
			<DialogContent className="max-w-md bg-white p-6 shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItAddEquipmentModalTitle)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColEquipmentCategory)} *
							</label>
							<input
								type="text"
								value={category}
								onChange={(e) => {
									setCategory(e.target.value);
									if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
								}}
								className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
									errors.category
										? "border-rose-400 focus:border-rose-500"
										: "border-slate-200 focus:border-slate-400"
								}`}
							/>
							{errors.category && (
								<p className="mt-1 text-xs text-rose-500">{errors.category}</p>
							)}
						</div>
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColEquipmentType)} *
							</label>
							<input
								type="text"
								value={type}
								onChange={(e) => {
									setType(e.target.value);
									if (errors.type) setErrors((prev) => ({ ...prev, type: "" }));
								}}
								className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
									errors.type
										? "border-rose-400 focus:border-rose-500"
										: "border-slate-200 focus:border-slate-400"
								}`}
							/>
							{errors.type && (
								<p className="mt-1 text-xs text-rose-500">{errors.type}</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColEquipmentBrand)} *
							</label>
							<input
								type="text"
								value={brand}
								onChange={(e) => {
									setBrand(e.target.value);
									if (errors.brand) setErrors((prev) => ({ ...prev, brand: "" }));
								}}
								className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
									errors.brand
										? "border-rose-400 focus:border-rose-500"
										: "border-slate-200 focus:border-slate-400"
								}`}
							/>
							{errors.brand && (
								<p className="mt-1 text-xs text-rose-500">{errors.brand}</p>
							)}
						</div>
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColEquipmentModel)} *
							</label>
							<input
								type="text"
								value={model}
								onChange={(e) => {
									setModel(e.target.value);
									if (errors.model) setErrors((prev) => ({ ...prev, model: "" }));
								}}
								className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
									errors.model
										? "border-rose-400 focus:border-rose-500"
										: "border-slate-200 focus:border-slate-400"
								}`}
							/>
							{errors.model && (
								<p className="mt-1 text-xs text-rose-500">{errors.model}</p>
							)}
						</div>
					</div>

					<div>
						<label className="text-xs font-medium text-slate-500">
							{t(localizationConstants.dataItColEquipmentSerial)} *
						</label>
						<input
							type="text"
							value={serialNumber}
							onChange={(e) => {
								setSerialNumber(e.target.value);
								if (errors.serialNumber)
									setErrors((prev) => ({ ...prev, serialNumber: "" }));
							}}
							className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
								errors.serialNumber
									? "border-rose-400 focus:border-rose-500"
									: "border-slate-200 focus:border-slate-400"
							}`}
						/>
						{errors.serialNumber && (
							<p className="mt-1 text-xs text-rose-500">{errors.serialNumber}</p>
						)}
					</div>

					<div>
						<label className="text-xs font-medium text-slate-500">
							{t(localizationConstants.dataItColEquipmentMonthlyCost)} (SEK) *
						</label>
						<input
							type="number"
							min={0}
							value={monthlyCost}
							onChange={(e) => {
								setMonthlyCost(e.target.value);
								if (errors.monthlyCost)
									setErrors((prev) => ({ ...prev, monthlyCost: "" }));
							}}
							className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
								errors.monthlyCost
									? "border-rose-400 focus:border-rose-500"
									: "border-slate-200 focus:border-slate-400"
							}`}
						/>
						{errors.monthlyCost && (
							<p className="mt-1 text-xs text-rose-500">{errors.monthlyCost}</p>
						)}
					</div>

					<DialogFooter className="mt-4 flex justify-end gap-2">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="rounded-md border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
						>
							{t(localizationConstants.dataItBtnCancel)}
						</button>
						<button
							type="submit"
							className="rounded-md bg-slate-950 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
						>
							{t(localizationConstants.dataItAddEquipmentBtn)}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
