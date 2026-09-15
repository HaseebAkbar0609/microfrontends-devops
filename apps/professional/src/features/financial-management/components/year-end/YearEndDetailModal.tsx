"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { YearEndItem } from "../../types/yearEnd.types";

interface YearEndDetailModalProps {
	item: YearEndItem | null;
	isOpen: boolean;
	onClose: () => void;
	onEdit: (item: YearEndItem) => void;
}

export function YearEndDetailModal({
	item,
	isOpen,
	onClose,
	onEdit,
}: YearEndDetailModalProps) {
	if (!item) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-0 overflow-hidden bg-white">
				<DialogHeader className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.titleYearEndDetails} />
					</DialogTitle>
				</DialogHeader>

				<div className="p-6 space-y-4 text-xs">
					{/* Header summary */}
					<div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
						<div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
							<FileText className="h-5 w-5 text-slate-600" />
						</div>
						<div className="flex-1 min-w-0">
							<h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
							<p className="text-slate-500 text-[11px] truncate">
								{item.category} • {item.fiscalYear}
							</p>
						</div>
					</div>

					{/* Metadata Grid */}
					<div className="grid grid-cols-2 gap-3 pt-2">
						<div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
							<span className="text-[10px] text-slate-400 uppercase font-bold block">
								<Translate text={localizationConstants.colSrNr} />
							</span>
							<span className="font-semibold text-slate-800">{item.srNr}</span>
						</div>

						<div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
							<span className="text-[10px] text-slate-400 uppercase font-bold block">
								<Translate text={localizationConstants.fieldFiscalYear} />
							</span>
							<span className="font-semibold text-slate-800">{item.fiscalYear}</span>
						</div>

						<div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
							<span className="text-[10px] text-slate-400 uppercase font-bold block">
								<Translate text={localizationConstants.colStatus} />
							</span>
							<span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
								<CheckCircle2 className="h-3 w-3" />
								{item.status === "completed"
									? "Klar"
									: item.status === "in_progress"
										? "Pågår"
										: "Ej påbörjad"}
							</span>
						</div>

						<div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
							<span className="text-[10px] text-slate-400 uppercase font-bold block">
								Filformat
							</span>
							<span className="font-semibold text-slate-800">
								{item.fileType} ({item.fileSize || "1.0 MB"})
							</span>
						</div>
					</div>

					{/* Notes */}
					{item.notes && (
						<div className="space-y-1 pt-1">
							<span className="text-[10px] text-slate-400 uppercase font-bold block">
								<Translate text={localizationConstants.fieldNotes} />
							</span>
							<div className="p-3 rounded-lg border border-slate-200 bg-white text-slate-700 leading-relaxed">
								{item.notes}
							</div>
						</div>
					)}

					{/* File Action */}
					<div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/40">
						<div className="flex items-center gap-2 truncate">
							<span
								className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
									item.fileType === "PDF"
										? "bg-rose-50 text-rose-600 border border-rose-200"
										: "bg-blue-50 text-blue-600 border border-blue-200"
								}`}
							>
								{item.fileType}
							</span>
							<span className="font-medium text-slate-800 truncate">
								{item.fileName}
							</span>
						</div>
						{item.fileUrl && (
							<a
								href={item.fileUrl}
								download={item.fileName}
								className="inline-flex items-center justify-center h-7 px-2.5 rounded bg-slate-900 text-white text-xs hover:bg-slate-800 gap-1"
							>
								<Download className="h-3 w-3" />
								Ladda ner
							</a>
						)}
					</div>

					{/* Footer Actions */}
					<div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="h-8 px-3 text-xs border-slate-200"
						>
							<Translate text={localizationConstants.actionCancel} />
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={() => {
								onClose();
								onEdit(item);
							}}
							className="h-8 px-4 text-xs bg-slate-900 text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.btnEdit} />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default YearEndDetailModal;
