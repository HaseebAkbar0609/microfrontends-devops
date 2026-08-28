"use client";

import { ArrowUpDown, ChevronDown, ChevronUp, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { ExternalBookingRow } from "../types/bookMachine.types";

/** Every column in this table carries sort arrows in the design. */
const COLUMNS: { key: keyof ExternalBookingRow; labelKey: TranslationKeys }[] = [
	{ key: "machineNo", labelKey: localizationConstants.machineColumnId },
	{ key: "name", labelKey: localizationConstants.machine },
	{ key: "supplier", labelKey: localizationConstants.machineListSupplier },
	{ key: "rate", labelKey: localizationConstants.machineListExternalRent },
	{
		key: "deliveryDate",
		labelKey: localizationConstants.machineListDeliveryDate,
	},
	{ key: "returnDate", labelKey: localizationConstants.machineListReturnDate },
	{ key: "status", labelKey: localizationConstants.statusLabel },
];

type SortKey = (typeof COLUMNS)[number]["key"];

interface ExternalBookedTableProps {
	rows: ExternalBookingRow[];
	expanded: boolean;
	onToggle: () => void;
	sortKey: SortKey | null;
	sortAsc: boolean;
	onSort: (key: SortKey) => void;
	onRemove: (id: string) => void;
}

/**
 * "Bokade maskiner" for hired-in machines. The header band is blue here, the
 * same tone the machine list detail uses for its external groups.
 */
export function ExternalBookedTable({
	rows,
	expanded,
	onToggle,
	sortKey,
	sortAsc,
	onSort,
	onRemove,
}: ExternalBookedTableProps) {
	const t = useTranslate();

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={expanded}
				className="flex w-full cursor-pointer items-center justify-between bg-[#93C5FD] px-4 py-2.5 text-sm font-medium text-slate-900"
			>
				<Translate text={localizationConstants.machineBookBookedMachines} />
				{expanded ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)}
			</button>

			{expanded && (
				<div className="w-full overflow-x-auto">
					<Table className="w-full min-w-200 table-auto border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 hover:bg-transparent">
								{COLUMNS.map((column) => (
									<TableHead
										key={column.key}
										aria-sort={
											sortKey === column.key
												? sortAsc
													? "ascending"
													: "descending"
												: "none"
										}
										className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-500"
									>
										<button
											type="button"
											onClick={() => onSort(column.key)}
											className="flex cursor-pointer items-center gap-1 transition-colors hover:text-slate-700"
										>
											<Translate text={column.labelKey} />
											<ArrowUpDown
												className={`h-3 w-3 ${sortKey === column.key ? "opacity-100" : "opacity-60"}`}
											/>
										</button>
									</TableHead>
								))}
								<TableHead className="w-12 px-2 py-2.5" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell
										colSpan={COLUMNS.length + 1}
										className="px-3 py-8 text-center text-xs text-slate-500"
									>
										<Translate text={localizationConstants.machineBookNoMachines} />
									</TableCell>
								</TableRow>
							) : (
								rows.map((row) => (
									<TableRow
										key={row.id}
										className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
									>
										<TableCell className="px-3 py-3 text-xs whitespace-nowrap text-slate-700">
											{row.machineNo}
										</TableCell>
										<TableCell className="px-3 py-3 text-xs font-semibold whitespace-nowrap text-slate-900">
											{row.name}
										</TableCell>
										<TableCell className="px-3 py-3 whitespace-nowrap">
											<span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
												{row.supplier}
											</span>
										</TableCell>
										<TableCell className="px-3 py-3 text-xs font-semibold whitespace-nowrap text-slate-900">
											{row.rate}
										</TableCell>
										<TableCell className="px-3 py-3 text-xs font-semibold whitespace-nowrap text-slate-900">
											{row.deliveryDate}
										</TableCell>
										<TableCell className="px-3 py-3 text-xs font-semibold whitespace-nowrap text-slate-900">
											{row.returnDate}
										</TableCell>
										<TableCell className="px-3 py-3 whitespace-nowrap">
											<MachineRentalStatusBadge status={row.status} />
										</TableCell>
										<TableCell className="px-2 py-3 text-center">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														aria-label={t(localizationConstants.actionsHeader)}
														className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md"
												>
													<DropdownMenuItem
														onClick={() => onRemove(row.id)}
														className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
														<span>
															<Translate text={localizationConstants.actionDelete} />
														</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
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
