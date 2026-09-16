"use client";

import { Folder } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { SortableHead } from "../../components/SortableHead";
import type { ProjectAta } from "../types";
import { ATA_LIST_COLUMNS } from "../projectAta.config";
import { AtaTableRow } from "./AtaTableRow";
import type { ProjectAtaListState } from "./useProjectAtaList";

export interface AtaTableCardProps {
	list: ProjectAtaListState;
	onEdit: (ata: ProjectAta) => void;
	onDelete: (ata: ProjectAta) => void;
	onSend: (ata: ProjectAta) => void;
}

/**
 * The frame's "ÄTA" card: six sortable columns, Visa detaljer and a ⋮ per row.
 * The table scrolls inside the card on narrow screens, so the page never
 * scrolls sideways.
 */
export function AtaTableCard({ list, onEdit, onDelete, onSend }: AtaTableCardProps) {
	const { rows, emptyState } = list;

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.ataTitle}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="sm:p-4"
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[44rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{ATA_LIST_COLUMNS.map((column) => (
								<SortableHead
									key={column.key}
									labelKey={column.labelKey}
									onSort={() => list.onSort(column.key)}
									active={list.sortField === column.key}
									dir={list.sortDir}
									className="px-3 whitespace-normal xl:px-4 xl:whitespace-nowrap"
								/>
							))}
							<TableHead className="w-36" />
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={ATA_LIST_COLUMNS.length + 2} className="py-10 text-center">
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
								<AtaTableRow
									key={row.ata.id}
									row={row}
									label={list.labels.number(row.ata.number)}
									onEdit={() => onEdit(row.ata)}
									onDelete={() => onDelete(row.ata)}
									onSend={() => onSend(row.ata)}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</ProjectSectionCard>
	);
}

export default AtaTableCard;
