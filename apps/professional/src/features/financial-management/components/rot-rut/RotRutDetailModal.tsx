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
import { RotateCcw, AlertTriangle, Building2, User, Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutItem } from "../../types/rotRut.types";

interface RotRutDetailModalProps {
	item: RotRutItem | null;
	isOpen: boolean;
	onClose: () => void;
	onResubmit: (id: string, updatedFields: Partial<RotRutItem>) => void;
}

function formatCurrency(amount: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function RotRutDetailModal({
	item,
	isOpen,
	onClose,
	onResubmit,
}: RotRutDetailModalProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);
	const [editablePropertyId, setEditablePropertyId] = useState("");
	const [editableLaborCost, setEditableLaborCost] = useState<number>(0);

	useEffect(() => {
		if (item) {
			setEditablePropertyId(item.propertyId);
			setEditableLaborCost(item.laborCost);
		}
	}, [item]);

	if (!item) return null;

	const handleResubmitSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onResubmit(item.id, {
			propertyId: editablePropertyId,
			laborCost: Number(editableLaborCost),
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg bg-white p-6 rounded-2xl shadow-xl">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.rotRutDetailTitle} />
						</DialogTitle>
						<span
							className={`px-2 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
								item.type === "rot"
									? "bg-indigo-50 text-indigo-700 border border-indigo-200"
									: "bg-violet-50 text-violet-700 border border-violet-200"
							}`}
						>
							{item.type.toUpperCase()}
						</span>
					</div>
					<p className="text-xs text-slate-500 font-mono mt-0.5">
						<Translate text={localizationConstants.invoice} />: {item.invoiceNo}
					</p>
				</DialogHeader>

				<div className="space-y-4 py-3 text-xs text-slate-700">
					{/* Rejection Alert if Rejected */}
					{item.status === "rejected" && item.rejectionReason && (
						<div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800">
							<AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
							<div>
								<span className="font-semibold block">
									<Translate text={localizationConstants.rotRutDetailRejectionReason} />:
								</span>
								<p className="text-xs text-rose-700 mt-0.5">{item.rejectionReason}</p>
							</div>
						</div>
					)}

					{/* Customer Info Section */}
					<div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-2">
						<div className="flex items-center gap-1.5 font-semibold text-slate-900">
							<User className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.rotRutDetailCustomerInfo} />
						</div>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<span className="text-slate-500 block text-[11px]">
									<Translate text={localizationConstants.rotRutColCustomer} />:
								</span>
								<span className="font-medium text-slate-800">{item.customerName}</span>
							</div>
							<div>
								<span className="text-slate-500 block text-[11px]">
									<Translate text={localizationConstants.rotRutColPersonalId} />:
								</span>
								<span className="font-mono text-slate-800">{item.customerPersonalIdMasked}</span>
							</div>
						</div>
					</div>

					{/* Property Info Section */}
					<div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-2">
						<div className="flex items-center gap-1.5 font-semibold text-slate-900">
							<Building2 className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.rotRutDetailPropertyInfo} />
						</div>
						{item.status === "rejected" ? (
							<div className="space-y-1">
								<label className="text-slate-500 text-[11px] block">
									<Translate text={localizationConstants.rotRutResubmitPropertyHelp} />:
								</label>
								<Input
									type="text"
									value={editablePropertyId}
									onChange={(e) => setEditablePropertyId(e.target.value)}
									className="h-8 text-xs bg-white border-slate-200"
								/>
							</div>
						) : (
							<div className="grid grid-cols-2 gap-2 text-xs">
								<div>
									<span className="text-slate-500 block text-[11px]">
										<Translate text={localizationConstants.rotRutColPropertyId} />:
									</span>
									<span className="font-medium text-slate-800">{item.propertyId}</span>
								</div>
								{item.apartmentNo && (
									<div>
										<span className="text-slate-500 block text-[11px]">
											<Translate text={localizationConstants.rotRutDetailApartmentNo} />:
										</span>
										<span className="font-medium text-slate-800">{item.apartmentNo}</span>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Cost Calculation Section */}
					<div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-2">
						<div className="flex items-center gap-1.5 font-semibold text-slate-900">
							<Receipt className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.rotRutDetailCostBreakdown} />
						</div>
						<div className="space-y-1.5">
							<div className="flex justify-between">
								<span className="text-slate-500">
									<Translate text={localizationConstants.rotRutColLaborAmount} />:
								</span>
								<span className="font-mono font-medium">{formatCurrency(item.laborCost, currency)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">
									<Translate text={localizationConstants.rotRutDetailMaterialAmount} />:
								</span>
								<span className="font-mono font-medium">{formatCurrency(item.materialCost, currency)}</span>
							</div>
							<div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
								<span>
									<Translate text={localizationConstants.rotRutColDeduction} /> (30 %):
								</span>
								<span className="font-mono text-blue-600">-{formatCurrency(item.deductionAmount, currency)}</span>
							</div>
						</div>
					</div>

					{/* Skatteverket Reference / Status */}
					{item.skatteverketReference && (
						<div className="flex items-center justify-between text-xs px-1 text-slate-500">
							<span>
								<Translate text={localizationConstants.rotRutDetailSkatteverketRef} />:
							</span>
							<span className="font-mono font-semibold text-slate-700">
								{item.skatteverketReference}
							</span>
						</div>
					)}
				</div>

				<DialogFooter className="border-t border-slate-100 pt-3 flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						className="h-8 text-xs border-slate-200 cursor-pointer"
					>
						<Translate text={localizationConstants.rotRutBtnClose} />
					</Button>
					{item.status === "rejected" && (
						<Button
							type="button"
							size="sm"
							onClick={handleResubmitSubmit}
							className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer font-semibold"
						>
							<RotateCcw className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.rotRutActionResubmit} />
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
