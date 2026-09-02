"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceDetailData } from "../../types/invoiceDetail.types";

interface EditInvoiceDetailModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	section: "header" | "paymentPlan" | "comments" | null;
	data: InvoiceDetailData;
	onSave: (updates: Partial<InvoiceDetailData>) => void;
}

export function EditInvoiceDetailModal({
	open,
	onOpenChange,
	section,
	data,
	onSave,
}: EditInvoiceDetailModalProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState({
		projectName: data.projectName,
		projectNumber: data.projectNumber,
		contactPerson: data.contactPerson,
		customer: data.customer,
		invoiceDate: data.invoiceDate,
		dueDate: data.dueDate,
		pricingModel: data.pricingModel,
		category: data.category,
		comments: data.comments,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setFormData({
			projectName: data.projectName,
			projectNumber: data.projectNumber,
			contactPerson: data.contactPerson,
			customer: data.customer,
			invoiceDate: data.invoiceDate,
			dueDate: data.dueDate,
			pricingModel: data.pricingModel,
			category: data.category,
			comments: data.comments,
		});
		setErrors({});
	}, [data, open]);

	const validate = () => {
		if (section === "comments") return true;

		const nextErrors: Record<string, string> = {};
		if (!formData.projectName.trim()) {
			nextErrors.projectName = t(localizationConstants.invoiceDetailValidationRequired);
		}
		if (!formData.projectNumber.trim()) {
			nextErrors.projectNumber = t(localizationConstants.invoiceDetailValidationRequired);
		}
		if (!formData.customer.trim()) {
			nextErrors.customer = t(localizationConstants.invoiceDetailValidationRequired);
		}
		if (!formData.contactPerson.trim()) {
			nextErrors.contactPerson = t(localizationConstants.invoiceDetailValidationRequired);
		}
		if (!formData.invoiceDate.trim()) {
			nextErrors.invoiceDate = t(localizationConstants.invoiceDetailValidationRequired);
		}
		if (!formData.dueDate.trim()) {
			nextErrors.dueDate = t(localizationConstants.invoiceDetailValidationRequired);
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSave = () => {
		if (!validate()) return;
		onSave(formData);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl bg-white p-6 rounded-xl shadow-2xl">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.actionEdit} /> -{" "}
						{section === "comments" ? (
							<Translate text={localizationConstants.invoiceDetailEditComments} />
						) : section === "paymentPlan" ? (
							<Translate text={localizationConstants.invoiceDetailEditPaymentPlan} />
						) : (
							<Translate text={localizationConstants.invoiceDetailEditGeneralInfo} />
						)}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4 text-xs">
					{section === "comments" ? (
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.createInvoiceCommentTitle} />
							</Label>
							<Textarea
								rows={6}
								value={formData.comments}
								onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
								className="text-xs border-slate-200 resize-y rounded-md"
								placeholder={t(localizationConstants.createInvoiceCommentPlaceholder)}
							/>
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.createInvoiceFieldProjectName} /> *
								</Label>
								<Input
									value={formData.projectName}
									onChange={(e) => {
										setFormData({ ...formData, projectName: e.target.value });
										if (errors.projectName) setErrors({ ...errors, projectName: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${errors.projectName ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
								/>
								{errors.projectName && <p className="text-[11px] text-rose-500">{errors.projectName}</p>}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.createInvoiceFieldProjectNumber} /> *
								</Label>
								<Input
									value={formData.projectNumber}
									onChange={(e) => {
										setFormData({ ...formData, projectNumber: e.target.value });
										if (errors.projectNumber) setErrors({ ...errors, projectNumber: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${errors.projectNumber ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
								/>
								{errors.projectNumber && <p className="text-[11px] text-rose-500">{errors.projectNumber}</p>}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.createInvoiceFieldContactPerson} /> *
								</Label>
								<Input
									value={formData.contactPerson}
									onChange={(e) => {
										setFormData({ ...formData, contactPerson: e.target.value });
										if (errors.contactPerson) setErrors({ ...errors, contactPerson: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${errors.contactPerson ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
								/>
								{errors.contactPerson && <p className="text-[11px] text-rose-500">{errors.contactPerson}</p>}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.createInvoiceFieldCustomer} /> *
								</Label>
								<Input
									value={formData.customer}
									onChange={(e) => {
										setFormData({ ...formData, customer: e.target.value });
										if (errors.customer) setErrors({ ...errors, customer: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${errors.customer ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
								/>
								{errors.customer && <p className="text-[11px] text-rose-500">{errors.customer}</p>}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.createInvoiceFieldInvoiceDate} /> *
								</Label>
								<Input
									type="date"
									value={formData.invoiceDate}
									onChange={(e) => {
										setFormData({ ...formData, invoiceDate: e.target.value });
										if (errors.invoiceDate) setErrors({ ...errors, invoiceDate: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${errors.invoiceDate ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
								/>
								{errors.invoiceDate && <p className="text-[11px] text-rose-500">{errors.invoiceDate}</p>}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.invoiceColumnDueDate} /> *
								</Label>
								<Input
									type="date"
									value={formData.dueDate}
									onChange={(e) => {
										setFormData({ ...formData, dueDate: e.target.value });
										if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${errors.dueDate ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
								/>
								{errors.dueDate && <p className="text-[11px] text-rose-500">{errors.dueDate}</p>}
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="border-t border-slate-100 pt-3 flex justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="h-8 text-xs cursor-pointer border-slate-200 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.createInvoiceBtnCancel} />
					</Button>
					<Button
						size="sm"
						onClick={handleSave}
						className="h-8 text-xs bg-zinc-900 hover:bg-slate-800 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.createInvoiceBtnSave} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default EditInvoiceDetailModal;
