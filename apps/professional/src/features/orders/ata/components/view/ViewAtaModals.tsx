"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ATA_CONSTANTS } from "../../constants/ata.constants";
import type { DetailedLineItem } from "../../types/ata.types";

export interface ViewAtaEditLineItemsModalProps {
	isOpen: boolean;
	sectionTitle: string;
	items: DetailedLineItem[];
	onItemsChange: (items: DetailedLineItem[]) => void;
	onSave: () => void;
	onClose: () => void;
}

export function ViewAtaEditLineItemsModal({
	isOpen,
	sectionTitle,
	items,
	onItemsChange,
	onSave,
	onClose,
}: ViewAtaEditLineItemsModalProps) {
	const handleAddRow = () => {
		const newItem: DetailedLineItem = {
			id: `item-${Date.now()}`,
			date: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
			personOrSupplier: "",
			team: ATA_CONSTANTS.VIEW_DEFAULTS.DEFAULT_TEAM,
			description: "",
			amount: 0,
			quantityOrInvoice: "",
			unit: ATA_CONSTANTS.VIEW_DEFAULTS.DEFAULT_UNIT,
			netPrice: "",
			netSum: "",
			percentage: "",
			contracted: "",
			n2: "",
			activity: "",
			position: "",
		};
		onItemsChange([...items, newItem]);
	};

	const handleDeleteRow = (index: number) => {
		onItemsChange(items.filter((_, i) => i !== index));
	};

	const handleFieldChange = (index: number, field: keyof DetailedLineItem, val: string | number) => {
		const next = [...items];
		next[index] = {
			...next[index],
			[field]: field === "amount" ? Number(val) || 0 : val,
		};
		onItemsChange(next);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white font-sans">
				<DialogHeader className="px-6 py-4 border-b border-slate-200">
					<DialogTitle className="font-sans text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.viewAtaEditSectionModalTitle} />: {sectionTitle}
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<span className="text-xs text-slate-500">
							{items.length}{" "}
							<Translate
								text={
									items.length === 1
										? localizationConstants.viewAtaRowSingular
										: localizationConstants.viewAtaRowPlural
								}
							/>
						</span>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleAddRow}
							className="h-8 px-3 text-xs font-medium border-slate-200 rounded text-slate-800 hover:bg-slate-50 cursor-pointer shadow-none flex items-center gap-1.5"
						>
							<Plus className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.viewAtaAddRow} />
						</Button>
					</div>

					<div className="overflow-x-auto border border-slate-200 rounded-md">
						<Table className="w-full font-sans text-xs min-w-[700px]">
							<TableHeader className="bg-slate-50 border-b border-slate-200">
								<TableRow>
									<TableHead className="px-3 py-2.5 font-semibold text-slate-700 w-32"><Translate text={localizationConstants.createAtaColDate} /></TableHead>
									<TableHead className="px-3 py-2.5 font-semibold text-slate-700 w-44"><Translate text={localizationConstants.createAtaColPerson} /> / <Translate text={localizationConstants.createAtaColSupplier} /></TableHead>
									<TableHead className="px-3 py-2.5 font-semibold text-slate-700 w-24"><Translate text={localizationConstants.createAtaColTeam} /></TableHead>
									<TableHead className="px-3 py-2.5 font-semibold text-slate-700"><Translate text={localizationConstants.createAtaColDescription} /></TableHead>
									<TableHead className="px-3 py-2.5 font-semibold text-slate-700 w-32"><Translate text={localizationConstants.createAtaColAmount} /> (SEK)</TableHead>
									<TableHead className="px-3 py-2.5 font-semibold text-slate-700 w-12 text-center"><Translate text={localizationConstants.viewAtaColActions} /></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="py-6 text-center text-slate-500 font-sans text-xs">
											<Translate text={localizationConstants.viewAtaNoLineItems} />
										</TableCell>
									</TableRow>
								) : (
									items.map((item, idx) => (
										<TableRow key={item.id || idx} className="border-b border-slate-100">
											<TableCell className="p-2">
												<Input
													type="text"
													value={item.date || ""}
													onChange={(e) => handleFieldChange(idx, "date", e.target.value)}
													className="h-8 text-xs bg-white border-slate-200"
												/>
											</TableCell>
											<TableCell className="p-2">
												<Input
													type="text"
													value={item.personOrSupplier || ""}
													onChange={(e) => handleFieldChange(idx, "personOrSupplier", e.target.value)}
													className="h-8 text-xs bg-white border-slate-200"
												/>
											</TableCell>
											<TableCell className="p-2">
												<Input
													type="text"
													value={item.team || ""}
													onChange={(e) => handleFieldChange(idx, "team", e.target.value)}
													className="h-8 text-xs bg-white border-slate-200"
												/>
											</TableCell>
											<TableCell className="p-2">
												<Input
													type="text"
													value={item.description || ""}
													onChange={(e) => handleFieldChange(idx, "description", e.target.value)}
													className="h-8 text-xs bg-white border-slate-200"
												/>
											</TableCell>
											<TableCell className="p-2">
												<Input
													type="number"
													value={item.amount || 0}
													onChange={(e) => handleFieldChange(idx, "amount", e.target.value)}
													className="h-8 text-xs bg-white border-slate-200 text-right"
												/>
											</TableCell>
											<TableCell className="p-2 text-center">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteRow(idx)}
													className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
												>
													<Trash2 className="h-3.5 w-3.5" />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				<DialogFooter className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="h-9 px-4 text-xs font-medium border-slate-300 rounded text-slate-700 hover:bg-slate-100 cursor-pointer shadow-none"
					>
						<Translate text={localizationConstants.viewAtaBtnCancel} />
					</Button>
					<Button
						type="button"
						onClick={onSave}
						className="h-9 px-4 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded cursor-pointer shadow-none"
					>
						<Translate text={localizationConstants.viewAtaBtnSave} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export interface ViewAtaConfirmDialogProps {
	isOpen: boolean;
	title: string;
	description: string;
	onConfirm: () => void;
	onClose: () => void;
}

export function ViewAtaConfirmDialog({
	isOpen,
	title,
	description,
	onConfirm,
	onClose,
}: ViewAtaConfirmDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white max-w-md font-sans">
				<AlertDialogHeader>
					<AlertDialogTitle className="font-sans text-base font-bold text-slate-900">
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription className="font-sans text-sm text-slate-600">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex items-center justify-end gap-2 pt-2">
					<AlertDialogCancel
						onClick={onClose}
						className="h-9 px-4 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none"
					>
						<Translate text={localizationConstants.viewAtaBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="h-9 px-4 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer shadow-none"
					>
						<Translate text={localizationConstants.viewAtaBtnConfirm} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
