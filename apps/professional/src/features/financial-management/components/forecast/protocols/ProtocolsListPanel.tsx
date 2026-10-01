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
import { PROTOCOL_TYPE_LABELS } from "../../../constants/forecastProtocols.constants";
import { useForecastProtocols } from "../../../hooks/useForecastProtocols";
import type { ForecastProtocol } from "../../../types/forecastProtocols.types";
import { ForecastToolbar, forecastFilterGroup } from "../ForecastToolbar";
import { ProtocolDetailsDialog } from "./ProtocolDetailsDialog";
import { ProtocolUploadDialog } from "./ProtocolUploadDialog";
import { ProtocolsTableCard } from "./ProtocolsTableCard";

/**
 * Protokoll: Sök, Filter and "Skapa protokoll" over the register, the card the
 * frame draws around the table, and the frame's centred pagination under it.
 * Each dialog is mounted only while it is open, so every opening starts fresh.
 */
export function ProtocolsListPanel() {
	const t = useTranslate();
	const list = useForecastProtocols();
	const [creating, setCreating] = useState(false);
	const [viewing, setViewing] = useState<ForecastProtocol | null>(null);
	const [deleting, setDeleting] = useState<ForecastProtocol | null>(null);

	/* A seeded protocol, and a new one after a reload, holds no file. */
	const openFile = (protocol: ForecastProtocol) => {
		if (!openSafeUrl(protocol.url)) {
			showToast("error", t(localizationConstants.projectProtocolNoFile));
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.projectProtocolColType,
						PROTOCOL_TYPE_LABELS,
						list.filters.type,
						(value) => list.setFilter("type", value),
					),
				]}
				action={
					<Button
						type="button"
						onClick={() => setCreating(true)}
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectProtocolCreateButton} />
					</Button>
				}
			/>

			<ProtocolsTableCard
				protocols={list.pageRows}
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
				<ProtocolUploadDialog onCreate={list.create} onClose={() => setCreating(false)} />
			)}

			{viewing && (
				<ProtocolDetailsDialog
					protocol={viewing}
					onOpenFile={() => openFile(viewing)}
					onClose={() => setViewing(null)}
				/>
			)}

			<ConfirmActionDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title={localizationConstants.projectProtocolDeleteTitle}
				description={localizationConstants.projectProtocolDeleteBody}
				confirmLabel={localizationConstants.actionDelete}
				subject={deleting?.fileName}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default ProtocolsListPanel;
