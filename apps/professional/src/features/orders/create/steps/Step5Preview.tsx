"use client";

import { useState } from "react";
import Image from "next/image";
import {
	UserPlus,
	Contact,
	ShoppingBag,
	Building2,
	Info,
	File,
	ChevronDown,
	MapPin,
	CircleDollarSign,
	MoreVertical,
	PencilLine,
	Trash2,
	ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateOrderFormData, OrderOrganizationSummaryRow, OrderDocumentItem } from "../types";

interface Step5PreviewProps {
	data: CreateOrderFormData;
	onEditSection?: (step: number) => void;
	onOrganizationsListChange?: (list: OrderOrganizationSummaryRow[]) => void;
	onDocumentsChange?: (docs: OrderDocumentItem[]) => void;
}

export function Step5Preview({
	data,
	onEditSection,
	onOrganizationsListChange,
	onDocumentsChange,
}: Step5PreviewProps) {
	const t = useTranslate();
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({
		customer: true,
		contact: true,
		order: true,
		orderInfo: true,
		documents: true,
		organisation: true,
	});

	const [viewingOrgDetails, setViewingOrgDetails] = useState<OrderOrganizationSummaryRow | null>(null);

	const toggleSection = (key: string) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const { customerInfo, contactPerson, orderInfo, documents, contractor, organizationsList } = data;

	const formattedSum = orderInfo.contractSum || "0";

	const handleDeleteOrgRow = (id: string) => {
		if (onOrganizationsListChange) {
			onOrganizationsListChange(organizationsList.filter((org) => org.id !== id));
			showToast("info", t(localizationConstants.actionDelete));
		}
	};

	const handleDeleteDocument = (id: string) => {
		if (onDocumentsChange) {
			onDocumentsChange(documents.filter((doc) => doc.id !== id));
			showToast("info", t(localizationConstants.actionDelete));
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Top Overview Cards Banner */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center rounded-lg border border-slate-200 bg-white p-4 shadow-none">
				<div className="space-y-2">
					<div className="flex items-center gap-2.5">
						<h1 className="text-lg font-bold text-slate-900">
							{orderInfo.orderName || <Translate text={localizationConstants.orderTitleKitchenRenovation} />}
						</h1>
						<span className="rounded border border-slate-300 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
							<Translate text={localizationConstants.project} />
						</span>
					</div>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.postedDateLabel} /> {orderInfo.startDate || "-"}
					</p>

					<div className="flex items-center gap-2 pt-1">
						{customerInfo.city && (
							<span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
								<MapPin className="h-3 w-3" />
								{customerInfo.city}
							</span>
						)}
						{orderInfo.blockName && (
							<span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
								<MapPin className="h-3 w-3" />
								{orderInfo.blockName}
							</span>
						)}
					</div>
				</div>

				{/* Total offert card */}
				<div className="flex w-full flex-col justify-center rounded-lg bg-[#1E293B] p-4 text-white shadow-none">
					<div className="flex items-center gap-1.5 text-xs text-slate-300 font-normal">
						<CircleDollarSign className="h-4 w-4 text-slate-300" />
						<span><Translate text={localizationConstants.orderKontraktsummaLabel} /></span>
					</div>
					<div className="mt-1 text-xl font-bold tracking-tight">
						{formattedSum !== "0" && formattedSum ? formattedSum : "-"}
					</div>
				</div>
			</div>

			{/* Section Title */}
			<div className="pt-1">
				<h2 className="text-base font-bold text-slate-900">
					<Translate text={localizationConstants.orderDetailedInfoHeader} />
				</h2>
			</div>

			{/* Accordion 1: Kunduppgifter */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<Collapsible
					open={openSections.customer}
					onOpenChange={() => toggleSection("customer")}
				>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 py-0 text-left transition-colors hover:bg-slate-50/50 cursor-pointer"
						>
							<div className="flex items-center gap-2 text-base font-medium text-slate-900">
								<UserPlus className="h-5 w-5 text-slate-700" />
								<span><Translate text={localizationConstants.orderKunduppgifterSection} /></span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-slate-700 transition-transform duration-200",
									openSections.customer && "rotate-180"
								)}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 py-0 space-y-4 pt-3.5">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderKundLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.customer || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderAddressLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.address || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderPostNrLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.postalCode || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderCityLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.city || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderMailLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.email || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderTelefonLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.phone || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderOrgPersonNrLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{customerInfo.orgOrPersonalNo || "-"}
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</Card>

			{/* Accordion 2: Kontaktperson */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<Collapsible
					open={openSections.contact}
					onOpenChange={() => toggleSection("contact")}
				>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 py-0 text-left transition-colors hover:bg-slate-50/50 cursor-pointer"
						>
							<div className="flex items-center gap-2 text-base font-medium text-slate-900">
								<Contact className="h-5 w-5 text-slate-700" />
								<span><Translate text={localizationConstants.orderKontaktpersonSection} /></span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-slate-700 transition-transform duration-200",
									openSections.contact && "rotate-180"
								)}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 py-0 space-y-4 pt-3.5">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderFornamLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{contactPerson.firstName || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderEfternamnLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{contactPerson.lastName || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderMailLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{contactPerson.email || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderMobilLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{contactPerson.mobile || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderRollLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{contactPerson.role || "-"}
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</Card>

			{/* Accordion 3: Order */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<Collapsible
					open={openSections.order}
					onOpenChange={() => toggleSection("order")}
				>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 py-0 text-left transition-colors hover:bg-slate-50/50 cursor-pointer"
						>
							<div className="flex items-center gap-2 text-base font-medium text-slate-900">
								<ShoppingBag className="h-5 w-5 text-slate-700" />
								<span><Translate text={localizationConstants.orderSection} /></span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-slate-700 transition-transform duration-200",
									openSections.order && "rotate-180"
								)}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 py-0 space-y-4 pt-3.5">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderOrderNrLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.orderNo || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderOrderNameLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.orderName || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderBlockNameLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.blockName || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderAddress} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.orderAddress || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderPostNrLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.postalCode || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderCityLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.city || "-"}
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</Card>

			{/* Accordion 4: Order information */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<Collapsible
					open={openSections.orderInfo}
					onOpenChange={() => toggleSection("orderInfo")}
				>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 py-0 text-left transition-colors hover:bg-slate-50/50 cursor-pointer"
						>
							<div className="flex items-center gap-2 text-base font-medium text-slate-900">
								<Info className="h-5 w-5 text-slate-700" />
								<span><Translate text={localizationConstants.orderInfoSection} /></span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-slate-700 transition-transform duration-200",
									openSections.orderInfo && "rotate-180"
								)}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 py-0 space-y-4 pt-3.5">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderTypLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.type || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderKategoriLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.category || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderAvdelningLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.department || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderKontraktsummaLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.contractSum ? `${orderInfo.contractSum} kr` : "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderOffertNrLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.offerNo || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderStartDatumLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.startDate || "-"}
								</div>
							</div>
							<div>
								<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
									<Translate text={localizationConstants.orderSlutDatumLabel} />
								</Label>
								<div className="mt-1 text-sm font-normal text-slate-500">
									{orderInfo.endDate || "-"}
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</Card>

			{/* Accordion 5: Documents */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<Collapsible
					open={openSections.documents}
					onOpenChange={() => toggleSection("documents")}
				>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 py-0 text-left transition-colors hover:bg-slate-50/50 cursor-pointer"
						>
							<div className="flex items-center gap-2 text-base font-medium text-slate-900">
								<File className="h-5 w-5 text-slate-700" />
								<span><Translate text={localizationConstants.orderDokumentSection} /></span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-slate-700 transition-transform duration-200",
									openSections.documents && "rotate-180"
								)}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 py-0 space-y-4 pt-3.5">
						<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
							<div className="flex h-9 items-center bg-slate-200 px-4 border-b border-slate-200">
								<h3 className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.orderAttachedDocumentsHeader} />
								</h3>
							</div>
							<Table>
								<TableHeader className="bg-white">
									<TableRow className="border-b border-slate-200 hover:bg-white">
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.dateHeaderLabel} />
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.documentNameHeader} />
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.fileHeader} />
										</TableHead>
										<TableHead className="w-12 text-right text-xs font-medium text-slate-600 h-8">
											<span className="sr-only">
												<Translate text={localizationConstants.orderActionsHeader} />
											</span>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{documents.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={4}
												className="py-6 text-center text-xs text-slate-400"
											>
												<Translate text={localizationConstants.orderNoDocumentsYet} />
											</TableCell>
										</TableRow>
									) : (
										documents.map((doc) => (
											<TableRow
												key={doc.id}
												className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
											>
												<TableCell className="py-1.5 text-xs text-slate-600">
													{doc.date}
												</TableCell>
												<TableCell className="py-1.5">
													<div className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-none min-h-[34px]">
														{doc.documentName || t(localizationConstants.orderDocumentNameHeader)}
													</div>
												</TableCell>
												<TableCell className="py-1.5">
													<div className="flex items-center gap-2.5">
														{doc.fileType === "pdf" ? (
															<Image
																src="/file-type-pdf.png"
																alt="PDF"
																width={36}
																height={36}
																className="h-9 w-9 object-contain shrink-0"
															/>
														) : doc.fileType === "doc" ? (
															<Image
																src="/file-type-doc.png"
																alt="DOC"
																width={36}
																height={36}
																className="h-9 w-9 object-contain shrink-0"
															/>
														) : (
															<span className="flex items-center justify-center rounded bg-[#10B981] px-2 py-1 text-[10px] font-bold text-white tracking-wider">
																PNG
															</span>
														)}
														<span className="text-xs font-normal text-slate-800">
															{doc.fileName}
														</span>
													</div>
												</TableCell>
												<TableCell className="py-1.5 text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																aria-label={t(localizationConstants.actionsHeader)}
																className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-36 bg-white shadow-lg border border-slate-200 rounded-lg"
														>
															<DropdownMenuItem
																onClick={() =>
																	onEditSection?.(3)
																}
																className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
															>
																<PencilLine className="h-3.5 w-3.5 text-slate-700" />
																<span><Translate text={localizationConstants.actionEdit} /></span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleDeleteDocument(doc.id)
																}
																className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
															>
																<Trash2 className="h-3.5 w-3.5 text-slate-700" />
																<span><Translate text={localizationConstants.actionDelete} /></span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</Card>

			{/* Accordion 6: Organisation (First Table View -> On Click 'Se information' Shows Detail View) */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<Collapsible
					open={openSections.organisation}
					onOpenChange={() => toggleSection("organisation")}
				>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 py-0 text-left transition-colors hover:bg-slate-50/50 cursor-pointer"
						>
							<div className="flex items-center gap-2 text-base font-medium text-slate-900">
								<Building2 className="h-5 w-5 text-slate-700" />
								<span><Translate text={localizationConstants.companyTabOrganisation} /></span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-slate-700 transition-transform duration-200",
									openSections.organisation && "rotate-180"
								)}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 py-0 space-y-4 pt-3.5">
						{!viewingOrgDetails ? (
							/* 1. Initial State: Organisations Table (Figma Image 2) */
							<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
								<div className="flex h-9 items-center bg-slate-200 px-4 border-b border-slate-200">
									<h3 className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.orderGeneralInformation} />
									</h3>
								</div>
								<Table>
									<TableHeader className="bg-white">
										<TableRow className="border-b border-slate-200 hover:bg-white">
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.orderForetagHeader} />
											</TableHead>
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.orderKategoriLabel} />
											</TableHead>
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.contactNameLabel} />
											</TableHead>
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.orderMailLabel} />
											</TableHead>
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.orderMobilLabel} />
											</TableHead>
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.orderRollLabel} />
											</TableHead>
											<TableHead className="text-xs font-medium text-slate-600 h-8">
												<Translate text={localizationConstants.orderDetailedInfoHeader} />
											</TableHead>
											<TableHead className="w-12 text-right text-xs font-medium text-slate-600 h-8">
												<span className="sr-only">
													<Translate text={localizationConstants.orderActionsHeader} />
												</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{organizationsList.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={8}
													className="py-6 text-center text-xs text-slate-400"
												>
													<Translate text={localizationConstants.orderNoOrganizationsYet} />
												</TableCell>
											</TableRow>
										) : (
											organizationsList.map((row) => (
												<TableRow
													key={row.id}
													className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
												>
													<TableCell className="py-1.5 text-xs font-medium text-slate-900">
														{row.company || "-"}
													</TableCell>
													<TableCell className="py-1.5 text-xs text-slate-700">
														{row.category || "-"}
													</TableCell>
													<TableCell className="py-1.5 text-xs text-slate-800">
														{row.name || "-"}
													</TableCell>
													<TableCell className="py-1.5 text-xs text-slate-600 truncate max-w-[130px]">
														{row.email || "-"}
													</TableCell>
													<TableCell className="py-1.5 text-xs text-slate-600">
														{row.mobile || "-"}
													</TableCell>
													<TableCell className="py-1.5 text-xs text-slate-700">
														{row.role || "-"}
													</TableCell>
													<TableCell className="py-1.5">
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => setViewingOrgDetails(row)}
															className="h-7 border-slate-200 px-3 text-[11px] font-normal text-slate-800 hover:bg-slate-50 cursor-pointer shadow-none rounded"
														>
															<Translate text={localizationConstants.orderViewDetailsButton} />
														</Button>
													</TableCell>
													<TableCell className="py-1.5 text-right">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	aria-label={t(localizationConstants.actionsHeader)}
																	className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
																>
																	<MoreVertical className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent
																align="end"
																className="w-36 bg-white shadow-lg border border-slate-200 rounded-lg"
															>
																<DropdownMenuItem
																	onClick={() =>
																		onEditSection?.(4)
																	}
																	className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
																>
																	<PencilLine className="h-3.5 w-3.5 text-slate-700" />
																	<span><Translate text={localizationConstants.actionEdit} /></span>
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		handleDeleteOrgRow(row.id)
																	}
																	className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
																>
																	<Trash2 className="h-3.5 w-3.5 text-slate-700" />
																	<span><Translate text={localizationConstants.actionDelete} /></span>
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						) : (
							/* 2. Detail View State (Figma Image 1) shown on clicking 'Se information' */
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									{/* Allmän information Header / Badge */}
									<div className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-900">
										<Info className="h-4.5 w-4.5 text-slate-900" />
										<span><Translate text={localizationConstants.orderGeneralInformation} /></span>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setViewingOrgDetails(null)}
										className="h-8 gap-1.5 border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none rounded-md"
									>
										<ArrowLeft className="h-3.5 w-3.5" />
										<span><Translate text={localizationConstants.orderCreateBackButton} /></span>
									</Button>
								</div>

								{/* Contractor Overview Grid */}
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											<Translate text={localizationConstants.orderContractorTypeLabel} />
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.category || contractor.contractorType || "-"}
										</div>
									</div>
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											{viewingOrgDetails.category || contractor.contractorType || <Translate text={localizationConstants.orderKategoriLabel} />}
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.company || contractor.organizationName || "-"}
										</div>
									</div>
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											<Translate text={localizationConstants.orderAddressLabel} />
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.address || contractor.address || "-"}
										</div>
									</div>
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											<Translate text={localizationConstants.orderPostNrLabel} />
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.postalCode || contractor.postalCode || "-"}
										</div>
									</div>
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											<Translate text={localizationConstants.orderCityLabel} />
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.city || contractor.city || "-"}
										</div>
									</div>
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											<Translate text={localizationConstants.orderMailLabel} />
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.email || contractor.email || "-"}
										</div>
									</div>
									<div>
										<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
											<Translate text={localizationConstants.orderTelefonLabel} />
										</Label>
										<div className="mt-1 text-sm font-normal text-slate-500">
											{viewingOrgDetails.phone || contractor.phone || "-"}
										</div>
									</div>
								</div>

								<hr className="border-slate-200 my-3" />

								{/* Kontakt Header / Badge */}
								<div>
									<div className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-900">
										<Info className="h-4.5 w-4.5 text-slate-900" />
										<span><Translate text={localizationConstants.orderContactsSection} /></span>
									</div>
								</div>

								{/* Contact Persons List */}
								{viewingOrgDetails.contacts && viewingOrgDetails.contacts.length > 0 ? (
									<div className="space-y-4">
										{viewingOrgDetails.contacts.map((c, idx) => (
											<div
												key={c.id || idx}
												className="space-y-4 pt-3 first:pt-0 border-t first:border-t-0 border-slate-200"
											>
												<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
													<div>
														<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
															<Translate text={localizationConstants.orderFornamLabel} />
														</Label>
														<div className="mt-1 text-sm font-normal text-slate-500">
															{c.firstName || "-"}
														</div>
													</div>
													<div>
														<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
															<Translate text={localizationConstants.orderEfternamnLabel} />
														</Label>
														<div className="mt-1 text-sm font-normal text-slate-500">
															{c.lastName || "-"}
														</div>
													</div>
													<div>
														<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
															<Translate text={localizationConstants.orderMailLabel} />
														</Label>
														<div className="mt-1 text-sm font-normal text-slate-500">
															{c.email || "-"}
														</div>
													</div>
													<div>
														<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
															<Translate text={localizationConstants.orderMobilLabel} />
														</Label>
														<div className="mt-1 text-sm font-normal text-slate-500">
															{c.mobile || "-"}
														</div>
													</div>
													<div>
														<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
															<Translate text={localizationConstants.orderRollLabel} />
														</Label>
														<div className="mt-1 text-sm font-normal text-slate-500">
															{c.role || "-"}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
											<div>
												<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
													<Translate text={localizationConstants.orderFornamLabel} />
												</Label>
												<div className="mt-1 text-sm font-normal text-slate-500">
													{viewingOrgDetails.name?.split(" ")[0] || "-"}
												</div>
											</div>
											<div>
												<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
													<Translate text={localizationConstants.orderEfternamnLabel} />
												</Label>
												<div className="mt-1 text-sm font-normal text-slate-500">
													{viewingOrgDetails.name?.split(" ").slice(1).join(" ") || "-"}
												</div>
											</div>
											<div>
												<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
													<Translate text={localizationConstants.orderMailLabel} />
												</Label>
												<div className="mt-1 text-sm font-normal text-slate-500">
													{viewingOrgDetails.email || "-"}
												</div>
											</div>
											<div>
												<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
													<Translate text={localizationConstants.orderMobilLabel} />
												</Label>
												<div className="mt-1 text-sm font-normal text-slate-500">
													{viewingOrgDetails.mobile || "-"}
												</div>
											</div>
											<div>
												<Label className="text-[14px] font-medium leading-[20px] tracking-normal text-slate-700">
													<Translate text={localizationConstants.orderRollLabel} />
												</Label>
												<div className="mt-1 text-sm font-normal text-slate-500">
													{viewingOrgDetails.role || "-"}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
					</CollapsibleContent>
				</Collapsible>
			</Card>
		</div>
	);
}
