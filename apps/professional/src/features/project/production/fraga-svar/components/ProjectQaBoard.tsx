"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { QAThreadCreateDialog } from "@/components/common/QAThreadCreateDialog";
import { QAThreadFilterChips } from "@/components/common/QAThreadFilterChips";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/context/AuthContext";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../../components/ProjectRowsToolbar";
import type { ProjectQaBoardState } from "../hooks/useProjectQaBoard";
import {
	PROJECT_QA_CHIP_LABELS,
	PROJECT_QA_CREATE_LABELS,
	PROJECT_QA_FILTER_ENTRIES,
	PROJECT_QA_FUNCTION_OPTIONS,
	PROJECT_QA_ROLE_LABELS,
	PROJECT_QA_STATUS_OPTIONS,
	PROJECT_QA_TYPE_OPTIONS,
} from "../projectQa.config";
import type { ProjectQaRole, ProjectQuestion } from "../types";
import { ProjectQaColumns } from "./ProjectQaColumns";

export interface ProjectQaBoardProps {
	/** Owned by the page, so Alla and Arkiv act on one list. */
	board: ProjectQaBoardState;
	/** Arkiv lists archived questions; Alla lists the rest. */
	archivedOnly?: boolean;
}

/**
 * A project's Fråga/Svar board: Sök and Filter ▾ with Skapa ny fråga, the
 * Företag / Kund / Status chips, and the three columns.
 *
 * Everything visible is a shared piece — the project toolbar, the Q&A chips,
 * columns, cards and "Ny fråga" dialog — so this file is wiring.
 */
export function ProjectQaBoard({ board, archivedOnly = false }: ProjectQaBoardProps) {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const currentUserName = useCurrentUserName(localizationConstants.projectQaYou);

	const [creating, setCreating] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<ProjectQuestion | null>(
		null,
	);

	const filterOptions = PROJECT_QA_FILTER_ENTRIES.map((entry) => ({
		value: entry.value,
		label: t(entry.label),
	}));

	const formatRole = (value: string) => {
		const key = PROJECT_QA_ROLE_LABELS[value as ProjectQaRole];
		return key ? t(key) : value;
	};

	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				search={board.search}
				onSearchChange={board.setSearch}
				filter={board.filter}
				onFilterChange={board.setFilter}
				filterOptions={filterOptions}
				showPrint={false}
				action={
					<Button
						type="button"
						onClick={() => setCreating(true)}
						className="h-10 cursor-pointer gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white shadow-xs hover:bg-zinc-800"
					>
						<Plus size={20} aria-hidden />
						<Translate text={localizationConstants.projectQaCreate} />
					</Button>
				}
			/>

			<QAThreadFilterChips
				companies={board.companies}
				companyOptions={board.companyOptions}
				onToggleCompany={board.toggleCompany}
				roles={board.roles}
				roleOptions={board.roleOptions}
				onToggleRole={board.toggleRole}
				formatRole={formatRole}
				statuses={board.statuses}
				statusOptions={PROJECT_QA_STATUS_OPTIONS}
				onToggleStatus={board.toggleStatus}
				onReset={board.resetFilters}
				hasFilters={board.hasFilters}
				labels={PROJECT_QA_CHIP_LABELS}
			/>

			<ProjectQaColumns
				board={board}
				archivedOnly={archivedOnly}
				currentUserName={currentUserName}
				onRequestDelete={(question) =>
					/* Deferred so the row menu finishes closing first: opening
					   the dialog in the same tick leaves two Radix layers
					   unwinding together and `pointer-events: none` on `body`. */
					setTimeout(() => setPendingDelete(question), 0)
				}
			/>

			<QAThreadCreateDialog
				open={creating}
				onOpenChange={setCreating}
				typeOptions={PROJECT_QA_TYPE_OPTIONS}
				subjectOptions={PROJECT_QA_FUNCTION_OPTIONS}
				labels={PROJECT_QA_CREATE_LABELS}
				showSendIcon
				contentClassName="sm:max-w-[690px]"
				onSubmit={(draft) =>
					board.create(draft, currentUserName, company?.company_name ?? "")
				}
			/>

			<ConfirmActionDialog
				open={pendingDelete !== null}
				onOpenChange={(next) => {
					if (!next) setPendingDelete(null);
				}}
				title={localizationConstants.projectQaDeleteTitle}
				description={localizationConstants.projectQaDeleteBody}
				confirmLabel={localizationConstants.projectQaDeleteAction}
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

export default ProjectQaBoard;
