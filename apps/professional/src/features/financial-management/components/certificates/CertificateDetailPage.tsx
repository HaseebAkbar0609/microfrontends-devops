"use client";

import React from "react";
import { ArrowLeft, Edit2, Download, FileText, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CERTIFICATES_BASE_ROUTE } from "../../constants/certificates.constants";
import type { CertificateItem } from "../../types/certificates.types";

import { useTranslation } from "react-i18next";

interface CertificateDetailPageProps {
	item: CertificateItem;
	onEdit: (item: CertificateItem) => void;
}

export function CertificateDetailPage({
	item,
	onEdit,
}: CertificateDetailPageProps) {
	const router = useRouter();
	const { t } = useTranslation();

	const handleDownload = () => {
		// Mock download trigger for certificate document
		const element = document.createElement("a");
		const fileContent = `ID: ${item.id}\nObject: ${item.objectId || item.objectType}\nName: ${item.name}\nResponsible: ${item.responsiblePerson}\nMaster: ${item.masterApprover || "—"}\nIssue Date: ${item.issueDate || "—"}\nExpiry Date: ${item.expiryDate || "—"}`;
		const file = new Blob([fileContent], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = item.fileName || `attest_${item.id}.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Header with Back Arrow + #ID */}
			<div className="bg-white border-b border-slate-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.push(CERTIFICATES_BASE_ROUTE)}
							className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
							aria-label={t(localizationConstants.backAriaLabel)}
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div>
							<h1 className="text-xl font-bold text-slate-900">
								<Translate text={localizationConstants.titleCertificateDetails} />
							</h1>
							<p className="text-xs text-slate-500 font-mono">#{item.id}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							onClick={() => onEdit(item)}
							className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm gap-1.5 cursor-pointer"
						>
							<Edit2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnEditCertificate} />
						</Button>
					</div>
				</div>

				{/* Tabs: Budget / Attest */}
				<div className="flex gap-6 mt-4 -mb-4">
					<button
						type="button"
						className="pb-3 border-b-2 border-slate-900 font-semibold text-sm text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.tabAttest} />
					</button>
					<button
						type="button"
						className="pb-3 border-b-2 border-transparent font-medium text-sm text-slate-500 hover:text-slate-800 cursor-pointer"
					>
						<Translate text={localizationConstants.tabBudget} />
					</button>
				</div>
			</div>

			{/* Main Detail Content */}
			<div className="p-6 max-w-5xl mx-auto w-full space-y-6">
				{/* Card 1: Grunduppgifter */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
								<CheckCircle2 className="w-4 h-4" />
							</div>
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.sectionBasicInfo} />
							</h2>
						</div>

						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onEdit(item)}
							className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
						>
							<Edit2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnEditCertificate} />
						</Button>
					</div>

					<div className="p-6 space-y-6">
						{/* Grid: ID, Kategori, Benämning, Objekt */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertId} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{item.id}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertCategory} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{item.category || "—"}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertName} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{item.name}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertObject} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{item.objectType || "—"}
								</span>
							</div>
						</div>

						{/* Grid: Object ID, Objekt Namn */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertObjectId} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{item.objectId || "—"}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertObjectName} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{item.objectName || "—"}
								</span>
							</div>

							{item.issueDate && (
								<div>
									<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
										<Translate text={localizationConstants.fieldCertIssueDate} />
									</span>
									<span className="text-sm font-medium text-slate-800">
										{item.issueDate}
									</span>
								</div>
							)}

							{item.expiryDate && (
								<div>
									<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
										<Translate text={localizationConstants.fieldCertExpiryDate} />
									</span>
									<span className="text-sm font-medium text-slate-800">
										{item.expiryDate}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Card 2: Attestflöde */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
								<Clock className="w-4 h-4" />
							</div>
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.sectionAttestFlow} />
							</h2>
						</div>

						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onEdit(item)}
							className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
						>
							<Edit2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnEditCertificate} />
						</Button>
					</div>

					<div className="p-6">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertResponsible} />
								</span>
								<span className="text-sm font-semibold text-slate-900">
									{item.responsiblePerson === "Ej tildelad" ? (
										<Translate text={localizationConstants.fieldCertUnassigned} />
									) : (
										item.responsiblePerson
									)}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertResponsibleRole} />
								</span>
								<span className="text-sm font-medium text-slate-700">
									{item.responsibleRole || "—"}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertMaster} />
								</span>
								<span className="text-sm font-semibold text-slate-900">
									{item.masterApprover || "—"}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
									<Translate text={localizationConstants.fieldCertMasterRole} />
								</span>
								<span className="text-sm font-medium text-slate-700">
									{item.masterRole || "—"}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Card 3: Dokument & Förhandsgranskning */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
								<FileText className="w-4 h-4" />
							</div>
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.sectionDocPreview} />
							</h2>
						</div>

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleDownload}
							className="h-8 text-xs text-slate-700 hover:text-slate-900 gap-1.5 cursor-pointer border-slate-200"
						>
							<Download className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnDownloadCertificate} />
						</Button>
					</div>

					<div className="p-6">
						<div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4">
							<div className="flex items-center gap-3">
								<div className="p-3 bg-white text-blue-600 rounded-lg border border-slate-200 shadow-2xs">
									<FileText className="w-6 h-6" />
								</div>
								<div>
									<h4 className="text-sm font-semibold text-slate-800">
										{item.fileName || "attest_dokument.pdf"}
									</h4>
									<p className="text-xs text-slate-500">
										{item.fileSize || "1.4 MB"} • {item.fileType || "application/pdf"}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Button
									type="button"
									onClick={handleDownload}
									className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg gap-1.5 cursor-pointer shadow-2xs"
								>
									<Download className="w-3.5 h-3.5" />
									<Translate text={localizationConstants.btnDownloadCertificate} />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
