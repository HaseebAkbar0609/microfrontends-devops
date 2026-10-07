"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItSystemItem } from "../../types/dataItOverview.types";

interface DataItAddSystemDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	existingSystems: DataItSystemItem[];
	employeeEmail: string;
	onAdd: (item: DataItSystemItem) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DataItAddSystemDialog({
	open,
	onOpenChange,
	existingSystems,
	employeeEmail,
	onAdd,
}: DataItAddSystemDialogProps) {
	const t = useTranslate();
	const [category, setCategory] = useState("Administration");
	const [programName, setProgramName] = useState("");
	const [email, setEmail] = useState(employeeEmail);
	const [passwordStatus, setPasswordStatus] = useState("•••••••• (SSO)");
	const [monthlyCost, setMonthlyCost] = useState(500);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const resetForm = () => {
		setCategory("Administration");
		setProgramName("");
		setEmail(employeeEmail);
		setPasswordStatus("•••••••• (SSO)");
		setMonthlyCost(500);
		setErrors({});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: Record<string, string> = {};
		if (!programName.trim()) {
			newErrors.programName = t(localizationConstants.dataItValidationRequired);
		}
		if (!category.trim()) {
			newErrors.category = t(localizationConstants.dataItValidationRequired);
		}
		if (!email.trim()) {
			newErrors.email = t(localizationConstants.dataItValidationRequired);
		} else if (!EMAIL_REGEX.test(email.trim())) {
			newErrors.email = t(localizationConstants.dataItValidationEmailInvalid);
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// Calculate guaranteed collision-free sequential ID
		const maxNum = existingSystems.reduce((max, item) => {
			const match = item.id.match(/\d+/);
			return match ? Math.max(max, parseInt(match[0], 10)) : max;
		}, 1012);
		const newId = `SYS-${maxNum + 1}`;

		onAdd({
			id: newId,
			category: category.trim(),
			programName: programName.trim(),
			email: email.trim(),
			passwordStatus: passwordStatus.trim(),
			monthlyCost: Number(monthlyCost) || 0,
		});

		resetForm();
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) resetForm();
				onOpenChange(isOpen);
			}}
		>
			<DialogContent className="max-w-md bg-white p-6 shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItAddSystemModalTitle)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColSystemProgram)} *
							</label>
							<input
								type="text"
								value={programName}
								onChange={(e) => {
									setProgramName(e.target.value);
									if (errors.programName)
										setErrors((prev) => ({ ...prev, programName: "" }));
								}}
								className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
									errors.programName
										? "border-rose-400 focus:border-rose-500"
										: "border-slate-200 focus:border-slate-400"
								}`}
							/>
							{errors.programName && (
								<p className="mt-1 text-xs text-rose-500">{errors.programName}</p>
							)}
						</div>
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColSystemCategory)} *
							</label>
							<input
								type="text"
								value={category}
								onChange={(e) => {
									setCategory(e.target.value);
									if (errors.category)
										setErrors((prev) => ({ ...prev, category: "" }));
								}}
								className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
									errors.category
										? "border-rose-400 focus:border-rose-500"
										: "border-slate-200 focus:border-slate-400"
								}`}
							/>
							{errors.category && (
								<p className="mt-1 text-xs text-rose-500">{errors.category}</p>
							)}
						</div>
					</div>

					<div>
						<label className="text-xs font-medium text-slate-500">
							{t(localizationConstants.dataItColSystemEmail)} *
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
							}}
							className={`mt-1 h-9 w-full rounded-md border px-3 text-sm text-slate-800 focus:outline-none ${
								errors.email
									? "border-rose-400 focus:border-rose-500"
									: "border-slate-200 focus:border-slate-400"
							}`}
						/>
						{errors.email && (
							<p className="mt-1 text-xs text-rose-500">{errors.email}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColSystemPassword)}
							</label>
							<input
								type="text"
								value={passwordStatus}
								onChange={(e) => setPasswordStatus(e.target.value)}
								className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:border-slate-400"
							/>
						</div>
						<div>
							<label className="text-xs font-medium text-slate-500">
								{t(localizationConstants.dataItColSystemMonthlyCost)} (SEK)
							</label>
							<input
								type="number"
								min={0}
								value={monthlyCost}
								onChange={(e) => setMonthlyCost(Number(e.target.value))}
								className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:border-slate-400"
							/>
						</div>
					</div>

					<DialogFooter className="mt-4 flex justify-end gap-2">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="rounded-md border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
						>
							{t(localizationConstants.dataItBtnCancel)}
						</button>
						<button
							type="submit"
							className="rounded-md bg-slate-950 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
						>
							{t(localizationConstants.dataItAddSystemBtn)}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
