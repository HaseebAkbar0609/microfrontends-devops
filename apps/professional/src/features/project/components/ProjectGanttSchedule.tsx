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
	PROJECT_DETAIL_WEEKS,
} from "../data/projectDetail.mock";
import {
	GanttScheduleNode,
	PROJECT_GANTT_SCHEDULE,
} from "../data/projectGanttSchedule.mock";

const DAY_COUNT = PROJECT_DETAIL_WEEKS.reduce(
	(total, week) => total + week.days.length,
	0,
);

// Later segments paint over earlier ones where they overlap.
const segmentAt = (segments: GanttSegment[], dayIndex: number) =>
	segments.findLast(
		(segment) => dayIndex >= segment.from && dayIndex <= segment.to,
	) ?? null;

const formatDate = (value: string) => value.replaceAll("-", "/");

interface FlatRow {
	node: GanttScheduleNode;
	depth: number;
}

const flattenTree = (
	nodes: GanttScheduleNode[],
	collapsedIds: Set<string>,
	depth = 0,
): FlatRow[] =>
	nodes.flatMap((node) => {
		const row: FlatRow = { node, depth };
		if (node.children && !collapsedIds.has(node.id)) {
			return [row, ...flattenTree(node.children, collapsedIds, depth + 1)];
		}
		return [row];
	});

const ProjectGanttSchedule = () => {
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

	// Mock-phase handler — no add-task endpoint or design exists yet; replace
	// with the real flow once the backend is ready.
	const handleAdd = () =>
		showToast("info", t(localizationConstants.projectDetailAddToast));

	const rows = flattenTree(PROJECT_GANTT_SCHEDULE, collapsedIds);

	const renderChevron = (node: GanttScheduleNode) => {
		if (!node.children?.length) return null;
		const collapsed = collapsedIds.has(node.id);
		const Icon = collapsed ? ChevronUp : ChevronDown;
		return (
			<button
				type="button"
				onClick={() => toggleCollapse(node.id)}
				aria-label={node.name}
				className="cursor-pointer rounded p-0.5 text-slate-500 hover:text-slate-900"
			>
				<Icon className="h-4 w-4" />
			</button>
		);
	};

	return (
		<div className="w-full overflow-x-auto">
			{/* min-w keeps the 28 day cells + left columns readable; narrower viewports scroll horizontally */}
			<table className="w-full min-w-[96rem] border-separate border-spacing-0">
				<thead>
					<tr>
						<th
							rowSpan={3}
							className="w-40 border-b border-r border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-500"
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
					{rows.map(({ node, depth }) => {
						const isTopLevel = depth === 0;
						const muted = depth >= 2;
						const leftCellClass = cn(
							"border-b border-r border-slate-200 px-4 py-3 text-sm",
							isTopLevel
								? "bg-slate-100/80 font-medium text-slate-900"
								: muted
									? "text-slate-400"
									: "text-slate-700",
						);

						return (
							<tr key={node.id}>
								<td className={leftCellClass}>
									<span
										className="flex items-center gap-2"
										style={{
											paddingLeft: `${depth * 16}px`,
										}}
									>
										{renderChevron(node)}
										{node.nr ?? node.name}
									</span>
								</td>
								<td className={leftCellClass}>
									<span className="flex items-center gap-2">
										{renderChevron(node)}
										{node.name}
									</span>
								</td>
								<td className={leftCellClass}>
									{formatDate(node.startDate)}
								</td>
								<td className={leftCellClass}>
									{formatDate(node.endDate)}
								</td>
								<td
									className={cn(
										"border-b border-r border-slate-200 px-2 py-3 text-center",
										isTopLevel && "bg-slate-100/80",
									)}
								>
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
										const segment = segmentAt(
											node.segments,
											dayIndex,
										);
										if (isTopLevel) {
											return (
												<td
													key={dayIndex}
													className={cn(
														"h-11 w-12 border-b border-l border-slate-100",
														segment
															? segment.colorClass
															: "bg-slate-200/50",
													)}
												/>
											);
										}
										return (
											<td
												key={dayIndex}
												className="h-11 w-12 border-b border-l border-slate-100 p-0"
											>
												{segment && (
													<div
														className={cn(
															"h-5 w-full",
															segment.colorClass,
															dayIndex ===
																segment.from &&
																"rounded-l-md",
															dayIndex ===
																segment.to &&
																"rounded-r-md",
														)}
													/>
												)}
											</td>
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

export default ProjectGanttSchedule;
