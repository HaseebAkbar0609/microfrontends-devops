"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { X, Calendar, User, Wrench, ArrowRightLeft, PlusCircle, CheckCircle2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { CompanyAssetItem, AssetHistoryLog } from "../../../types/equipment.types";
import { EquipmentStatusBadge } from "../EquipmentStatusBadge";

interface AssetHistoryModalProps {
	isOpen: boolean;
	asset: CompanyAssetItem | null;
	onClose: () => void;
}

export const AssetHistoryModal: React.FC<AssetHistoryModalProps> = ({
	isOpen,
	asset,
	onClose,
}) => {
	const { t } = useTranslation();

	if (!isOpen || !asset) return null;

	const getEventIcon = (type: AssetHistoryLog["type"]) => {
		switch (type) {
			case "assignment":
				return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
			case "maintenance":
			case "service":
				return <Wrench className="h-4 w-4 text-amber-600" />;
			case "inspection":
				return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
			case "status_change":
				return <PlusCircle className="h-4 w-4 text-indigo-600" />;
			default:
				return <Calendar className="h-4 w-4 text-slate-500" />;
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
			<div
				className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
				role="dialog"
				aria-modal="true"
				aria-labelledby="asset-history-title"
			>
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
					<div>
						<h2 id="asset-history-title" className="text-lg font-semibold text-slate-900">
							{t(localizationConstants.modalAssetHistoryTitle)}
						</h2>
						<p className="text-xs text-slate-500 mt-0.5">
							{asset.name} • {asset.idNumber}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
						aria-label={t(localizationConstants.btnCancelCard)}
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="max-h-[68vh] overflow-y-auto p-6 space-y-6">
					{/* Asset Info Summary Card */}
					<div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-wrap items-center justify-between gap-4">
						<div className="space-y-1">
							<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
								{t(localizationConstants.colAssetNameModel)}
							</span>
							<p className="text-sm font-semibold text-slate-900">{asset.name}</p>
							<p className="text-xs text-slate-500">{asset.idNumber}</p>
						</div>
						<div className="space-y-1">
							<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
								{t(localizationConstants.colAssignedTo)}
							</span>
							<p className="text-sm font-medium text-slate-800">
								{asset.assignedEmployeeName || t(localizationConstants.unassignedLabel)}
							</p>
							{asset.department && (
								<p className="text-xs text-slate-500">{asset.department}</p>
							)}
						</div>
						<div className="space-y-1">
							<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
								{t(localizationConstants.fieldAssetStatus)}
							</span>
							<div>
								<EquipmentStatusBadge status={asset.status} />
							</div>
						</div>
					</div>

					{/* Timeline Section */}
					<div className="space-y-3">
						<h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
							{t(localizationConstants.modalAssetHistoryTitle)}
						</h3>

						{(!asset.history || asset.history.length === 0) ? (
							<div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg">
								{t(localizationConstants.noHistoryLogsFound)}
							</div>
						) : (
							<div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
								{asset.history.map((log) => (
									<div key={log.id} className="relative group">
										{/* Icon Dot */}
										<div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-slate-100 shadow-sm border border-slate-200">
											{getEventIcon(log.type)}
										</div>
										<div className="rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-sm space-y-1.5 hover:border-slate-300 transition-colors">
											<div className="flex items-center justify-between gap-2">
												<span className="text-xs font-semibold text-slate-900">
													{log.description}
												</span>
												<span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
													<Calendar className="h-3 w-3" />
													{log.date}
												</span>
											</div>
											<div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
												<span className="inline-flex items-center gap-1">
													<User className="h-3 w-3 text-slate-400" />
													{log.performedBy}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Modal Footer */}
				<div className="flex items-center justify-end border-t border-slate-200 px-6 py-4 bg-slate-50">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
					>
						{t(localizationConstants.btnCancelCard)}
					</button>
				</div>
			</div>
		</div>
	);
};
