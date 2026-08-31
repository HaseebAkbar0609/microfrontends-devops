"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MACHINE_PURCHASE_BASE_URL } from "@/features/machines/data/machineNav.config";
import { addPurchaseItem, getAllPurchases } from "../data/purchase.mock";
import type { PurchaseDocument, PurchaseItem } from "../types/purchase.types";
import { purchaseCreateSchema } from "./schemas/purchaseCreate.schema";
import { mapMachineTypeToCategory } from "../utils/purchaseCategory.utils";
import { MachineSectionIcon } from "./components/MachineSectionIcon";
import { MachineInfoForm } from "./components/MachineInfoForm";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { DocumentTable, type DocSortField } from "./components/DocumentTable";
import { DocumentPreviewModal } from "./components/DocumentPreviewModal";
import { StepProgressCard } from "./components/StepProgressCard";
import { PurchaseActionBar } from "./components/PurchaseActionBar";
import { showToast } from "@/lib/toast";

export function MachinePurchaseCreatePage() {
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<"info" | "docs">("info");

	// Auto-generate next sequence number
	const nextNumber = useMemo(() => {
		const existing = getAllPurchases();
		const nextSeq = existing.length + 1;
		return nextSeq < 10 ? `00${nextSeq}` : nextSeq < 100 ? `0${nextSeq}` : `${nextSeq}`;
	}, []);

	// Form State
	const [formData, setFormData] = useState({
		number: nextNumber,
		type: "",
		brand: "",
		designation: "",
		price: "",
		quantity: "1",
		supplier: "",
		address: "",
		postalCode: "",
		city: "",
		phone: "",
		email: "",
		additionalInfo: "",
	});

	// Field Validation Errors from Zod
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Uploaded files tags (pending upload / staged)
	const [stagedFiles, setStagedFiles] = useState<string[]>([
		"Document 1.pdf",
		"Document 2.doc",
	]);

	// Table Documents
	const [documents, setDocuments] = useState<PurchaseDocument[]>([
		{
			id: "doc-init-1",
			date: "2024-05-10",
			name: "filename.pdf",
			fileType: "PDF",
		},
		{
			id: "doc-init-2",
			date: "2024-05-10",
			name: "filename.pdf",
			fileType: "PDF",
		},
	]);

	// Document table sorting
	const [docSortBy, setDocSortBy] = useState<DocSortField>("date");
	const [docSortOrder, setDocSortOrder] = useState<"asc" | "desc">("desc");

	// Document Preview Modal State
	const [previewDoc, setPreviewDoc] = useState<PurchaseDocument | null>(null);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const copy = { ...prev };
				delete copy[field];
				return copy;
			});
		}
	};

	// Zod validation method
	const validateWithZod = (): boolean => {
		const result = purchaseCreateSchema.safeParse(formData);
		if (!result.success) {
			const formattedErrors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as string;
				if (!formattedErrors[field]) {
					formattedErrors[field] = issue.message;
				}
			}
			setErrors(formattedErrors);
			return false;
		}
		setErrors({});
		return true;
	};

	const handleRemoveStagedFile = (index: number) => {
		setStagedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleAddFiles = (newFiles: File[]) => {
		const newStaged: string[] = [];
		const newDocs: PurchaseDocument[] = [];
		const today = new Date().toISOString().split("T")[0];

		for (let i = 0; i < newFiles.length; i++) {
			const file = newFiles[i];
			newStaged.push(file.name);
			newDocs.push({
				id: `doc-upload-${Date.now()}-${i}`,
				date: today,
				name: file.name,
				fileType: file.name.split(".").pop()?.toUpperCase() || "PDF",
			});
		}

		setStagedFiles((prev) => [...prev, ...newStaged]);
		setDocuments((prev) => [...newDocs, ...prev]);
		showToast("success", `${newFiles.length} fil(er) har lagts till`);
	};

	const handleDeleteDocument = (docId: string) => {
		setDocuments((prev) => prev.filter((d) => d.id !== docId));
		showToast("success", "Dokumentet har tagits bort");
	};

	const handleSortDoc = (field: DocSortField) => {
		if (docSortBy === field) {
			setDocSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setDocSortBy(field);
			setDocSortOrder("asc");
		}
	};

	const sortedDocuments = useMemo(() => {
		return [...documents].sort((a, b) => {
			const valA = a[docSortBy] || "";
			const valB = b[docSortBy] || "";
			const cmp = valA.localeCompare(valB);
			return docSortOrder === "asc" ? cmp : -cmp;
		});
	}, [documents, docSortBy, docSortOrder]);

	const handleCancel = () => {
		router.push(MACHINE_PURCHASE_BASE_URL);
	};

	const handleNext = () => {
		if (!validateWithZod()) {
			showToast("error", "Vänligen fyll i alla obligatoriska fält korrekt");
			return;
		}
		setActiveTab("docs");
	};

	const handleSave = () => {
		if (!validateWithZod()) {
			setActiveTab("info");
			showToast("error", "Vänligen fyll i alla obligatoriska fält korrekt");
			return;
		}

		const newId = `PUR-${Date.now().toString().slice(-4)}`;
		const category = mapMachineTypeToCategory(formData.type);
		const unitPrice = parseFloat(formData.price) || 0;
		const quantity = parseInt(formData.quantity, 10) || 1;
		const totalCost = unitPrice * quantity;

		const newPurchaseItem: PurchaseItem = {
			id: newId,
			number: formData.number || nextNumber,
			category: category,
			type: formData.type || "Borrmaskin",
			brand: formData.brand || "Hilti",
			designation: formData.designation || "H367829",
			price: unitPrice,
			quantity: quantity,
			totalCost: totalCost,
			supplier: formData.supplier || "Hilti Sverige AB",
			address: formData.address || "Frejgatan",
			postalCode: formData.postalCode || "11345",
			city: formData.city || "Stockholm",
			phone: formData.phone || "0855050",
			email: formData.email || "info@hilti.com",
			file: documents[0]?.name || "filename.pdf",
			status: "pending",
			additionalInfo:
				formData.additionalInfo ||
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			documents: documents,
		};

		addPurchaseItem(newPurchaseItem);
		showToast("success", "Maskin inköp har sparats framgångsrikt");
		router.push(MACHINE_PURCHASE_BASE_URL);
	};

	return (
		<div className="flex flex-col gap-6 p-6 pb-24 min-h-screen bg-[#F8FAFC]">
			{/* Top Header */}
			<div className="flex flex-col gap-4 border-b border-slate-200 pb-3">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleCancel}
						className="flex items-center gap-2 text-lg font-bold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
					>
						<ArrowLeft className="h-5 w-5" />
						<Translate text={localizationConstants.machinePurchaseCreateTitle} />
					</button>
				</div>

				{/* Sub-tabs */}
				<div className="flex items-center gap-8">
					<button
						type="button"
						onClick={() => setActiveTab("info")}
						className={`pb-2.5 text-sm transition-colors relative cursor-pointer ${
							activeTab === "info"
								? "text-slate-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900"
								: "text-slate-500 hover:text-slate-700 font-medium"
						}`}
					>
						<Translate text={localizationConstants.machinePurchaseTabInfo} />
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("docs")}
						className={`pb-2.5 text-sm transition-colors relative cursor-pointer ${
							activeTab === "docs"
								? "text-slate-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900"
								: "text-slate-500 hover:text-slate-700 font-medium"
						}`}
					>
						<Translate text={localizationConstants.machinePurchaseTabDocs} />
					</button>
				</div>
			</div>

			{/* Main Content Area (Two Columns) */}
			<div className="flex flex-col lg:flex-row items-start gap-6">
				{/* LEFT COLUMN: Main Form Cards */}
				<div className="flex-1 w-full flex flex-col gap-6">
					{/* TAB 1: MASKIN INFORMATION (Figma 12323:342811) */}
					{activeTab === "info" && (
						<MachineInfoForm
							formData={formData}
							errors={errors}
							onChange={handleChange}
						/>
					)}

					{/* TAB 2: DOKUMENT (Figma 12323:342878) */}
					{activeTab === "docs" && (
						<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
							{/* Header */}
							<div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3 mb-5">
								<MachineSectionIcon className="h-4 w-4 text-slate-700" />
								<h3 className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.machinePurchaseTabDocs} />
								</h3>
							</div>

							{/* Upload Section with File Size & MIME checks */}
							<DocumentUploadSection
								stagedFiles={stagedFiles}
								onAddFiles={handleAddFiles}
								onRemoveStagedFile={handleRemoveStagedFile}
							/>

							{/* Sortable Document Table */}
							<DocumentTable
								documents={sortedDocuments}
								docSortBy={docSortBy}
								docSortOrder={docSortOrder}
								onSort={handleSortDoc}
								onPreview={setPreviewDoc}
								onDelete={handleDeleteDocument}
							/>
						</div>
					)}
				</div>

				{/* RIGHT COLUMN: Step Indicator Box (Figma Node) */}
				<StepProgressCard activeTab={activeTab} />
			</div>

			{/* BOTTOM FULL-WIDTH ACTION BAR */}
			<PurchaseActionBar
				activeTab={activeTab}
				onCancel={handleCancel}
				onSave={handleSave}
				onNext={handleNext}
			/>

			{/* Document Preview Modal */}
			<DocumentPreviewModal
				previewDoc={previewDoc}
				onClose={() => setPreviewDoc(null)}
			/>
		</div>
	);
}
