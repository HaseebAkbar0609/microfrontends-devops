"use client";

import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { DataTable } from "@/components/table/DataTable";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { ProjectRowsToolbar } from "../../../components/ProjectRowsToolbar";
import { todayIso } from "../../../shared/todayIso";
import { ProjectRecordTitle } from "../../components/ProjectRecordTitle";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { PAYMENT_PLAN_STATUS_FILTER_OPTIONS } from "../paymentPlan.config";
import { paymentPlanUrls } from "../paymentPlanNav";
import type { ProjectPaymentPlan } from "../types";
import { CreatePaymentPlanDialog } from "./CreatePaymentPlanDialog";
import type { CreatePaymentPlanValues } from "./createPaymentPlanSchema";
import { PAYMENT_PLAN_LIST_COLUMNS, paymentPlanRowActions } from "./paymentPlanListColumns";
import { usePaymentPlanList } from "./usePaymentPlanList";

const ICON = "h-4 w-4 shrink-0";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a menu item closes; defer by a macrotask. A timeout, not rAF, which never
   fires in an occluded page. */
const defer = (fn: () => void) => setTimeout(fn, 0);

export interface ProjectPaymentPlanListPageProps {
	projectId: string;
}

/**
 * Betalningsplan — the project's payment plans.
 *
 * The frame's second tab, "Betalningsplan UE / Lev", has no frame of its own,
 * so it is drawn disabled rather than guessed at.
 */
export function ProjectPaymentPlanListPage({ projectId }: ProjectPaymentPlanListPageProps) {
	const t = useTranslate();
	const router = useRouter();
	const list = usePaymentPlanList(projectId);
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

	/* An id that matches no project is a 404. After the hooks: it throws. */
	if (!list.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={list.project.projectNr}
							sectionKey={localizationConstants.paymentPlanTitle}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the query string, so it needs Suspense. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{ id: "bestallare", labelKey: localizationConstants.paymentPlanBestallareTab },
							{
								id: "ue-lev",
								labelKey: localizationConstants.paymentPlanUeLevTab,
								disabled: true,
								disabledReasonKey: localizationConstants.projectPaymentPlanUeLevUnavailable,
							},
						]}
						ariaLabel={t(localizationConstants.paymentPlanTitle)}
					>
						<TabsContent value="bestallare" className="mt-4 flex flex-col gap-4">
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
										<Plus className={ICON} aria-hidden />
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
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>

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

export default ProjectPaymentPlanListPage;
