"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { DataTable } from "@/components/table/DataTable";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../../components/ProjectRowsToolbar";
import { todayIso } from "../../../shared/todayIso";
import { PAYMENT_PLAN_STATUS_FILTER_OPTIONS } from "../paymentPlan.config";
import { paymentPlanUrls } from "../paymentPlanNav";
import type { ProjectPaymentPlan } from "../types";
import { CreatePaymentPlanDialog } from "./CreatePaymentPlanDialog";
import type { CreatePaymentPlanValues } from "./createPaymentPlanSchema";
import { PAYMENT_PLAN_LIST_COLUMNS, paymentPlanRowActions } from "./paymentPlanListColumns";
import type { PaymentPlanListState } from "./usePaymentPlanList";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a menu item closes; defer by a macrotask. A timeout, not rAF, which never
   fires in an occluded page. */
const defer = (fn: () => void) => setTimeout(fn, 0);

export interface BestallarePlanTabProps {
	projectId: string;
	list: PaymentPlanListState;
}

/**
 * Betalningsplan beställare — the project's own plans for its client: search,
 * filter, the table, and create / send / delete.
 */
export function BestallarePlanTab({ projectId, list }: BestallarePlanTabProps) {
	const t = useTranslate();
	const router = useRouter();
	const currentUser = useCurrentUserName(localizationConstants.projectPaymentPlanYou);

	const [creating, setCreating] = useState(false);
	const [sending, setSending] = useState<ProjectPaymentPlan | null>(null);
	const [deleting, setDeleting] = useState<ProjectPaymentPlan | null>(null);

	const actions = useMemo(
		() =>
			paymentPlanRowActions({
				onOpen: (plan) => router.push(paymentPlanUrls.view(projectId, plan.id)),
				onSend: (plan) => defer(() => setSending(plan)),
				onDelete: (plan) => defer(() => setDeleting(plan)),
			}),
		[projectId, router],
	);

	const handleCreate = (values: CreatePaymentPlanValues) => {
		const plan = list.create({
			name: values.name,
			contractFileName: values.contract?.name,
			createdBy: currentUser,
			today: todayIso(),
		});
		setCreating(false);
		router.push(paymentPlanUrls.view(projectId, plan.id));
	};

	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				filter={list.status}
				onFilterChange={list.setStatus}
				filterOptions={PAYMENT_PLAN_STATUS_FILTER_OPTIONS.map((option) => ({
					value: option.value,
					label: t(option.labelKey),
				}))}
				action={
					<Button
						type="button"
						onClick={() => setCreating(true)}
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Plus className="h-4 w-4 shrink-0" aria-hidden />
						<Translate text={localizationConstants.projectPaymentPlanCreate} />
					</Button>
				}
			/>

			<DataTable
				data={list.rows}
				columns={PAYMENT_PLAN_LIST_COLUMNS}
				rowKey={(plan) => plan.id}
				actions={actions}
				actionsLabel={(plan) => `${t(localizationConstants.actions)} ${plan.name}`}
				sortBy={list.sortField ?? undefined}
				sortOrder={list.sortDir ?? undefined}
				onSort={list.onSort}
				bordered
				emptyMessageKey={
					list.isEmpty
						? localizationConstants.projectPaymentPlanEmpty
						: localizationConstants.projectPaymentPlanNoMatches
				}
			/>

			<TablePagination
				currentPage={list.page}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>

			{creating && (
				<CreatePaymentPlanDialog open onClose={() => setCreating(false)} onCreate={handleCreate} />
			)}

			<ConfirmActionDialog
				open={Boolean(sending)}
				onOpenChange={(open) => !open && setSending(null)}
				title={localizationConstants.projectPaymentPlanSendTitle}
				description={localizationConstants.projectPaymentPlanSendBody}
				confirmLabel={localizationConstants.btnSkicka}
				subject={sending?.name}
				onConfirm={() => {
					if (sending) list.send(sending);
					setSending(null);
				}}
			/>

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectPaymentPlanDeleteTitle}
				description={localizationConstants.projectPaymentPlanDeleteBody}
				confirmLabel={localizationConstants.btnRadera}
				subject={deleting?.name}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default BestallarePlanTab;
