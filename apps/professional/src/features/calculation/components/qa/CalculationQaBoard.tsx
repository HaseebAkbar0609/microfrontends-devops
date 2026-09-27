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
import { ProjectRowsToolbar } from "@/features/project/components/ProjectRowsToolbar";
import type { CalculationQaBoardState } from "../../hooks/useCalculationQaBoard";
import {
	CALCULATION_QA_CHIP_LABELS,
	CALCULATION_QA_CREATE_LABELS,
	CALCULATION_QA_FILTER_ENTRIES,
	CALCULATION_QA_FUNCTION_OPTIONS,
	CALCULATION_QA_ROLE_LABELS,
	CALCULATION_QA_STATUS_OPTIONS,
	CALCULATION_QA_TYPE_OPTIONS,
} from "../../constants/calculationQa.config";
import type {
	CalculationQaRole,
	CalculationQuestion,
} from "../../types/calculationQa";
import { CalculationQaColumns } from "./CalculationQaColumns";

export interface CalculationQaBoardProps {
	board: CalculationQaBoardState;
	archivedOnly?: boolean;
}

export function CalculationQaBoard({
	board,
	archivedOnly = false,
}: CalculationQaBoardProps) {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const currentUserName = useCurrentUserName(localizationConstants.calcQAYou);

	const [creating, setCreating] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<CalculationQuestion | null>(
		null,
	);

	const filterOptions = CALCULATION_QA_FILTER_ENTRIES.map((entry) => ({
		value: entry.value,
		label: t(entry.label),
	}));

	const formatRole = (value: string) => {
		const key = CALCULATION_QA_ROLE_LABELS[value as CalculationQaRole];
		return key ? t(key) : value;
	};

	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				key={board.resetToken}
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
						<Translate text={localizationConstants.calcQANewQuestion} />
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
				statusOptions={CALCULATION_QA_STATUS_OPTIONS}
				onToggleStatus={board.toggleStatus}
				onReset={board.resetFilters}
				hasFilters={board.hasFilters}
				labels={CALCULATION_QA_CHIP_LABELS}
			/>

			<CalculationQaColumns
				board={board}
				archivedOnly={archivedOnly}
				currentUserName={currentUserName}
				onRequestDelete={(question) =>
					setTimeout(() => setPendingDelete(question), 0)
				}
			/>

			<QAThreadCreateDialog
				open={creating}
				onOpenChange={setCreating}
				typeOptions={CALCULATION_QA_TYPE_OPTIONS}
				subjectOptions={CALCULATION_QA_FUNCTION_OPTIONS}
				labels={CALCULATION_QA_CREATE_LABELS}
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
				title={localizationConstants.calcQADeleteTitle}
				description={localizationConstants.calcQADeleteBody}
				confirmLabel={localizationConstants.calcQADeleteAction}
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

export default CalculationQaBoard;
