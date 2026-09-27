"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../../data/projectNav.config";
import { ProjectRecordTitle } from "../../components/ProjectRecordTitle";
import { useProjectIdentity } from "../../hooks/useProjectIdentity";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { listPlans, removePlan } from "../services/timeplanService";
import { kindLabelKey } from "../timeplan.config";
import { formatStartDate } from "../timeline";
import { timeplanUrls } from "../timeplanNav";
import type { Timeplan } from "../types";
import { TimeplanListTable } from "./TimeplanListTable";
import {
	TIMEPLAN_LIST_COLUMNS,
	type TimeplanColumnKey,
} from "./timeplanListColumns";

export interface ProjectTimeplanListPageProps {
	projectId: string;
}

const EMPTY_PLANS: Timeplan[] = [];

/**
 * Tidsplan — the project's timeplans.
 *
 * Pattern 3, as the record's other sections are. Print and "Skapa ny tidsplan"
 * sit top right with no search, filter or pagination, because the frame draws
 * none.
 */
export function ProjectTimeplanListPage({ projectId }: ProjectTimeplanListPageProps) {
	const t = useTranslate();
	const router = useRouter();
	const projectQuery = useProjectIdentity(projectId);
	const project = projectQuery.data;
	const plansQuery = useQuery({
		queryKey: ["professional-project-timeplans", projectId],
		queryFn: () => listPlans(projectId),
		enabled: Boolean(project),
		retry: false,
	});

	const plans = plansQuery.data ?? EMPTY_PLANS;
	const [deleting, setDeleting] = useState<Timeplan | null>(null);
	const [visibleColumns, setVisibleColumns] = useState<Set<TimeplanColumnKey>>(
		() => new Set(TIMEPLAN_LIST_COLUMNS.map((column) => column.key)),
	);
	const { sortField, sortDir, toggleSort } = useTableSort<TimeplanColumnKey>();

	const sorted = useMemo(
		() =>
			sortItems(plans, sortField, sortDir, (plan, field) =>
				String(plan[field as TimeplanColumnKey]),
			),
		[plans, sortField, sortDir],
	);

	const toggleColumn = useCallback((key: TimeplanColumnKey) => {
		setVisibleColumns((previous) => {
			const next = new Set(previous);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	}, []);

	/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the
	   tick a dropdown item closes; defer by a macrotask. A timeout, not
	   requestAnimationFrame, which never fires in an occluded page. */
	const requestDelete = useCallback((plan: Timeplan) => {
		setTimeout(() => setDeleting(plan), 0);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!deleting) return;
		try {
			await removePlan(deleting);
			await plansQuery.refetch();
			setDeleting(null);
			showToast("success", t(localizationConstants.projectTimeplanDeletedToast));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		}
	}, [deleting, plansQuery, t]);

	if (projectQuery.isLoading || (project && plansQuery.isLoading)) {
		return <p role="status" className="p-6">{t(localizationConstants.genericLoading)}</p>;
	}
	if (!project || projectQuery.isError || plansQuery.isError) {
		return <p role="alert" className="p-6">{t(localizationConstants.genericError)}</p>;
	}

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={project.projectNr}
							sectionKey={localizationConstants.projectSectionTidsplan}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-5 p-6">
				<div className="flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => window.print()}
						aria-label={t(localizationConstants.projectListPrint)}
						title={t(localizationConstants.projectListPrint)}
						className="h-10 w-10 cursor-pointer rounded-md border-slate-200 bg-slate-100 text-slate-700"
					>
						<Printer className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						onClick={() => router.push(timeplanUrls.create(projectId))}
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectTimeplanCreateTitle} />
					</Button>
				</div>

				<div className="w-full max-w-4xl rounded-lg border border-slate-200 bg-white">
					<TimeplanListTable
						plans={sorted}
						visibleColumns={visibleColumns}
						onToggleColumn={toggleColumn}
						sortField={sortField}
						sortDir={sortDir}
						onSort={toggleSort}
						onView={(plan) => router.push(timeplanUrls.view(projectId, plan.id))}
						onEdit={(plan) => router.push(timeplanUrls.edit(projectId, plan.id))}
						onDelete={requestDelete}
					/>
				</div>
			</div>

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectTimeplanDeleteConfirmTitle}
				description={localizationConstants.projectTimeplanDeleteConfirmDescription}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={
					deleting
						? `${t(kindLabelKey(deleting.kind))} ${formatStartDate(deleting.createdDate)}`
						: undefined
				}
				destructive
				onConfirm={confirmDelete}
			/>
		</div>
	);
}

export default ProjectTimeplanListPage;
