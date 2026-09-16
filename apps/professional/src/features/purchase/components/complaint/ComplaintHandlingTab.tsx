"use client";

import { useState } from "react";
import { CircleUserRound, Package, Send } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import {
	QAThreadCard,
	type QAThreadLabels,
	type QAThreadMessage,
} from "@/components/common/QAThreadCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useComplaintHandlingForm } from "../../hooks/useComplaintHandlingForm";
import type { PurchaseComplaintDetail } from "../../types/purchase.types";
import { InfoField, InfoFieldGrid } from "../shared/InfoFieldGrid";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

const DECISIONS: { value: string; label: TranslationKeys }[] = [
	{
		value: "approved",
		label: localizationConstants.purchaseComplaintDecisionApproved,
	},
	{
		value: "rejected",
		label: localizationConstants.purchaseComplaintDecisionRejected,
	},
	{
		value: "pending",
		label: localizationConstants.purchaseComplaintDecisionPending,
	},
];

const RESOLUTION_TYPES: { value: string; label: TranslationKeys }[] = [
	{
		value: "replacement",
		label: localizationConstants.purchaseComplaintResolutionReplacement,
	},
	{
		value: "credit",
		label: localizationConstants.purchaseComplaintResolutionCredit,
	},
	{
		value: "repair",
		label: localizationConstants.purchaseComplaintResolutionRepair,
	},
];

const RESOLUTION_STATUSES: { value: string; label: TranslationKeys }[] = [
	{
		value: "open",
		label: localizationConstants.purchaseComplaintResolutionOpen,
	},
	{
		value: "in_progress",
		label: localizationConstants.purchaseComplaintResolutionProgress,
	},
	{
		value: "resolved",
		label: localizationConstants.purchaseComplaintResolutionResolved,
	},
	{
		value: "closed",
		label: localizationConstants.purchaseComplaintResolutionClosed,
	},
];

/**
 * This module's own wording for the shared thread card.
 *
 * No row-menu labels: a complaint thread has no read, archive or delete model,
 * so the frame's kebab is left off rather than shipped as three items that do
 * nothing.
 */
const QA_LABELS: QAThreadLabels = {
	leaveComment: localizationConstants.purchaseComplaintQaLeaveComment,
	send: localizationConstants.purchaseComplaintQaSend,
	cancel: localizationConstants.cancelButton,
	answerBadge: localizationConstants.purchaseComplaintQaAdmin,
	answerSubLabel: localizationConstants.purchaseComplaintQaYou,
	badges: { UE: localizationConstants.purchaseComplaintQaUe },
};

export interface ComplaintHandlingTabProps {
	complaintId: string;
	detail: PurchaseComplaintDetail;
	messages: QAThreadMessage[];
}

/**
 * The record's Hantering av reklamation section: who to talk to at the
 * supplier, the resolution form, and the Fråga/Svar thread.
 *
 * The frame's rail also carries a "Step 2/2" progress bar. That is the create
 * wizard's rail pasted onto a record — a detail page has no steps — so the bar
 * is dropped and the green action kept. Flagged on the ticket.
 */
