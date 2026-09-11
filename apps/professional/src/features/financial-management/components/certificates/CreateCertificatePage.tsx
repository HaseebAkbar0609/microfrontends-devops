"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Save, Upload, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	CERTIFICATE_CATEGORY_OPTIONS,
	OBJECT_TYPE_OPTIONS,
	RESPONSIBLE_PERSON_OPTIONS,
	RESPONSIBLE_ROLE_OPTIONS,
	MASTER_APPROVER_OPTIONS,
	MASTER_ROLE_OPTIONS,
	CERTIFICATES_BASE_ROUTE,
} from "../../constants/certificates.constants";
import type { CertificateItem, CertificateFormData } from "../../types/certificates.types";
import { useCertificates } from "../../hooks/useCertificates";

interface CreateCertificatePageProps {
	initialItem?: CertificateItem;
	isEditMode?: boolean;
}

export function CreateCertificatePage({
	initialItem,
	isEditMode = false,
}: CreateCertificatePageProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const { createCertificate, updateCertificate } = useCertificates();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState<CertificateFormData>({
		id: initialItem?.id || "",
		category: initialItem?.category || "",
		name: initialItem?.name || "",
		objectType: initialItem?.objectType || "",
		objectId: initialItem?.objectId || "",
		objectName: initialItem?.objectName || "",
		responsiblePerson: initialItem?.responsiblePerson || "",
		responsibleRole: initialItem?.responsibleRole || "",
		masterApprover: initialItem?.masterApprover || "",
		masterRole: initialItem?.masterRole || "",
		issueDate: initialItem?.issueDate || "",
		expiryDate: initialItem?.expiryDate || "",
		description: initialItem?.description || "",
		fileName: initialItem?.fileName || "",
		fileSize: initialItem?.fileSize || "",
		fileUrl: initialItem?.fileUrl || "",
	});

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleFileChange = (file: File | null) => {
		if (file) {
			setSelectedFile(file);
			setFormData((prev) => ({
				...prev,
				fileName: file.name,
				fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
				fileUrl: URL.createObjectURL(file),
			}));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = t(localizationConstants.valCertNameRequired);
		}
		if (!formData.category) {
			newErrors.category = t(localizationConstants.valCertCategoryRequired);
		}
		if (!formData.objectType && !formData.objectId) {
			newErrors.objectType = t(localizationConstants.valCertObjectRequired);
		}
		if (!formData.responsiblePerson) {
			newErrors.responsiblePerson = t(localizationConstants.valCertResponsibleRequired);
		}
		if (formData.issueDate && formData.expiryDate) {
			if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
				newErrors.expiryDate = t(localizationConstants.valCertExpiryAfterIssue);
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			if (isEditMode && initialItem) {
				updateCertificate(initialItem.id, {
					...formData,
					file: selectedFile,
				});
			} else {
				createCertificate({
					...formData,
					file: selectedFile,
				});
			}
			router.push(CERTIFICATES_BASE_ROUTE);
		} catch (error) {
			console.error("Failed to save certificate:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Bar with Back Arrow + Title */}
			<div className="bg-white border-b border-slate-200 px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.push(CERTIFICATES_BASE_ROUTE)}
						className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
						aria-label={t(localizationConstants.backAriaLabel)}
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-xl font-bold text-slate-900">
						{isEditMode ? (
							<Translate text={localizationConstants.btnEditCertificate} />
						) : (
							<Translate text={localizationConstants.titleNewCertificate} />
						)}
					</h1>
				</div>

				{/* Tab Header */}
				<div className="flex gap-6 mt-4 -mb-4">
					<button
						type="button"
						className="pb-3 border-b-2 border-slate-900 font-semibold text-sm text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.tabAttest} />
					</button>
				</div>
			</div>

			{/* Main Form Content */}
			<div className="p-6 max-w-5xl mx-auto w-full space-y-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Card 1: Grunduppgifter */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
						<div className="px-6 py-4 border-b border-slate-100 bg-white">
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.sectionBasicInfo} />
							</h2>
						</div>

						<div className="p-6 space-y-5">
							{/* Row 1: ID */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertId} />
									</label>
									<Input
										type="text"
										value={formData.id}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, id: e.target.value }))
										}
										placeholder={isEditMode ? initialItem?.id : "105"}
										className="h-10 text-sm bg-slate-50 border-slate-200 rounded-lg text-slate-800"
									/>
								</div>
							</div>

							{/* Row 2: Kategori & Benämning */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertCategory} />{" "}
										<span className="text-red-500">*</span>
									</label>
									<Select
										value={formData.category}
										onValueChange={(val) => {
											setFormData((prev) => ({ ...prev, category: val }));
											if (errors.category) {
												setErrors((prev) => ({ ...prev, category: "" }));
											}
										}}
									>
										<SelectTrigger className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
											<SelectValue placeholder={t(localizationConstants.fieldCertInfoPlaceholder)} />
										</SelectTrigger>
										<SelectContent>
											{CERTIFICATE_CATEGORY_OPTIONS.map((cat) => (
												<SelectItem key={cat} value={cat}>
													{cat}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.category && (
										<p className="text-xs text-red-500 mt-1">{errors.category}</p>
									)}
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertName} />{" "}
										<span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										value={formData.name}
										onChange={(e) => {
											setFormData((prev) => ({ ...prev, name: e.target.value }));
											if (errors.name) {
												setErrors((prev) => ({ ...prev, name: "" }));
											}
										}}
										placeholder={t(localizationConstants.fieldCertInfoPlaceholder)}
										className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-800"
									/>
									{errors.name && (
										<p className="text-xs text-red-500 mt-1">{errors.name}</p>
									)}
								</div>
							</div>

							{/* Row 3: Objekt & Object ID */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertObject} />{" "}
										<span className="text-red-500">*</span>
									</label>
									<Select
										value={formData.objectType}
										onValueChange={(val) => {
											setFormData((prev) => ({ ...prev, objectType: val }));
											if (errors.objectType) {
												setErrors((prev) => ({ ...prev, objectType: "" }));
											}
										}}
									>
										<SelectTrigger className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
											<SelectValue placeholder={t(localizationConstants.fieldCertInfoPlaceholder)} />
										</SelectTrigger>
										<SelectContent>
											{OBJECT_TYPE_OPTIONS.map((obj) => (
												<SelectItem key={obj} value={obj}>
													{obj}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.objectType && (
										<p className="text-xs text-red-500 mt-1">{errors.objectType}</p>
									)}
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertObjectId} />
									</label>
									<Input
										type="text"
										value={formData.objectId}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, objectId: e.target.value }))
										}
										placeholder={t(localizationConstants.fieldCertInfoPlaceholder)}
										className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-800"
									/>
								</div>
							</div>

							{/* Row 4: Objekt Namn */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertObjectName} />
									</label>
									<Input
										type="text"
										value={formData.objectName}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, objectName: e.target.value }))
										}
										placeholder={t(localizationConstants.fieldCertInfoPlaceholder)}
										className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-800"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Card 2: Attestflöde */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
						<div className="px-6 py-4 border-b border-slate-100 bg-white">
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.sectionAttestFlow} />
							</h2>
						</div>

						<div className="p-6 space-y-5">
							{/* Row 1: Attest ansvarig & Roll */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertResponsible} />{" "}
										<span className="text-red-500">*</span>
									</label>
									<Select
										value={formData.responsiblePerson}
										onValueChange={(val) => {
											setFormData((prev) => ({ ...prev, responsiblePerson: val }));
											if (errors.responsiblePerson) {
												setErrors((prev) => ({ ...prev, responsiblePerson: "" }));
											}
										}}
									>
										<SelectTrigger className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
											<SelectValue placeholder={t(localizationConstants.fieldCertInfoPlaceholder)} />
										</SelectTrigger>
										<SelectContent>
											{RESPONSIBLE_PERSON_OPTIONS.map((person) => (
												<SelectItem key={person} value={person}>
													{person}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.responsiblePerson && (
										<p className="text-xs text-red-500 mt-1">
											{errors.responsiblePerson}
										</p>
									)}
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertResponsibleRole} />
									</label>
									<Select
										value={formData.responsibleRole}
										onValueChange={(val) =>
											setFormData((prev) => ({ ...prev, responsibleRole: val }))
										}
									>
										<SelectTrigger className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
											<SelectValue placeholder={t(localizationConstants.fieldCertInfoPlaceholder)} />
										</SelectTrigger>
										<SelectContent>
											{RESPONSIBLE_ROLE_OPTIONS.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Row 2: Masterattest & Roll */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertMaster} />
									</label>
									<Select
										value={formData.masterApprover}
										onValueChange={(val) =>
											setFormData((prev) => ({ ...prev, masterApprover: val }))
										}
									>
										<SelectTrigger className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
											<SelectValue placeholder={t(localizationConstants.fieldCertInfoPlaceholder)} />
										</SelectTrigger>
										<SelectContent>
											{MASTER_APPROVER_OPTIONS.map((person) => (
												<SelectItem key={person} value={person}>
													{person}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1.5">
										<Translate text={localizationConstants.fieldCertMasterRole} />
									</label>
									<Select
										value={formData.masterRole}
										onValueChange={(val) =>
											setFormData((prev) => ({ ...prev, masterRole: val }))
										}
									>
										<SelectTrigger className="h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
											<SelectValue placeholder={t(localizationConstants.fieldCertInfoPlaceholder)} />
										</SelectTrigger>
										<SelectContent>
											{MASTER_ROLE_OPTIONS.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>

					{/* Card 3: Dokumentuppladdning (Jira Ticket Feature Requirement) */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
						<div className="px-6 py-4 border-b border-slate-100 bg-white">
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.fieldCertDocUpload} />
							</h2>
						</div>

						<div className="p-6">
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.png,.jpg,.jpeg"
								className="hidden"
								onChange={(e) => {
									if (e.target.files && e.target.files[0]) {
										handleFileChange(e.target.files[0]);
									}
								}}
							/>

							{formData.fileName ? (
								<div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
											<FileText className="w-5 h-5" />
										</div>
										<div>
											<p className="text-sm font-semibold text-slate-800">
												{formData.fileName}
											</p>
											<p className="text-xs text-slate-500">
												{formData.fileSize || "1.2 MB"}
											</p>
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => {
											setSelectedFile(null);
											setFormData((prev) => ({
												...prev,
												fileName: "",
												fileSize: "",
												fileUrl: "",
											}));
										}}
										className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-md"
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							) : (
								<div
									onDragOver={(e) => {
										e.preventDefault();
										setIsDragOver(true);
									}}
									onDragLeave={() => setIsDragOver(false)}
									onDrop={(e) => {
										e.preventDefault();
										setIsDragOver(false);
										if (e.dataTransfer.files && e.dataTransfer.files[0]) {
											handleFileChange(e.dataTransfer.files[0]);
										}
									}}
									onClick={() => fileInputRef.current?.click()}
									className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
										isDragOver
											? "border-blue-500 bg-blue-50/50"
											: "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
									}`}
								>
									<div className="flex flex-col items-center justify-center">
										<div className="p-3 bg-slate-100 text-slate-600 rounded-full mb-3">
											<Upload className="w-6 h-6" />
										</div>
										<p className="text-sm font-semibold text-slate-800 mb-1">
											<Translate text={localizationConstants.fieldCertDocUpload} />
										</p>
										<p className="text-xs text-slate-500">
											<Translate text={localizationConstants.fieldCertDocUploadSubtitle} />
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Bottom Action Bar */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push(CERTIFICATES_BASE_ROUTE)}
							className="h-10 px-5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
						>
							<Translate text={localizationConstants.btnCancelCertificate} />
						</Button>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm gap-2 cursor-pointer"
						>
							<Save className="w-4 h-4" />
							<Translate text={localizationConstants.btnSaveCertificate} />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
