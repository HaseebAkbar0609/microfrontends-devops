"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Info,
	CreditCard,
	LayoutList,
	Upload,
	ChevronUp,
	ArrowUpDown,
	ArrowLeft,
	CircleFadingPlus,
	MoreVertical,
	Trash2,
	Send,
	Save,
	Sigma,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { RecordNavRow } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";
import { ORDER_MODULE_BASE_URL } from "@/features/orders/data/orderNav.config";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { usePaymentPlanDetail } from "../hooks/usePaymentPlan";
import { AddMilestoneModal, ConfirmModal } from "./PaymentPlanModals";
import type {
	PaymentMilestone,
	PaymentPlanDocument,
} from "../types/paymentPlan.types";
import { PAYMENT_PLAN_CONSTANTS } from "../constants/paymentPlan.constants";

/* =========================================================================
   Detail View Helper Sub-Components
   ========================================================================= */
function InfoField({
	label,
	value,
	valueClassName,
}: {
	label: string;
	value?: string | number;
	valueClassName?: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">{label}</span>
			<span
				className={cn(
					"font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words",
					valueClassName
				)}
			>
				{value !== undefined && value !== null && value !== "" ? String(value) : "—"}
			</span>
		</div>
	);
}



/* =========================================================================
   Main PaymentPlanDetailView Component
   ========================================================================= */
export interface PaymentPlanDetailViewProps {
	orderId?: string;
	planId?: string;
	serialNo?: string;
}

