"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PaymentMilestone, UeLevPaymentPlan, UeLevStatus } from "../types/paymentPlan.types";
import { PAYMENT_PLAN_CONSTANTS } from "../constants/paymentPlan.constants";

/* =========================================================================
   1. Add / Edit Milestone Modal
   ========================================================================= */
export interface AddMilestoneModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (milestone: Omit<PaymentMilestone, "id">) => void;
	contractSum?: number;
	retainedPercent?: number;
}

export function AddMilestoneModal({
	isOpen,
	onClose,
	onAdd,
	contractSum = PAYMENT_PLAN_CONSTANTS.DEFAULT_CONTRACT_SUM,
	retainedPercent = PAYMENT_PLAN_CONSTANTS.DEFAULT_RETAINED_ACONTO_PERCENT,
}: AddMilestoneModalProps) {
	const t = useTranslate();
	const [activity, setActivity] = useState("");
	const [lyft, setLyft] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [percentage, setPercentage] = useState<string>("10");
	const [amount, setAmount] = useState<string>("500000");
	const [errorActivity, setErrorActivity] = useState("");
	const [errorAmount, setErrorAmount] = useState("");

	useEffect(() => {
		if (isOpen) {
			setActivity("");
			setLyft("");
			setDate(new Date().toISOString().split("T")[0]);
			setPercentage("10");
			const calculatedAmount = Math.round((contractSum * 10) / 100);
			setAmount(String(calculatedAmount));
			setErrorActivity("");
			setErrorAmount("");
		}
	}, [isOpen, contractSum]);

	const handlePercentageChange = (val: string) => {
		setPercentage(val);
		const p = parseFloat(val);
		if (!isNaN(p) && p > 0) {
			const calculated = Math.round((contractSum * p) / 100);
			setAmount(String(calculated));
			setErrorAmount("");
		}
	};

	const handleAmountChange = (val: string) => {
		setAmount(val);
		const a = parseFloat(val);
		if (!isNaN(a) && a > 0 && contractSum > 0) {
			const calculated = Number(((a / contractSum) * 100).toFixed(2));
			setPercentage(String(calculated));
			setErrorAmount("");
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		let valid = true;
		if (!activity.trim()) {
			setErrorActivity(t(localizationConstants.errMilestoneNameRequired));
			valid = false;
		}
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0) {
			setErrorAmount(t(localizationConstants.errMilestoneAmountRequired));
			valid = false;
		}
		if (!valid) return;

		const retainedAmount = -Math.round((numAmount * retainedPercent) / 100);
		const attErhalla = numAmount + retainedAmount;

		onAdd({
			activity: activity.trim(),
			lyft: lyft.trim() || "-",
			date,
			belopp: numAmount,
			innehallet: retainedAmount,
			attErhalla,
			percentage: parseFloat(percentage) || undefined,
			status: "not_invoiced",
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-white border border-slate-200 p-6 rounded-xl">
				<DialogHeader>
					<DialogTitle className="text-slate-900 font-semibold text-lg">
						{t(localizationConstants.modalAddMilestoneTitle)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colAktivitet)} *
						</Label>
						<Input
							value={activity}
							onChange={(e) => {
								setActivity(e.target.value);
								if (e.target.value.trim()) setErrorActivity("");
							}}
							placeholder="t.ex. Aconto 1, Slutbetalning"
							className="h-10 text-sm border-slate-200"
						/>
						{errorActivity && <p className="text-xs text-rose-500">{errorActivity}</p>}
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colLyft)}
						</Label>
						<Input
							value={lyft}
							onChange={(e) => setLyft(e.target.value)}
							placeholder="t.ex. Grund, Stomme, Installationer"
							className="h-10 text-sm border-slate-200"
						/>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colDatum)}
						</Label>
						<Input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="h-10 text-sm border-slate-200"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-medium text-slate-700">
								{t(localizationConstants.lblPercentage)}
							</Label>
							<Input
								type="number"
								step="any"
								min="0"
								max="100"
								value={percentage}
								onChange={(e) => handlePercentageChange(e.target.value)}
								className="h-10 text-sm border-slate-200"
							/>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs font-medium text-slate-700">
								{t(localizationConstants.colBelopp)} (kr) *
							</Label>
							<Input
								type="number"
								min="0"
								value={amount}
								onChange={(e) => handleAmountChange(e.target.value)}
								className="h-10 text-sm border-slate-200"
							/>
						</div>
					</div>
					{errorAmount && <p className="text-xs text-rose-500">{errorAmount}</p>}

					<DialogFooter className="flex gap-2 sm:justify-end pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							{t(localizationConstants.btnAvbryt)}
						</Button>
						<Button
							type="submit"
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-5 text-sm font-medium cursor-pointer"
						>
							{t(localizationConstants.btnLaggTill)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/* =========================================================================
   2. Add Beställare Payment Plan Modal
   ========================================================================= */
export interface AddPaymentPlanModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (name: string, fileName?: string) => void;
}

