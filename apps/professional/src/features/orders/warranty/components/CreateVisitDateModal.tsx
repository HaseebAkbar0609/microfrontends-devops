"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { InspectionDateItem } from "../types/warranty.types";

// Defined outside component body to avoid re-creation on every render
const createVisitDateSchema = (isSv: boolean) =>
	z.object({
		date: z.string().min(1, isSv ? "Datum krävs" : "Date is required"),
		reminderEmail: z
			.string()
			.min(1, isSv ? "E-post krävs" : "Email is required")
			.email(isSv ? "Ogiltig e-postadress" : "Invalid email address"),
		rule: z.string().min(1, isSv ? "Regel krävs" : "Rule is required"),
		documentName: z.string().min(1, isSv ? "Dokumentnamn krävs" : "Document name is required"),
	});

export type VisitDateFormData = z.infer<ReturnType<typeof createVisitDateSchema>>;

export interface CreateVisitDateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (dateItem: Omit<InspectionDateItem, "id">) => void;
}

export function CreateVisitDateModal({
	isOpen,
	onClose,
	onSave,
}: CreateVisitDateModalProps) {
	const { i18n } = useTranslation();
	const isSv = i18n.language === "sv";

	const visitDateSchema = useMemo(() => createVisitDateSchema(isSv), [isSv]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<VisitDateFormData>({
		resolver: zodResolver(visitDateSchema),
		defaultValues: {
			date: "",
			reminderEmail: "",
			rule: "",
			documentName: "",
		},
	});

	// Reset form fields whenever modal is opened
	useEffect(() => {
		if (isOpen) {
			reset({
				date: "",
				reminderEmail: "",
				rule: "",
				documentName: "",
			});
		}
	}, [isOpen, reset]);

	if (!isOpen) return null;

	const onSubmit = (data: VisitDateFormData) => {
		onSave({
			date: data.date,
			reminderEmail: data.reminderEmail,
			rule: data.rule,
			documentName: data.documentName,
			fileType: "pdf",
		});
		reset({
			date: "",
			reminderEmail: "",
			rule: "",
			documentName: "",
		});
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
			{/* Modal container with max-w-lg */}
			<div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col overflow-hidden border border-slate-200">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h3 className="text-base font-semibold text-slate-900 whitespace-nowrap">
						<Translate text={localizationConstants.createVisitDateTitle} />
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Form with React Hook Form + Zod Validation */}
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="p-6 flex flex-col gap-4 text-xs">
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
								<Translate text={localizationConstants.dateHeaderLabel} />
							</Label>
							<Input
								type="date"
								{...register("date")}
								className={`h-9 text-xs ${errors.date ? "border-red-500 focus-visible:ring-red-500" : ""}`}
							/>
							{errors.date && (
								<span className="text-[11px] font-medium text-red-500">{errors.date.message}</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
								<Translate text={localizationConstants.reminderEmailLabel} />
							</Label>
							<Input
								type="email"
								placeholder={isSv ? "t.ex. info@byggbolaget.se" : "e.g. info@byggbolaget.se"}
								{...register("reminderEmail")}
								className={`h-9 text-xs ${errors.reminderEmail ? "border-red-500 focus-visible:ring-red-500" : ""}`}
							/>
							{errors.reminderEmail && (
								<span className="text-[11px] font-medium text-red-500">{errors.reminderEmail.message}</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
								<Translate text={localizationConstants.ruleLabel} />
							</Label>
							<Input
								type="text"
								placeholder={isSv ? "t.ex. 01 månad innan" : "e.g. 1 month before"}
								{...register("rule")}
								className={`h-9 text-xs ${errors.rule ? "border-red-500 focus-visible:ring-red-500" : ""}`}
							/>
							{errors.rule && (
								<span className="text-[11px] font-medium text-red-500">{errors.rule.message}</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
								<Translate text={localizationConstants.documentNameHeader} />
							</Label>
							<Input
								type="text"
								placeholder={isSv ? "t.ex. Lönespecifikation Januari" : "e.g. Payslip January"}
								{...register("documentName")}
								className={`h-9 text-xs ${errors.documentName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
							/>
							{errors.documentName && (
								<span className="text-[11px] font-medium text-red-500">{errors.documentName.message}</span>
							)}
						</div>
					</div>

					{/* Modal Footer */}
					<div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="h-9 px-4 text-xs font-medium border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							className="h-9 px-5 gap-1.5 text-xs font-medium bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
						>
							<Check className="h-3.5 w-3.5" />
							<span><Translate text={localizationConstants.saveButton} /></span>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
