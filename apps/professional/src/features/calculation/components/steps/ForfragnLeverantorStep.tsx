"use client";

import React, { useEffect, useState } from "react";
import { Folder, Plus, X, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	getSuppliersForEnquiryAction,
	MOCK_AVAILABLE_SUPPLIERS,
} from "../../api/createEnquiryApi";
import type { KalkylLeverantorData } from "../../types/kalkyl";

export interface ForfragnLeverantorStepProps {
	data: KalkylLeverantorData;
	onChange: (patch: Partial<KalkylLeverantorData>) => void;
}

export function ForfragnLeverantorStep({ data, onChange }: ForfragnLeverantorStepProps) {
	const t = useTranslate();
	const [allSuppliers, setAllSuppliers] = useState<string[]>(MOCK_AVAILABLE_SUPPLIERS);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [customSupplier, setCustomSupplier] = useState("");

	useEffect(() => {
		let isMounted = true;
		async function fetchSuppliers() {
			try {
				const list = await getSuppliersForEnquiryAction();
				if (isMounted && list.length > 0) {
					setAllSuppliers(list);
				}
			} catch {
				// Fallback to MOCK_AVAILABLE_SUPPLIERS
			}
		}
		fetchSuppliers();
		return () => {
			isMounted = false;
		};
	}, []);

	const selectedSuppliers = data.suppliers || [];

	const handleAddSupplier = (name: string) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		if (!selectedSuppliers.includes(trimmed)) {
			onChange({ suppliers: [...selectedSuppliers, trimmed] });
		}
		setCustomSupplier("");
		setIsAddOpen(false);
	};

	const handleRemoveSupplier = (name: string) => {
		onChange({
			suppliers: selectedSuppliers.filter((s) => s !== name),
		});
	};

	const filteredAvailable = allSuppliers.filter((s) =>
		s.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-4">
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardHeader className="min-h-14 flex flex-row items-center justify-between gap-2 border-b border-slate-200 px-4 sm:px-6 py-2.5 sm:py-0 [.border-b]:pb-2.5 sm:[.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900 min-w-0">
						<Folder className="h-5 w-5 shrink-0 text-slate-700" />
						<span className="truncate">
							<Translate text={localizationConstants.calcInquiryWizInbjudnaLeverantorer} />
						</span>
					</CardTitle>

					<Button
						type="button"
						onClick={() => setIsAddOpen(true)}
						className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-800"
					>
						<Plus className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.calcInquiryWizLaggTillLeverantor} />
					</Button>
				</CardHeader>

				<CardContent className="px-4 py-4 sm:px-6 sm:py-5">
					<div className="flex flex-col gap-2">
						<Label className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.calcInquiryWizInbjudnaLeverantorerLabel} />
						</Label>

						<div className="flex min-h-12 w-full flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white p-2">
							{selectedSuppliers.length === 0 ? (
								<span className="text-sm text-slate-400">
									<Translate text={localizationConstants.calcInquiryWizValjLeverantor} />
								</span>
							) : (
								selectedSuppliers.map((supplier) => (
									<Badge
										key={supplier}
										variant="outline"
										className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-800 shadow-none"
									>
										<span className="truncate max-w-[200px] sm:max-w-xs">{supplier}</span>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label={t(localizationConstants.remove)}
											onClick={() => handleRemoveSupplier(supplier)}
											className="h-4 w-4 cursor-pointer rounded-xs p-0 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
										>
											<X className="h-3 w-3" />
										</Button>
									</Badge>
								))
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Add Supplier Dialog */}
			<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
				<DialogContent className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcInquiryWizLaggTillLeverantor} />
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						{/* Search existing suppliers */}
						<div className="relative">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t(localizationConstants.calcInquiryWizSokLeverantor)}
								className="h-10 pl-9"
							/>
						</div>

						{/* Quick supplier chips to add */}
						<div className="max-h-48 overflow-y-auto rounded-md border border-slate-100 p-2">
							<div className="flex flex-wrap gap-1.5">
								{filteredAvailable.map((sup) => {
									const isSelected = selectedSuppliers.includes(sup);
									return (
										<Button
											key={sup}
											type="button"
											variant={isSelected ? "secondary" : "outline"}
											size="sm"
											disabled={isSelected}
											onClick={() => handleAddSupplier(sup)}
											className={cn(
												"h-7 cursor-pointer px-2.5 py-1 text-xs font-medium",
												isSelected && "opacity-60 cursor-not-allowed",
											)}
										>
											+ {sup} {isSelected ? "✓" : ""}
										</Button>
									);
								})}
							</div>
						</div>

						{/* Or type custom supplier */}
						<div className="flex items-center gap-2 pt-2 border-t border-slate-100">
							<Input
								value={customSupplier}
								onChange={(e) => setCustomSupplier(e.target.value)}
								placeholder={t(localizationConstants.calcInquiryWizSkrivLeverantorsnamn)}
								className="h-10 text-sm"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddSupplier(customSupplier);
									}
								}}
							/>
							<Button
								type="button"
								onClick={() => handleAddSupplier(customSupplier)}
								disabled={!customSupplier.trim()}
								className="h-10 shrink-0 cursor-pointer bg-slate-900 text-sm text-white hover:bg-slate-800"
							>
								<Translate text={localizationConstants.add} />
							</Button>
						</div>
					</div>

					<DialogFooter className="flex flex-row items-center justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsAddOpen(false)}
							className="h-9 cursor-pointer border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50"
						>
							<Translate text={localizationConstants.cancelButton} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
