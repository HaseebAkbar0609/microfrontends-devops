"use client";

import React from "react";
import Link from "next/link";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExpenseDetail } from "../../hooks/useExpenseDetail";
import { ExpenseDetailHeader } from "./ExpenseDetailHeader";
import { ExpenseDetailAttestCard } from "./ExpenseDetailAttestCard";
import { ExpenseDetailInvoiceCard } from "./ExpenseDetailInvoiceCard";
import { ExpenseDetailTimeReportAccordion } from "./ExpenseDetailTimeReportAccordion";
import { ExpenseDetailAttachmentsAccordion } from "./ExpenseDetailAttachmentsAccordion";
import { EXPENSE_LIST_ROUTE } from "../../constants/expense.constants";

interface ExpenseDetailPageProps {
	expenseId: string;
}

export function ExpenseDetailPage({ expenseId }: ExpenseDetailPageProps) {
	const {
		expense,
		isLoading,
		error,
		calculations,
		confirmDisputeOpen,
		setConfirmDisputeOpen,
		confirmCertifiedOpen,
		setConfirmCertifiedOpen,
		confirmMoveToSupplierOpen,
		setConfirmMoveToSupplierOpen,
		isSubmitting,
		handleDispute,
		handleMarkCertified,
		handleMoveToSupplierList,
	} = useExpenseDetail(expenseId);

	if (isLoading) {
		return (
			<div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.expenseDetailLoading} />
					</p>
				</div>
			</div>
		);
	}

	if (error || !expense) {
		return (
			<div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
				<div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200 max-w-md">
					<p className="font-semibold text-sm">
						<Translate text={localizationConstants.expenseDetailNotFound} />
					</p>
					<Link href={EXPENSE_LIST_ROUTE} className="inline-block mt-4">
						<Button variant="outline" size="sm" className="text-xs">
							<Translate text={localizationConstants.expenseDetailBack} />
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const isInbox = Boolean(expense.isInboxItem);

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Main Content Container matching Figma layout */}
			<div className="max-w-6xl mx-auto w-full px-6 py-6 flex flex-col gap-3">
				{/* 1. Header with Detaljer and Actions */}
				<ExpenseDetailHeader
					expense={expense}
					onDispute={() => setConfirmDisputeOpen(true)}
					onMarkCertified={() => setConfirmCertifiedOpen(true)}
					onMoveToSupplierList={() => setConfirmMoveToSupplierOpen(true)}
					isSubmitting={isSubmitting}
				/>

				{/* 2. When Inbox: Attest ansvarig Card at top */}
				{isInbox && <ExpenseDetailAttestCard expense={expense} />}

				{/* 3. Invoice Card (Wrapped in Faktura container if inbox, standalone if supplier list) */}
				<ExpenseDetailInvoiceCard
					expense={expense}
					calculations={calculations}
					isInboxWrapper={isInbox}
				/>

				{/* 4. Collapsible Tidrapport Accordion */}
				<ExpenseDetailTimeReportAccordion expense={expense} />

				{/* 5. Collapsible Faktura underlag Accordion */}
				<ExpenseDetailAttachmentsAccordion expense={expense} />
			</div>

			{/* Modal: Confirm Dispute (göra reklamation) */}
			<Dialog open={confirmDisputeOpen} onOpenChange={setConfirmDisputeOpen}>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmDisputeTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmDisputeDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmDisputeOpen(false)}
							className="text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							disabled={isSubmitting}
							onClick={handleDispute}
							className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseDetailBtnDispute} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal: Confirm Certified (Markera som bestyrkt) */}
			<Dialog open={confirmCertifiedOpen} onOpenChange={setConfirmCertifiedOpen}>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmCertifiedTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmCertifiedDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmCertifiedOpen(false)}
							className="text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							disabled={isSubmitting}
							onClick={handleMarkCertified}
							className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseDetailBtnMarkCertified} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal: Confirm Move to Supplier List (Flytta till leverantörslistan) */}
			<Dialog
				open={confirmMoveToSupplierOpen}
				onOpenChange={setConfirmMoveToSupplierOpen}
			>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate
								text={localizationConstants.expenseConfirmMoveToSupplierListTitle}
							/>
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate
								text={localizationConstants.expenseConfirmMoveToSupplierListDesc}
							/>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmMoveToSupplierOpen(false)}
							className="text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							disabled={isSubmitting}
							onClick={handleMoveToSupplierList}
							className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
						>
							<Translate
								text={localizationConstants.expenseDetailBtnMoveToSupplierList}
							/>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default ExpenseDetailPage;
