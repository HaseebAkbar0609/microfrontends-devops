"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	UserPlus,
	Building2,
	ClipboardList,
	BadgeDollarSign,
	FilePlus,
	ChevronUp,
	ArrowRight,
	ArrowUp,
	ArrowDown,
	ArrowUpDown,
	MoreVertical,
	PenLine,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData, OrderDocumentItem } from "../types/orderOpened.types";

function DocTypeBadge({ type, label }: { type?: string; label?: string }) {
	if (type === "doc" || (!type && label?.endsWith(".doc")) || label?.endsWith(".docx")) {
		return <DocFileIcon className="h-11 w-9 shrink-0" />;
	}
	return <PdfFileIcon className="h-11 w-9 shrink-0" />;
}

interface AccordionSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	hideToggle?: boolean;
}

function AccordionSection({
	title,
	icon,
	children,
	defaultOpen = true,
	hideToggle = false,
}: AccordionSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (hideToggle) {
		return (
			<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
				<div className="flex h-14 min-h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
					<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
						<span className="flex items-center shrink-0 text-slate-800">{icon}</span>
						<h3 className="font-sans text-base font-medium leading-6 text-slate-900 truncate">
							{title}
						</h3>
					</div>
				</div>
				<div className="p-4 sm:p-6">{children}</div>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<div className="flex h-14 min-h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
					<CollapsibleTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							className="flex flex-1 items-center justify-between cursor-pointer p-0 h-auto text-left hover:bg-transparent shadow-none font-normal min-w-0"
						>
							<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
								<span className="flex items-center shrink-0 text-slate-800">{icon}</span>
								<h3 className="font-sans text-base font-medium leading-6 text-slate-900 truncate">
									{title}
								</h3>
							</div>
							<ChevronUp
								size={18}
								className={cn(
									"text-zinc-500 transition-transform duration-200 shrink-0",
									!isOpen && "rotate-180"
								)}
								aria-hidden={true}
							/>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<div className="p-5 sm:p-6">{children}</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

function Field({ label, value }: { label: string; value?: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 text-slate-900">{label}</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">{value || "—"}</span>
		</div>
	);
}

export interface OrderOfferViewProps {
	data: OrderOpenedData;
}

export function OrderOfferView({ data }: OrderOfferViewProps) {
	const t = useTranslate();
	const router = useRouter();

	const [sortField, setSortField] = useState<"datum" | "namn" | "fil" | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

	const handleSort = (field: "datum" | "namn" | "fil") => {
		if (sortField === field) {
			if (sortOrder === "asc") setSortOrder("desc");
			else if (sortOrder === "desc") {
				setSortField(null);
				setSortOrder(null);
			}
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const [documents, setDocuments] = useState<OrderDocumentItem[]>(data.documents || []);
	const [documentToDelete, setDocumentToDelete] = useState<OrderDocumentItem | null>(null);

	useEffect(() => {
		if (data.documents) {
			setDocuments(data.documents);
		}
	}, [data.documents]);

	const sortedDocuments = useMemo(() => {
		if (!documents || documents.length === 0) return [];
		if (!sortField || !sortOrder) return documents;
		return [...documents].sort((a, b) => {
			let aVal = "";
			let bVal = "";
			if (sortField === "datum") {
				aVal = a.date || "";
				bVal = b.date || "";
			} else if (sortField === "namn") {
				aVal = a.documentName || "";
				bVal = b.documentName || "";
			} else if (sortField === "fil") {
				aVal = a.fileName || "";
				bVal = b.fileName || "";
			}
			return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
		});
	}, [documents, sortField, sortOrder]);

	const company = data.companyInfo || {
		companyId: "comp-nesse-01",
		name: "Nesse bygg AB",
		email: "Per@nessebygg.com",
		phone: "076000000",
		address: "Storgatan 16, 18880 Stockholm.",
		orgNumber: "556310-1010",
	};

	const project = data.projectDescription || {
		projectName: "Kök project",
		workLocation: "Adress där renoveringen ska utföra",
		specifications: "-",
	};

	const offer = data.offerDetails || {
		offerNo: "1234",
		work: "Total kostnad för projektet, inklusive material och arbete.",
		material: "Enter material",
		totalOffer: "Enter budget",
		rotDeductionLabor: "---",
		paymentTerms: "Info",
		rotDeductionSettled: "ja",
		secondaryPaymentTerms: "Info",
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Accordion 1: Kunduppgifter */}
			<AccordionSection
				title={t(localizationConstants.customerDetailsSection)}
				icon={<UserPlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.orderCustomer)} value={data.customerInfo.customerName} />
					<Field label={t(localizationConstants.addressLabel)} value={data.customerInfo.address} />
					<Field label={t(localizationConstants.postNrLabel)} value={data.customerInfo.postCode} />
					<Field label={t(localizationConstants.cityLabel)} value={data.customerInfo.city} />
					<Field label={t(localizationConstants.mailLabel)} value={data.customerInfo.email} />
					<Field label={t(localizationConstants.phoneLabel)} value={data.customerInfo.phone} />
					<Field label={t(localizationConstants.orgPersonNrLabel)} value={data.customerInfo.orgNumber} />
				</div>
			</AccordionSection>

			{/* Accordion 2: Företagsnummer */}
			<AccordionSection
				title={t(localizationConstants.companyNumberSection)}
				icon={<Building2 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="flex flex-col gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
						<Field label={t(localizationConstants.companyName)} value={company.name} />
						<Field label={t(localizationConstants.email)} value={company.email} />
						<Field label={t(localizationConstants.phone)} value={company.phone} />
						<Field label={t(localizationConstants.addressLabel)} value={company.address} />
						<Field label={t(localizationConstants.b2bArchiveOrgNr)} value={company.orgNumber} />
					</div>
					<div className="flex justify-center pt-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => router.push(`/module/business/b2b/company/${company.companyId}`)}
							className="gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							<span>{t(localizationConstants.goToCompany)}</span>
							<ArrowRight className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</AccordionSection>

			{/* Accordion 3: Projektbeskrivning */}
			<AccordionSection
				title={t(localizationConstants.projectDescriptionSection)}
				icon={<ClipboardList className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.projectName)} value={project.projectName} />
					<Field label={t(localizationConstants.workPlaceLabel)} value={project.workLocation} />
					<div className="sm:col-span-2">
						<Field label={t(localizationConstants.specificationsLabel)} value={project.specifications} />
					</div>
				</div>
			</AccordionSection>

			{/* Accordion 4: Offert */}
			<AccordionSection
				title={t(localizationConstants.offerTab)}
				icon={<BadgeDollarSign className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.offerNoLabel)} value={offer.offerNo} />
					<Field label={t(localizationConstants.workLabel)} value={offer.work} />
					<Field label={t(localizationConstants.materialLabel)} value={offer.material} />
					<Field label={t(localizationConstants.totalOfferLabel)} value={offer.totalOffer} />
					<Field label={t(localizationConstants.rotDeductionLabel)} value={offer.rotDeductionLabor} />
					<Field label={t(localizationConstants.paymentTermsLabel)} value={offer.paymentTerms} />
					<Field label={t(localizationConstants.rotDeductionSettled)} value={offer.rotDeductionSettled} />
					<Field label={t(localizationConstants.paymentTermsLabel)} value={offer.secondaryPaymentTerms || "—"} />
				</div>
			</AccordionSection>

			{/* Section 5: Bifogade dokument */}
			<AccordionSection
				title={t(localizationConstants.attachedDocumentsSection)}
				icon={<FilePlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
				hideToggle
			>
				<div className="overflow-x-auto w-full md:w-1/2">
					<table className="w-full min-w-[380px] table-fixed text-sm">
						<thead>
							<tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
								<th className="w-[120px] pb-2.5 font-normal">
									<Button
										type="button"
										variant="ghost"
										onClick={() => handleSort("datum")}
										className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
									>
										<span>{t(localizationConstants.b2bAvtalDatum)}</span>
										{sortField === "datum" ? (
											sortOrder === "asc" ? (
												<ArrowUp size={13} className="text-slate-900" />
											) : (
												<ArrowDown size={13} className="text-slate-900" />
											)
										) : (
											<ArrowUpDown size={13} className="text-slate-400 opacity-60" />
										)}
									</Button>
								</th>
								<th className="w-[150px] pb-2.5 font-normal">
									<Button
										type="button"
										variant="ghost"
										onClick={() => handleSort("namn")}
										className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
									>
										<span>{t(localizationConstants.b2bAvtalDokumentNamn)}</span>
										{sortField === "namn" ? (
											sortOrder === "asc" ? (
												<ArrowUp size={13} className="text-slate-900" />
											) : (
												<ArrowDown size={13} className="text-slate-900" />
											)
										) : (
											<ArrowUpDown size={13} className="text-slate-400 opacity-60" />
										)}
									</Button>
								</th>
								<th className="pb-2.5 font-normal">
									<Button
										type="button"
										variant="ghost"
										onClick={() => handleSort("fil")}
										className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
									>
										<span>{t(localizationConstants.b2bAvtalFil)}</span>
										{sortField === "fil" ? (
											sortOrder === "asc" ? (
												<ArrowUp size={13} className="text-slate-900" />
											) : (
												<ArrowDown size={13} className="text-slate-900" />
											)
										) : (
											<ArrowUpDown size={13} className="text-slate-400 opacity-60" />
										)}
									</Button>
								</th>
								<th className="w-[48px] pb-2.5 text-right font-normal"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{sortedDocuments.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
									<td className="w-[120px] py-2 text-slate-900 text-xs font-normal truncate">
										{doc.date || "2024-06-10"}
									</td>
									<td className="w-[150px] py-2 pr-3">
										<span
											title={doc.documentName}
											className="flex h-[34px] w-full max-w-[150px] items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-slate-900 font-normal leading-none truncate"
										>
											{doc.documentName || t(localizationConstants.b2bAvtalDocNamnPlaceholder)}
										</span>
									</td>
									<td className="py-2 pr-2">
										<div className="flex items-center gap-2 min-w-0">
											<DocTypeBadge type={doc.fileType} label={doc.fileName} />
											<span
												title={doc.fileName}
												className="text-xs font-normal text-slate-900 truncate min-w-0 flex-1"
											>
												{doc.fileName}
											</span>
										</div>
									</td>
									<td className="w-[48px] py-2 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
												>
													<MoreVertical size={16} aria-hidden={true} />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-[140px] rounded-xl bg-white p-1.5 shadow-md border border-slate-200">
												<DropdownMenuItem
													className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-normal text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
												>
													<PenLine className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
													<span>{t(localizationConstants.menuEditDocument)}</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setDocumentToDelete(doc)}
													className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-normal text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
												>
													<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
													<span>{t(localizationConstants.menuDeleteDocument)}</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</AccordionSection>

			{/* Delete Document Confirmation Dialog */}
			<Dialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
				<DialogContent className="sm:max-w-md bg-white border border-zinc-200 p-6">
					<DialogHeader>
						<DialogTitle className="text-slate-900 font-semibold text-base">
							{t(localizationConstants.deleteDocumentTitle)}
						</DialogTitle>
						<DialogDescription className="text-slate-600 text-sm mt-1">
							{t(localizationConstants.deleteDocumentDesc)}
						</DialogDescription>
						{documentToDelete?.fileName && (
							<p className="mt-2 text-sm font-medium text-slate-900 truncate">
								{documentToDelete.fileName}
							</p>
						)}
					</DialogHeader>
					<DialogFooter className="flex gap-2 sm:justify-end mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setDocumentToDelete(null)}
							className="border-zinc-200 text-slate-700 hover:bg-zinc-100 cursor-pointer"
						>
							{t(localizationConstants.cancelButton)}
						</Button>
						<Button
							type="button"
							onClick={() => {
								if (documentToDelete) {
									setDocuments((prev) => prev.filter((d) => d.id !== documentToDelete.id));
									setDocumentToDelete(null);
								}
							}}
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-4 py-2 text-sm font-medium cursor-pointer"
						>
							{t(localizationConstants.actionDelete)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
