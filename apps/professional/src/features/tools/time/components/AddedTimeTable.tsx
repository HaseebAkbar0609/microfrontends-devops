"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	ATA_BADGE_CLASS,
	MOCK_OB_MINUTES,
	STANDARD_WORKDAY,
	TIME_TYPE_CLASS,
	TIME_TYPE_KEY,
	TimeRow,
} from "../constants/mockData";
import { diffMinutes, formatDuration } from "../utils/time";

interface AddedTimeTableProps {
	rows: TimeRow[];
	onEdit: (row: TimeRow) => void;
	onDelete: (row: TimeRow) => void;
}

const HEADER_KEYS = [
	localizationConstants.timeColRow,
	localizationConstants.timeColStartShort,
	localizationConstants.timeColEndShort,
	localizationConstants.protocolColType,
	localizationConstants.protocolPointColNr,
	localizationConstants.timeColHours,
	localizationConstants.timeTypeAta,
	localizationConstants.timeColAtaNr,
	localizationConstants.timeColTravel,
	localizationConstants.timeFieldAllowance,
];

const travelDisplay = (row: TimeRow, hourShort: string): string => {
	if (!row.travelValue) return "-";
	return row.travelUnit === "km"
		? `${row.travelValue} Km`
		: `${row.travelValue} ${hourShort}`;
};

const AddedTimeTable = ({ rows, onEdit, onDelete }: AddedTimeTableProps) => {
	const t = useTranslate();
	const totalMinutes = rows.reduce(
		(sum, row) => sum + diffMinutes(row.start, row.end),
		0,
	);
	const overtimeMinutes = Math.max(
		0,
		totalMinutes - STANDARD_WORKDAY.hours * 60,
	);
	const typeCounts = rows.reduce<Record<string, number>>((counts, row) => {
		counts[row.type] = (counts[row.type] ?? 0) + 1;
		return counts;
	}, {});
	const ataCount = rows.filter((row) => row.ata).length;
	const registeredStart = rows.map((row) => row.start).sort()[0];
	const registeredEnd = [...rows.map((row) => row.end)].sort().at(-1);

	return (
		<div className="rounded-md border border-slate-200 bg-white">
			<div className="flex items-center justify-between rounded-t-md bg-slate-100 px-5 py-3">
				<span className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.timeAddedCard} />
				</span>
			</div>
			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[64rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							{HEADER_KEYS.map((key) => (
								<TableHead
									key={key}
									className="px-4 py-3 text-sm font-medium text-slate-500"
								>
									<Translate text={key} />
								</TableHead>
							))}
							<TableHead className="px-4 py-3" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row, index) => (
							<TableRow
								key={row.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{index + 1}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{row.start}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{row.end}
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<span
										className={cn(
											"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
											TIME_TYPE_CLASS[row.type],
										)}
									>
										<Translate
											text={TIME_TYPE_KEY[row.type]}
										/>
									</span>
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{row.refNr || "-"}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{Math.floor(
										diffMinutes(row.start, row.end) / 60,
									)}
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<Checkbox checked={row.ata} disabled />
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{row.ata && row.ataNr ? row.ataNr : "-"}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{travelDisplay(
										row,
										t(
											localizationConstants.timeUnitHourShort,
										),
									)}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{row.allowance ? "Ja" : "-"}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-md text-slate-500 hover:text-slate-900"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
										>
											<DropdownMenuItem
												onClick={() => onEdit(row)}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
											>
												<Pencil className="h-4 w-4 text-slate-600" />
												<Translate
													text={
														localizationConstants.subscriptionPaymentEdit
													}
												/>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onDelete(row)}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
											>
												<Trash2 className="h-4 w-4 text-slate-600" />
												<Translate
													text={
														localizationConstants.subscriptionPaymentDelete
													}
												/>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
				<span className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.timeTotalHour} />
				</span>
				<div className="flex flex-wrap items-center gap-4">
					{(["order", "project", "overhead"] as const).map(
						(type) =>
							(typeCounts[type] ?? 0) > 0 && (
								<span
									key={type}
									className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"
								>
									{typeCounts[type]}
									<span
										className={cn(
											"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
											TIME_TYPE_CLASS[type],
										)}
									>
										<Translate
											text={TIME_TYPE_KEY[type]}
										/>
									</span>
								</span>
							),
					)}
					{ataCount > 0 && (
						<span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
							{ataCount}
							<span
								className={cn(
									"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
									ATA_BADGE_CLASS,
								)}
							>
								<Translate
									text={localizationConstants.timeAtaTime}
								/>
							</span>
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-start justify-between gap-4 rounded-b-md bg-slate-100 px-5 py-4">
				<div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-900">
					<span className="font-semibold">
						<Translate text={localizationConstants.timeTotalHour} />
					</span>
					<span>{Math.floor(totalMinutes / 60)}</span>
					<span className="font-semibold">
						<Translate text={localizationConstants.timeOvertime} />
					</span>
					<span>{Math.floor(overtimeMinutes / 60)}</span>
					<span className="font-semibold">
						<Translate text={localizationConstants.timeOfWhichOB} />
					</span>
					<span>{Math.floor(MOCK_OB_MINUTES / 60)}</span>
				</div>
				<div className="grid grid-cols-[auto_auto_auto] gap-x-6 gap-y-1 rounded-md bg-slate-800 px-5 py-4 text-sm text-white">
					<span className="font-semibold">
						<Translate text={localizationConstants.timeWorkHours} />
					</span>
					<span>
						{STANDARD_WORKDAY.start}-{STANDARD_WORKDAY.end}
					</span>
					<span>{STANDARD_WORKDAY.hours}</span>
					<span className="font-semibold">
						<Translate
							text={localizationConstants.timeRegisteredHours}
						/>
					</span>
					<span>
						{registeredStart && registeredEnd
							? `${registeredStart}-${registeredEnd}`
							: "-"}
					</span>
					<span>{formatDuration(totalMinutes)}</span>
				</div>
			</div>
		</div>
	);
};

export default AddedTimeTable;
