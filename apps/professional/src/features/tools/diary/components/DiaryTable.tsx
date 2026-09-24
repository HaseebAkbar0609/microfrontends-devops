"use client";

import { ArrowUpDown, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DiaryEntry } from "../constants/data";

interface DiaryTableProps {
	entries: DiaryEntry[];
	showEmptyState: boolean;
	sortField: "date" | null;
	onToggleSort: () => void;
	onOpen: (entry: DiaryEntry) => void;
	onDelete: (entry: DiaryEntry) => void;
}

const DiaryTable = ({
	entries,
	showEmptyState,
	sortField,
	onToggleSort,
	onOpen,
	onDelete,
}: DiaryTableProps) => (
	<div className="w-full overflow-x-auto">
		<Table className="w-full min-w-[48rem]">
			<TableHeader>
				<TableRow className="border-b border-slate-200 hover:bg-transparent">
					<TableHead className="w-40 px-4 py-3 text-sm font-medium text-slate-500">
						<button
							type="button"
							onClick={onToggleSort}
							className="flex cursor-pointer items-center gap-1"
						>
							<Translate
								text={localizationConstants.diaryFieldDate}
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
					<TableHead className="w-48 px-4 py-3 text-sm font-medium text-slate-500">
						<Translate
							text={localizationConstants.diaryColProject}
						/>
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.diaryColSpec} />
					</TableHead>
					<TableHead className="px-4 py-3" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{showEmptyState && entries.length === 0 && (
					<TableRow>
						<TableCell colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.noDataFound} />
						</TableCell>
					</TableRow>
				)}
				{entries.map((entry) => (
					<TableRow
						key={entry.id}
						onClick={() => onOpen(entry)}
						className="cursor-pointer border-b border-slate-100 hover:bg-slate-50/60"
					>
						<TableCell className="px-4 py-3.5 text-sm text-slate-700">
							{entry.date}
						</TableCell>
						<TableCell className="px-4 py-3.5 text-sm text-slate-700">
							{entry.projectName}
						</TableCell>
						<TableCell className="px-4 py-3.5">
							<p className="text-sm font-medium text-slate-900">
								{entry.title}
							</p>
							<p className="mt-0.5 max-w-3xl truncate text-sm text-slate-500">
								{entry.description}
							</p>
						</TableCell>
						<TableCell
							onClick={(event) => event.stopPropagation()}
							className="px-4 py-3.5 text-right"
						>
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
										onClick={() => onOpen(entry)}
										className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
									>
										<Pencil className="h-4 w-4 text-slate-600" />
										<Translate
											text={
												localizationConstants.diaryEditRead
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => onDelete(entry)}
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
);

export default DiaryTable;
