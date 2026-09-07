"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, Receipt, FileText } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DrilldownTarget, TransactionDetailItem } from "../../types/financialReports.types";

interface TransactionDetailDrawerProps {
	isOpen: boolean;
	target: DrilldownTarget | null;
	periodLabel: string;
	transactions: TransactionDetailItem[];
	onClose: () => void;
}

function formatCurrency(amount: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function TransactionDetailDrawer({
	isOpen,
	target,
	periodLabel,
	transactions,
	onClose,
}: TransactionDetailDrawerProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);
	const drawerRef = useRef<HTMLDivElement>(null);

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen || !target) return null;

	const isBox = Boolean(target.boxNumber);
	const headerTitle = isBox
		? `${t(localizationConstants.boxNumberPrefix)} ${target.boxNumber}`
		: target.accountCode
			? `${t(localizationConstants.reportDrilldownAccount)} ${target.accountCode}`
			: t(localizationConstants.reportDrilldownTitle);

	return (
		<div className="fixed inset-0 z-50 overflow-hidden">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
				onClick={onClose}
			/>

			{/* Slide-over Drawer Panel */}
			<div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
				<div
					ref={drawerRef}
					role="dialog"
					aria-modal="true"
					aria-labelledby="drilldown-dialog-title"
					className="w-screen max-w-3xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
				>
					{/* Header */}
					<div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-mono">
									{headerTitle}
								</span>
								<span className="text-xs text-slate-500 font-medium">{periodLabel}</span>
							</div>
							<h3 id="drilldown-dialog-title" className="text-lg font-bold text-slate-900 tracking-tight">
								<Translate text={target.labelKey} />
							</h3>
						</div>

						<button
							type="button"
							onClick={onClose}
							className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
							aria-label={t(localizationConstants.reportDrilldownClose)}
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Summary Stats Banner */}
					<div className="px-6 py-4 bg-slate-100/60 border-b border-slate-200 grid grid-cols-2 gap-4">
						<div>
							<p className="text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.reportDrilldownTotal} />
							</p>
							<p className="text-xl font-extrabold text-slate-900 mt-0.5">
								{formatCurrency(target.totalAmount, currency)}
							</p>
						</div>
						<div className="text-right">
							<p className="text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.reportDrilldownSubtitle} />
							</p>
							<p className="text-sm font-semibold text-slate-700 mt-1">
								{transactions.length}
							</p>
						</div>
					</div>

					{/* Transaction Table Content */}
					<div className="flex-1 overflow-y-auto p-6">
						{transactions.length === 0 ? (
							<div className="text-center py-16 px-4">
								<div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
									<Receipt className="w-6 h-6" />
								</div>
								<h4 className="text-sm font-bold text-slate-800">
									<Translate text={localizationConstants.reportDrilldownEmpty} />
								</h4>
								<p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
									<Translate text={localizationConstants.reportEmptyStateDesc} />
								</p>
							</div>
						) : (
							<div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
												<th className="py-2.5 px-3">
													<Translate text={localizationConstants.reportDrilldownDate} />
												</th>
												<th className="py-2.5 px-3">
													<Translate text={localizationConstants.reportDrilldownDocNo} />
												</th>
												<th className="py-2.5 px-3">
													<Translate text={localizationConstants.reportDrilldownCounterparty} />
												</th>
												<th className="py-2.5 px-3">
													<Translate text={localizationConstants.reportDrilldownDescription} />
												</th>
												<th className="py-2.5 px-3 text-right">
													<Translate text={localizationConstants.reportDrilldownAmount} />
												</th>
												<th className="py-2.5 px-3 text-right">
													<Translate text={localizationConstants.reportDrilldownVat} />
												</th>
												<th className="py-2.5 px-3 text-center">
													<Translate text={localizationConstants.reportDrilldownType} />
												</th>
											</tr>
										</thead>
										<tbody>
											{transactions.map((tx) => (
												<tr
													key={tx.id}
													className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs"
												>
													<td className="py-3 px-3 font-mono text-slate-600">
														{tx.date}
													</td>
													<td className="py-3 px-3 font-mono font-semibold text-slate-900">
														{tx.documentNo}
													</td>
													<td className="py-3 px-3 font-medium text-slate-800">
														{tx.counterparty}
													</td>
													<td className="py-3 px-3 text-slate-600 max-w-[180px] truncate" title={tx.description}>
														{tx.description}
													</td>
													<td className="py-3 px-3 text-right font-bold text-slate-900">
														{formatCurrency(tx.netAmount, currency)}
													</td>
													<td className="py-3 px-3 text-right text-slate-500">
														{formatCurrency(tx.vatAmount, currency)}
													</td>
													<td className="py-3 px-3 text-center">
														<span
															className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
																tx.sourceType === "invoice"
																	? "bg-blue-50 text-blue-700 border border-blue-200"
																	: "bg-amber-50 text-amber-700 border border-amber-200"
															}`}
														>
															{tx.sourceType === "invoice" ? (
																<FileText className="w-3 h-3 mr-1" />
															) : (
																<Receipt className="w-3 h-3 mr-1" />
															)}
															<Translate
																text={
																	tx.sourceType === "invoice"
																		? localizationConstants.reportDrilldownSourceInvoice
																		: localizationConstants.reportDrilldownSourceExpense
																}
															/>
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
						<span className="text-xs text-slate-500 font-medium">
							{target.accountCode ? `BAS ${target.accountCode}` : headerTitle}
						</span>
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
						>
							<Translate text={localizationConstants.reportDrilldownClose} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TransactionDetailDrawer;
