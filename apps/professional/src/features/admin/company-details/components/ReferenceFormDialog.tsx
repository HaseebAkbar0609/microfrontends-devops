"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { REFERENCE_ALLOWED_TYPES } from "../constants";
import { CompanyReference } from "../types";
import { uploadCompanyMedia } from "../api/companyInformation.api";
import {
	CompanyReferenceValues,
	companyReferenceSchema,
} from "../schemas/companyReference.schema";

const EMPTY_VALUES: CompanyReferenceValues = {
	project: "",
	customer: "",
	municipality: "",
	contact: "",
	phone: "",
};

interface ReferenceFormDialogProps {
	open: boolean;
	editingReference: CompanyReference | null;
	onClose: () => void;
	onSave: (values: CompanyReferenceValues & { fileMediaId: string | null }) => void;
	isSaving?: boolean;
}

const ReferenceFormDialog = ({
	open,
	editingReference,
	onClose,
	onSave,
	isSaving,
}: ReferenceFormDialogProps) => {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const fileInputId = useId();
	const [fileName, setFileName] = useState("");
	const [fileMediaId, setFileMediaId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const form = useForm<CompanyReferenceValues>({
		resolver: zodResolver(companyReferenceSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (!open) return;
		form.reset(
			editingReference
				? {
						project: editingReference.project,
						customer: editingReference.customer,
						municipality: editingReference.municipality,
						contact: editingReference.contact,
						phone: editingReference.phone,
					}
				: EMPTY_VALUES,
		);
		setFileName(editingReference?.file?.fileName ?? "");
		setFileMediaId(editingReference?.file?.mediaId ?? null);
	}, [open, editingReference, form]);

	const handleFileChange = async (file: File | undefined) => {
		if (!file) return;
		setFileName(file.name);
		setUploading(true);
		try {
			const uploaded = await uploadCompanyMedia(file);
			setFileMediaId(uploaded.mediaId);
		} catch (_error) {
			showToast("error", t(localizationConstants.profileUpdateFailed));
			setFileName(editingReference?.file?.fileName ?? "");
		} finally {
			setUploading(false);
		}
	};

	const handleSave = form.handleSubmit((values) => {
		onSave({ ...values, fileMediaId });
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-7">
				<DialogTitle className="text-xl font-bold text-slate-900">
					<Translate
						text={
							editingReference
								? localizationConstants.companyRefEditTitle
								: localizationConstants.companyRefNewTitle
						}
					/>
				</DialogTitle>
				<Form {...form}>
					<form onSubmit={handleSave} className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="project"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.companyRefColProject
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(
													localizationConstants.companyRefProjectPlaceholder,
												)}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<div className="hidden sm:block" />
							<FormField
								control={form.control}
								name="customer"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.companyRefColCustomer
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(
													localizationConstants.companyRefCustomerPlaceholder,
												)}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="municipality"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.companyRefColMunicipality
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(
													localizationConstants.textField,
												)}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="contact"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.companyRefColContact
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="annahanson@email.com"
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.companyRefColPhone
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="093-808-489"
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={localizationConstants.companyRefColPdf}
								/>
							</span>
							<div className="flex items-center gap-3">
								<label
									htmlFor={fileInputId}
									className="flex h-11 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 text-sm"
								>
									<span className="font-medium text-slate-900">
										<Translate
											text={localizationConstants.upload}
										/>
									</span>
									<input
										id={fileInputId}
										ref={fileInputRef}
										type="file"
										accept={REFERENCE_ALLOWED_TYPES.join(
											",",
										)}
										className="hidden"
										onChange={(event) => {
											void handleFileChange(
												event.target.files?.[0],
											);
											event.target.value = "";
										}}
									/>
									<span className="text-slate-500">
										{uploading ? (
											"..."
										) : (
											fileName || (
												<Translate
													text={
														localizationConstants.noFileChosen
													}
												/>
											)
										)}
									</span>
								</label>
								<Button
									type="button"
									onClick={() =>
										fileInputRef.current?.click()
									}
									disabled={uploading}
									className="h-11 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
								>
									<Translate
										text={localizationConstants.upload}
									/>
								</Button>
							</div>
							<p className="text-sm text-slate-400">
								<Translate
									text={
										localizationConstants.companyRefFileHint
									}
								/>
							</p>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-11 rounded-md border-slate-200 bg-white px-8 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								type="submit"
								disabled={uploading || isSaving}
								className="h-11 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								{editingReference ? (
									<Save className="h-4 w-4" />
								) : (
									<CirclePlus className="h-4 w-4" />
								)}
								<Translate
									text={
										editingReference
											? localizationConstants.save
											: localizationConstants.companyRefCreateBtn
									}
								/>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ReferenceFormDialog;
