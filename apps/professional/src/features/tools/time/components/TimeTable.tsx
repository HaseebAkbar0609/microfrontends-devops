"use client";

import {
	ArrowUpDown,
	Check,
	CircleDashed,
	MoreVertical,
	Pencil,
	Trash2,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	ATA_BADGE_CLASS,
	TIME_TYPE_CLASS,
	TIME_TYPE_KEY,
	TimeEntryType,
	WORK_DAY_STATUS_CLASS,
	WORK_DAY_STATUS_KEY,
	WorkDay,
} from "../constants/mockData";
import { TimeSortField } from "../hooks/useTimeFilters";
import {
	diffMinutes,
	formatDisplayDate,
	formatDuration,
	weekdayKeyOf,
} from "../utils/time";

interface TimeTableProps {
	workDays: WorkDay[];
	sortField: TimeSortField | null;
	onToggleSort: (field: TimeSortField) => void;
	onView: (day: WorkDay) => void;
	onDelete: (day: WorkDay) => void;
}

const dayTypes = (day: WorkDay): TimeEntryType[] => [
	...new Set(day.rows.map((row) => row.type)),
];

const dayStart = (day: WorkDay) =>
	day.rows.map((row) => row.start).sort()[0] ?? "";

const dayEnd = (day: WorkDay) =>
	[...day.rows.map((row) => row.end)].sort().at(-1) ?? "";

const dayDuration = (day: WorkDay) =>
	formatDuration(
		day.rows.reduce(
			(sum, row) => sum + diffMinutes(row.start, row.end),
			0,
		),
	);

const dayNrLines = (day: WorkDay): string[] =>
	day.rows.map((row) =>
		row.ata && row.ataNr ? `${row.refNr}, Äta ${row.ataNr}` : row.refNr,
	);

const TimeTable = ({
	workDays,
	sortField,
	onToggleSort,
	onView,
	onDelete,
}: TimeTableProps) => (
	<div className="w-full overflow-x-auto">
		<Table className="w-full min-w-[72rem]">
			<TableHeader>
				<TableRow className="border-b border-slate-200 hover:bg-transparent">
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<button
							type="button"
							onClick={() => onToggleSort("date")}
							className="flex cursor-pointer items-center gap-1"
						>
							<Translate
								text={localizationConstants.protocolColDate}
							/>
							<ArrowUpDown
								className={
									sortField === "date"
										? "h-3.5 w-3.5 text-slate-900"
										: "h-3.5 w-3.5 opacity-50"
								}
							/>
						</button>
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.timeColStart} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.timeColEnd} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate
							text={localizationConstants.timeColDuration}
						/>
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.protocolColType} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate
							text={localizationConstants.timeColProjectName}
						/>
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate
							text={localizationConstants.timeColProjectNr}
						/>
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<button
							type="button"
							onClick={() => onToggleSort("status")}
							className="flex cursor-pointer items-center gap-1"
						>
							<Translate
								text={
									localizationConstants.myPagesEmpLeaveColStatus
								}
							/>
							<ArrowUpDown
								className={
									sortField === "status"
										? "h-3.5 w-3.5 text-slate-900"
										: "h-3.5 w-3.5 opacity-50"
								}
							/>
						</button>
					</TableHead>
					<TableHead className="px-4 py-3" />
					<TableHead className="px-4 py-3" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{workDays.map((day) => {
					const hasAta = day.rows.some((row) => row.ata);
					const StatusIcon =
						day.status === "approved" ? Check : CircleDashed;
					return (
						<TableRow
							key={day.id}
							className="border-b border-slate-100 hover:bg-slate-50/60"
						>
							<TableCell className="px-4 py-3.5 text-sm text-slate-700">
								<Translate text={weekdayKeyOf(day.date)} />{" "}
								{formatDisplayDate(day.date)}
							</TableCell>
							<TableCell className="px-4 py-3.5 text-sm text-slate-700">
								{dayStart(day)}
							</TableCell>
							<TableCell className="px-4 py-3.5 text-sm text-slate-700">
								{dayEnd(day)}
							</TableCell>
							<TableCell className="px-4 py-3.5 text-sm text-slate-700">
								{dayDuration(day)}
							</TableCell>
							<TableCell className="px-4 py-3.5">
								<div className="flex flex-wrap items-center gap-1.5">
									{hasAta && (
										<span
											className={cn(
												"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
												ATA_BADGE_CLASS,
											)}
										>
											<Translate
												text={
													localizationConstants.timeTypeAta
												}
											/>
										</span>
									)}
									{dayTypes(day).map((type) => (
										<span
											key={type}
											className={cn(
												"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
												TIME_TYPE_CLASS[type],
											)}
										>
											<Translate
												text={TIME_TYPE_KEY[type]}
											/>
										</span>
									))}
								</div>
							</TableCell>
							<TableCell className="px-4 py-3.5 text-sm text-slate-700">
								{[
									...new Set(
										day.rows.map(
											(row) => row.projectName,
										),
									),
								].map((name) => (
									<p key={name}>{name}</p>
								))}
							</TableCell>
							<TableCell className="px-4 py-3.5 text-sm text-slate-700">
								{dayNrLines(day).map((line) => (
									<p key={line}>{line}</p>
								))}
							</TableCell>
							<TableCell className="px-4 py-3.5">
								<span
									className={cn(
										"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
										WORK_DAY_STATUS_CLASS[day.status],
									)}
								>
									<StatusIcon className="h-3 w-3" />
									<Translate
										text={WORK_DAY_STATUS_KEY[day.status]}
									/>
								</span>
							</TableCell>
							<TableCell className="px-2 py-3.5">
								<Button
									type="button"
									variant="outline"
									onClick={() => onView(day)}
									className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
								>
									<Translate
										text={
											localizationConstants.timeViewAction
										}
									/>
								</Button>
							</TableCell>
							<TableCell className="px-2 py-3.5 text-right">
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
											onClick={() => onView(day)}
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
											onClick={() => onDelete(day)}
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
					);
				})}
			</TableBody>
		</Table>
	</div>
);

export default TimeTable;
