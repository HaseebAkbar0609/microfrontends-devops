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
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutItem } from "../../types/rotRut.types";

interface RotRutResubmitDialogProps {
	item: RotRutItem | null;
	isOpen: boolean;
	onClose: () => void;
	onResubmit: (id: string, updatedFields: Partial<RotRutItem>) => void;
}

function formatCurrency(amount: number, currency: string, lang = "sv"): string {
	const locale = lang === "sv" ? "sv-SE" : "en-US";
	return `${new Intl.NumberFormat(locale, {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function RotRutResubmitDialog({
	item,
	isOpen,
	onClose,
	onResubmit,
}: RotRutResubmitDialogProps) {
	const { t, i18n } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);

	const [editablePropertyId, setEditablePropertyId] = useState("");
	const [validationError, setValidationError] = useState<string | null>(null);

	useEffect(() => {
		if (item) {
			setEditablePropertyId(item.propertyId);
			setValidationError(null);
		}
	}, [item]);

	if (!item) return null;

	const handleResubmitSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!editablePropertyId.trim()) {
			setValidationError(t(localizationConstants.rotRutValPropertyIdRequired));
			return;
		}
		onResubmit(item.id, {
			propertyId: editablePropertyId.trim(),
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<div className="flex items-center gap-2">
						<div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
							<RotateCcw className="w-4 h-4" />
						</div>
						<div>
							<DialogTitle className="text-base font-bold text-slate-900">
								<Translate text={localizationConstants.rotRutActionResubmit} />
							</DialogTitle>
							<p className="text-xs text-slate-500 font-mono mt-0.5">
								{item.invoiceNo} — {item.customerName}
							</p>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleResubmitSubmit} className="space-y-4 py-3 text-xs text-slate-700">
					{/* Rejection Reason Alert */}
					{item.rejectionReason && (
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

					{/* Property ID Correction Input */}
					<div className="space-y-1.5">
						<label className="text-slate-700 font-medium text-xs block">
							<Translate text={localizationConstants.rotRutResubmitPropertyHelp} />:
						</label>
						<Input
							type="text"
							value={editablePropertyId}
							onChange={(e) => {
								setEditablePropertyId(e.target.value);
								if (validationError) setValidationError(null);
							}}
							className="h-9 text-xs bg-white border-slate-200"
						/>
						{validationError && (
							<p className="text-[11px] text-rose-600 font-medium">{validationError}</p>
						)}
					</div>

					{/* Deduction Amount Summary */}
					<div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between items-center text-xs">
						<span className="text-slate-600">
							<Translate text={localizationConstants.rotRutColDeduction} />:
						</span>
						<span className="font-bold text-blue-600 font-mono">
							{formatCurrency(item.deductionAmount, currency, i18n.language)}
						</span>
					</div>

					<DialogFooter className="border-t border-slate-100 pt-3 flex justify-end gap-2">
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
							className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer font-semibold"
						>
							<RotateCcw className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.rotRutActionResubmit} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
