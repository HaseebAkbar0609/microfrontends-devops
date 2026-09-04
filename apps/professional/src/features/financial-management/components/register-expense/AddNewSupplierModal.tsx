"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddNewSupplierModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddSupplier: (name: string) => void;
}

export function AddNewSupplierModal({
	open,
	onOpenChange,
	onAddSupplier,
}: AddNewSupplierModalProps) {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [orgNo, setOrgNo] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			setError(t(localizationConstants.registerExpenseErrorSupplierRequired));
			return;
		}
		onAddSupplier(trimmed);
		setName("");
		setOrgNo("");
		setError("");
	};

	const handleClose = () => {
		setName("");
		setOrgNo("");
		setError("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl border-slate-200">
				<DialogHeader>
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.registerExpenseModalAddSupplierTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div>
						<Label className="text-xs font-semibold text-slate-700 block mb-1">
							<Translate text={localizationConstants.registerExpenseModalSupplierNameLabel} /> *
						</Label>
						<Input
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (error) setError("");
							}}
							placeholder={t(localizationConstants.registerExpenseModalSupplierNamePlaceholder)}
							className={`h-9 text-xs border-slate-200 bg-white rounded-md ${
								error ? "border-rose-500 ring-1 ring-rose-500" : ""
							}`}
							autoFocus
						/>
						{error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
					</div>

					<div>
						<Label className="text-xs font-semibold text-slate-700 block mb-1">
							<Translate text={localizationConstants.registerExpenseModalSupplierOrgNoLabel} />
						</Label>
						<Input
							value={orgNo}
							onChange={(e) => setOrgNo(e.target.value)}
							placeholder={t(localizationConstants.registerExpenseModalSupplierOrgNoPlaceholder)}
							className="h-9 text-xs border-slate-200 bg-white rounded-md"
						/>
					</div>

					<DialogFooter className="mt-5 flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleClose}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.registerExpenseBtnCancel} />
						</Button>
						<Button
							type="submit"
							size="sm"
							className="text-xs bg-zinc-900 hover:bg-slate-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.registerExpenseModalAddSupplierBtn} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddNewSupplierModal;
