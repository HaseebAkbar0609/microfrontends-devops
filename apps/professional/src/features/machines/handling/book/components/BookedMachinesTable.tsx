"use client";

import { ArrowUpDown, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { MachineRentalStatusBadge } from "../../components/MachineRentalStatusBadge";
import type {
	BookedMachineRow,
	BookedMachineSortKey,
} from "../types/bookMachine.types";

/** A column always has a key; only the table's active key can be unset. */
type SortableColumn = NonNullable<BookedMachineSortKey>;

interface BookedMachinesTableProps {
	rows: BookedMachineRow[];
	expanded: boolean;
	onToggle: () => void;
	sortKey: BookedMachineSortKey;
	sortAsc: boolean;
	onSort: (key: SortableColumn) => void;
	onRemove: (id: string) => void;
}

/** Only "ID-nr" and "Maskin" carry sort arrows in the design. */
function SortableHead({
	labelKey,
	sortKey,
	activeKey,
	sortAsc,
	onSort,
}: {
	labelKey: TranslationKeys;
	sortKey: SortableColumn;
	activeKey: BookedMachineSortKey;
	sortAsc: boolean;
	onSort: (key: SortableColumn) => void;
}) {
	const isActive = activeKey === sortKey;

	return (
		<TableHead
			aria-sort={isActive ? (sortAsc ? "ascending" : "descending") : "none"}
			className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-500"
		>
			<button
				type="button"
				onClick={() => onSort(sortKey)}
				className="flex cursor-pointer items-center gap-1 transition-colors hover:text-slate-700"
			>
				<Translate text={labelKey} />
				<ArrowUpDown
					className={`h-3 w-3 ${isActive ? "opacity-100" : "opacity-60"}`}
				/>
			</button>
		</TableHead>
	);
}

/**
 * "Bokade maskiner" — the machines picked so far, collapsible from its header.
 * Rows are removed with the trash action; nothing is persisted until Spara.
 */
export function BookedMachinesTable({
	rows,
	expanded,
	onToggle,
	sortKey,
	sortAsc,
	onSort,
	onRemove,
}: BookedMachinesTableProps) {
	const t = useTranslate();

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={expanded}
				className="flex h-14 w-full cursor-pointer items-center justify-between border-b border-slate-200 px-6 text-base font-medium text-slate-900"
			>
				<Translate text={localizationConstants.machineBookBookedMachines} />
				{expanded ? (
					<ChevronUp className="h-4 w-4 text-slate-500" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-500" />
				)}
			</button>

			{expanded && (
				<div className="w-full overflow-x-auto px-2 py-2">
					<Table className="w-full min-w-125 table-auto border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 hover:bg-transparent">
								<SortableHead
									labelKey={localizationConstants.machineColumnId}
									sortKey="machineNo"
									activeKey={sortKey}
									sortAsc={sortAsc}
									onSort={onSort}
								/>
								<SortableHead
									labelKey={localizationConstants.machine}
									sortKey="name"
									activeKey={sortKey}
									sortAsc={sortAsc}
									onSort={onSort}
								/>
								<TableHead className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-500">
									<Translate
										text={localizationConstants.machineListDeliveryDate}
									/>
								</TableHead>
								<TableHead className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-500">
									<Translate text={localizationConstants.statusLabel} />
								</TableHead>
								<TableHead className="w-10 px-2 py-2.5" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell
										colSpan={5}
										className="px-3 py-8 text-center text-xs text-slate-500"
									>
										<Translate
											text={localizationConstants.machineBookNoMachines}
										/>
									</TableCell>
								</TableRow>
							) : (
								rows.map((row) => (
									<TableRow
										key={row.id}
										className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
									>
										<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
											{row.machineNo}
										</TableCell>
										<TableCell className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-900">
											{row.name}
										</TableCell>
										<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
											{row.deliveryDate}
										</TableCell>
										<TableCell className="px-3 py-2.5 whitespace-nowrap">
											<MachineRentalStatusBadge status={row.status} />
										</TableCell>
										<TableCell className="px-2 py-2.5">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onRemove(row.id)}
												aria-label={t(
													localizationConstants.machineBookRemoveMachine
												)}
												className="h-7 w-7 cursor-pointer text-slate-500 hover:text-red-600"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
