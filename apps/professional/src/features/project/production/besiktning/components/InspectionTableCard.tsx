"use client";

import { Folder } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { SortableHead } from "../../components/SortableHead";
import type { ProjectInspectionListState } from "../hooks/useProjectInspectionList";
import { INSPECTION_COLUMNS } from "../projectInspection.config";
import type { ProjectInspection } from "../types";
import { InspectionTableRow } from "./InspectionTableRow";

export interface InspectionTableCardProps {
	list: ProjectInspectionListState;
	onOpen: (inspection: ProjectInspection) => void;
	onDelete: (inspection: ProjectInspection) => void;
}

/**
 * The frame's "Besiktning" card: Datum, Typ, Besiktningsdatum and PDF, each
 * sortable, and a ⋮ per row. The table scrolls inside the card on a phone, so
 * the page itself never scrolls sideways.
 */
export function InspectionTableCard({ list, onOpen, onDelete }: InspectionTableCardProps) {
	const { rows, emptyState } = list;

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectInspectionTitle}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="sm:p-4"
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[36rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{INSPECTION_COLUMNS.map((column) => (
								<SortableHead
									key={column.key}
									labelKey={column.labelKey}
									onSort={() => list.onSort(column.key)}
									active={list.sortField === column.key}
									dir={list.sortDir}
									className="px-3 lg:px-4"
								/>
							))}
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={INSPECTION_COLUMNS.length + 1} className="py-10 text-center">
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
							rows.map((row) => (
								<InspectionTableRow
									key={row.id}
									inspection={row}
									label={list.labelOf(row)}
									typeLabel={list.typeLabel(row.type)}
									onOpen={() => onOpen(row)}
									onToggleArchive={() => list.toggleArchive(row)}
									onDelete={() => onDelete(row)}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</ProjectSectionCard>
	);
}

export default InspectionTableCard;
