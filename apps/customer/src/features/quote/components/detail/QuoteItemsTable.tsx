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

interface QuoteItemsTableProps {
	items: QuoteItem[];
	quoteTotal: string;
	vat: string;
	rotDeduction: boolean;
	finalTotal: string;
}

export function QuoteItemsTable({
	items,
	quoteTotal,
	vat,
	rotDeduction,
	finalTotal,
}: QuoteItemsTableProps) {
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
							{rotDeduction && (
								<div className="flex justify-end items-center gap-12">
									<span className="text-xs text-slate-500 font-medium whitespace-nowrap">
										<Translate
											text={
												localizationConstants.rotDeductionLabel
											}
										/>
									</span>
									<div className="w-32" />
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
					className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 h-10 rounded-md"
				>
					<Translate text={localizationConstants.rejectLabel} />
				</Button>
				<Button
					variant="ghost"
					className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 h-10 rounded-md"
				>
					<Translate text={localizationConstants.approveLabel} />
				</Button>
			</div>
		</DetailCard>
	);
}
