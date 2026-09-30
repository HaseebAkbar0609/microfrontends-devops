import { Receipt } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface QuoteItem {
	id: string;
	no: string;
	description: string;
	amount: string;
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveQuoteAPIAction } from "@/api-actions";
import { rejectQuoteAPIAction } from "@/api-actions/quote/reject";
import { Loader2 } from "lucide-react";

interface QuoteItemsTableProps {
	items: QuoteItem[];
	quoteTotal: string;
	vat: string;
	rotDeduction: boolean | string;
	finalTotal: string;
	quoteId?: string;
	projectId?: string;
	onApprove?: () => void;
}

export function QuoteItemsTable({
	items,
	quoteTotal,
	vat,
	rotDeduction,
	finalTotal,
	quoteId,
	projectId,
	onApprove,
}: QuoteItemsTableProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<"approved" | "rejected" | null>(null);

	/**
	 * Handles quote approval. If a custom `onApprove` callback prop is passed,
	 * it short-circuits the default API call and hands over handling to the parent component.
	 * Otherwise, it falls back to calling `approveQuoteAPIAction(quoteId)` directly.
	 */
	const handleApprove = async () => {
		if (onApprove) {
			onApprove();
			return;
		}
		if (!quoteId) return;
		setIsSubmitting(true);
		const res = await approveQuoteAPIAction(quoteId);
		setIsSubmitting(false);
		if (res.success) {
			setStatus("approved");
			if (projectId) router.push(`/business/offer/${projectId}?tab=quote-list`);
		}
	};
	const handleReject = async () => {
		if (!quoteId) return;
		setIsSubmitting(true);
		const res = await rejectQuoteAPIAction(quoteId);
		setIsSubmitting(false);
		if (res.success) {
			setStatus("rejected");
			if (projectId) router.push(`/business/offer/${projectId}?tab=quote-list`);
		}
	};
	return (
		<DetailCard icon={Receipt} title={localizationConstants.quote}>
			<div className="space-y-4">
				<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
					<Table>
						<TableHeader className="bg-slate-50/50">
							<TableRow className="hover:bg-transparent border-b border-slate-100">
								<TableHead className="w-16 text-xs font-medium text-slate-500 py-3 h-auto">
									<Translate
										text={localizationConstants.date}
									/>
								</TableHead>
								<TableHead className="text-xs font-medium text-slate-500 py-3 h-auto">
									<Translate
										text={localizationConstants.description}
									/>
								</TableHead>
								<TableHead className="text-right text-xs font-medium text-slate-500 py-3 h-auto pr-8">
									<Translate
										text={localizationConstants.amount}
									/>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item) => (
								<TableRow
									key={item.id}
									className="border-b border-slate-50 hover:bg-slate-50/30"
								>
									<TableCell className="py-4 text-sm text-slate-900 font-medium">
										{item.no}
									</TableCell>
									<TableCell className="py-4 text-sm text-slate-900">
										{item.description}
									</TableCell>
									<TableCell className="py-4 text-right text-sm text-slate-900 pr-8">
										{item.amount}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<div className="p-6 space-y-3 bg-white">
						<div className="flex justify-end items-center gap-12">
							<span className="text-sm font-semibold text-slate-900 uppercase tracking-tight">
								<Translate
									text={localizationConstants.quoteTotalLabel}
								/>
							</span>
							<span className="text-sm font-bold text-slate-900 w-32 text-right pr-2">
								{quoteTotal}
							</span>
						</div>
						<div className="flex flex-col items-end gap-1">
							<div className="flex justify-end items-center gap-12">
								<span className="text-xs text-slate-500 font-medium whitespace-nowrap">
									<Translate
										text={
											localizationConstants.includingVatLabel
										}
									/>
								</span>
								<span className="text-xs text-slate-500 font-medium w-32 text-right pr-2">
									{vat}
								</span>
							</div>
							{Boolean(rotDeduction) && (
								<div className="flex justify-end items-center gap-12">
									<span className="text-xs text-slate-500 font-medium whitespace-nowrap">
										<Translate
											text={
												localizationConstants.rotDeductionLabel
											}
										/>
									</span>
									<span className="text-xs text-slate-500 font-medium w-32 text-right pr-2">
										{typeof rotDeduction === "string" ? rotDeduction : "Ja"}
									</span>
								</div>
							)}
						</div>

						<div className="flex justify-end items-center gap-12 pt-4 border-t border-slate-100">
							<span className="text-base font-bold text-slate-900 uppercase tracking-tight">
								<Translate
									text={localizationConstants.finalTotalLabel}
								/>
							</span>
							<span className="text-base font-extrabold text-slate-900 w-32 text-right pr-2">
								{finalTotal}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-3 mt-4">
				<Button
					variant="ghost"
					onClick={handleReject}
					disabled={isSubmitting || !quoteId || status !== null}
					className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 h-10 rounded-md"
				>
					<Translate text={localizationConstants.rejectLabel} />
				</Button>
				<Button
					variant="ghost"
					onClick={handleApprove}
					disabled={isSubmitting || status !== null || (!onApprove && !quoteId)}
					className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 h-10 rounded-md"
				>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Translate text={localizationConstants.approveLabel} />
					)}
				</Button>
			</div>
		</DetailCard>
	);
}
