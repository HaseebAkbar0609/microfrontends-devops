"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowRight,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Trash2,
	X,
	Save,
	FileText,
	Eye,
	Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MACHINE_PURCHASE_BASE_URL } from "@/features/machines/data/machineNav.config";
import { addPurchaseItem, getAllPurchases } from "../data/purchase.mock";
import type { PurchaseDocument, PurchaseItem } from "../types/purchase.types";
import { showToast } from "@/lib/toast";

// Icon matching Figma node: calendar/contact card with top loops and user avatar silhouette
function MachineSectionIcon({ className = "h-4 w-4" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M16 2v2" />
			<path d="M8 2v2" />
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<circle cx="12" cy="11" r="3" />
			<path d="M17 18.5a5 5 0 0 0-10 0" />
		</svg>
	);
}

type DocSortField = "date" | "name" | "fileType";

export function MachinePurchaseCreatePage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

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
		supplier: "",
		address: "",
		postalCode: "",
		city: "",
		phone: "",
		email: "",
		additionalInfo: "",
	});

	// Field Validation Errors
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Uploaded file tag chips
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

	const validateStep1 = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.number.trim()) {
			newErrors.number = "Nummer är obligatoriskt";
		}
		if (!formData.type.trim()) {
			newErrors.type = "Välj en maskintyp";
		}
		if (!formData.brand.trim()) {
			newErrors.brand = "Fabrikat är obligatoriskt";
		}
		if (!formData.designation.trim()) {
			newErrors.designation = "Beteckning är obligatoriskt";
		}
		if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
			newErrors.price = "Ange ett giltigt pris";
		}
		if (!formData.supplier.trim()) {
			newErrors.supplier = "Leverantör är obligatoriskt";
		}
		if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email)) {
			newErrors.email = "Ogiltig e-postadress";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleRemoveStagedFile = (index: number) => {
		setStagedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newStaged: string[] = [];
		const newDocs: PurchaseDocument[] = [];
		const today = new Date().toISOString().split("T")[0];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
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
		showToast("success", `${files.length} fil(er) har lagts till`);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleTriggerUpload = () => {
		fileInputRef.current?.click();
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
		if (!validateStep1()) {
			showToast("error", "Vänligen fyll i alla obligatoriska fält korrekt");
			return;
		}
		setActiveTab("docs");
	};

	const handleSave = () => {
		if (!validateStep1()) {
			setActiveTab("info");
			showToast("error", "Vänligen fyll i alla obligatoriska fält korrekt");
			return;
		}

		const newId = `PUR-${Date.now().toString().slice(-4)}`;
		const typeLower = formData.type.toLowerCase();
		const category =
			typeLower.includes("hand") || typeLower.includes("skruvdragare")
				? "handmaskin"
				: typeLower.includes("tung") || typeLower.includes("grävmaskin")
				? "tunga_maskiner"
				: typeLower.includes("fordon") || typeLower.includes("bil") || typeLower.includes("lastbil")
				? "fordon"
				: "ovrigt";

		const newPurchaseItem: PurchaseItem = {
			id: newId,
			number: formData.number || nextNumber,
			category: category,
			type: formData.type || "Borrmaskin",
			brand: formData.brand || "Hilti",
			designation: formData.designation || "H367829",
			price: parseFloat(formData.price) || 4500,
			supplier: formData.supplier || "Hilti Sverige AB",
			address: formData.address || "Frejgatan",
			postalCode: formData.postalCode || "11345",
			city: formData.city || "Stockholm",
			phone: formData.phone || "0855050",
			email: formData.email || "info@hilti.com",
			file: documents[0]?.name || "filename.pdf",
			status: "ready",
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
						<>
							{/* Card 1: Maskin Details */}
							<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
								<div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3 mb-5">
									<MachineSectionIcon className="h-4 w-4 text-slate-700" />
									<h3 className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.machinePurchaseCardDetails} />
									</h3>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
									{/* Row 1: Nummer & Typ */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColNumber} />{" "}
											<span className="text-red-500">*</span>
										</label>
										<Input
											value={formData.number}
											onChange={(e) => handleChange("number", e.target.value)}
											placeholder="001"
											className={`bg-[#F8FAFC] text-xs h-9 ${
												errors.number ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
											}`}
										/>
										{errors.number && (
											<span className="text-[11px] text-red-500">{errors.number}</span>
										)}
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColType} />{" "}
											<span className="text-red-500">*</span>
										</label>
										<Select
											value={formData.type}
											onValueChange={(val) => handleChange("type", val)}
										>
											<SelectTrigger
												className={`bg-white text-xs h-9 text-slate-700 ${
													errors.type ? "border-red-500" : "border-slate-200"
												}`}
											>
												<SelectValue placeholder="info" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Borrmaskin">Borrmaskin</SelectItem>
												<SelectItem value="Handmaskin">Handmaskin</SelectItem>
												<SelectItem value="Tunga maskiner">Tunga maskiner</SelectItem>
												<SelectItem value="Fordon">Fordon</SelectItem>
												<SelectItem value="Grävmaskin">Grävmaskin</SelectItem>
												<SelectItem value="Skruvdragare">Skruvdragare</SelectItem>
												<SelectItem value="Övrigt">Övrigt</SelectItem>
											</SelectContent>
										</Select>
										{errors.type && (
											<span className="text-[11px] text-red-500">{errors.type}</span>
										)}
									</div>

									{/* Row 2: Fabrikat & Beteckning */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColBrand} />{" "}
											<span className="text-red-500">*</span>
										</label>
										<Input
											value={formData.brand}
											onChange={(e) => handleChange("brand", e.target.value)}
											placeholder="info"
											className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
												errors.brand ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
											}`}
										/>
										{errors.brand && (
											<span className="text-[11px] text-red-500">{errors.brand}</span>
										)}
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColDesignation} />{" "}
											<span className="text-red-500">*</span>
										</label>
										<Input
											value={formData.designation}
											onChange={(e) => handleChange("designation", e.target.value)}
											placeholder="info"
											className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
												errors.designation ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
											}`}
										/>
										{errors.designation && (
											<span className="text-[11px] text-red-500">{errors.designation}</span>
										)}
									</div>

									{/* Row 3: Pris & Leverantör */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColPrice} />{" "}
											<span className="text-red-500">*</span>
										</label>
										<Input
											type="number"
											value={formData.price}
											onChange={(e) => handleChange("price", e.target.value)}
											placeholder="info"
											className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
												errors.price ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
											}`}
										/>
										{errors.price && (
											<span className="text-[11px] text-red-500">{errors.price}</span>
										)}
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColSupplier} />{" "}
											<span className="text-red-500">*</span>
										</label>
										<Input
											value={formData.supplier}
											onChange={(e) => handleChange("supplier", e.target.value)}
											placeholder="info"
											className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
												errors.supplier ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
											}`}
										/>
										{errors.supplier && (
											<span className="text-[11px] text-red-500">{errors.supplier}</span>
										)}
									</div>

									{/* Row 4: Address & Post nr */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColAddress} />
										</label>
										<Input
											value={formData.address}
											onChange={(e) => handleChange("address", e.target.value)}
											placeholder="info"
											className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColPostalCode} />
										</label>
										<Input
											value={formData.postalCode}
											onChange={(e) => handleChange("postalCode", e.target.value)}
											placeholder="info"
											className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
										/>
									</div>

									{/* Row 5: Ort & Telefon */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColCity} />
										</label>
										<Input
											value={formData.city}
											onChange={(e) => handleChange("city", e.target.value)}
											placeholder="info"
											className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColPhone} />
										</label>
										<Input
											value={formData.phone}
											onChange={(e) => handleChange("phone", e.target.value)}
											placeholder="info"
											className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
										/>
									</div>

									{/* Row 6: Mail */}
									<div className="flex flex-col gap-1.5 md:col-span-1">
										<label className="text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.machinePurchaseColEmail} />
										</label>
										<Input
											type="email"
											value={formData.email}
											onChange={(e) => handleChange("email", e.target.value)}
											placeholder="info"
											className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
												errors.email ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
											}`}
										/>
										{errors.email && (
											<span className="text-[11px] text-red-500">{errors.email}</span>
										)}
									</div>
								</div>
							</div>

							{/* Card 2: Ytterligare information */}
							<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
								<div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3 mb-5">
									<MachineSectionIcon className="h-4 w-4 text-slate-700" />
									<h3 className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.machinePurchaseCardAdditional} />
									</h3>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-medium text-slate-700">
										<Translate text={localizationConstants.machinePurchaseFieldMaskinInfo} />
									</label>
									<Textarea
										value={formData.additionalInfo}
										onChange={(e) => handleChange("additionalInfo", e.target.value)}
										placeholder="info"
										rows={4}
										className="bg-white border-slate-200 text-xs resize-none placeholder:text-slate-400"
									/>
								</div>
							</div>
						</>
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

							{/* Upload Box */}
							<div className="mb-6 flex flex-col gap-2">
								<div>
									<h4 className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.machinePurchaseUploadSubtitle} />
									</h4>
									<p className="text-[11px] text-slate-400">
										<Translate text={localizationConstants.machinePurchaseUploadHelper} />
									</p>
								</div>

								<div className="flex items-center gap-2">
									<div className="flex-1 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 min-h-[42px]">
										{stagedFiles.length === 0 ? (
											<span className="text-xs text-slate-400 italic px-2">
												Inga filer valda ännu. Klicka på Upload för att välja filer.
											</span>
										) : (
											stagedFiles.map((fileName, idx) => (
												<span
													key={`${fileName}-${idx}`}
													className="inline-flex items-center gap-1.5 rounded bg-slate-50 px-2.5 py-1 text-xs text-slate-700 border border-slate-200 shadow-2xs"
												>
													{fileName}
													<button
														type="button"
														onClick={() => handleRemoveStagedFile(idx)}
														className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
													>
														<X className="h-3 w-3" />
													</button>
												</span>
											))
										)}
									</div>

									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileUpload}
										multiple
										accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
										className="hidden"
									/>

									<Button
										type="button"
										onClick={handleTriggerUpload}
										className="rounded-lg bg-[#111721] text-white hover:bg-slate-800 text-xs px-5 h-[42px] font-medium cursor-pointer"
									>
										<Translate text={localizationConstants.machinePurchaseUploadButton} />
									</Button>
								</div>
							</div>

							{/* Document Table */}
							<div className="rounded-lg border border-slate-200/80 overflow-hidden">
								<Table>
									<TableHeader className="bg-slate-50/70 border-b border-slate-200">
										<TableRow>
											<TableHead
												onClick={() => handleSortDoc("date")}
												className="text-xs font-semibold text-slate-600 py-3 w-40 cursor-pointer select-none hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.machinePurchaseColDocDate} />
													{docSortBy === "date" ? (
														docSortOrder === "asc" ? (
															<ArrowUp className="h-3 w-3 text-slate-900" />
														) : (
															<ArrowDown className="h-3 w-3 text-slate-900" />
														)
													) : (
														<ArrowUpDown className="h-3 w-3 text-slate-400" />
													)}
												</div>
											</TableHead>
											<TableHead
												onClick={() => handleSortDoc("name")}
												className="text-xs font-semibold text-slate-600 py-3 cursor-pointer select-none hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.machinePurchaseColDocName} />
													{docSortBy === "name" ? (
														docSortOrder === "asc" ? (
															<ArrowUp className="h-3 w-3 text-slate-900" />
														) : (
															<ArrowDown className="h-3 w-3 text-slate-900" />
														)
													) : (
														<ArrowUpDown className="h-3 w-3 text-slate-400" />
													)}
												</div>
											</TableHead>
											<TableHead
												onClick={() => handleSortDoc("fileType")}
												className="text-xs font-semibold text-slate-600 py-3 w-28 cursor-pointer select-none hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.machinePurchaseColDocFile} />
													{docSortBy === "fileType" ? (
														docSortOrder === "asc" ? (
															<ArrowUp className="h-3 w-3 text-slate-900" />
														) : (
															<ArrowDown className="h-3 w-3 text-slate-900" />
														)
													) : (
														<ArrowUpDown className="h-3 w-3 text-slate-400" />
													)}
												</div>
											</TableHead>
											<TableHead className="text-xs font-semibold text-slate-600 py-3 text-right pr-6 w-36">
												<Translate text={localizationConstants.orderActionsHeader} />
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{sortedDocuments.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={4}
													className="h-24 text-center text-xs text-slate-400"
												>
													Inga dokument uppladdade ännu.
												</TableCell>
											</TableRow>
										) : (
											sortedDocuments.map((doc) => (
												<TableRow
													key={doc.id}
													className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
												>
													<TableCell className="text-xs text-slate-600 py-3">
														{doc.date}
													</TableCell>
													<TableCell className="text-xs font-medium text-slate-800 py-3">
														<div className="flex items-center gap-2.5">
															<PdfFileIcon className="h-7 w-[22px] shrink-0" />
															<span>{doc.name}</span>
														</div>
													</TableCell>
													<TableCell className="text-xs text-slate-600 py-3">
														<span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
															{doc.fileType}
														</span>
													</TableCell>
													<TableCell className="text-xs py-3 text-right pr-6">
														<div className="flex items-center justify-end gap-3">
															<button
																type="button"
																onClick={() => setPreviewDoc(doc)}
																className="rounded border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
															>
																<Translate text={localizationConstants.machinePurchaseActionViewFile} />
															</button>
															<button
																type="button"
																onClick={() => handleDeleteDocument(doc.id)}
																className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
																title="Ta bort dokument"
															>
																<Trash2 className="h-4 w-4" />
															</button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					)}
				</div>

				{/* RIGHT COLUMN: Step Indicator Box (Figma Node) */}
				<div className="w-full lg:w-80 shrink-0">
					<div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
						<div className="text-xs font-semibold text-slate-800 mb-2.5">
							{activeTab === "info" ? (
								<Translate text={localizationConstants.machinePurchaseStep1Indicator} />
							) : (
								<Translate text={localizationConstants.machinePurchaseStep2Indicator} />
							)}
						</div>
						<div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
							<div
								className={`h-full bg-slate-900 transition-all duration-300 ${
									activeTab === "info" ? "w-1/5" : "w-2/5"
								}`}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* BOTTOM FULL-WIDTH ACTION BAR (Aligned to the Right of the Entire Container as in Figma) */}
			<div className="flex items-center justify-end gap-3 pt-6 pb-12 mt-4">
				<Button
					type="button"
					onClick={handleCancel}
					className="rounded-lg border border-slate-200 bg-white px-6 h-10 text-xs font-medium text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
				>
					<Translate text={localizationConstants.machinePurchaseBtnCancel} />
				</Button>

				<Button
					type="button"
					onClick={handleSave}
					className="rounded-lg bg-[#111721] text-white hover:bg-slate-800 px-6 h-10 text-xs font-medium shadow-2xs flex items-center gap-2 cursor-pointer"
				>
					<span>
						<Translate text={localizationConstants.machinePurchaseBtnSave} />
					</span>
					<Save className="h-3.5 w-3.5" />
				</Button>

				{activeTab === "info" && (
					<Button
						type="button"
						onClick={handleNext}
						className="rounded-lg bg-[#111721] text-white hover:bg-slate-800 px-6 h-10 text-xs font-medium shadow-2xs flex items-center gap-2 cursor-pointer"
					>
						<span>
							<Translate text={localizationConstants.machinePurchaseBtnNext} />
						</span>
						<ArrowRight className="h-3.5 w-3.5" />
					</Button>
				)}
			</div>

			{/* Document Preview Modal */}
			<Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
				<DialogContent className="max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
							<FileText className="h-5 w-5 text-slate-700" />
							{previewDoc?.name}
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200/80 rounded-lg text-center gap-3 my-2">
						<PdfFileIcon className="h-16 w-12" />
						<div>
							<p className="text-sm font-semibold text-slate-800">{previewDoc?.name}</p>
							<p className="text-xs text-slate-500 mt-0.5">
								Format: {previewDoc?.fileType} • Datum: {previewDoc?.date}
							</p>
						</div>
						<span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium mt-2">
							<Eye className="h-3 w-3" /> Förhandsgranskning aktiv
						</span>
					</div>

					<DialogFooter className="flex items-center justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setPreviewDoc(null)}
							className="text-xs"
						>
							Stäng
						</Button>
						<Button
							type="button"
							onClick={() => {
								showToast("success", `Laddar ner ${previewDoc?.name}...`);
								setPreviewDoc(null);
							}}
							className="bg-slate-900 text-white text-xs gap-1.5"
						>
							<Download className="h-3.5 w-3.5" />
							Ladda ner
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
