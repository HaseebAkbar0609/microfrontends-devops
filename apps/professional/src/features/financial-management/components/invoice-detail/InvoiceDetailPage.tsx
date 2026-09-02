"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowLeft,
	Send,
	Download,
	CheckCircle,
	AlertOctagon,
	Edit2,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInvoiceDetail } from "../../hooks/useInvoiceDetail";
import { InvoiceDetailOverviewTab } from "./InvoiceDetailOverviewTab";
import { InvoiceDetailTimeReportTab } from "./InvoiceDetailTimeReportTab";
import { InvoiceDetailUnderlagTab } from "./InvoiceDetailUnderlagTab";
import { EditInvoiceDetailModal } from "./EditInvoiceDetailModal";
import { InvoicePrintDocumentView } from "./InvoicePrintDocumentView";

interface InvoiceDetailPageProps {
	invoiceId: string;
}

export function InvoiceDetailPage({ invoiceId }: InvoiceDetailPageProps) {
	const {
		activeTab,
		setActiveTab,
		invoiceData,
		isLoading,
		calculations,
		timeReportTotals,
		underlagTotals,
		editModalSection,
		setEditModalSection,
		showPrintView,
		setShowPrintView,
		updateInvoiceData,
		handleSendInvoice,
		handleMarkAsPaid,
		handleCreditInvoice,
	} = useInvoiceDetail(invoiceId);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-[400px]">
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.invoiceDetailLoading} />
				</p>
			</div>
		);
	}

	if (!invoiceData) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.invoiceDetailNotFound} />
				</p>
				<Link href="/module/financial-management/invoice">
					<Button variant="outline" size="sm">
						<Translate text={localizationConstants.invoiceDetailBack} />
					</Button>
				</Link>
			</div>
		);
	}

	if (showPrintView) {
		return (
			<InvoicePrintDocumentView
				data={invoiceData}
				calculations={calculations}
				onBack={() => setShowPrintView(false)}
			/>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen pb-16">
			{/* Top Page Header */}
			<div className="bg-white border-b border-slate-200 px-8 py-4">
				<div className="flex items-center justify-between flex-wrap gap-4">
					{/* Left: Back & Title */}
					<div className="flex items-center gap-3">
						<Link href="/module/financial-management/invoice">
							<Button
								variant="ghost"
								size="icon"
								aria-label="Back"
								className="h-8 w-8 text-slate-700 hover:text-slate-900 cursor-pointer -ml-2"
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
								<Translate text={localizationConstants.invoiceDetailTitle} />
								<span className="text-slate-400 font-normal text-sm">
									#{invoiceData.invoiceNo}
								</span>
							</h1>
							<p className="text-xs text-slate-400 font-normal mt-0.5">
								{invoiceData.customer} &bull; {invoiceData.projectName}
							</p>
						</div>
					</div>

					{/* Right: Primary Action Toolbar */}
					<div className="flex items-center gap-2 flex-wrap">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setEditModalSection("header")}
							className="h-8 px-3 text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer rounded-md"
						>
							<Edit2 className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.actionEdit} />
							</span>
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowPrintView(true)}
							className="h-8 px-3 text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer rounded-md"
						>
							<Download className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.invoiceDetailDownloadPdf} />
							</span>
						</Button>

						{invoiceData.status !== "krediterad" && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleCreditInvoice}
								className="h-8 px-3 text-xs gap-1.5 border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer rounded-md"
							>
								<AlertOctagon className="h-3.5 w-3.5" />
								<span>
									<Translate text={localizationConstants.invoiceDetailCredit} />
								</span>
							</Button>
						)}

						{invoiceData.status !== "betald" && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleMarkAsPaid}
								className="h-8 px-3 text-xs gap-1.5 border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer rounded-md"
							>
								<CheckCircle className="h-3.5 w-3.5" />
								<span>
									<Translate text={localizationConstants.invoiceDetailMarkAsPaid} />
								</span>
							</Button>
						)}

						<Button
							size="sm"
							onClick={handleSendInvoice}
							className="h-8 px-4 text-xs font-medium bg-zinc-900 hover:bg-slate-800 text-white gap-1.5 shadow-2xs cursor-pointer rounded-md"
						>
							<Send className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.createInvoiceBtnSend} />
							</span>
						</Button>
					</div>
				</div>

				{/* Level-2 Tabs Header */}
				<div className="mt-4 border-b border-slate-200">
					<Tabs
						value={activeTab}
						onValueChange={(val) =>
							setActiveTab(val as "oversikt" | "tidrapport" | "faktura-underlag")
						}
					>
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="oversikt" className="cursor-pointer text-xs font-medium">
								<Translate text={localizationConstants.createInvoiceTabOverview} />
							</TabsTrigger>
							<TabsTrigger value="tidrapport" className="cursor-pointer text-xs font-medium">
								<Translate text={localizationConstants.createInvoiceTabTimeReport} />
							</TabsTrigger>
							<TabsTrigger
								value="faktura-underlag"
								className="cursor-pointer text-xs font-medium"
							>
								<Translate text={localizationConstants.createInvoiceTabAttachments} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="px-8 py-6 max-w-7xl mx-auto w-full flex-1">
				{activeTab === "oversikt" && (
					<InvoiceDetailOverviewTab
						data={invoiceData}
						calculations={calculations}
						onOpenEdit={(sec) => setEditModalSection(sec)}
					/>
				)}

				{activeTab === "tidrapport" && (
					<InvoiceDetailTimeReportTab
						data={invoiceData}
						totals={timeReportTotals}
						onOpenEdit={(sec) => setEditModalSection(sec)}
					/>
				)}

				{activeTab === "faktura-underlag" && (
					<InvoiceDetailUnderlagTab
						data={invoiceData}
						totals={underlagTotals}
						onOpenEdit={(sec) => setEditModalSection(sec)}
					/>
				)}
			</div>

			{/* Edit Metadata / Comments Modal */}
			<EditInvoiceDetailModal
				open={editModalSection !== null}
				onOpenChange={(open) => {
					if (!open) setEditModalSection(null);
				}}
				section={editModalSection}
				data={invoiceData}
				onSave={updateInvoiceData}
			/>
		</div>
	);
}

export default InvoiceDetailPage;