export function AddPaymentPlanModal({ isOpen, onClose, onAdd }: AddPaymentPlanModalProps) {
	const t = useTranslate();
	const [name, setName] = useState("");
	const [fileName, setFileName] = useState("Kontrakt.pdf");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError(t(localizationConstants.companyNameRequired));
			return;
		}
		onAdd(name.trim(), fileName.trim() || "Kontrakt.pdf");
		setName("");
		setFileName("Kontrakt.pdf");
		setError("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-white border border-slate-200 p-6 rounded-xl">
				<DialogHeader>
					<DialogTitle className="text-slate-900 font-semibold text-lg">
						{t(localizationConstants.modalAddPlanTitle)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colBetalningsplan)} *
						</Label>
						<Input
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (e.target.value.trim()) setError("");
							}}
							placeholder="t.ex. Betalningsplan etapp 4"
							className="h-10 text-sm border-slate-200"
						/>
						{error && <p className="text-xs text-rose-500">{error}</p>}
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colFil)}
						</Label>
						<Input
							value={fileName}
							onChange={(e) => setFileName(e.target.value)}
							placeholder="Kontrakt.pdf"
							className="h-10 text-sm border-slate-200"
						/>
					</div>

					<DialogFooter className="flex gap-2 sm:justify-end pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							{t(localizationConstants.btnAvbryt)}
						</Button>
						<Button
							type="submit"
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-5 text-sm font-medium cursor-pointer"
						>
							{t(localizationConstants.btnLaggTill)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/* =========================================================================
   3. Add UE / Lev Payment Plan Modal
   ========================================================================= */
export interface AddUeLevPlanModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (plan: Partial<UeLevPaymentPlan>) => void;
}

