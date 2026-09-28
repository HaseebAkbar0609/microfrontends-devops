"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, X } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { CompanyAssetItem } from "../../../types/equipment.types";

interface DeleteAssetDialogProps {
	isOpen: boolean;
	asset: CompanyAssetItem | null;
	onClose: () => void;
	onConfirm: () => void;
}

export const DeleteAssetDialog: React.FC<DeleteAssetDialogProps> = ({
	isOpen,
	asset,
	onClose,
	onConfirm,
}) => {
	const { t } = useTranslation();

	if (!isOpen || !asset) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
			<div
				className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-desc"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
							<AlertTriangle className="h-5 w-5" />
						</div>
						<h2 id="delete-dialog-title" className="text-base font-semibold text-slate-900">
							{t(localizationConstants.confirmDeleteAssetTitle)}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
						aria-label={t(localizationConstants.btnCancelCard)}
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<p id="delete-dialog-desc" className="text-sm text-slate-600 leading-relaxed">
						{t(localizationConstants.confirmDeleteAssetDesc)}
					</p>

					<div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								{t(localizationConstants.colAssetNameModel)}:
							</span>
							<span className="font-semibold text-slate-800">{asset.name}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								{t(localizationConstants.colIdRegNumber)}:
							</span>
							<span className="font-mono text-slate-700">{asset.idNumber}</span>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
					>
						{t(localizationConstants.btnCancelCard)}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
					>
						{t(localizationConstants.btnDeleteCardItem)}
					</button>
				</div>
			</div>
		</div>
	);
};
