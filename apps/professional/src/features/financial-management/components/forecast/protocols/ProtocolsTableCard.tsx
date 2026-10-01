"use client";

import { Folder } from "lucide-react";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectSectionCard } from "@/features/project/production/components/ProjectSectionCard";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROTOCOL_LIST_COLUMNS } from "../../../constants/forecastProtocols.constants";
import type {
	ForecastProtocol,
	ForecastProtocolSortField,
} from "../../../types/forecastProtocols.types";
import { ProtocolsTableRow } from "./ProtocolsTableRow";

export interface ProtocolsTableCardProps {
	protocols: ForecastProtocol[];
	sortField: ForecastProtocolSortField | null;
	sortDir: SortDir;
	onSort: (field: ForecastProtocolSortField) => void;
	emptyKey: TranslationKeys;
	onView: (protocol: ForecastProtocol) => void;
	onOpenFile: (protocol: ForecastProtocol) => void;
	onDelete: (protocol: ForecastProtocol) => void;
}

/**
 * Protokoll's table, inside the titled card the frame draws.
 *
 * The card is a project-module pattern rather than a Prognos one — the other
 * registers here sit bare on the page — but it is what this screen's frame
 * shows, and it is the same card the project and design protocol tables use.
 */
export function ProtocolsTableCard({
	protocols,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	onView,
	onOpenFile,
	onDelete,
}: ProtocolsTableCardProps) {
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
							{PROTOCOL_LIST_COLUMNS.map((column) => (
								<SortableHead
									key={column.key}
									labelKey={column.labelKey}
									onSort={() => onSort(column.key)}
									active={sortField === column.key}
									dir={sortDir}
									className="px-3 lg:px-4"
								/>
							))}
							{/* Named, not sr-only: the frame draws this header, and it sits
							    over the Visa detaljer button. No `onSort` — nothing to sort. */}
							<SortableHead
								labelKey={localizationConstants.projectProtocolColHandling}
								className="px-3 lg:px-4"
							/>
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{protocols.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={PROTOCOL_LIST_COLUMNS.length + 2}
									className="py-10 text-center text-sm text-slate-500"
								>
									<Translate text={emptyKey} />
								</TableCell>
							</TableRow>
						) : (
							protocols.map((protocol) => (
								<ProtocolsTableRow
									key={protocol.id}
									protocol={protocol}
									onView={() => onView(protocol)}
									onOpenFile={() => onOpenFile(protocol)}
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

export default ProtocolsTableCard;
