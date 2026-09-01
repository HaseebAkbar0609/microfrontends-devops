import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceStatus, InvoiceType } from "../../types/invoice.types";
import { cn } from "@/lib/utils";

interface InvoiceStatusBadgeProps {
	status: InvoiceStatus;
	className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
	switch (status) {
		case "paid":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#22c55e] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusPaid} />
				</span>
			);
		case "reminder1":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ef4444] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusReminder1} />
				</span>
			);
		case "reminder2":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dc2626] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusReminder2} />
				</span>
			);
		case "reminder3":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#b91c1c] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusReminder3} />
				</span>
			);
		case "sent":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f97316] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusSent} />
				</span>
			);
		case "saved":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#38bdf8] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusSaved} />
				</span>
			);
		case "overdue":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eab308] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusOverdue} />
				</span>
			);
		case "collection":
			return (
				<span
					className={cn(
						"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#10b981] text-white whitespace-nowrap",
						className,
					)}
				>
					<Translate text={localizationConstants.invoiceStatusCollection} />
				</span>
			);
		default:
			return null;
	}
}

export function InvoiceTypeBadge({ type }: { type: InvoiceType }) {
	return (
		<span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 whitespace-nowrap">
			{type === "fastpris" ? (
				<Translate text={localizationConstants.invoiceTypeFixed} />
			) : (
				<Translate text={localizationConstants.invoiceTypeBudget} />
			)}
		</span>
	);
}