export function ComplaintHandlingTab({
	complaintId,
	detail,
	messages,
}: ComplaintHandlingTabProps) {
	const t = useTranslate();
	const currentUserName = useCurrentUserName(
		localizationConstants.purchaseComplaintQaYou,
	);
	const { resolution, patch, errors, save, reset } = useComplaintHandlingForm(
		complaintId,
		detail.resolution,
	);

	const [thread, setThread] = useState(messages);

	/** No endpoint yet: the reply is acknowledged and shown on the thread. */
	const handleSendReply = (id: string, text: string) => {
		setThread((previous) =>
			previous.map((message) =>
				message.id === id
					? {
							...message,
							answered: true,
							answerUser: currentUserName,
							answerText: text,
						}
					: message,
			),
		);
		showToast(
			"success",
			t(localizationConstants.purchaseComplaintQaSentToast),
		);
	};

	return (
		<div className="flex flex-col gap-4 xl:flex-row">
			<div className="min-w-0 flex-1 space-y-4">
				<InfoFieldGrid
					titleKey={
						localizationConstants.purchaseComplaintSupplierComm
					}
					icon={<Package className="h-5 w-5 text-slate-700" />}
				>
					<InfoField
						labelKey={localizationConstants.contactPersonLabel}
						value={detail.supplierContact.contactPerson}
					/>
					<InfoField
						labelKey={localizationConstants.mailLabel}
						value={detail.supplierContact.email}
					/>
					<InfoField
						labelKey={
							localizationConstants.purchaseComplaintReference
						}
						value={detail.supplierContact.referenceNumber}
					/>
					<InfoField
						labelKey={localizationConstants.orderTelefonLabel}
						value={detail.supplierContact.phone}
					/>
				</InfoFieldGrid>

				<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
					<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
							<CircleUserRound
								className="h-5 w-5 text-slate-700"
								aria-hidden
							/>
							<Translate
								text={
									localizationConstants.purchaseComplaintResolutionSection
								}
							/>
						</CardTitle>
					</CardHeader>

					<CardContent className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
						<div>
							<Label
								htmlFor="complaint-decision"
								className="mb-1.5 text-sm font-medium text-slate-900"
							>
								<Translate
									text={
										localizationConstants.purchaseComplaintDecision
									}
								/>
							</Label>
							<Select
								value={resolution.decision}
								onValueChange={(value) =>
									patch({ decision: value })
								}
							>
								<SelectTrigger
									id="complaint-decision"
									className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none"
								>
									<SelectValue
										placeholder={t(
											localizationConstants.purchaseComplaintDecisionPlaceholder,
										)}
									/>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{DECISIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
											className="cursor-pointer"
										>
											<Translate text={option.label} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label
								htmlFor="complaint-resolution-type"
								className="mb-1.5 text-sm font-medium text-slate-900"
							>
								<Translate
									text={
										localizationConstants.purchaseComplaintResolutionType
									}
								/>
							</Label>
							<Select
								value={resolution.resolutionType}
								onValueChange={(value) =>
									patch({ resolutionType: value })
								}
							>
								<SelectTrigger
									id="complaint-resolution-type"
									className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none"
								>
									<SelectValue
										placeholder={t(
											localizationConstants.purchaseComplaintTypePlaceholder,
										)}
									/>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{RESOLUTION_TYPES.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
											className="cursor-pointer"
										>
											<Translate text={option.label} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label
								htmlFor="complaint-resolution-status"
								className="mb-1.5 text-sm font-medium text-slate-900"
							>
								<Translate
									text={
										localizationConstants.purchaseComplaintResolutionStatus
									}
								/>
							</Label>
							<Select
								value={resolution.resolutionStatus}
								onValueChange={(value) =>
									patch({ resolutionStatus: value })
								}
							>
								<SelectTrigger
									id="complaint-resolution-status"
									className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none"
								>
									<SelectValue
										placeholder={t(
											localizationConstants.purchaseComplaintStatusPlaceholder,
										)}
									/>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{RESOLUTION_STATUSES.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
											className="cursor-pointer"
										>
											<Translate text={option.label} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label
								htmlFor="complaint-resolution-date"
								className="mb-1.5 text-sm font-medium text-slate-900"
							>
								<Translate
									text={
										localizationConstants.purchaseComplaintResolutionDate
									}
								/>
							</Label>
							<Input
								id="complaint-resolution-date"
								type="date"
								value={resolution.resolutionDate}
								onChange={(event) =>
									patch({
										resolutionDate: event.target.value,
									})
								}
								className={FIELD_CLASS}
							/>
						</div>

						<div className="sm:col-span-2">
							<Label
								htmlFor="complaint-internal-notes"
								className="mb-1.5 text-sm font-medium text-slate-900"
							>
								<Translate
									text={
										localizationConstants.purchaseComplaintInternalNotes
									}
								/>
							</Label>
							<Textarea
								id="complaint-internal-notes"
								value={resolution.internalNotes}
								onChange={(event) =>
									patch({
										internalNotes: event.target.value,
									})
								}
								placeholder={t(
									localizationConstants.purchaseComplaintNotesPlaceholder,
								)}
								aria-invalid={Boolean(errors.internalNotes)}
								className={cn(
									"min-h-24 rounded-md border-slate-200 shadow-none",
									errors.internalNotes && "border-red-500",
								)}
							/>
							{errors.internalNotes && (
								<p className="mt-1 text-xs font-normal text-red-500">
									{t(
										errors.internalNotes as TranslationKeys,
									)}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex flex-wrap items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={reset}
						className="h-10 min-w-25 cursor-pointer border-slate-300 bg-white text-sm text-slate-700 shadow-none hover:bg-slate-100"
					>
						<Translate
							text={localizationConstants.cancelButton}
						/>
					</Button>

					<PermissionGate permission="EDIT_PURCHASE">
						<Button
							type="button"
							onClick={save}
							className="h-10 min-w-25 cursor-pointer gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800"
						>
							<Translate
								text={localizationConstants.confirmSave}
							/>
						</Button>
					</PermissionGate>
				</div>
			</div>

			<div className="w-full shrink-0 space-y-4 xl:w-96">
				<div className="rounded-lg border border-slate-200 bg-white p-4 shadow-none">
					<Button
						type="button"
						disabled
						aria-disabled
						title={t(
							localizationConstants.complaintCreateUnavailable,
						)}
						aria-label={`${t(localizationConstants.purchaseTabQa)} — ${t(
							localizationConstants.complaintCreateUnavailable,
						)}`}
						className="h-10 w-full cursor-pointer gap-2 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Send className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.purchaseTabQa} />
					</Button>
				</div>

				<div className="rounded-lg border border-slate-200 bg-white p-4 shadow-none">
					<p className="mb-3 flex items-center gap-2 text-base font-medium text-slate-900">
						<Translate text={localizationConstants.purchaseTabQa} />
						<span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
							{String(thread.length).padStart(2, "0")}
						</span>
					</p>

					{thread.length === 0 ? (
						<p className="py-6 text-center text-xs text-slate-400">
							<Translate
								text={
									localizationConstants.purchaseComplaintQaNone
								}
							/>
						</p>
					) : (
						<div className="flex flex-col gap-3.5">
							{thread.map((message) => (
								<QAThreadCard
									key={message.id}
									message={message}
									labels={QA_LABELS}
									currentUserName={currentUserName}
									onSendReply={handleSendReply}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ComplaintHandlingTab;