export function AddUeLevPlanModal({ isOpen, onClose, onAdd }: AddUeLevPlanModalProps) {
	const t = useTranslate();
	const [companyName, setCompanyName] = useState("");
	const [totalAmount, setTotalAmount] = useState("");
	const [status, setStatus] = useState<UeLevStatus>("not_ready");
	const [role, setRole] = useState("");
	const [errorName, setErrorName] = useState("");
	const [errorAmount, setErrorAmount] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		let valid = true;

		if (!companyName.trim()) {
			setErrorName(t(localizationConstants.companyNameRequired));
			valid = false;
		}

		const numAmount = parseFloat(totalAmount);
		if (isNaN(numAmount) || numAmount <= 0) {
			setErrorAmount(t(localizationConstants.errMilestoneAmountRequired));
			valid = false;
		}

		if (!valid) return;

		onAdd({
			companyName: companyName.trim(),
			totalAmount: numAmount,
			status,
			role: role.trim() || undefined,
		});

		setCompanyName("");
		setTotalAmount("");
		setRole("");
		setStatus("not_ready");
		setErrorName("");
		setErrorAmount("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-white border border-slate-200 p-6 rounded-xl">
				<DialogHeader>
					<DialogTitle className="text-slate-900 font-semibold text-lg">
						{t(localizationConstants.modalAddUePlanTitle)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colForetagsNamn)} *
						</Label>
						<Input
							value={companyName}
							onChange={(e) => {
								setCompanyName(e.target.value);
								if (e.target.value.trim()) setErrorName("");
							}}
							placeholder="t.ex. Pelle Målare"
							className="h-10 text-sm border-slate-200"
						/>
						{errorName && <p className="text-xs text-rose-500">{errorName}</p>}
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colTotal)} (kr) *
						</Label>
						<Input
							type="number"
							min="0"
							value={totalAmount}
							onChange={(e) => {
								setTotalAmount(e.target.value);
								if (e.target.value.trim()) setErrorAmount("");
							}}
							placeholder="150000"
							className="h-10 text-sm border-slate-200"
						/>
						{errorAmount && <p className="text-xs text-rose-500">{errorAmount}</p>}
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.orgColRoll)}
						</Label>
						<Input
							value={role}
							onChange={(e) => setRole(e.target.value)}
							placeholder="t.ex. Målare, VVS, El"
							className="h-10 text-sm border-slate-200"
						/>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-medium text-slate-700">
							{t(localizationConstants.colStatus)}
						</Label>
						<Select value={status} onValueChange={(val) => setStatus(val as UeLevStatus)}>
							<SelectTrigger className="h-10 text-sm border-slate-200">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="approved">{t(localizationConstants.statusGodkand)}</SelectItem>
								<SelectItem value="under_review">{t(localizationConstants.statusGranskas)}</SelectItem>
								<SelectItem value="not_ready">{t(localizationConstants.statusEjKlar)}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<DialogFooter className="flex gap-2 sm:justify-end pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							{t(localizationConstants.btnAvbryt)}
						</Button>
						<Button
							type="submit"
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-5 text-sm font-medium cursor-pointer"
						>
							{t(localizationConstants.btnLaggTill)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/* =========================================================================
   4. Generic Confirmation Modals (Delete & Send)
   ========================================================================= */
export interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	itemName?: string;
	planName?: string;
	type?: "delete" | "send";
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	itemName,
	planName,
	type = "delete",
}: ConfirmModalProps) {
	const t = useTranslate();

	const resolvedItem = itemName || planName;
	const isDelete = type === "delete";
	const defaultTitle = isDelete
		? t(localizationConstants.modalDeletePlanTitle)
		: t(localizationConstants.modalSendPlanTitle);
	const defaultDesc = isDelete
		? t(localizationConstants.modalDeletePlanDesc)
		: t(localizationConstants.modalSendPlanDesc);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-white border border-slate-200 p-6 rounded-xl">
				<DialogHeader>
					<DialogTitle className="text-slate-900 font-semibold text-lg">
						{title || defaultTitle}
					</DialogTitle>
					<DialogDescription className="text-slate-600 text-sm mt-1">
						{description || defaultDesc}
					</DialogDescription>
					{resolvedItem && (
						<p className="mt-2 text-sm font-medium text-slate-900 truncate">
							{resolvedItem}
						</p>
					)}
				</DialogHeader>

				<DialogFooter className="flex gap-2 sm:justify-end pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						{t(localizationConstants.btnAvbryt)}
					</Button>
					{isDelete ? (
						<Button
							type="button"
							onClick={() => {
								onConfirm();
								onClose();
							}}
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 text-sm font-medium cursor-pointer"
						>
							{t(localizationConstants.btnRadera)}
						</Button>
					) : (
						<Button
							type="button"
							onClick={() => {
								onConfirm();
								onClose();
							}}
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 text-sm font-medium cursor-pointer inline-flex items-center gap-2"
						>
							<Send className="h-4 w-4" />
							<span>{t(localizationConstants.btnSkicka)}</span>
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
