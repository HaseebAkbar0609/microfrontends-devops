"use client";

import React, { useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { STAFF_CONSTANTS } from "../constants/staff.constants";
import type { AddStaffPayload, StaffLedgerItem, StaffRole } from "../types/staff.types";

export interface AddStaffModalProps {
	isOpen: boolean;
	isSubmitting: boolean;
	onClose: () => void;
	onSubmit: (payload: AddStaffPayload) => void;
}

export function AddStaffModal({
	isOpen,
	isSubmitting,
	onClose,
	onSubmit,
}: AddStaffModalProps) {
	const t = useTranslate();

	const [name, setName] = useState<string>("");
	const [role, setRole] = useState<StaffRole>("Snickare");
	const [personNumber, setPersonNumber] = useState<string>("");
	const [isOwnStaff, setIsOwnStaff] = useState<boolean>(true);
	const [ue, setUe] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [errors, setErrors] = useState<{ name?: boolean; personNumber?: boolean }>({});

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: { name?: boolean; personNumber?: boolean } = {};
		if (!name.trim()) newErrors.name = true;
		if (!personNumber.trim()) newErrors.personNumber = true;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		onSubmit({
			name: name.trim(),
			role,
			personNumber: personNumber.trim(),
			isOwnStaff,
			ue: ue.trim() || undefined,
			phone: phone.trim() || undefined,
			email: email.trim() || undefined,
		});

		// Reset form
		setName("");
		setRole("Snickare");
		setPersonNumber("");
		setIsOwnStaff(true);
		setUe("");
		setPhone("");
		setEmail("");
		setErrors({});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white font-sans p-0 overflow-hidden">
				<DialogHeader className="px-6 py-4 border-b border-slate-200">
					<DialogTitle className="font-sans text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.staffAddModalTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
					{/* Namn */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-sans text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.staffColName} /> *
						</Label>
						<Input
							type="text"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
							}}
							placeholder={t(localizationConstants.staffPlaceholderName)}
							className={`h-10 text-sm border-slate-200 bg-white ${
								errors.name ? "border-rose-500 focus:ring-rose-500" : ""
							}`}
						/>
						{errors.name && (
							<span className="text-xs text-rose-600">
								<Translate text={localizationConstants.staffRequiredName} />
							</span>
						)}
					</div>

					{/* Person nr */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-sans text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.staffColPersonNr} /> *
						</Label>
						<Input
							type="text"
							value={personNumber}
							onChange={(e) => {
								setPersonNumber(e.target.value);
								if (errors.personNumber)
									setErrors((prev) => ({ ...prev, personNumber: false }));
							}}
							placeholder={t(localizationConstants.staffPlaceholderPersonNr)}
							className={`h-10 text-sm border-slate-200 bg-white ${
								errors.personNumber ? "border-rose-500 focus:ring-rose-500" : ""
							}`}
						/>
						{errors.personNumber && (
							<span className="text-xs text-rose-600">
								<Translate text={localizationConstants.staffRequiredPersonNr} />
							</span>
						)}
					</div>

					{/* Roll */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-sans text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.staffColRole} /> *
						</Label>
						<Select value={role} onValueChange={(val) => setRole(val as StaffRole)}>
							<SelectTrigger className="h-10 w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 shadow-none">
								<SelectValue placeholder={role} />
							</SelectTrigger>
							<SelectContent className="bg-white border border-slate-200 shadow-md">
								{STAFF_CONSTANTS.ROLES.map((r) => (
									<SelectItem key={r} value={r} className="text-sm cursor-pointer">
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Egen personal checkbox */}
					<div className="flex items-center gap-2 pt-1">
						<Checkbox
							id="is-own-staff"
							checked={isOwnStaff}
							onCheckedChange={(checked) => setIsOwnStaff(!!checked)}
							className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
						/>
						<Label
							htmlFor="is-own-staff"
							className="font-sans text-sm text-slate-800 cursor-pointer select-none"
						>
							<Translate text={localizationConstants.staffColOwnStaff} />
						</Label>
					</div>

					{/* UE */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-sans text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.staffColUe} />
						</Label>
						<Input
							type="text"
							value={ue}
							onChange={(e) => setUe(e.target.value)}
							placeholder={t(localizationConstants.staffPlaceholderUe)}
							className="h-10 text-sm border-slate-200 bg-white"
						/>
					</div>

					{/* Telefon */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-sans text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.staffColPhone} />
						</Label>
						<Input
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder={t(localizationConstants.staffPlaceholderPhone)}
							className="h-10 text-sm border-slate-200 bg-white"
						/>
					</div>

					{/* E-post */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-sans text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.staffColEmail} />
						</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={t(localizationConstants.staffPlaceholderEmail)}
							className="h-10 text-sm border-slate-200 bg-white"
						/>
					</div>

					<DialogFooter className="px-0 pt-3 flex items-center justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="h-9 px-4 text-xs font-medium border-slate-300 rounded text-slate-700 hover:bg-slate-100 cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.staffBtnCancel} />
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-9 px-4 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.staffBtnSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export interface RemoveStaffConfirmDialogProps {
	isOpen: boolean;
	item: StaffLedgerItem | null;
	isSubmitting: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function RemoveStaffConfirmDialog({
	isOpen,
	item,
	isSubmitting,
	onClose,
	onConfirm,
}: RemoveStaffConfirmDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white max-w-md font-sans">
				<AlertDialogHeader>
					<AlertDialogTitle className="font-sans text-base font-bold text-slate-900">
						<Translate text={localizationConstants.staffDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="font-sans text-sm text-slate-600">
						<Translate text={localizationConstants.staffDeleteConfirmDesc} />
						{item && (
							<span className="block font-medium text-slate-800 mt-2">
								{item.name} ({item.role})
							</span>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex items-center justify-end gap-2 pt-2">
					<AlertDialogCancel
						onClick={onClose}
						className="h-9 px-4 text-xs font-medium border-slate-300 text-slate-700 hover:bg-slate-100 shadow-none cursor-pointer rounded"
					>
						<Translate text={localizationConstants.staffBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isSubmitting}
						className="h-9 px-4 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-none cursor-pointer rounded"
					>
						<Translate text={localizationConstants.staffDeleteBtnConfirm} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
