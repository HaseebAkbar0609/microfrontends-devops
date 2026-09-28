"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CompanyAssetItem, EquipmentCategory, AssetStatus } from "../../../types/equipment.types";

interface AddEditAssetModalProps {
	isOpen: boolean;
	onClose: () => void;
	assetToEdit?: CompanyAssetItem | null;
	onSave: (assetData: Omit<CompanyAssetItem, "id" | "history">) => void;
}

const EMPLOYEES_OPTIONS = [
	{ id: "unassigned", name: "Ej tilldelad (I lager)" },
	{ id: "emp_anna_svensson", name: "Anna Svensson" },
	{ id: "emp_erik_lindqvist", name: "Erik Lindqvist" },
	{ id: "emp_maria_karlsson", name: "Maria Karlsson" },
	{ id: "emp_johan_berg", name: "Johan Berg" },
	{ id: "emp_lisa_nilsson", name: "Lisa Nilsson" },
];

export function AddEditAssetModal({
	isOpen,
	onClose,
	assetToEdit,
	onSave,
}: AddEditAssetModalProps) {
	const [name, setName] = useState<string>("");
	const [category, setCategory] = useState<EquipmentCategory>("power_tool");
	const [idNumber, setIdNumber] = useState<string>("");
	const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>("unassigned");
	const [status, setStatus] = useState<AssetStatus>("in_stock");
	const [lastInspectionDate, setLastInspectionDate] = useState<string>("");
	const [nextInspectionDate, setNextInspectionDate] = useState<string>("");
	const [department, setDepartment] = useState<string>("Produktion");
	const [notes, setNotes] = useState<string>("");

	const [errors, setErrors] = useState<{ name?: string; idNumber?: string }>({});

	useEffect(() => {
		if (isOpen) {
			if (assetToEdit) {
				setName(assetToEdit.name);
				setCategory(assetToEdit.category);
				setIdNumber(assetToEdit.idNumber);
				setAssignedEmployeeId(assetToEdit.assignedEmployeeId || "unassigned");
				setStatus(assetToEdit.status);
				setLastInspectionDate(assetToEdit.lastInspectionDate || "");
				setNextInspectionDate(assetToEdit.nextInspectionDate || "");
				setDepartment(assetToEdit.department || "Produktion");
				setNotes(assetToEdit.notes || "");
			} else {
				setName("");
				setCategory("power_tool");
				setIdNumber("");
				setAssignedEmployeeId("unassigned");
				setStatus("in_stock");
				setLastInspectionDate(new Date().toISOString().split("T")[0]);
				setNextInspectionDate("");
				setDepartment("Produktion");
				setNotes("");
			}
			setErrors({});
		}
	}, [isOpen, assetToEdit]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: { name?: string; idNumber?: string } = {};
		if (!name.trim()) newErrors.name = "Namn är obligatoriskt";
		if (!idNumber.trim()) newErrors.idNumber = "ID/Reg.nr är obligatoriskt";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const assignedEmp = EMPLOYEES_OPTIONS.find((emp) => emp.id === assignedEmployeeId);
		const assignedName =
			assignedEmployeeId !== "unassigned" && assignedEmp ? assignedEmp.name : null;

		onSave({
			name: name.trim(),
			category,
			idNumber: idNumber.trim(),
			assignedEmployeeId: assignedEmployeeId === "unassigned" ? null : assignedEmployeeId,
			assignedEmployeeName: assignedName,
			status: assignedName && status === "in_stock" ? "active_in_use" : status,
			lastInspectionDate,
			nextInspectionDate,
			department,
			notes: notes.trim(),
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-xl p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate
							text={
								assetToEdit
									? localizationConstants.modalEditAssetTitle
									: localizationConstants.modalAddAssetTitle
							}
						/>
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
					{/* Name / Model */}
					<div className="space-y-1">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.fieldAssetName} /> *
						</label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="t.ex. Ford Transit Custom eller Hilti Borrhammare"
							className={`h-9 text-xs bg-slate-50/50 ${errors.name ? "border-rose-500" : ""}`}
						/>
						{errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
					</div>

					{/* Category & ID/Reg.nr */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.fieldAssetCategory} />
							</label>
							<Select
								value={category}
								onValueChange={(val) => setCategory(val as EquipmentCategory)}
							>
								<SelectTrigger className="h-9 text-xs bg-slate-50/50 border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="text-xs">
									<SelectItem value="vehicle" className="text-xs">
										<Translate text={localizationConstants.categoryVehicle} />
									</SelectItem>
									<SelectItem value="it_device" className="text-xs">
										<Translate text={localizationConstants.categoryIT} />
									</SelectItem>
									<SelectItem value="power_tool" className="text-xs">
										<Translate text={localizationConstants.categoryPowerTools} />
									</SelectItem>
									<SelectItem value="safety_gear" className="text-xs">
										<Translate text={localizationConstants.categorySafety} />
									</SelectItem>
									<SelectItem value="clothes" className="text-xs">
										<Translate text={localizationConstants.categoryClothes} />
									</SelectItem>
									<SelectItem value="keys_cards" className="text-xs">
										<Translate text={localizationConstants.categoryKeysCards} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.fieldAssetIdNumber} /> *
							</label>
							<Input
								value={idNumber}
								onChange={(e) => setIdNumber(e.target.value)}
								placeholder="t.ex. HKH455 eller Dator 01"
								className={`h-9 text-xs bg-slate-50/50 ${errors.idNumber ? "border-rose-500" : ""}`}
							/>
							{errors.idNumber && (
								<p className="text-[11px] text-rose-500">{errors.idNumber}</p>
							)}
						</div>
					</div>

					{/* Assigned To & Status */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.fieldAssignedEmployee} />
							</label>
							<Select
								value={assignedEmployeeId}
								onValueChange={setAssignedEmployeeId}
							>
								<SelectTrigger className="h-9 text-xs bg-slate-50/50 border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="text-xs">
									{EMPLOYEES_OPTIONS.map((emp) => (
										<SelectItem key={emp.id} value={emp.id} className="text-xs">
											{emp.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.fieldAssetStatus} />
							</label>
							<Select
								value={status}
								onValueChange={(val) => setStatus(val as AssetStatus)}
							>
								<SelectTrigger className="h-9 text-xs bg-slate-50/50 border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="text-xs">
									<SelectItem value="active_in_use" className="text-xs">
										<Translate text={localizationConstants.statusActiveInUse} />
									</SelectItem>
									<SelectItem value="in_stock" className="text-xs">
										<Translate text={localizationConstants.statusInStock} />
									</SelectItem>
									<SelectItem value="maintenance" className="text-xs">
										<Translate text={localizationConstants.statusMaintenance} />
									</SelectItem>
									<SelectItem value="out_of_service" className="text-xs">
										<Translate text={localizationConstants.statusOutOfService} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Inspection Dates */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.fieldLastInspectionDate} />
							</label>
							<Input
								type="date"
								value={lastInspectionDate}
								onChange={(e) => setLastInspectionDate(e.target.value)}
								className="h-9 text-xs bg-slate-50/50 font-mono"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.fieldNextInspectionDate} />
							</label>
							<Input
								type="date"
								value={nextInspectionDate}
								onChange={(e) => setNextInspectionDate(e.target.value)}
								className="h-9 text-xs bg-slate-50/50 font-mono"
							/>
						</div>
					</div>

					{/* Department */}
					<div className="space-y-1">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.fieldAssetDepartment} />
						</label>
						<Select value={department} onValueChange={setDepartment}>
							<SelectTrigger className="h-9 text-xs bg-slate-50/50 border-slate-200">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="text-xs">
								<SelectItem value="Montering" className="text-xs">
									Montering
								</SelectItem>
								<SelectItem value="Produktion" className="text-xs">
									Produktion
								</SelectItem>
								<SelectItem value="Administration" className="text-xs">
									Administration
								</SelectItem>
								<SelectItem value="Fältarbete" className="text-xs">
									Fältarbete
								</SelectItem>
								<SelectItem value="Logistik" className="text-xs">
									Logistik
								</SelectItem>
								<SelectItem value="Lager" className="text-xs">
									Lager
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Notes */}
					<div className="space-y-1">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.fieldAssetNotes} />
						</label>
						<Input
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Anteckningar eller tekniska specifikationer..."
							className="h-9 text-xs bg-slate-50/50"
						/>
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
							type="submit"
							size="sm"
							className="h-8 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white shadow-2xs"
						>
							<Translate text={localizationConstants.btnSaveCard} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
