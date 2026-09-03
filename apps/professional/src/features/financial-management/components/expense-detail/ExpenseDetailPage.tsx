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
import { ExpenseDetailGeneralInfoCard } from "./ExpenseDetailGeneralInfoCard";
import { ExpenseDetailInvoiceCard } from "./ExpenseDetailInvoiceCard";
import { ExpenseDetailTimeReportAccordion } from "./ExpenseDetailTimeReportAccordion";
import { ExpenseDetailAttachmentsAccordion } from "./ExpenseDetailAttachmentsAccordion";
import { ExpenseDetailTimeline } from "./ExpenseDetailTimeline";

interface ExpenseDetailPageProps {
	expenseId: string;
}

export function ExpenseDetailPage({ expenseId }: ExpenseDetailPageProps) {
	const {
		expense,
		isLoading,
		error,
		calculations,
		confirmApproveOpen,
		setConfirmApproveOpen,
		confirmMarkPaidOpen,
		setConfirmMarkPaidOpen,
		confirmDeleteOpen,
		setConfirmDeleteOpen,
		isSubmitting,
		handleApprove,
		handleMarkAsPaid,
		handleDelete,
		handlePrint,
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
					<Link href="/module/financial-management/economy" className="inline-block mt-4">
						<Button variant="outline" size="sm" className="text-xs">
							<Translate text={localizationConstants.expenseDetailBack} />
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Main Content Container */}
			<div className="max-w-5xl mx-auto w-full px-6 py-6 flex flex-col gap-5">
				{/* 1. Header with Actions */}
				<ExpenseDetailHeader
					expense={expense}
					onPrint={handlePrint}
					onApprove={() => setConfirmApproveOpen(true)}
					onMarkAsPaid={() => setConfirmMarkPaidOpen(true)}
					onDelete={() => setConfirmDeleteOpen(true)}
					isSubmitting={isSubmitting}
				/>

				{/* 2. Timeline Status Bar */}
				<ExpenseDetailTimeline expense={expense} />

				{/* 3. General Information Card */}
				<ExpenseDetailGeneralInfoCard expense={expense} />

				{/* 4. Invoice Card Document View */}
				<ExpenseDetailInvoiceCard expense={expense} calculations={calculations} />

				{/* 5. Collapsible Time Report Accordion */}
				<ExpenseDetailTimeReportAccordion expense={expense} />

				{/* 6. Collapsible Attachments Accordion */}
				<ExpenseDetailAttachmentsAccordion expense={expense} />
			</div>

			{/* Modal: Confirm Approve */}
			<Dialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmApproveTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmApproveDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmApproveOpen(false)}
							className="text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							disabled={isSubmitting}
							onClick={handleApprove}
							className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseDetailBtnApprove} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal: Confirm Mark as Paid */}
			<Dialog open={confirmMarkPaidOpen} onOpenChange={setConfirmMarkPaidOpen}>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmMarkPaidTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmMarkPaidDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmMarkPaidOpen(false)}
							className="text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							disabled={isSubmitting}
							onClick={handleMarkAsPaid}
							className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseDetailBtnMarkPaid} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal: Confirm Delete */}
			<Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmDeleteTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmDeleteDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmDeleteOpen(false)}
							className="text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							variant="destructive"
							disabled={isSubmitting}
							onClick={handleDelete}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseDetailBtnDelete} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default ExpenseDetailPage;
