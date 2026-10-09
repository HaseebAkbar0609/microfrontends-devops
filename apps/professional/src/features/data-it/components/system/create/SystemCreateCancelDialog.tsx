"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SystemCreateCancelDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const SystemCreateCancelDialog: React.FC<
	SystemCreateCancelDialogProps
> = ({ isOpen, onClose, onConfirm }) => {
	const t = useTranslate();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
				<div className="flex items-start gap-3.5">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
						<AlertCircle className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-base font-semibold text-slate-900">
							{t(localizationConstants.dataItSystemCreateConfirmCancelTitle)}
						</h3>
						<p className="mt-1.5 text-xs text-slate-500">
							{t(localizationConstants.dataItSystemCreateConfirmCancelDesc)}
						</p>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
					>
						{t(localizationConstants.dataItSystemBtnCancel)}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
					>
						{t(localizationConstants.dataItSystemBtnDiscardConfirm)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SystemCreateCancelDialog;
