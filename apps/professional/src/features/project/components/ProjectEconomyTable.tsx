"use client";

import { ReactNode, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ProjectEconomyItem } from "../data/projectEconomy.mock";
import { ProjectEconomySortField } from "../hooks/useProjectEconomyFilters";

const TB_AMOUNT_FORMAT = new Intl.NumberFormat("de-DE");

interface ProjectEconomyColumn {
	key: ProjectEconomySortField;
	labelKey: string;
	renderCell?: (row: ProjectEconomyItem) => ReactNode;
}

export const PROJECT_ECONOMY_COLUMNS: ProjectEconomyColumn[] = [
	{ key: "projectNr", labelKey: localizationConstants.projectEconomyColNr },
	{ key: "name", labelKey: localizationConstants.projectEconomyColName },
	{
		key: "totalRevenue",
		labelKey: localizationConstants.projectEconomyColRevenue,
		renderCell: (row) => (
			<span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
				{row.totalRevenue}
			</span>
		),
	},
	{
		key: "totalCosts",
		labelKey: localizationConstants.projectEconomyColCosts,
	},
	{
		key: "tbContribution",
		labelKey: localizationConstants.projectEconomyColTb,
		renderCell: (row) => TB_AMOUNT_FORMAT.format(row.tbContribution),
	},
];

interface ProjectEconomyTableProps {
	rows: ProjectEconomyItem[];
	sortField: ProjectEconomySortField | null;
	onToggleSort: (field: ProjectEconomySortField) => void;
}

const ProjectEconomyTable = ({
	rows,
	sortField,
	onToggleSort,
}: ProjectEconomyTableProps) => {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const allSelected =
		rows.length > 0 && rows.every((row) => selectedIds.has(row.id));

	const toggleRow = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const toggleAll = () => {
		setSelectedIds(
			allSelected ? new Set() : new Set(rows.map((row) => row.id)),
		);
	};

	return (
		<div className="w-full overflow-x-auto">
			<Table className="w-full min-w-[56rem]">
				<TableHeader>
					<TableRow className="border-b border-slate-200 hover:bg-transparent">
						<TableHead className="w-12 px-4 py-3">
							<Checkbox
								checked={allSelected}
								onCheckedChange={toggleAll}
								aria-label="Select all"
							/>
						</TableHead>
						{PROJECT_ECONOMY_COLUMNS.map((column) => (
							<TableHead
								key={column.key}
								className="px-4 py-3 text-sm font-medium text-slate-500"
							>
								<button
									type="button"
									onClick={() => onToggleSort(column.key)}
									className="flex cursor-pointer items-center gap-1"
								>
									<Translate text={column.labelKey} />
									<ArrowUpDown
										className={cn(
											"h-3.5 w-3.5",
											sortField === column.key
												? "text-slate-900"
												: "opacity-50",
										)}
									/>
								</button>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.id}
							className="border-b border-slate-100 hover:bg-slate-50/60"
						>
							<TableCell className="w-12 px-4 py-3.5">
								<Checkbox
									checked={selectedIds.has(row.id)}
									onCheckedChange={() => toggleRow(row.id)}
									aria-label={row.projectNr}
								/>
							</TableCell>
							{PROJECT_ECONOMY_COLUMNS.map((column) => (
								<TableCell
									key={column.key}
									className="px-4 py-3.5 text-sm text-slate-700"
								>
									{column.renderCell
										? column.renderCell(row)
										: row[column.key]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ProjectEconomyTable;
