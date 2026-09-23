"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModuleTabs } from "@/components/layout/navigation";
import { RecordNavRow } from "@/components/layout/navigation/RecordNavRow";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { ProjectRowsToolbar } from "../../project/components/ProjectRowsToolbar";
import { CreateProtocolMenu } from "../../project/production/protokoll/components/CreateProtocolMenu";
import { NewMeetingDialog } from "../../project/production/protokoll/form/NewMeetingDialog";
import { UploadProtocolDialog } from "../../project/production/protokoll/form/UploadProtocolDialog";
import { useProtocolList } from "../../project/production/protokoll/hooks/useProtocolList";
import type { ProjectProtocol, ProtocolKind } from "../../project/production/protokoll/types";
import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";
import { DesignRecordTitle } from "../projektinformation/components/DesignRecordTitle";
import { designProjektTabs } from "../projektinformation/designProjektNavConfig";
import { DesignProtocolTableCard } from "./components/DesignProtocolTableCard";
import { useDesignProtocols } from "./hooks/useDesignProtocols";

const defer = (fn: () => void) => setTimeout(fn, 0);

export interface DesignProtocolsPageProps {
	projektId: string;
}

export function DesignProtocolsPage({ projektId }: DesignProtocolsPageProps) {
	const protocols = useDesignProtocols(projektId);
	const list = useProtocolList(protocols.protocols, protocols.typeLabel);
	const [creating, setCreating] = useState<ProtocolKind | null>(null);
	const [deleting, setDeleting] = useState<ProjectProtocol | null>(null);

	if (!protocols.projekt) notFound();

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b border-slate-200 bg-white px-5">
				<RecordNavRow
					title={
						<DesignRecordTitle
							projektNr={protocols.projekt.projektNr}
							sectionKey={localizationConstants.projectProtocolTitle}
						/>
					}
					backHref={`${DESIGN_MODULE_BASE_URL}/oversikt`}
				/>
				<div className="mt-3 -mb-px">
					<ModuleTabs items={designProjektTabs(projektId)} />
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-6">
				<ProjectRowsToolbar
					search={list.search}
					onSearchChange={list.setSearch}
					filter={list.filter}
					onFilterChange={list.setFilter}
					filterOptions={list.filterOptions}
					showPrint={false}
					action={
						<CreateProtocolMenu
							onCreate={(kind) => defer(() => setCreating(kind))}
						/>
					}
				/>

				<DesignProtocolTableCard
					list={list}
					typeLabel={protocols.typeLabel}
					onOpen={protocols.open}
					onToggleArchive={protocols.toggleArchive}
					onPrint={protocols.print}
					onDelete={(protocol) => defer(() => setDeleting(protocol))}
				/>

				<TablePagination
					currentPage={list.currentPage}
					totalPages={list.totalPages}
					pageSize={list.pageSize}
					onPageChange={list.setPage}
					onPageSizeChange={list.setPageSize}
					className="justify-center sm:justify-center"
				/>
			</div>

			{(creating === "standard" || creating === "action") &&
				protocols.facts && (
					<NewMeetingDialog
						key={creating}
						kind={creating}
						projectId={projektId}
						projectNo={protocols.facts.projectNo}
						projectName={protocols.facts.projectName}
						onCreate={(input) => protocols.createMeeting(creating, input)}
						onClose={() => setCreating(null)}
					/>
				)}

			{creating === "upload" && protocols.facts && (
				<UploadProtocolDialog
					projectId={projektId}
					projectNo={protocols.facts.projectNo}
					projectName={protocols.facts.projectName}
					onSave={(details, file) => {
						const created = protocols.createUpload(details, file);
						if (created) list.reveal(created.row, created.protocols);
						return Boolean(created);
					}}
					onClose={() => setCreating(null)}
				/>
			)}

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectProtocolDeleteTitle}
				description={localizationConstants.projectProtocolDeleteBody}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={deleting?.name}
				destructive
				onConfirm={() => {
					if (deleting) protocols.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default DesignProtocolsPage;
