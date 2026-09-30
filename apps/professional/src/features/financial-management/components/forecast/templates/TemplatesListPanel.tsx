"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { TEMPLATE_CATEGORY_LABELS } from "../../../constants/forecastTemplates.constants";
import { useForecastTemplates } from "../../../hooks/useForecastTemplates";
import type { TemplateDocument } from "../../../types/forecastTemplates.types";
import { ForecastToolbar, forecastFilterGroup } from "../ForecastToolbar";
import { TemplateCreateDialog } from "./TemplateCreateDialog";
import { TemplateDetailsDialog } from "./TemplateDetailsDialog";
import { TemplatesTable } from "./TemplatesTable";

/**
 * Mallar: Sök, Filter and "Skapa ny" over the register, the frame's centred
 * pagination under it, and the three dialogs the rows open. Each dialog is
 * mounted only while it is open, so every opening starts fresh.
 */
export function TemplatesListPanel() {
	const t = useTranslate();
	const list = useForecastTemplates();
	const [creating, setCreating] = useState(false);
	const [viewing, setViewing] = useState<TemplateDocument | null>(null);
	const [deleting, setDeleting] = useState<TemplateDocument | null>(null);

	/* A seeded template, and a new one after a reload, holds no file. */
	const openFile = (template: TemplateDocument) => {
		if (!openSafeUrl(template.url)) {
			showToast("error", t(localizationConstants.forecastTemplatesNoFile));
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.forecastTemplatesFilterCategory,
						TEMPLATE_CATEGORY_LABELS,
						list.filters.category,
						(value) => list.setFilter("category", value),
					),
				]}
				action={
					<Button
						type="button"
						onClick={() => setCreating(true)}
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastTemplatesCreateNew} />
					</Button>
				}
			/>

			<TemplatesTable
				templates={list.pageRows}
				columns={list.columns}
				shownColumns={list.shownColumns}
				visibleColumns={list.visibleColumns}
				onToggleColumn={list.toggleColumn}
				sortField={list.sortField}
				sortDir={list.sortDir}
				onSort={list.onSort}
				emptyKey={list.emptyKey}
				onView={setViewing}
				onOpenFile={openFile}
				onDelete={setDeleting}
			/>

			<TablePagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>

			{creating && (
				<TemplateCreateDialog onCreate={list.create} onClose={() => setCreating(false)} />
			)}

			{viewing && (
				<TemplateDetailsDialog
					template={viewing}
					onOpenFile={() => openFile(viewing)}
					onClose={() => setViewing(null)}
				/>
			)}

			<ConfirmActionDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title={localizationConstants.forecastTemplatesDeleteTitle}
				description={localizationConstants.forecastTemplatesDeleteDescription}
				confirmLabel={localizationConstants.forecastTemplatesDelete}
				subject={deleting?.documentName}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default TemplatesListPanel;
