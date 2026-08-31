"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	ArrowLeft,
	Info,
	Edit2,
	Check,
	Trash2,
	X,
	Folder,
	ArrowUpDown,
	ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MACHINE_PURCHASE_BASE_URL } from "@/features/machines/data/machineNav.config";
import { usePurchaseDetail } from "./hooks/usePurchaseDetail";
import { showToast } from "@/lib/toast";

interface MachinePurchaseDetailPageProps {
	id?: string;
}

export function MachinePurchaseDetailPage({ id }: MachinePurchaseDetailPageProps) {
	const params = useParams();
	const router = useRouter();
	const purchaseId = id || (params?.id as string) || "PUR-01";

	const {
		detail,
		activeTab,
		setActiveTab,
		isEditing,
		setIsEditing,
		addDocument,
		removeDocument,
		updateDetail,
	} = usePurchaseDetail(purchaseId);

	const [selectedFileNames, setSelectedFileNames] = useState<string[]>([
		"Document 1.pdf",
		"Document 2.doc",
	]);
	const [newFileNameInput, setNewFileNameInput] = useState("");

	const handleSaveEdit = () => {
		setIsEditing(false);
		showToast("success", "Ändringar har sparats!");
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const names = Array.from(e.target.files).map((f) => f.name);
			setSelectedFileNames((prev) => [...prev, ...names]);
		}
	};

	const handleUploadFiles = () => {
		if (selectedFileNames.length === 0 && !newFileNameInput.trim()) {
			showToast("error", "Välj minst en fil att ladda upp.");
			return;
		}

		const filesToUpload = newFileNameInput.trim()
			? [...selectedFileNames, newFileNameInput.trim()]
			: selectedFileNames;

		filesToUpload.forEach((name) => {
			addDocument({
				date: new Date().toISOString().split("T")[0],
				name,
				fileType: name.endsWith(".doc") ? "DOC" : "PDF",
			});
		});

		setSelectedFileNames([]);
		setNewFileNameInput("");
		showToast("success", "Dokument har laddats upp!");
	};

	const removeSelectedTag = (index: number) => {
		setSelectedFileNames((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="flex flex-col min-h-screen bg-white">
			<div className="px-8 pt-6 pb-8 space-y-6 max-w-[1600px] w-full">
				{/* Top Header matching Figma: Bare arrow + "Machine Details" */}
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.push(MACHINE_PURCHASE_BASE_URL)}
						className="text-[#0F172A] hover:text-slate-600 transition-colors cursor-pointer"
						aria-label="Back"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
						<Translate text={localizationConstants.machinePurchaseDetailsTitle} />
					</h1>
				</div>

				{/* Tabs Navigation matching Figma: Active underline directly under label */}
				<div className="flex items-center gap-6">
					<button
						type="button"
						onClick={() => setActiveTab("information")}
						className={`pb-2 text-[14px] font-semibold transition-all relative cursor-pointer ${
							activeTab === "information"
								? "text-[#0F172A] border-b-2 border-[#0F172A]"
								: "text-[#64748B] hover:text-[#0F172A] border-b-2 border-transparent"
						}`}
					>
						<Translate text={localizationConstants.machinePurchaseTabInfo} />
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("documents")}
						className={`pb-2 text-[14px] font-medium transition-all relative cursor-pointer ${
							activeTab === "documents"
								? "text-[#0F172A] border-b-2 border-[#0F172A]"
								: "text-[#64748B] hover:text-[#0F172A] border-b-2 border-transparent"
						}`}
					>
						<Translate text={localizationConstants.machinePurchaseTabDocs} />
					</button>
				</div>

				{/* TAB 1: MACHINE INFORMATION */}
				{activeTab === "information" && (
					<div className="space-y-6 animate-in fade-in duration-150">
						{/* Card 1: Information */}
						<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
							{/* Card Header with divider line */}
							<div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
								<div className="flex items-center gap-2.5">
									<Info className="h-5 w-5 text-[#0F172A]" />
									<h2 className="text-[15px] font-semibold text-[#0F172A]">
										<Translate text={localizationConstants.machinePurchaseCardInfo} />
									</h2>
								</div>
								{!isEditing ? (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditing(true)}
										className="h-[34px] px-3.5 gap-1.5 text-[13px] font-medium border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100 rounded-lg cursor-pointer shadow-2xs"
									>
										<Edit2 className="h-3.5 w-3.5 text-[#0F172A]" />
										<span>Edit</span>
									</Button>
								) : (
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={handleCancelEdit}
											className="h-[34px] px-3 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
										>
											<Translate text={localizationConstants.cancel} />
										</Button>
										<Button
											size="sm"
											onClick={handleSaveEdit}
											className="h-[34px] px-3.5 gap-1.5 text-xs font-medium bg-[#111721] text-white hover:bg-slate-800 rounded-lg cursor-pointer shadow-2xs"
										>
											<Check className="h-3.5 w-3.5" />
											<span>
												<Translate text={localizationConstants.saveButton} />
											</span>
										</Button>
									</div>
								)}
							</div>

							{/* Field Grid: 4 Columns */}
							{!isEditing ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 pt-1">
									{/* Row 1 */}
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColNumber} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.number || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColType} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.type || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColBrand} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.brand || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColDesignation} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.designation || "Info"}
										</p>
									</div>

									{/* Row 2 */}
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColPrice} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.price ? `${detail.price.toLocaleString("sv-SE")} kr` : "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColSupplier} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.supplier || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColAddress} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.address || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColPostalCode} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.postalCode || "Info"}
										</p>
									</div>

									{/* Row 3 */}
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColCity} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.city || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColPhone} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.phone || "Info"}
										</p>
									</div>
									<div>
										<p className="text-[13px] font-medium text-[#0F172A] mb-1">
											<Translate text={localizationConstants.machinePurchaseColEmail} />
										</p>
										<p className="text-[13px] font-normal text-[#64748B]">
											{detail.email || "Info"}
										</p>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColNumber} />
										</label>
										<Input
											value={detail.number}
											onChange={(e) => updateDetail({ number: e.target.value })}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColType} />
										</label>
										<Input
											value={detail.type}
											onChange={(e) => updateDetail({ type: e.target.value })}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColBrand} />
										</label>
										<Input
											value={detail.brand}
											onChange={(e) => updateDetail({ brand: e.target.value })}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColDesignation} />
										</label>
										<Input
											value={detail.designation}
											onChange={(e) =>
												updateDetail({ designation: e.target.value })
											}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColPrice} />
										</label>
										<Input
											type="number"
											value={detail.price}
											onChange={(e) =>
												updateDetail({ price: Number(e.target.value) || 0 })
											}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColSupplier} />
										</label>
										<Input
											value={detail.supplier}
											onChange={(e) =>
												updateDetail({ supplier: e.target.value })
											}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColAddress} />
										</label>
										<Input
											value={detail.address}
											onChange={(e) =>
												updateDetail({ address: e.target.value })
											}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColPostalCode} />
										</label>
										<Input
											value={detail.postalCode}
											onChange={(e) =>
												updateDetail({ postalCode: e.target.value })
											}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColCity} />
										</label>
										<Input
											value={detail.city}
											onChange={(e) => updateDetail({ city: e.target.value })}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColPhone} />
										</label>
										<Input
											value={detail.phone}
											onChange={(e) => updateDetail({ phone: e.target.value })}
											className="h-9 text-sm"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-slate-700 mb-1 block">
											<Translate text={localizationConstants.machinePurchaseColEmail} />
										</label>
										<Input
											value={detail.email}
											onChange={(e) => updateDetail({ email: e.target.value })}
											className="h-9 text-sm"
										/>
									</div>
								</div>
							)}
						</div>

						{/* Card 2: Additional Information */}
						<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
							<div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8F0]">
								<Info className="h-5 w-5 text-[#0F172A]" />
								<h2 className="text-[15px] font-semibold text-[#0F172A]">
									<Translate text={localizationConstants.machinePurchaseCardAdditional} />
								</h2>
							</div>

							<div className="pt-1">
								<h3 className="text-[13px] font-semibold text-[#0F172A] mb-1.5">
									Machine Information
								</h3>
								{!isEditing ? (
									<p className="text-[13px] font-normal text-[#64748B] leading-relaxed">
										{detail.additionalInfo ||
											"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,"}
									</p>
								) : (
									<Textarea
										rows={4}
										value={detail.additionalInfo}
										onChange={(e) =>
											updateDetail({ additionalInfo: e.target.value })
										}
										className="w-full text-sm leading-relaxed"
										placeholder="Beskrivning av maskinen..."
									/>
								)}
							</div>
						</div>
					</div>
				)}

				{/* TAB 2: DOCUMENTS - EXACT FIGMA MATCH (Single Card with Header, Upload Box & Table) */}
				{activeTab === "documents" && (
					<div className="space-y-6 animate-in fade-in duration-150">
						{/* Unified Card matching Figma Frame 12323-342517 */}
						<div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
							{/* Card Header: Folder Icon + Title + Divider */}
							<div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E2E8F0]">
								<Folder className="h-5 w-5 text-[#0F172A]" />
								<h2 className="text-[15px] font-semibold text-[#0F172A]">
									<Translate text={localizationConstants.machinePurchaseTabDocs} />
								</h2>
							</div>

							<div className="p-6 space-y-6">
								{/* Upload Section */}
								<div className="space-y-3">
									<div>
										<h3 className="text-[14px] font-semibold text-[#0F172A]">
											<Translate text={localizationConstants.machinePurchaseUploadSubtitle} />
										</h3>
										<p className="text-[12px] text-[#64748B] mt-0.5">
											PNG-, JPG- och PDF-filer är tillåtna.
										</p>
									</div>

									{/* Multi-Tag Select/Input Box + Upload Button */}
									<div className="flex items-center gap-3">
										<div className="relative flex-1 min-h-[42px] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between gap-2 shadow-2xs">
											<div className="flex flex-wrap items-center gap-2 flex-1">
												{selectedFileNames.length === 0 && (
													<span className="text-xs text-slate-400">
														Välj eller skriv in fil...
													</span>
												)}
												{selectedFileNames.map((fileName, idx) => (
													<span
														key={idx}
														className="inline-flex items-center gap-1.5 bg-[#F1F5F9] text-[#1E293B] text-xs font-medium px-2.5 py-1 rounded border border-[#E2E8F0]"
													>
														<span>{fileName}</span>
														<button
															type="button"
															onClick={() => removeSelectedTag(idx)}
															className="text-slate-400 hover:text-slate-700 cursor-pointer"
														>
															<X className="h-3 w-3" />
														</button>
													</span>
												))}
											</div>
											<label className="flex items-center text-slate-400 hover:text-slate-700 cursor-pointer shrink-0">
												<ChevronDown className="h-4 w-4" />
												<input
													type="file"
													multiple
													onChange={handleFileSelect}
													className="hidden"
												/>
											</label>
										</div>

										<Button
											onClick={handleUploadFiles}
											className="h-[42px] px-6 bg-[#111721] text-white hover:bg-slate-800 rounded-lg text-sm font-medium cursor-pointer shadow-2xs shrink-0"
										>
											<span>Upload</span>
										</Button>
									</div>
								</div>

								{/* Documents Table */}
								<div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
									<Table className="w-full">
										<TableHeader>
											<TableRow className="border-b border-[#E2E8F0] bg-white hover:bg-white">
												<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-[#64748B]">
													<div className="flex items-center gap-1.5">
														<Translate text={localizationConstants.machinePurchaseColDocDate} />
														<ArrowUpDown className="h-3.5 w-3.5 text-[#94A3B8]" />
													</div>
												</TableHead>
												<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-[#64748B]">
													<div className="flex items-center gap-1.5">
														<Translate text={localizationConstants.machinePurchaseColDocName} />
														<ArrowUpDown className="h-3.5 w-3.5 text-[#94A3B8]" />
													</div>
												</TableHead>
												<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-[#64748B]">
													<div className="flex items-center gap-1.5">
														<Translate text={localizationConstants.machinePurchaseColDocFile} />
														<ArrowUpDown className="h-3.5 w-3.5 text-[#94A3B8]" />
													</div>
												</TableHead>
												<TableHead className="py-3.5 px-4 w-[160px] min-w-[160px] border-l border-[#E2E8F0]" />
											</TableRow>
										</TableHeader>
										<TableBody>
											{(!detail.documents || detail.documents.length === 0) ? (
												<TableRow>
													<TableCell
														colSpan={4}
														className="py-12 text-center text-xs text-slate-400"
													>
														<Translate text={localizationConstants.noDataFound} />
													</TableCell>
												</TableRow>
											) : (
												detail.documents.map((doc) => (
													<TableRow
														key={doc.id}
														className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/90 transition-colors h-[54px]"
													>
														<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#0F172A]">
															{doc.date}
														</TableCell>
														<TableCell className="px-4 py-3.5">
															<div className="flex items-center gap-2.5">
																<PdfFileIcon className="h-7 w-[22px]" />
																<span className="text-[13px] font-medium text-[#0F172A]">
																	{doc.name}
																</span>
															</div>
														</TableCell>
														<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#0F172A]">
															{doc.fileType || "PDF"}
														</TableCell>
														<TableCell className="px-4 py-3.5 border-l border-[#E2E8F0]">
															<div className="flex items-center justify-between gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	className="h-8 px-3.5 text-xs font-medium text-[#1E293B] border-[#E2E8F0] hover:bg-slate-50 rounded-md cursor-pointer"
																>
																	<span>
																		<Translate text={localizationConstants.machinePurchaseActionViewFile} />
																	</span>
																</Button>
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => {
																		removeDocument(doc.id);
																		showToast("success", "Dokument har raderats");
																	}}
																	className="h-8 w-8 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
