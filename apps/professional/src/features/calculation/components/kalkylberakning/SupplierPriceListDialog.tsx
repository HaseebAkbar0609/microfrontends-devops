"use client";

import { useEffect, useState } from "react";
import { Plus, Search as SearchIcon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import type { SupplierPriceListItem, TemplateCostSection } from "../../types/templateCalculation";
import { getSupplierPriceListsAPIAction } from "../../api/calculationTemplateApi";

interface SupplierPriceListDialogProps {
	isOpen: boolean;
	onClose: () => void;
	sections: TemplateCostSection[];
	onImportItem: (targetSectionId: string, item: SupplierPriceListItem) => void;
}

export function SupplierPriceListDialog({
	isOpen,
	onClose,
	sections,
	onImportItem,
}: SupplierPriceListDialogProps) {
	const t = useTranslate();
	const [query, setQuery] = useState("");
	const [items, setItems] = useState<SupplierPriceListItem[]>([]);
	const [targetSectionId, setTargetSectionId] = useState<string>(
		sections[0]?.id || "sec-material",
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!isOpen) return;

		setIsLoading(true);
		const timer = setTimeout(() => {
			getSupplierPriceListsAPIAction(query)
				.then(setItems)
				.finally(() => setIsLoading(false));
		}, 300);

		return () => clearTimeout(timer);
	}, [isOpen, query]);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-3xl bg-white p-6">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.calcTemplateSupplierPriceLists} />
					</DialogTitle>
					<DialogDescription className="text-xs text-slate-500">
						<Translate text={localizationConstants.calcTemplatePriceListDialogDesc} />
					</DialogDescription>
				</DialogHeader>

				{/* Search and Target Section Selector */}
				<div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
					<div className="relative flex-1 w-full">
						<SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={t(localizationConstants.search)}
							className="h-10 pl-9 text-sm border-slate-200"
						/>
					</div>

					<div className="flex items-center gap-2 w-full sm:w-auto">
						<span className="text-xs text-slate-500 whitespace-nowrap">
							<Translate text={localizationConstants.calcTemplateAddTo} />
						</span>
						<Select value={targetSectionId} onValueChange={setTargetSectionId}>
							<SelectTrigger className="h-10 w-44 bg-white border-slate-200 text-xs">
								<SelectValue placeholder={t(localizationConstants.calcTemplateSelectSection)} />
							</SelectTrigger>
							<SelectContent className="bg-white shadow-md border-slate-200">
								{sections.map((sec) => (
									<SelectItem key={sec.id} value={sec.id} className="text-xs cursor-pointer">
										{sec.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Price List Table */}
				<div className="max-h-80 overflow-y-auto rounded-md border border-slate-200 mt-2">
					<Table className="w-full text-xs">
						<TableHeader className="bg-slate-50 sticky top-0 z-10">
							<TableRow className="border-b border-slate-200">
								<TableHead className="px-3 py-2 font-semibold text-slate-700">
									<Translate text={localizationConstants.calcItemCol} />
								</TableHead>
								<TableHead className="px-3 py-2 font-semibold text-slate-700">
									<Translate text={localizationConstants.calcTemplateLeverantorCol} />
								</TableHead>
								<TableHead className="px-3 py-2 font-semibold text-slate-700">
									<Translate text={localizationConstants.calcAPrisNaming} />
								</TableHead>
								<TableHead className="px-3 py-2 font-semibold text-slate-700">
									<Translate text={localizationConstants.calcUnitCol} />
								</TableHead>
								<TableHead className="px-3 py-2 font-semibold text-slate-700">
									<Translate text={localizationConstants.calcAPriceCol} />
								</TableHead>
								<TableHead className="w-16 px-3 py-2" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-slate-400">
										<Translate text={localizationConstants.genericLoading} />
									</TableCell>
								</TableRow>
							) : items.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-slate-400">
										<Translate text={localizationConstants.noDataFound} />
									</TableCell>
								</TableRow>
							) : (
								items.map((item) => (
									<TableRow key={item.id} className="border-b border-slate-100 hover:bg-slate-50/60">
										<TableCell className="px-3 py-2 font-normal text-slate-900">{item.articleNo}</TableCell>
										<TableCell className="px-3 py-2 text-slate-600">{item.supplier}</TableCell>
										<TableCell className="px-3 py-2 font-normal text-slate-900">{item.name}</TableCell>
										<TableCell className="px-3 py-2 text-slate-600">{item.unit}</TableCell>
										<TableCell className="px-3 py-2 font-normal text-slate-900 tabular-nums">
											{formatCurrency(item.price)}
										</TableCell>
										<TableCell className="px-3 py-2 text-right">
											<Button
												size="sm"
												variant="outline"
												onClick={() => onImportItem(targetSectionId, item)}
												className="h-7 px-2.5 text-xs font-normal border-slate-200 bg-white hover:bg-slate-50 cursor-pointer gap-1"
											>
												<Plus className="h-3 w-3" />
												<Translate text={localizationConstants.add} />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	);
}

