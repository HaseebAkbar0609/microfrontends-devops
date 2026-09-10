"use client";

import { useState } from "react";
import { CheckCheck, Mail, MailOpen, Plus } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import {
	QAThreadCard,
	type QAThreadLabels,
} from "@/components/common/QAThreadCard";
import { QAThreadColumn } from "@/components/common/QAThreadColumn";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	PurchaseQaDraft,
	usePurchaseQaBoard,
} from "../../hooks/usePurchaseQaBoard";
import type {
	PurchaseQaMessage,
	PurchaseQaStatus,
} from "../../types/purchase.types";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { PurchaseQaCreateDialog } from "./PurchaseQaCreateDialog";
import { PurchaseQaFilters } from "./PurchaseQaFilters";

/** This module's wording for the shared card, in Swedish. */
const QA_LABELS: QAThreadLabels = {
	markAsRead: localizationConstants.purchaseQaMarkAsRead,
	archive: localizationConstants.purchaseQaArchiveAction,
	delete: localizationConstants.purchaseQaDeleteAction,
	leaveComment: localizationConstants.purchaseComplaintQaLeaveComment,
	send: localizationConstants.purchaseComplaintQaSend,
	cancel: localizationConstants.cancelButton,
	answerBadge: localizationConstants.purchaseComplaintQaAdmin,
	answerSubLabel: localizationConstants.purchaseComplaintQaYou,
	badges: { UE: localizationConstants.purchaseComplaintQaUe },
};

const COLUMNS: {
	status: PurchaseQaStatus;
	labelKey: TranslationKeys;
	icon: React.ReactNode;
	className?: string;
}[] = [
	{
		status: "new",
		labelKey: localizationConstants.purchaseQaColNew,
		icon: <Mail size={18} className="text-slate-900" aria-hidden />,
	},
	{
		status: "opened",
		labelKey: localizationConstants.purchaseQaColOpened,
		icon: <MailOpen size={18} className="text-slate-900" aria-hidden />,
	},
	{
		status: "answered",
		labelKey: localizationConstants.purchaseQaColAnswered,
		icon: <CheckCheck size={18} className="text-slate-900" aria-hidden />,
		className: "md:col-span-2 xl:col-span-1",
	},
];

export interface PurchaseQaBoardProps {
	/**
	 * The board state, owned by the page so both tabs act on one list rather
	 * than each holding its own copy.
	 */
	board: ReturnType<typeof usePurchaseQaBoard>;
	/** The Arkiv tab lists archived questions; All lists the rest. */
	archivedOnly?: boolean;
}

/**
 * The purchase module's Fråga/Svar board: three collapsible columns over a
 * search-and-filter row, with a create action.
 *
 * Both the column and the message card are shared with b2b's project market
 * board, so this file is configuration and wiring.
 */
export function PurchaseQaBoard({
	board,
	archivedOnly = false,
}: PurchaseQaBoardProps) {
	const t = useTranslate();
	const { user, company } = useAuthStatus();

	const [creating, setCreating] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<PurchaseQaMessage | null>(
		null,
	);

	const account = (user as { first_name?: string; last_name?: string }) ?? {};
	const currentUserName =
		[account.first_name, account.last_name].filter(Boolean).join(" ") ||
		t(localizationConstants.purchaseComplaintQaYou);
	const currentCompany = company?.company_name ?? "";

	const handleCreate = (draft: PurchaseQaDraft) =>
		board.create(draft, currentUserName, currentCompany);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0 flex-1">
					<PurchaseQaFilters
						search={board.search}
						onSearchChange={board.setSearch}
						companies={board.companies}
						companyOptions={board.companyOptions}
						onToggleCompany={board.toggleCompany}
						roles={board.roles}
						roleOptions={board.roleOptions}
						onToggleRole={board.toggleRole}
						statuses={board.statuses}
						onToggleStatus={board.toggleStatus}
						onReset={board.resetFilters}
						hasFilters={board.hasFilters}
						resetToken={board.resetToken}
					/>
				</div>

				<PermissionGate permission="CREATE_PURCHASE">
					<Button
						type="button"
						onClick={() => setCreating(true)}
						className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate
							text={localizationConstants.purchaseQaCreate}
						/>
					</Button>
				</PermissionGate>
			</div>

			<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{COLUMNS.map((column) => {
					const items = board.inColumn(column.status, archivedOnly);

					return (
						<QAThreadColumn
							key={column.status}
							label={t(column.labelKey)}
							icon={column.icon}
							count={items.length}
							emptyMessageKey={
								localizationConstants.purchaseQaNoneInColumn
							}
							className={column.className}
						>
							{items.map((row) => (
								<QAThreadCard
									key={row.id}
									message={{
										id: row.id,
										sender: row.sender,
										company: row.company,
										badge: row.badge,
										message: row.message,
										date: row.date,
										answered: row.status === "answered",
										answerUser: row.answerUser,
										answerText: row.answerText,
										answerDate: row.answerDate,
									}}
									labels={QA_LABELS}
									currentUserName={currentUserName}
									onSendReply={(id, text) =>
										board.reply(id, text, currentUserName)
									}
									onMarkAsRead={board.markAsRead}
									onArchive={board.archive}
									onDelete={() =>
										/**
										 * Deferred a frame so the dropdown
										 * finishes closing first: opening the
										 * dialog in the same tick leaves two
										 * Radix layers unwinding together and
										 * `pointer-events: none` stuck on
										 * `body`.
										 */
										requestAnimationFrame(() =>
											setPendingDelete(row),
										)
									}
								/>
							))}
						</QAThreadColumn>
					);
				})}
			</div>

			<PurchaseQaCreateDialog
				open={creating}
				onOpenChange={setCreating}
				onSubmit={handleCreate}
			/>

			<ConfirmActionDialog
				open={pendingDelete !== null}
				onOpenChange={(next) => {
					if (!next) setPendingDelete(null);
				}}
				title={localizationConstants.purchaseQaDeleteTitle}
				description={localizationConstants.purchaseQaDeleteBody}
				confirmLabel={localizationConstants.purchaseQaDeleteAction}
				subject={pendingDelete?.sender}
				destructive
				onConfirm={() => {
					if (!pendingDelete) return;
					board.remove(pendingDelete.id);
					setPendingDelete(null);
				}}
			/>
		</div>
	);
}

export default PurchaseQaBoard;
