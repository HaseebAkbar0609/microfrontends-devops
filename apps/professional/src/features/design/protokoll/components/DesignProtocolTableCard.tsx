"use client";

import { Folder } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../../project/production/components/ProjectSectionCard";
import { SortableHead } from "../../../project/production/components/SortableHead";
import type { ProtocolListState } from "../../../project/production/protokoll/hooks/useProtocolList";
import { PROTOCOL_COLUMNS } from "../../../project/production/protokoll/projectProtocol.config";
import type { ProtocolTypeLabel } from "../../../project/production/protokoll/protocolView";
import type { ProjectProtocol } from "../../../project/production/protokoll/types";
import { DesignProtocolTableRow } from "./DesignProtocolTableRow";

export interface DesignProtocolTableCardProps {
	list: ProtocolListState;
	typeLabel: ProtocolTypeLabel;
	onOpen: (protocol: ProjectProtocol) => void;
	onToggleArchive: (protocol: ProjectProtocol) => void;
	onPrint: (protocol: ProjectProtocol) => void;
	onDelete: (protocol: ProjectProtocol) => void;
}

export function DesignProtocolTableCard({
	list,
	typeLabel,
	onOpen,
	onToggleArchive,
	onPrint,
	onDelete,
}: DesignProtocolTableCardProps) {
	const { pageRows, emptyState } = list;

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectProtocolTitle}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="sm:p-4"
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[40rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{PROTOCOL_COLUMNS.map((column) => (
								<SortableHead
									key={column.key}
									labelKey={column.labelKey}
									onSort={() => list.onSort(column.key)}
									active={list.sortField === column.key}
									dir={list.sortDir}
									className="px-3 lg:px-4"
								/>
							))}
							<SortableHead
								labelKey={localizationConstants.projectProtocolColHandling}
								className="px-3 lg:px-4"
							/>
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{pageRows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={PROTOCOL_COLUMNS.length + 2}
									className="py-10 text-center"
								>
									<p className="text-sm font-medium text-slate-900">
										<Translate text={emptyState.titleKey} />
									</p>
									{emptyState.descriptionKey && (
										<p className="mt-1 text-sm text-slate-500">
											<Translate text={emptyState.descriptionKey} />
										</p>
									)}
								</TableCell>
							</TableRow>
						) : (
							pageRows.map((protocol) => (
								<DesignProtocolTableRow
									key={protocol.id}
									protocol={protocol}
									typeLabel={typeLabel}
									onOpen={() => onOpen(protocol)}
									onToggleArchive={() => onToggleArchive(protocol)}
									onPrint={() => onPrint(protocol)}
									onDelete={() => onDelete(protocol)}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</ProjectSectionCard>
	);
}

export default DesignProtocolTableCard;
