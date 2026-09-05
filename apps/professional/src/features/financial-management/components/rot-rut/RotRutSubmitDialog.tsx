"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

interface RotRutSubmitDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	selectedCount: number;
	totalAmount: number;
}

function formatCurrency(amount: number, currency: string, lang = "sv"): string {
	const locale = lang === "sv" ? "sv-SE" : "en-US";
	return `${new Intl.NumberFormat(locale, {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function RotRutSubmitDialog({
	isOpen,
	onClose,
	onConfirm,
	selectedCount,
	totalAmount,
}: RotRutSubmitDialogProps) {
	const { t, i18n } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-2xl">
				<DialogHeader>
					<div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
						<Send className="w-5 h-5" />
					</div>
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.rotRutSubmitConfirmTitle} />
					</DialogTitle>
					<DialogDescription className="text-xs text-slate-600 mt-1.5 leading-relaxed">
						<Translate
							text={
								selectedCount === 1
									? localizationConstants.rotRutSingleSubmitConfirmDesc
									: localizationConstants.rotRutSubmitConfirmDesc
							}
						/>
					</DialogDescription>
				</DialogHeader>

				{/* Summary Box */}
				<div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.rotRutSubmitCountSelected} />:
						</span>
						<span className="font-semibold text-slate-900 font-mono">{selectedCount}</span>
					</div>
					<div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
						<span>
							<Translate text={localizationConstants.rotRutSubmitTotalDeduction} />:
						</span>
						<span className="font-bold text-blue-600 text-sm font-mono">
							{formatCurrency(totalAmount, currency, i18n.language)}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60 mb-2">
					<AlertCircle className="w-4 h-4 shrink-0" />
					<span>
						<Translate text={localizationConstants.rotRutSubmitWarning} />
					</span>
				</div>

				<DialogFooter className="flex justify-end gap-2 mt-2">
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
						type="button"
						size="sm"
						onClick={onConfirm}
						className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer gap-1.5"
					>
						<Send className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.rotRutBtnConfirmSubmit} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
