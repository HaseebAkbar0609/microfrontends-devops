"use client";

import React from "react";
import Link from "next/link";
import { Send, RotateCcw, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { EconomyStatusBadge } from "../common/EconomyStatusBadge";
import { RotRutItem } from "../../types/rotRut.types";
import { formatCurrency } from "../../utils/rotRutFormatters";

interface RotRutTableRowProps {
	item: RotRutItem;
	isSelected: boolean;
	onToggleSelect: (id: string) => void;
	currency: string;
	language: string;
	customerLimit?: number;
	onSubmitSingle: (id: string) => void;
	onResubmit: (item: RotRutItem) => void;
}

export function RotRutTableRow({
	item,
	isSelected,
	onToggleSelect,
	currency,
	language,
	customerLimit,
	onSubmitSingle,
	onResubmit,
}: RotRutTableRowProps) {
	const { t } = useTranslation();

	return (
		<tr
			className={`hover:bg-slate-50/70 transition-colors ${
				isSelected ? "bg-blue-50/30" : ""
			}`}
		>
			<td className="py-3 px-4">
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => onToggleSelect(item.id)}
					aria-label={`Select ${item.invoiceNo}`}
				/>
			</td>
			<td className="py-3 px-4 font-mono font-semibold text-blue-600 hover:underline">
				<Link href={`/module/financial-management/invoice/${item.invoiceId}`}>
					{item.invoiceNo}
				</Link>
			</td>
			<td className="py-3 px-4">
				<div className="font-semibold text-slate-900">{item.customerName}</div>
				<div className="text-[11px] text-slate-400 font-mono">
					{item.customerPersonalIdMasked}
				</div>
				{customerLimit !== undefined && (
					<div className="text-[10px] text-emerald-600 font-medium mt-0.5">
						{formatCurrency(customerLimit, currency, language)}{" "}
						<Translate text={localizationConstants.rotRutRemaining} />
					</div>
				)}
			</td>
			<td className="py-3 px-4 text-slate-600 font-medium">
				<span className="truncate max-w-[180px] block" title={item.propertyId}>
					{item.propertyId}
				</span>
			</td>
			<td className="py-3 px-4 text-center">
				<span
					className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider ${
						item.type === "rot"
							? "bg-indigo-50 text-indigo-700 border border-indigo-200"
							: "bg-violet-50 text-violet-700 border border-violet-200"
					}`}
				>
					{item.type.toUpperCase()}
				</span>
			</td>
			<td className="py-3 px-4 text-right font-medium text-slate-800 font-mono">
				{formatCurrency(item.laborCost, currency, language)}
			</td>
			<td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
				{formatCurrency(item.deductionAmount, currency, language)}
			</td>
			<td className="py-3 px-4 text-center">
				<div className="flex flex-col items-center justify-center gap-0.5">
					<EconomyStatusBadge
						status={item.status}
						labelKey={
							item.status === "approved"
								? localizationConstants.rotRutFilterStatusApproved
								: item.status === "submitted"
									? localizationConstants.rotRutFilterStatusSubmitted
									: item.status === "rejected"
										? localizationConstants.rotRutFilterStatusRejected
										: localizationConstants.rotRutFilterStatusPending
						}
					/>
					{item.skatteverketReference && (
						<span className="text-[10px] text-slate-500 font-mono" title={item.skatteverketReference}>
							{item.skatteverketReference}
						</span>
					)}
				</div>
			</td>
			<td className="py-3 px-4 text-right">
				<div className="inline-flex items-center justify-end gap-1">
					{item.status === "pending" && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onSubmitSingle(item.id)}
							className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
							title={t(localizationConstants.rotRutActionSubmit)}
						>
							<Send className="w-3.5 h-3.5" />
						</Button>
					)}
					{item.status === "rejected" && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onResubmit(item)}
							className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
							title={t(localizationConstants.rotRutActionResubmit)}
						>
							<RotateCcw className="w-3.5 h-3.5" />
						</Button>
					)}
					<Link
						href={`/module/financial-management/invoice/${item.invoiceId}`}
						className="inline-flex items-center justify-center h-7 w-7 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
						title={t(localizationConstants.rotRutActionViewInvoice)}
					>
						<FileText className="w-3.5 h-3.5" />
					</Link>
				</div>
			</td>
		</tr>
	);
}
