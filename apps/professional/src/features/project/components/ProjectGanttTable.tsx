"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	GanttSegment,
	PROJECT_DETAIL_MONTH_LABEL,
	PROJECT_DETAIL_ROWS,
	PROJECT_DETAIL_WEEKS,
} from "../data/projectDetail.mock";

const DAY_COUNT = PROJECT_DETAIL_WEEKS.reduce(
	(total, week) => total + week.days.length,
	0,
);

// Later segments paint over earlier ones where they overlap.
const segmentColorAt = (segments: GanttSegment[], dayIndex: number) =>
	segments.findLast(
		(segment) => dayIndex >= segment.from && dayIndex <= segment.to,
	)?.colorClass ?? null;

const formatDate = (value: string) => value.replaceAll("-", "/");

const ProjectGanttTable = () => {
	const t = useTranslate();
	const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

	const toggleCollapse = (id: string) => {
		setCollapsedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	// Mock-phase handler — no add-phase endpoint or design exists yet;
	// replace with the real flow once the backend is ready.
	const handleAdd = () =>
		showToast("info", t(localizationConstants.projectDetailAddToast));

	return (
		<div className="w-full overflow-x-auto">
			{/* min-w keeps the 28 day cells + left columns readable; narrower viewports scroll horizontally */}
			<table className="w-full min-w-[96rem] border-separate border-spacing-0">
				<thead>
					<tr>
						<th
							rowSpan={3}
							className="w-36 border-b border-r border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-500"
						>
							<Translate
								text={localizationConstants.projectDetailColNr}
							/>
						</th>
						<th
							rowSpan={3}
							className="w-44 border-b border-r border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-500"
						>
							<Translate
								text={localizationConstants.projectDetailColName}
							/>
						</th>
						<th
							rowSpan={3}
							className="w-28 border-b border-r border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-500"
						>
							<Translate
								text={localizationConstants.projectDetailColStart}
							/>
						</th>
						<th
							rowSpan={3}
							className="w-28 border-b border-r border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-500"
						>
							<Translate
								text={localizationConstants.projectDetailColEnd}
							/>
						</th>
						<th
							rowSpan={3}
							className="w-12 border-b border-r border-slate-200 px-2 py-3"
						/>
						<th
							colSpan={DAY_COUNT}
							className="border-b border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-900"
						>
							{PROJECT_DETAIL_MONTH_LABEL}
						</th>
					</tr>
					<tr>
						{PROJECT_DETAIL_WEEKS.map((week, weekIndex) => (
							<th
								key={`${week.label}-${weekIndex}`}
								colSpan={week.days.length}
								className="border-b border-l border-slate-200 px-2 py-2 text-center text-sm font-medium text-slate-700"
							>
								{week.label}
							</th>
						))}
					</tr>
					<tr>
						{PROJECT_DETAIL_WEEKS.flatMap((week, weekIndex) =>
							week.days.map((day, dayIndex) => (
								<th
									key={`${weekIndex}-${dayIndex}`}
									className="w-12 border-b border-l border-slate-200 px-1 py-1.5 text-center text-xs font-medium text-slate-600"
								>
									{day}
								</th>
							)),
						)}
					</tr>
				</thead>
				<tbody>
					{PROJECT_DETAIL_ROWS.map((row) => {
						const collapsed = collapsedIds.has(row.id);
						const CollapseIcon = collapsed
							? ChevronDown
							: ChevronUp;

						return (
							<tr key={row.id}>
								<td className="border-b border-r border-slate-200 bg-slate-100/80 px-4 py-3 text-sm font-medium text-slate-900">
									<span className="flex items-center gap-2">
										<button
											type="button"
											onClick={() =>
												toggleCollapse(row.id)
											}
											aria-label={row.projectNr}
											className="cursor-pointer rounded p-0.5 text-slate-500 hover:text-slate-900"
										>
											<CollapseIcon className="h-4 w-4" />
										</button>
										{row.projectNr}
									</span>
								</td>
								<td className="border-b border-r border-slate-200 bg-slate-100/80 px-4 py-3 text-sm text-slate-700">
									{row.name}
								</td>
								<td className="border-b border-r border-slate-200 bg-slate-100/80 px-4 py-3 text-sm text-slate-700">
									{formatDate(row.startDate)}
								</td>
								<td className="border-b border-r border-slate-200 bg-slate-100/80 px-4 py-3 text-sm text-slate-700">
									{formatDate(row.endDate)}
								</td>
								<td className="border-b border-r border-slate-200 bg-slate-100/80 px-2 py-3 text-center">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={handleAdd}
										className="h-7 w-7 rounded-md text-slate-600 hover:text-slate-900"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</td>
								{Array.from(
									{ length: DAY_COUNT },
									(_, dayIndex) => {
										const color = collapsed
											? null
											: segmentColorAt(
													row.segments,
													dayIndex,
												);
										return (
											<td
												key={dayIndex}
												className={cn(
													"h-11 w-12 border-b border-l border-slate-100",
													color,
												)}
											/>
										);
									},
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default ProjectGanttTable;
