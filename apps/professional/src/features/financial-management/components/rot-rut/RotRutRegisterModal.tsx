"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RegisterRotRutFormData, RotRutType } from "../../types/rotRut.types";
import {
	ROT_RUT_ANNUAL_LIMIT,
	ROT_RUT_DEDUCTION_RATE,
} from "../../constants/rotRut.constants";
import { invoiceRepository } from "../../utils/invoiceRepository";
import { InvoiceItem } from "../../types/invoice.types";

interface RotRutRegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onRegister: (formData: RegisterRotRutFormData) => void;
}

function formatSEK(amount: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount) + " kr";
}

export function RotRutRegisterModal({
	isOpen,
	onClose,
	onRegister,
}: RotRutRegisterModalProps) {
	const { t } = useTranslation();
	const availableInvoices: InvoiceItem[] = useMemo(() => {
		try {
			return invoiceRepository.getInvoices();
		} catch {
			return [];
		}
	}, []);

	const [invoiceId, setInvoiceId] = useState("");
	const [customerName, setCustomerName] = useState("");
	const [personalId, setPersonalId] = useState("");
	const [type, setType] = useState<RotRutType>("rot");
	const [propertyId, setPropertyId] = useState("");
	const [apartmentNo, setApartmentNo] = useState("");
	const [brfOrgNr, setBrfOrgNr] = useState("");
	const [laborCost, setLaborCost] = useState<number | "">("");
	const [materialCost, setMaterialCost] = useState<number | "">("");
	const [description, setDescription] = useState("");

	const [errors, setErrors] = useState<Record<string, string>>({});

	// When an invoice is selected, prefill customer info
	const handleInvoiceSelect = (invId: string) => {
		setInvoiceId(invId);
		const inv = availableInvoices.find((i: InvoiceItem) => i.id === invId);
		if (inv) {
			setCustomerName(inv.customer);
		}
	};

	const numericLabor = typeof laborCost === "number" ? laborCost : 0;
	const numericMaterial = typeof materialCost === "number" ? materialCost : 0;
	const calculatedDeduction = Math.round(numericLabor * ROT_RUT_DEDUCTION_RATE);

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (!invoiceId) newErrors.invoiceId = t(localizationConstants.rotRutValInvoiceRequired);
		if (!customerName.trim()) newErrors.customerName = `${t(localizationConstants.rotRutRegisterCustomerName)} *`;
		if (!personalId.trim() || personalId.replace(/\D/g, "").length < 10) {
			newErrors.personalId = t(localizationConstants.rotRutValPersonalIdRequired);
		}
		if (type === "rot" && !propertyId.trim()) {
			newErrors.propertyId = t(localizationConstants.rotRutValPropertyIdRequired);
		}
		if (numericLabor <= 0) {
			newErrors.laborCost = t(localizationConstants.rotRutValLaborCostRequired);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		onRegister({
			invoiceId,
			customerName,
			customerPersonalId: personalId,
			type,
			propertyId: type === "rot" ? propertyId : propertyId || "Bostadsadress",
			apartmentNo: apartmentNo || undefined,
			brfOrgNr: brfOrgNr || undefined,
			laborCost: numericLabor,
			materialCost: numericMaterial,
			description: description || "Utförda tjänster enligt avtal",
		});

		// Reset form
		setInvoiceId("");
		setCustomerName("");
		setPersonalId("");
		setPropertyId("");
		setApartmentNo("");
		setBrfOrgNr("");
		setLaborCost("");
		setMaterialCost("");
		setDescription("");
		setErrors({});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg bg-white p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.rotRutRegisterTitle} />
					</DialogTitle>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.rotRutRegisterSubtitle} />
					</p>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-3 py-3 text-xs text-slate-700">
					{/* Invoice Selection */}
					<div>
						<label className="block text-slate-600 font-medium mb-1">
							<Translate text={localizationConstants.rotRutRegisterSelectInvoice} /> *
						</label>
						<Select value={invoiceId} onValueChange={handleInvoiceSelect}>
							<SelectTrigger className="w-full h-8 text-xs bg-slate-50 border-slate-200">
								<SelectValue placeholder={t(localizationConstants.rotRutRegisterSelectInvoicePlaceholder)} />
							</SelectTrigger>
							<SelectContent>
								{availableInvoices.map((inv: InvoiceItem) => (
									<SelectItem key={inv.id} value={inv.id}>
										{inv.invoiceNo} - {inv.customer} ({formatSEK(inv.total)})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.invoiceId && (
							<span className="text-[11px] text-rose-600">{errors.invoiceId}</span>
						)}
					</div>

					{/* Customer Name & Personal ID */}
					<div className="grid grid-cols-2 gap-2">
						<div>
							<label className="block text-slate-600 font-medium mb-1">
								<Translate text={localizationConstants.rotRutRegisterCustomerName} /> *
							</label>
							<Input
								type="text"
								value={customerName}
								onChange={(e) => setCustomerName(e.target.value)}
								placeholder="Anna Lindberg"
								className="h-8 text-xs bg-slate-50 border-slate-200"
							/>
							{errors.customerName && (
								<span className="text-[11px] text-rose-600">{errors.customerName}</span>
							)}
						</div>
						<div>
							<label className="block text-slate-600 font-medium mb-1">
								<Translate text={localizationConstants.rotRutRegisterPersonalId} /> *
							</label>
							<Input
								type="text"
								value={personalId}
								onChange={(e) => setPersonalId(e.target.value)}
								placeholder="19850412-3829"
								className="h-8 text-xs bg-slate-50 border-slate-200"
							/>
							{errors.personalId && (
								<span className="text-[11px] text-rose-600">{errors.personalId}</span>
							)}
						</div>
					</div>

					{/* Deduction Type Tabs */}
					<div>
						<label className="block text-slate-600 font-medium mb-1">
							<Translate text={localizationConstants.rotRutRegisterType} /> *
						</label>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => setType("rot")}
								className={`py-1.5 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
									type === "rot"
										? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
										: "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
								}`}
							>
								ROT
							</button>
							<button
								type="button"
								onClick={() => setType("rut")}
								className={`py-1.5 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
									type === "rut"
										? "bg-violet-50 border-violet-300 text-violet-700 shadow-2xs"
										: "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
								}`}
							>
								RUT
							</button>
						</div>
					</div>

					{/* Property ID / Fastighetsbeteckning */}
					<div>
						<label className="block text-slate-600 font-medium mb-1">
							<Translate text={localizationConstants.rotRutRegisterPropertyId} />{" "}
							{type === "rot" && "*"}
						</label>
						<Input
							type="text"
							value={propertyId}
							onChange={(e) => setPropertyId(e.target.value)}
							placeholder={type === "rot" ? "Stockholm Vasastaden 1:42" : "Gatuadress"}
							className="h-8 text-xs bg-slate-50 border-slate-200"
						/>
						{errors.propertyId && (
							<span className="text-[11px] text-rose-600">{errors.propertyId}</span>
						)}
					</div>

					{/* Optional Tenant-Owner Flat Details */}
					<div className="grid grid-cols-2 gap-2">
						<div>
							<label className="block text-slate-600 font-medium mb-1">
								<Translate text={localizationConstants.rotRutRegisterApartment} />
							</label>
							<Input
								type="text"
								value={apartmentNo}
								onChange={(e) => setApartmentNo(e.target.value)}
								placeholder="1201"
								className="h-8 text-xs bg-slate-50 border-slate-200"
							/>
						</div>
						<div>
							<label className="block text-slate-600 font-medium mb-1">
								<Translate text={localizationConstants.rotRutRegisterBrfOrgNr} />
							</label>
							<Input
								type="text"
								value={brfOrgNr}
								onChange={(e) => setBrfOrgNr(e.target.value)}
								placeholder="769600-1234"
								className="h-8 text-xs bg-slate-50 border-slate-200"
							/>
						</div>
					</div>

					{/* Labor and Material Costs */}
					<div className="grid grid-cols-2 gap-2">
						<div>
							<label className="block text-slate-600 font-medium mb-1">
								<Translate text={localizationConstants.rotRutRegisterLaborCost} /> *
							</label>
							<Input
								type="number"
								value={laborCost}
								onChange={(e) => setLaborCost(e.target.value === "" ? "" : Number(e.target.value))}
								placeholder="0"
								className="h-8 text-xs bg-slate-50 border-slate-200 font-mono"
							/>
							{errors.laborCost && (
								<span className="text-[11px] text-rose-600">{errors.laborCost}</span>
							)}
						</div>
						<div>
							<label className="block text-slate-600 font-medium mb-1">
								<Translate text={localizationConstants.rotRutRegisterMaterialCost} />
							</label>
							<Input
								type="number"
								value={materialCost}
								onChange={(e) => setMaterialCost(e.target.value === "" ? "" : Number(e.target.value))}
								placeholder="0"
								className="h-8 text-xs bg-slate-50 border-slate-200 font-mono"
							/>
						</div>
					</div>

					{/* Description */}
					<div>
						<label className="block text-slate-600 font-medium mb-1">
							<Translate text={localizationConstants.rotRutRegisterDescription} />
						</label>
						<Input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="T.ex. Målning av sovrum och hall"
							className="h-8 text-xs bg-slate-50 border-slate-200"
						/>
					</div>

					{/* Live Calculation Preview */}
					<div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-xs">
						<div className="flex justify-between text-blue-900 font-bold">
							<span>
								<Translate text={localizationConstants.rotRutRegisterCalculatedDeduction} />:
							</span>
							<span className="font-mono text-sm">{formatSEK(calculatedDeduction)}</span>
						</div>
						<div className="flex justify-between text-[11px] text-blue-700 pt-1 border-t border-blue-200/60">
							<span>
								<Translate text={localizationConstants.rotRutAnnualLimitLabel} />:
							</span>
							<span className="font-mono">{formatSEK(ROT_RUT_ANNUAL_LIMIT)}</span>
						</div>
					</div>

					<DialogFooter className="pt-2 border-t border-slate-100 flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="h-8 text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.rotRutBtnCancel} />
						</Button>
						<Button
							type="submit"
							size="sm"
							className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
						>
							<Translate text={localizationConstants.rotRutBtnSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
