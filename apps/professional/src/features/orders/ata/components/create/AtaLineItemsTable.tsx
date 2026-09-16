"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ArrowUpDown, ArrowUp, ArrowDown, Sigma, CircleFadingPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DetailedLineItem } from "../../types/ata.types";
import { formatAtaCurrency } from "../../utils/ata.utils";

export interface AtaLineItemsTableProps {
	title: string;
	icon: React.ReactNode;
	secondColHeaderKey: "createAtaColPerson" | "createAtaColSupplier";
	sixthColHeaderKey: "createAtaColQuantity" | "createAtaColInvoice";
	items: DetailedLineItem[];
	totalLabel: string;
	totalValue: string | number;
	secondaryTotalLabel?: string;
	secondaryTotalValue?: string | number;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onChangeItems?: () => void;
}

export function AtaLineItemsTable({
	title,
	icon,
	secondColHeaderKey,
	sixthColHeaderKey,
	items,
	totalLabel,
	totalValue,
	secondaryTotalLabel,
	secondaryTotalValue,
	isExpanded,
	onToggleExpand,
	onChangeItems,
}: AtaLineItemsTableProps) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<keyof DetailedLineItem | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (field: keyof DetailedLineItem) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const sortedItems = useMemo(() => {
		if (!sortField) return items;
		return [...items].sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];
			if (valA === undefined || valA === null) return 1;
			if (valB === undefined || valB === null) return -1;
			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}
			const comp = String(valA).localeCompare(String(valB), "sv");
			return sortOrder === "asc" ? comp : -comp;
		});
	}, [items, sortField, sortOrder]);

	const renderSortIcon = (field: keyof DetailedLineItem) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 ml-1 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		);
	};

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
			{/* Accordion Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={onToggleExpand}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-5 sm:px-6 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isExpanded}
			>
				<div className="flex items-center gap-2.5 min-w-0">
					{icon}
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						{title}
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isExpanded && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Accordion Content */}
			{isExpanded && (
				<div className="p-4 flex flex-col gap-4 border-t border-slate-200">
					<div className="w-full overflow-x-auto">
						<Table className="w-full table-auto border-collapse">
							<TableHeader className="bg-white">
								<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
									<TableHead
										onClick={() => handleSort("date")}
										className="px-3 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
									>
										<div className="flex items-center gap-1">
											<span>
												<Translate text={localizationConstants.createAtaColDate} />
											</span>
											{renderSortIcon("date")}
										</div>
									</TableHead>
									<TableHead
										onClick={() => handleSort("personOrSupplier")}
										className="px-3 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
									>
										<div className="flex items-center gap-1">
											<span>
												<Translate text={localizationConstants[secondColHeaderKey]} />
											</span>
											{renderSortIcon("personOrSupplier")}
										</div>
									</TableHead>
									<TableHead
										onClick={() => handleSort("team")}
										className="px-3 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
									>
										<div className="flex items-center gap-1">
											<span><Translate text={localizationConstants.createAtaColTeam} /></span>
											{renderSortIcon("team")}
										</div>
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColDescription} />
									</TableHead>
									<TableHead
										onClick={() => handleSort("amount")}
										className="px-3 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap text-right"
									>
										<div className="flex items-center justify-end gap-1">
											<span><Translate text={localizationConstants.createAtaColAmount} /></span>
											{renderSortIcon("amount")}
										</div>
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants[sixthColHeaderKey]} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColUnit} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColNetPrice} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColNetSum} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColPercentage} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColContracted} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColN2} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColActivity} />
									</TableHead>
									<TableHead className="px-3 py-3 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
										<Translate text={localizationConstants.createAtaColPosition} />
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
								{sortedItems.length === 0 ? (
									<TableRow className="border-b border-slate-200">
										<TableCell colSpan={14} className="h-20 text-center font-sans text-sm text-slate-400">
											<Translate text={localizationConstants.noDataFound} />
										</TableCell>
									</TableRow>
								) : (
									sortedItems.map((item) => (
										<TableRow
											key={item.id}
											className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors text-sm text-slate-900"
										>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.date}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm font-normal text-slate-900">
												{item.personOrSupplier}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.team}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.description || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap text-right font-sans text-sm text-slate-900">
												{formatAtaCurrency(item.amount)}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.quantityOrInvoice || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.unit || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.netPrice || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.netSum || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.percentage || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.contracted || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.n2 || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.activity || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.position || "-"}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Section Footer Bar: Gray Sigma Box on Left, Black Button on Right */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
						{/* Left: Gray Total Box (width: 296px, dynamic height: 44px for single row / 76px for double row, gap: 4px, radius: 8px, bg: slate-200) */}
						<div
							className={cn(
								"w-[296px] flex flex-col justify-center gap-[4px] bg-slate-200 rounded-[8px] px-[12px] shrink-0",
								secondaryTotalLabel ? "h-[76px] py-[8px]" : "h-[44px] py-[6px]"
							)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<Sigma className="w-[20px] h-[20px] text-slate-700 shrink-0" strokeWidth={2} />
									<span className="font-sans font-medium text-base leading-6 text-slate-900 tracking-normal truncate">
										{totalLabel}
									</span>
								</div>
								<span className="w-[95px] text-left font-sans font-semibold text-lg leading-7 tracking-normal text-slate-900 shrink-0">
									{typeof totalValue === "number" ? formatAtaCurrency(totalValue) : totalValue}
								</span>
							</div>
							{secondaryTotalLabel && secondaryTotalValue !== undefined && (
								<>
									<div className="border-t border-slate-300/80 w-full" />
									<div className="flex items-center justify-between">
										<span className="font-sans font-medium text-sm leading-6 tracking-normal text-slate-500 pl-7 truncate flex-1 min-w-0">
											{secondaryTotalLabel}
										</span>
										<span className="w-[95px] text-left font-sans font-medium text-sm leading-6 tracking-normal text-slate-500 shrink-0">
											{typeof secondaryTotalValue === "number"
												? formatAtaCurrency(secondaryTotalValue)
												: secondaryTotalValue}
										</span>
									</div>
								</>
							)}
						</div>

						{/* Right: Black Action Button */}
						<Button
							type="button"
							onClick={onChangeItems}
							className="h-8.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium gap-1.5 shadow-none cursor-pointer self-end sm:self-center"
						>
							<CircleFadingPlus className="h-4 w-4 text-white" />
							<span>{t(localizationConstants.createAtaBtnChange)}</span>
						</Button>
					</div>
				</div>
			)}
		</Card>
	);
}
