"use client";

import { ShieldCheck } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { SortableHead } from "../../components/SortableHead";
import type { ProjectWarrantyListState } from "../hooks/useProjectWarrantyList";
import { WARRANTY_COLUMNS } from "../projectWarranty.config";
import type { WarrantyCommitment } from "../types";
import { WarrantyTableRow } from "./WarrantyTableRow";

export interface WarrantyTableCardProps {
	list: ProjectWarrantyListState;
	onEdit: (commitment: WarrantyCommitment) => void;
	onDelete: (commitment: WarrantyCommitment) => void;
}

/**
 * The frame's card: Datum and Benämning, both sortable, and a ⋮ per row. The
 * table scrolls inside the card on a phone, so the page itself never scrolls
 * sideways.
 */
export function WarrantyTableCard({ list, onEdit, onDelete }: WarrantyTableCardProps) {
	const { rows, emptyState } = list;

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectWarrantyCommitments}
			icon={<ShieldCheck className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="sm:p-4"
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[28rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{WARRANTY_COLUMNS.map((column) => (
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
								<TableCell colSpan={WARRANTY_COLUMNS.length + 1} className="py-10 text-center">
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
								<WarrantyTableRow key={row.id} commitment={row} onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} />
							))
						)}
					</TableBody>
				</Table>
			</div>
		</ProjectSectionCard>
	);
}

export default WarrantyTableCard;
