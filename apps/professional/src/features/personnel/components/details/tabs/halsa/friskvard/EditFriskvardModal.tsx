"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { FriskvardData } from "@/features/personnel/types/halsa.types";

interface EditFriskvardModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: FriskvardData;
	onSave: (data: FriskvardData) => void;
}

export function EditFriskvardModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditFriskvardModalProps) {
	const { t } = useTranslation();
	const [isEligible, setIsEligible] = useState(initialData.isEligible);
	const [amount, setAmount] = useState(initialData.allowanceAmount.toString());
	const [period, setPeriod] = useState<"month" | "year">(initialData.period);
	const [providers, setProviders] = useState<string[]>(initialData.providers);
	const [newProvider, setNewProvider] = useState("");

	useEffect(() => {
		if (isOpen) {
			setIsEligible(initialData.isEligible);
			setAmount(initialData.allowanceAmount.toString());
			setPeriod(initialData.period);
			setProviders([...initialData.providers]);
			setNewProvider("");
		}
	}, [isOpen, initialData]);

	const handleAddProvider = () => {
		const trimmed = newProvider.trim();
		if (trimmed && !providers.includes(trimmed)) {
			setProviders((prev) => [...prev, trimmed]);
			setNewProvider("");
		}
	};

	const handleRemoveProvider = (p: string) => setProviders((prev) => prev.filter((item) => item !== p));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({ isEligible, allowanceAmount: parseFloat(amount) || 0, period, providers });
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.friskvardModalTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="space-y-2">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.friskvardFieldEligible} />
						</Label>
						<RadioGroup
							value={isEligible ? "yes" : "no"}
							onValueChange={(val) => setIsEligible(val === "yes")}
							className="flex items-center gap-6"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="yes" id="friskvard-eligible-yes" />
								<Label htmlFor="friskvard-eligible-yes" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.friskvardRadioYes} />
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="no" id="friskvard-eligible-no" />
								<Label htmlFor="friskvard-eligible-no" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.friskvardRadioNo} />
								</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.friskvardFieldAmount} /> (kr)
						</Label>
						<div className="flex items-center gap-2">
							<Input
								type="number"
								min="0"
								step="100"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="h-9 text-xs flex-1"
							/>
							<select
								value={period}
								onChange={(e) => setPeriod(e.target.value as "month" | "year")}
								className="h-9 text-xs border border-slate-200 rounded-md px-2 bg-white text-slate-700 font-medium cursor-pointer"
							>
								<option value="month">{t(localizationConstants.friskvardOptionMonth)}</option>
								<option value="year">{t(localizationConstants.friskvardOptionYear)}</option>
							</select>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.friskvardFieldProviders} />
						</Label>
						<div className="flex items-center gap-1.5 flex-wrap min-h-8 p-2 rounded-md border border-slate-200 bg-slate-50/50">
							{providers.map((p) => (
								<span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs">
									{p}
									<button type="button" onClick={() => handleRemoveProvider(p)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
										<X className="w-3 h-3" />
									</button>
								</span>
							))}
						</div>
						<div className="flex items-center gap-2 pt-1">
							<Input
								value={newProvider}
								onChange={(e) => setNewProvider(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddProvider();
									}
								}}
								placeholder={localizationConstants.friskvardAddProviderPlaceholder}
								className="h-8 text-xs flex-1"
							/>
							<Button type="button" variant="outline" size="sm" onClick={handleAddProvider} className="h-8 px-2.5 text-xs font-medium cursor-pointer">
								<Plus className="w-3.5 h-3.5 mr-1" />
								<Translate text={localizationConstants.friskvardBtnAddProvider} />
							</Button>
						</div>
					</div>

					<DialogFooter className="gap-2 pt-3">
						<Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs cursor-pointer">
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button type="submit" size="sm" className="h-9 text-xs bg-[#111721] hover:bg-slate-800 text-white cursor-pointer">
							<Translate text={localizationConstants.save} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
