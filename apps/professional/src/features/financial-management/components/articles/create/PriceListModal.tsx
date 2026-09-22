"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListRow } from "../../../types/article.types";

interface PriceListModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onAdd: (row: PriceListRow) => void;
}

export function PriceListModal({
	isOpen,
	onClose,
	onAdd,
}: PriceListModalProps) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [currency, setCurrency] = useState("SEK");
	const [validFrom, setValidFrom] = useState("");
	const [validTo, setValidTo] = useState("");

	const handleAdd = () => {
		if (!name || !price) return;
		onAdd({
			id: `pl_${Date.now()}`,
			name,
			price,
			currency,
			validFrom: validFrom || undefined,
			validTo: validTo || undefined,
		});
		setName("");
		setPrice("");
		setCurrency("SEK");
		setValidFrom("");
		setValidTo("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="bg-white border-slate-200 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-slate-900 flex items-center gap-2">
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.articleNewRowButton} />
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articlePrislistaHeader} /> *
						</label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="T.ex. Sommarkampanj 2024"
							className="h-10 text-sm border-slate-200"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.articlePrisUtHeader} /> *
							</label>
							<Input
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								placeholder="0,00"
								className="h-10 text-sm border-slate-200"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.customerCurrencyLabel} />
							</label>
							<Input
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
								placeholder="SEK"
								className="h-10 text-sm border-slate-200"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.priceListValidPeriodHeader} />
							</label>
							<Input
								type="date"
								value={validFrom}
								onChange={(e) => setValidFrom(e.target.value)}
								className="h-10 text-sm border-slate-200"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.articleAndringsDatumHeader} />
							</label>
							<Input
								type="date"
								value={validTo}
								onChange={(e) => setValidTo(e.target.value)}
								className="h-10 text-sm border-slate-200"
							/>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>
					<Button
						type="button"
						onClick={handleAdd}
						disabled={!name || !price}
						className="bg-[#111721] hover:bg-slate-800 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.articleNewRowButton} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