export function PaymentPlanDetailView({
	orderId = PAYMENT_PLAN_CONSTANTS.DEFAULT_ORDER_ID,
	planId = "1",
	serialNo,
}: PaymentPlanDetailViewProps) {
	const t = useTranslate();
	const router = useRouter();

	const {
		detail,
		isLoading,
		calculations,
		addMilestone,
		deleteMilestone,
		addDocument,
		deleteDocument,
		saveDetail,
		sendPlan,
	} = usePaymentPlanDetail(orderId, planId);

	// Collapsible states
	const [openSections, setOpenSections] = useState({
		projectInfo: true,
		paymentPlan: true,
		innehollMedel: true,
		uploadPlan: true,
	});

	// Modals
	const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
	const [milestoneToDelete, setMilestoneToDelete] = useState<PaymentMilestone | null>(null);
	const [docToDelete, setDocToDelete] = useState<PaymentPlanDocument | null>(null);
	const [isSendModalOpen, setIsSendModalOpen] = useState(false);

	// File input ref
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Table Sorting
	const [mSortBy, setMSortBy] = useState<keyof PaymentMilestone>("date");
	const [mSortOrder, setMSortOrder] = useState<"asc" | "desc">("asc");
	const [dSortBy, setDSortBy] = useState<keyof PaymentPlanDocument>("date");
	const [dSortOrder, setDSortOrder] = useState<"asc" | "desc">("asc");

	const toggleSection = (key: keyof typeof openSections) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleUpload = () => {
		if (!selectedFile) return;
		const ext = selectedFile.name.split(".").pop()?.toLowerCase();
		const fileType: "pdf" | "doc" | "image" =
			ext === "pdf" ? "pdf" : ext === "doc" || ext === "docx" ? "doc" : "image";

		addDocument({
			date: new Date().toISOString().split("T")[0],
			type: t(localizationConstants.lblByggmote),
			fileName: selectedFile.name,
			fileType,
		});

		setSelectedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const basePath = `/module/production/order/${orderId}`;
	const recordTitle = (
		<span className="font-sans text-base sm:text-xl md:text-2xl font-semibold leading-tight tracking-[-0.6px] text-slate-900 truncate">
			{t(localizationConstants.viewPaymentPlanBestallare)}
		</span>
	);

	const sortedMilestones = detail?.milestones
		? [...detail.milestones].sort((a, b) => {
				const aVal = a[mSortBy];
				const bVal = b[mSortBy];
				if (typeof aVal === "number" && typeof bVal === "number") {
					return mSortOrder === "asc" ? aVal - bVal : bVal - aVal;
				}
				const strA = String(aVal || "").toLowerCase();
				const strB = String(bVal || "").toLowerCase();
				if (strA < strB) return mSortOrder === "asc" ? -1 : 1;
				if (strA > strB) return mSortOrder === "asc" ? 1 : -1;
				return 0;
		  })
		: [];

	const sortedDocuments = detail?.documents
		? [...detail.documents].sort((a, b) => {
				const strA = String(a[dSortBy] || "").toLowerCase();
				const strB = String(b[dSortBy] || "").toLowerCase();
				if (strA < strB) return dSortOrder === "asc" ? -1 : 1;
				if (strA > strB) return dSortOrder === "asc" ? 1 : -1;
				return 0;
		  })
		: [];

	return (
		<div className="flex h-full flex-col bg-slate-50 relative overflow-hidden font-sans antialiased text-slate-900">
			{/* Top Header: Back + Order Title + Tabs */}
			<div className="bg-white px-4 sm:px-6 pt-4">
				<div className="flex justify-between gap-4 items-center pt-0 pb-4">
					<div className="flex min-w-0 gap-2 items-center">
						<Button asChild variant="ghost" size="icon" aria-label="Back"
							className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
							<Link href="/module/production/order/overview" aria-label="Back" className="flex items-center justify-center">
								<ArrowLeft className="size-5" />
							</Link>
						</Button>
						<div className="min-w-0">
							<h2 className="truncate font-sans text-base sm:text-xl md:text-2xl font-semibold leading-6 sm:leading-7 md:leading-8 tracking-normal text-slate-900">
								{t(localizationConstants.order)} {serialNo || orderId}
							</h2>
						</div>
					</div>
				</div>
				<Tabs value="payment-plan" className="w-full flex flex-col gap-0">
					<TabsList variant="line" className="pl-4 sm:pl-[3.25rem] pr-4 sm:pr-6">
						<TabsTrigger value="order-information" asChild>
							<Link href={`${basePath}/order-information`} className="cursor-pointer">
								<Translate text={localizationConstants.orderInformationTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="inspection" asChild>
							<Link href={`${basePath}/inspection`} className="cursor-pointer">
								<Translate text={localizationConstants.orderInspectionTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="organisation" asChild>
							<Link href={`${basePath}/organisation`} className="cursor-pointer">
								<Translate text={localizationConstants.orderOrganisationTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="payment-plan" asChild>
							<Link href={`${basePath}/payment-plan`} className="cursor-pointer">
								<Translate text={localizationConstants.paymentPlanTitle} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="ata" asChild>
							<Link href={`${basePath}/ata`} className="cursor-pointer">
								<Translate text={localizationConstants.ataTitle} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="guarantee" asChild>
							<Link href={`${basePath}/guarantee`} className="cursor-pointer">
								<Translate text={localizationConstants.warrantyCommitments} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="handlingar" asChild>
							<Link href={`${basePath}/handlingar`} className="cursor-pointer">
								<Translate text={localizationConstants.orderHandlingarTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="protocol" asChild>
							<Link href={`${basePath}/protocol`} className="cursor-pointer">
								<Translate text={localizationConstants.protocolsTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="staff" asChild>
							<Link href={`${basePath}/staff`} className="cursor-pointer">
								<Translate text={localizationConstants.staffLedgerTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="tidsplan" asChild>
							<Link href={`${basePath}/tidsplan`} className="cursor-pointer">
								<Translate text={localizationConstants.orderTimeplanTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="fraga-svar" asChild>
							<Link href={`${basePath}/fraga-svar`} className="cursor-pointer">
								<Translate text={localizationConstants.orderQaTab} />
							</Link>
						</TabsTrigger>
						<TabsTrigger value="dagbok" asChild>
							<Link href={`${basePath}/construction-log`} className="cursor-pointer">
								<Translate text={localizationConstants.orderDagbokTab} />
							</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Main Scrollable Content */}
			<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 pb-28">
				<div className="w-full space-y-6">
					{/* Navigation Row */}
					<RecordNavRow
						title={recordTitle}
						backHref={`${ORDER_MODULE_BASE_URL}/${orderId}/payment-plan`}
						className="pt-0"
						titleClassName="font-sans text-base sm:text-xl md:text-2xl font-semibold leading-tight tracking-[-0.6px] text-slate-900"
						backButtonClassName="mt-0"
					/>

					<div className="ml-0 sm:ml-7 space-y-4 max-w-[860px]">
						{isLoading || !detail ? (
							<div className="space-y-4 max-w-[860px]">
								<Skeleton className="h-44 w-full bg-slate-200 rounded-lg" />
								<Skeleton className="h-44 w-full bg-slate-200 rounded-lg" />
								<Skeleton className="h-64 w-full bg-slate-200 rounded-lg" />
								<Skeleton className="h-44 w-full bg-slate-200 rounded-lg" />
							</div>
						) : (
							<div className="space-y-4 max-w-[860px]">
								{/* Card 1: Projektinformation */}
								<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
									<Collapsible
										open={openSections.projectInfo}
										onOpenChange={() => toggleSection("projectInfo")}
									>
										<CollapsibleTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 text-left hover:bg-slate-50/50 rounded-none shadow-none font-normal"
											>
												<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
													<Info className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
													<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
														{t(localizationConstants.sectionProjectInfo)}
													</h3>
												</div>
												<ChevronUp
													size={18}
													className={cn(
														"text-zinc-500 transition-transform duration-200 shrink-0",
														!openSections.projectInfo && "rotate-180"
													)}
													aria-hidden={true}
												/>
											</Button>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
												<InfoField
													label={t(localizationConstants.lblProjektNr)}
													value={detail.projectInfo.projectNr}
												/>
												<InfoField
													label={t(localizationConstants.lblProjekt)}
													value={detail.projectInfo.project}
												/>
												<InfoField
													label={t(localizationConstants.lblKvartersNamn)}
													value={detail.projectInfo.kvartersNamn}
												/>
												<div className="hidden sm:block" />
												<InfoField
													label={t(localizationConstants.lblBestallare)}
													value={detail.projectInfo.bestallare}
												/>
												<InfoField
													label={t(localizationConstants.lblKontraktsumma)}
													value={detail.projectInfo.kontraktSumma.toLocaleString("sv-SE")}
												/>
												<InfoField
													label={t(localizationConstants.lblStartDatum)}
													value={detail.projectInfo.startDatum}
												/>
												<InfoField
													label={t(localizationConstants.lblSlutDatum)}
													value={detail.projectInfo.slutDatum}
												/>
											</div>
										</CollapsibleContent>
									</Collapsible>
								</div>

								{/* Card 2: Betalningsplan */}
								<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
									<Collapsible
										open={openSections.paymentPlan}
										onOpenChange={() => toggleSection("paymentPlan")}
									>
										<CollapsibleTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 text-left hover:bg-slate-50/50 rounded-none shadow-none font-normal"
											>
												<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
													<CreditCard className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
													<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
														{t(localizationConstants.sectionBetalningsplan)}
													</h3>
												</div>
												<ChevronUp
													size={18}
													className={cn(
														"text-zinc-500 transition-transform duration-200 shrink-0",
														!openSections.paymentPlan && "rotate-180"
													)}
													aria-hidden={true}
												/>
											</Button>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
												<InfoField
													label={t(localizationConstants.lblKontraktsummaAlt)}
													value={`${detail.summary.kontraktsumma.toLocaleString("sv-SE")} kr`}
												/>
												<InfoField
													label={t(localizationConstants.lblSkapadAv)}
													value={detail.summary.skapadAv}
												/>
												<InfoField
													label={t(localizationConstants.lblDatum)}
													value={detail.summary.datum}
												/>
												<InfoField
													label={t(localizationConstants.lblReviderad)}
													value={detail.summary.reviderad}
												/>
												<div className="col-span-1 sm:col-span-2 border-b border-zinc-200" />
												<InfoField
													label={t(localizationConstants.lblInnehallnaMedelPerAconto)}
													value={`${detail.summary.innehallnaMedelPerAcontoPercent}%`}
												/>
												<InfoField
													label={t(localizationConstants.lblTotaltInnehalletAvKontraktsumma)}
													value={`${detail.summary.totaltInnehalletAvKontraktsummaPercent}%`}
												/>
												<InfoField
													label={t(localizationConstants.lblBelopp)}
													value={String(detail.summary.belopp)}
												/>
												<InfoField
													label={t(localizationConstants.lblBeloppInnehalletTotalt)}
													value={detail.summary.beloppInnehalletTotalt.toLocaleString("sv-SE")}
												/>
											</div>
										</CollapsibleContent>
									</Collapsible>
								</div>

								{/* Card 3: Innehöll medel / Retained funds */}
								<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
									<Collapsible
										open={openSections.innehollMedel}
										onOpenChange={() => toggleSection("innehollMedel")}
									>
										<CollapsibleTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 text-left hover:bg-slate-50/50 rounded-none shadow-none font-normal"
											>
												<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
													<LayoutList className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
													<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
														{t(localizationConstants.sectionInnehollMedel)}
													</h3>
												</div>
												<ChevronUp
													size={18}
													className={cn(
														"text-zinc-500 transition-transform duration-200 shrink-0",
														!openSections.innehollMedel && "rotate-180"
													)}
													aria-hidden={true}
												/>
											</Button>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<div className="p-4 sm:p-6 space-y-6">
												<div className="w-full overflow-x-auto relative bg-white">
													<Table className="w-full min-w-[640px] table-auto border-collapse">
														<TableHeader>
															<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
																<TableHead
																	onClick={() => {
																		setMSortBy("date");
																		setMSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
																	}}
																	className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
																>
																	<div className="flex items-center gap-1">
																		<span>{t(localizationConstants.colDatum)}</span>
																		<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
																	</div>
																</TableHead>
																<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] whitespace-nowrap">
																	{t(localizationConstants.colAktivitet)}
																</TableHead>
																<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] whitespace-nowrap">
																	{t(localizationConstants.colLyft)}
																</TableHead>
																<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] whitespace-nowrap">
																	{t(localizationConstants.colBelopp)}
																</TableHead>
																<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] whitespace-nowrap">
																	{t(localizationConstants.colInnehallet)}
																</TableHead>
																<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B] whitespace-nowrap">
																	{t(localizationConstants.colAttErhalla)}
																</TableHead>
																<TableHead className="w-10 px-2 py-3.5" />
															</TableRow>
														</TableHeader>
														<TableBody>
															{sortedMilestones.length === 0 ? (
																<TableRow className="h-[56px]">
																	<TableCell colSpan={7} className="h-[56px] text-center font-sans text-sm text-slate-400 py-6">
																		{t(localizationConstants.noRecordsFound)}
																	</TableCell>
																</TableRow>
															) : (
																sortedMilestones.map((m) => (
																	<TableRow
																		key={m.id}
																		className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
																	>
																		<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																			{m.date}
																		</TableCell>
																		<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																			{m.activity}
																		</TableCell>
																		<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																			{m.lyft}
																		</TableCell>
																		<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																			{m.belopp.toLocaleString("sv-SE")}
																		</TableCell>
																		<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																			{m.innehallet < 0 ? `-${Math.abs(m.innehallet).toLocaleString("sv-SE")}` : m.innehallet.toLocaleString("sv-SE")}
																		</TableCell>
																		<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																			{m.attErhalla.toLocaleString("sv-SE")}
																		</TableCell>
																		<TableCell className="px-3 py-3.5 text-right whitespace-nowrap">
																			<DropdownMenu>
																				<DropdownMenuTrigger asChild>
																					<Button
																						type="button"
																						variant="ghost"
																						size="icon"
																						className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
																						aria-label={t(localizationConstants.actions)}
																					>
																						<MoreVertical className="h-4 w-4" />
																					</Button>
																				</DropdownMenuTrigger>
																				<DropdownMenuContent align="end" className="w-36 bg-white border border-slate-200 shadow-md rounded-md p-1">
																					<DropdownMenuItem onClick={() => setMilestoneToDelete(m)} className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors">
																						<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
																						<span>{t(localizationConstants.btnRadera)}</span>
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

												{/* Financial Summary Card */}
												<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2">
													<div className="w-full sm:w-[340px] h-[132px] rounded-lg bg-slate-200 px-3 py-2 flex flex-col justify-between gap-1">
														<div className="flex items-center justify-between pb-1 border-b border-slate-300/80">
															<div className="flex items-center gap-1.5 font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
																<Sigma className="h-5 w-5 size-5 text-slate-700 shrink-0" strokeWidth={1.6} aria-hidden />
																<span>{t(localizationConstants.lblTotalSum)}</span>
															</div>
															<span className="w-[115px] text-left font-sans font-medium text-base leading-6 tracking-normal text-slate-900 shrink-0">
																{calculations.totalSum.toLocaleString("sv-SE")} kr
															</span>
														</div>
														<div className="flex flex-col justify-between flex-1 gap-0.5">
															<div className="flex items-center justify-between font-sans font-medium text-sm leading-6 tracking-normal text-slate-500">
																<span className="pl-[26px]">{t(localizationConstants.lblSkickat)}</span>
																<span className="w-[115px] text-left shrink-0">{calculations.totalInvoicedSent.toLocaleString("sv-SE")} kr</span>
															</div>
															<div className="flex items-center justify-between font-sans font-medium text-sm leading-6 tracking-normal text-slate-500">
																<span className="pl-[26px]">{t(localizationConstants.lblKvarAttSkicka)}</span>
																<span className="w-[115px] text-left shrink-0">
																	{calculations.remainingToSend < 0
																		? `-${Math.abs(calculations.remainingToSend).toLocaleString("sv-SE")} kr`
																		: `${calculations.remainingToSend.toLocaleString("sv-SE")} kr`}
																</span>
															</div>
															<div className="flex items-center justify-between font-sans font-medium text-sm leading-6 tracking-normal text-slate-500">
																<span className="pl-[26px]">{t(localizationConstants.sectionInnehallnaMedel)}</span>
																<span className="w-[115px] text-left shrink-0">
																	{calculations.totalRetained < 0
																		? `-${Math.abs(calculations.totalRetained).toLocaleString("sv-SE")} kr`
																		: `${calculations.totalRetained.toLocaleString("sv-SE")} kr`}
																</span>
															</div>
														</div>
													</div>

													<Button
														type="button"
														onClick={() => setIsAddMilestoneOpen(true)}
														className="h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-none gap-2 cursor-pointer self-end sm:self-auto"
													>
														<CircleFadingPlus className="h-4 w-4" />
														<span>{t(localizationConstants.btnLaggTill)}</span>
													</Button>
												</div>
											</div>
										</CollapsibleContent>
									</Collapsible>
								</div>

								{/* Card 4: Ladda upp betalningsplan */}
								<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
									<div className="flex h-14 min-h-14 w-full items-center border-b border-zinc-200 bg-white px-4 sm:px-6">
										<div className="flex items-center gap-2 sm:gap-3 min-w-0">
											<Upload className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
											<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
												{t(localizationConstants.sectionLaddaUppBetalningsplan)}
											</h3>
										</div>
									</div>
									<div className="p-4 sm:p-6 space-y-6">
												<div className="space-y-2">
													<label className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 block">
														{t(localizationConstants.lblLaddaUppDinaFiler)}
													</label>
													<div className="flex items-center gap-3">
														<input
															type="file"
															ref={fileInputRef}
															onChange={(e) => {
																if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
															}}
															accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
															className="hidden"
															id="plan-detail-upload"
														/>
														<div className="h-10 w-full max-w-[340px] rounded-lg border border-slate-200 bg-white px-3 flex items-center gap-3">
															<label
																htmlFor="plan-detail-upload"
																className="cursor-pointer font-sans text-sm font-semibold text-slate-900 hover:text-slate-700 shrink-0"
															>
																{t(localizationConstants.btnLaddaUpp)}
															</label>
															<span className="font-sans text-sm font-normal text-slate-700 truncate min-w-0 flex-1">
																{selectedFile ? selectedFile.name : t(localizationConstants.lblNoFileChosen)}
															</span>
														</div>
														<Button
															type="button"
															onClick={handleUpload}
															disabled={!selectedFile}
															className="h-10 px-5 rounded-lg bg-slate-500 hover:bg-slate-600 text-white font-sans text-sm font-medium shadow-none cursor-pointer disabled:opacity-50"
														>
															{t(localizationConstants.btnLaggTill)}
														</Button>
													</div>
													<p className="font-sans text-xs font-normal text-slate-400 mt-1">
														{t(localizationConstants.lblAllowedFileFormats)}
													</p>
												</div>

												{/* Inner Uppladdad dokument Card */}
												<div className="overflow-hidden rounded-lg border border-slate-200 bg-white w-full shadow-2xs mt-6">
													<div className="bg-slate-200 px-4 py-2.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 border-b border-slate-200">
														{t(localizationConstants.lblUppladdadDokument)}
													</div>
													<div className="w-full overflow-x-auto relative bg-white">
														<Table className="w-full table-auto border-collapse">
															<TableHeader>
																<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
																	<TableHead
																		onClick={() => {
																			setDSortBy("date");
																			setDSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
																		}}
																		className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
																	>
																		<div className="flex items-center gap-1">
																			<span>{t(localizationConstants.colDatum)}</span>
																			<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
																		</div>
																	</TableHead>
																	<TableHead
																		onClick={() => {
																			setDSortBy("type");
																			setDSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
																		}}
																		className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
																	>
																		<div className="flex items-center gap-1">
																			<span>{t(localizationConstants.colType)}</span>
																			<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
																		</div>
																	</TableHead>
																	<TableHead
																		onClick={() => {
																			setDSortBy("fileName");
																			setDSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
																		}}
																		className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
																	>
																		<div className="flex items-center gap-1">
																			<span>{t(localizationConstants.colPdf)}</span>
																			<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
																		</div>
																	</TableHead>
																	<TableHead className="w-36 px-4 py-3.5" />
																</TableRow>
															</TableHeader>
															<TableBody>
																{sortedDocuments.length === 0 ? (
																	<TableRow className="h-[56px]">
																		<TableCell colSpan={4} className="h-[56px] text-center font-sans text-sm text-slate-400 py-6">
																			{t(localizationConstants.noRecordsFound)}
																		</TableCell>
																	</TableRow>
																) : (
																	sortedDocuments.map((doc) => (
																		<TableRow key={doc.id} className="group border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/60">
																			<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																				{doc.date}
																			</TableCell>
																			<TableCell className="px-4 py-3.5 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
																				{doc.type || t(localizationConstants.lblByggmote)}
																			</TableCell>
																			<TableCell className="px-4 py-3.5">
																				<div className="flex items-center gap-3 min-w-0">
																					<PdfFileIcon className="h-11 w-9 shrink-0" />
																					<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 truncate min-w-0">
																						{doc.fileName}
																					</span>
																				</div>
																			</TableCell>
																			<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
																				<div className="flex items-center justify-end gap-2">
																					<Button
																						type="button"
																						variant="outline"
																						className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-sans text-sm font-medium shadow-none cursor-pointer"
																					>
																						{t(localizationConstants.btnView)}
																					</Button>
																					<DropdownMenu>
																						<DropdownMenuTrigger asChild>
																							<Button
																								type="button"
																								variant="ghost"
																								size="icon"
																								className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
																								aria-label={t(localizationConstants.actions)}
																							>
																								<MoreVertical className="h-4 w-4" />
																							</Button>
																						</DropdownMenuTrigger>
																						<DropdownMenuContent align="end" className="w-36 bg-white border border-slate-200 shadow-md rounded-md p-1">
																							<DropdownMenuItem
																								onClick={() => setDocToDelete(doc)}
																								className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
																							>
																								<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
																								<span>{t(localizationConstants.btnRadera)}</span>
																							</DropdownMenuItem>
																						</DropdownMenuContent>
																					</DropdownMenu>
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
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Sticky Action Footer */}
			<div className="sticky bottom-0 left-0 right-0 z-10 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 sm:gap-3 border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shadow-md">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(`${ORDER_MODULE_BASE_URL}/${orderId}/payment-plan`)}
					className="w-full sm:w-[160px] h-[44px] px-4 py-2 rounded-lg border-slate-200 bg-white text-slate-900 hover:bg-slate-50 font-sans text-sm font-medium cursor-pointer shadow-none"
				>
					{t(localizationConstants.btnAvbryt)}
				</Button>

				<Button
					type="button"
					onClick={saveDetail}
					className="w-full sm:w-[160px] h-[44px] px-4 py-2 rounded-lg border border-transparent bg-zinc-100 hover:bg-zinc-200 text-slate-900 font-sans text-sm font-medium cursor-pointer shadow-none inline-flex items-center justify-center gap-2"
				>
					<Save className="h-4 w-4 text-slate-800 shrink-0" strokeWidth={1.75} />
					<span>{t(localizationConstants.btnSpara)}</span>
				</Button>

				<Button
					type="button"
					onClick={() => setIsSendModalOpen(true)}
					className="w-full sm:w-[160px] h-[44px] px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-medium cursor-pointer shadow-none inline-flex items-center justify-center gap-2"
				>
					<Send className="h-4 w-4 text-white shrink-0" strokeWidth={1.75} />
					<span>{t(localizationConstants.btnSkicka)}</span>
				</Button>
			</div>

			{/* Add Milestone Modal */}
			<AddMilestoneModal
				isOpen={isAddMilestoneOpen}
				onClose={() => setIsAddMilestoneOpen(false)}
				onAdd={addMilestone}
				contractSum={detail?.projectInfo.kontraktSumma}
				retainedPercent={detail?.summary.innehallnaMedelPerAcontoPercent}
			/>

			{/* Delete Milestone Confirmation */}
			<ConfirmModal
				isOpen={!!milestoneToDelete}
				onClose={() => setMilestoneToDelete(null)}
				onConfirm={() => {
					if (milestoneToDelete) deleteMilestone(milestoneToDelete.id);
				}}
				title={t(localizationConstants.modalDeleteMilestoneTitle)}
				description={t(localizationConstants.modalDeleteMilestoneDesc)}
				itemName={milestoneToDelete?.activity}
				type="delete"
			/>

			{/* Delete Document Confirmation */}
			<ConfirmModal
				isOpen={!!docToDelete}
				onClose={() => setDocToDelete(null)}
				onConfirm={() => {
					if (docToDelete) deleteDocument(docToDelete.id);
				}}
				title={t(localizationConstants.deleteDocumentTitle)}
				description={t(localizationConstants.deleteDocumentDesc)}
				itemName={docToDelete?.fileName}
				type="delete"
			/>

			{/* Send Payment Plan Confirmation */}
			<ConfirmModal
				isOpen={isSendModalOpen}
				onClose={() => setIsSendModalOpen(false)}
				onConfirm={sendPlan}
				planName={detail?.title}
				type="send"
			/>
		</div>
	);
}

export default PaymentPlanDetailView;
