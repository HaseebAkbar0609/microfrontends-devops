"use client";

import { useState, useEffect } from "react";
import {
	Search,
	ChevronDown,
	ChevronRight,
	ChevronLeft,
	Plus,
	ArrowUpDown,
	MoreVertical,
	Pencil,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ModalWrapper } from "@/components/modal";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ActiveProject } from "../../types";

import { getProjectTimelinesAPIAction, type ApiTimelineTaskItem, type ApiTimelineProjectItem } from "@/api-actions/project/timeline";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineProject {
	id: string;
	title: string;
	estimatedDays: number;
	lastUpdated: string;
	tasks?: ApiTimelineTaskItem[];
}

interface GanttTask {
	id: string;
	title: string;
	startDate: Date;
	endDate: Date;
	color: "orange" | "green" | "red";
	isGroup: boolean;
	isExpanded: boolean;
	parentId?: string;
}

// ─── Calendar helpers ─────────────────────────────────────────────────────────

const D = (m: number, day: number) => new Date(2026, m - 1, day);

const INITIAL_TASKS: GanttTask[] = [
	{
		id: "t1",
		title: "Measurement",
		startDate: D(3, 4),
		endDate: D(3, 18),
		color: "orange",
		isGroup: true,
		isExpanded: false,
	},
	{
		id: "t2",
		title: "Redesign",
		startDate: D(3, 12),
		endDate: D(3, 23),
		color: "green",
		isGroup: true,
		isExpanded: true,
	},
	{
		id: "t2a",
		title: "Layout Design",
		startDate: D(3, 12),
		endDate: D(3, 18),
		color: "green",
		isGroup: false,
		isExpanded: false,
		parentId: "t2",
	},
	{
		id: "t2b",
		title: "Material Selection",
		startDate: D(3, 18),
		endDate: D(3, 23),
		color: "green",
		isGroup: false,
		isExpanded: false,
		parentId: "t2",
	},
	{
		id: "t3",
		title: "Upgrade Tech",
		startDate: D(3, 15),
		endDate: D(3, 24),
		color: "red",
		isGroup: true,
		isExpanded: false,
	},
	{
		id: "t4",
		title: "Storage",
		startDate: D(3, 20),
		endDate: D(4, 5),
		color: "orange",
		isGroup: true,
		isExpanded: false,
	},
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────

// Start on Mon Feb 9 (Week 7) — full weeks, no sliver; end Apr 26 for scroll range
const CHART_START = new Date(2026, 1, 9);
const CHART_END = new Date(2026, 3, 26);

// Figma: each day cell = 36px
const CELL_W = 36;

function buildDays(start: Date, end: Date): Date[] {
	const days: Date[] = [];
	const cur = new Date(start);
	while (cur <= end) {
		days.push(new Date(cur));
		cur.setDate(cur.getDate() + 1);
	}
	return days;
}

function isoWeek(date: Date): number {
	const d = new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
	);
	const day = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function groupByWeek(days: Date[]): { weekNum: number; days: Date[] }[] {
	const groups: { weekNum: number; days: Date[] }[] = [];
	for (const day of days) {
		const wn = isoWeek(day);
		const last = groups[groups.length - 1];
		if (last && last.weekNum === wn) last.days.push(day);
		else groups.push({ weekNum: wn, days: [day] });
	}
	return groups;
}

function groupByMonth(days: Date[]): { label: string; count: number }[] {
	const groups: { label: string; count: number }[] = [];
	for (const day of days) {
		const label = day.toLocaleString("en", {
			month: "long",
			year: "numeric",
		});
		const last = groups[groups.length - 1];
		if (last && last.label === label) last.count++;
		else groups.push({ label, count: 1 });
	}
	return groups;
}

const ALL_DAYS = buildDays(CHART_START, CHART_END);
const WEEKS = groupByWeek(ALL_DAYS);
const MONTHS = groupByMonth(ALL_DAYS);

const BAR_COLOR: Record<GanttTask["color"], string> = {
	orange: "bg-orange-500",
	green: "bg-green-700",
	red: "bg-red-600",
};

function taskActive(day: Date, task: GanttTask): boolean {
	return day >= task.startDate && day <= task.endDate;
}

// ─── Gantt view ───────────────────────────────────────────────────────────────

function GanttView({ project, onBack }: { project: TimelineProject; onBack: () => void }) {
	const mappedApiTasks: GanttTask[] | null =
		project.tasks && project.tasks.length > 0
			? project.tasks.map((t: ApiTimelineTaskItem) => ({
				id: t.id,
				title: t.name || t.title || "Untitled Task",
				startDate: new Date(Number(t.startDate) || t.startDate),
				endDate: new Date(Number(t.endDate) || t.endDate),
				color: (t.color as GanttTask["color"]) || "green",
				isGroup: !t.parentId,
				isExpanded: true,
				parentId: t.parentId,
			}))
			: null;

	const [tasks, setTasks] = useState<GanttTask[]>(mappedApiTasks || INITIAL_TASKS);

	const visibleTasks = tasks.filter(
		(t) =>
			!t.parentId || tasks.find((p) => p.id === t.parentId)?.isExpanded,
	);

	const toggle = (id: string) =>
		setTasks((prev) =>
			prev.map((t) =>
				t.id === id ? { ...t, isExpanded: !t.isExpanded } : t,
			),
		);

	return (
		<div className="pb-10">
			<div className="flex items-center gap-1 mb-4 p-0">
				<button
					type="button"
					onClick={onBack}
					className="cursor-pointer text-[#64748B] hover:text-[#09090B] transition-colors"
					aria-label="Back"
				>
					<ChevronLeft className="h-5 w-5" />
				</button>
				<span className="text-base font-semibold text-[#0A0A0A]">
					{project.title}
				</span>
			</div>

			<div className="bg-white border border-slate-500/10 rounded-xl overflow-hidden">
				<div className="flex">
					<div className="w-45 shrink-0 border-r border-[#E2E8F0]">
						<div className="h-36 border-b border-[#E2E8F0] px-4 flex items-center">
							<span className="text-xl font-medium text-[#0A0A0A]">
								{project.estimatedDays} days
							</span>
						</div>

						{visibleTasks.map((task) => (
							<div
								key={task.id}
								className="h-10 flex items-center border-b border-[#E2E8F0] last:border-0 bg-[#E2E8F0]"
							>
								<div
									className="flex items-center gap-1 h-full px-2 flex-1 min-w-0"
									style={{
										background: "#E2E8F0",
										borderRadius: "4px 0px 0px 4px",
										paddingLeft: task.parentId ? 20 : 8,
									}}
								>
									{task.isGroup ? (
										<button
											type="button"
											onClick={() => toggle(task.id)}
											className="cursor-pointer shrink-0 text-[#1E293B] hover:text-[#0A0A0A]"
										>
											{task.isExpanded ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
										</button>
									) : (
										<span className="w-4 shrink-0" />
									)}
									<span className="text-sm font-medium text-[#020617] truncate">
										{task.title}
									</span>
								</div>
							</div>
						))}
					</div>

					<div
						className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
						style={{ scrollbarWidth: "none" }}
					>
						<div className="flex h-12 border-b border-[#E2E8F0]">
							{MONTHS.map((m) => (
								<div
									key={m.label}
									style={{
										width: m.count * CELL_W,
										minWidth: m.count * CELL_W,
									}}
									className="shrink-0 flex items-center justify-center text-sm font-medium text-[#0A0A0A] border-r border-[#E2E8F0] last:border-0"
								>
									{m.label}
								</div>
							))}
						</div>

						<div className="flex h-12 border-b border-[#E2E8F0]">
							{WEEKS.map((w) => (
								<div
									key={`wk-${w.weekNum}`}
									style={{
										width: w.days.length * CELL_W,
										minWidth: w.days.length * CELL_W,
									}}
									className="shrink-0 flex items-center justify-center text-sm font-medium text-[#0A0A0A] border-l border-[#E2E8F0] first:border-0"
								>
									Week {w.weekNum}
								</div>
							))}
						</div>

						<div className="flex h-12 border-b border-[#E2E8F0]">
							{ALL_DAYS.map((day) => (
								<div
									key={day.toISOString()}
									style={{ width: CELL_W, minWidth: CELL_W }}
									className="shrink-0 flex items-center justify-center text-sm font-medium text-[#0A0A0A] border-r border-[#F1F5F9] last:border-0"
								>
									{day.getDate()}
								</div>
							))}
						</div>

						{visibleTasks.map((task) => (
							<div
								key={task.id}
								className="flex h-10 border-b border-[#E2E8F0] last:border-0 bg-[#E2E8F0]"
							>
								{ALL_DAYS.map((day) => {
									const active = taskActive(day, task);
									return (
										<div
											key={day.toISOString()}
											style={{
												width: CELL_W,
												minWidth: CELL_W,
											}}
											className="shrink-0 h-full"
										>
											<div className="flex h-full py-2">
												{active && (
													<div
														className={`flex-1 ${BAR_COLOR[task.color]}`}
													/>
												)}
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

interface TimelineTabProps {
	project?: ActiveProject;
}

export function TimelineTab({ project }: TimelineTabProps) {
	const t = useTranslate();
	const [view, setView] = useState<"list" | "gantt">("list");
	const [selected, setSelected] = useState<TimelineProject | null>(null);
	const [search, setSearch] = useState("");
	const [apiTimelines, setApiTimelines] = useState<TimelineProject[]>([]);
	const [createOpen, setCreateOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newDays, setNewDays] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<TimelineProject | null>(null);

	useEffect(() => {
		if (!project?.id) return;
		getProjectTimelinesAPIAction(project.id).then((res) => {
			if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
				setApiTimelines(
					res.data.map((t: ApiTimelineProjectItem) => ({
						id: t.id,
						title: t.title,
						estimatedDays: t.estimatedDays || 30,
						lastUpdated: t.lastUpdated ? t.lastUpdated.split("T")[0] : new Date().toISOString().split("T")[0],
						tasks: t.tasks || [],
					}))
				);
			}
		});
	}, [project?.id]);

	const fallbackTimelines: TimelineProject[] = [
		{
			id: project?.id || "1",
			title: project?.name && project.name !== "-" ? project.name : "Renovering Badrum & Kök",
			estimatedDays: 30,
			lastUpdated: project?.updatedAt && project.updatedAt !== "-" ? project.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0],
		},
		{
			id: "2",
			title: "VVS & El Installationer",
			estimatedDays: 14,
			lastUpdated: project?.updatedAt && project.updatedAt !== "-" ? project.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0],
		},
	];

	const timelineList: TimelineProject[] = apiTimelines.length > 0 ? apiTimelines : fallbackTimelines;

	const filtered = timelineList.filter((p) =>
		p.title.toLowerCase().includes(search.toLowerCase()),
	);

	const openGantt = (p: TimelineProject) => {
		setSelected(p);
		setView("gantt");
	};

	const handleCreate = () => {
		const title = newTitle.trim();
		if (!title) return;
		const days = Math.max(0, Number(newDays) || 0);
		setApiTimelines((prev) => [
			...prev,
			{
				id: String(Date.now()),
				title,
				estimatedDays: days,
				lastUpdated: new Date().toISOString().split("T")[0],
			},
		]);
		setCreateOpen(false);
		setNewTitle("");
		setNewDays("");
		showToast(
			"success",
			t(localizationConstants.projectTimelineCreatedSuccess),
		);
	};

	const handleDeleteConfirmed = () => {
		if (!deleteTarget) return;
		setApiTimelines((prev) => prev.filter((p) => p.id !== deleteTarget.id));
		setDeleteTarget(null);
		showToast(
			"success",
			t(localizationConstants.projectTimelineDeletedSuccess),
		);
	};

	if (view === "gantt" && selected) {
		return <GanttView project={selected} onBack={() => setView("list")} />;
	}

	return (
		<div className="pb-10">
			{/* Toolbar */}
			<div className="flex items-center gap-3 mb-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search"
						className="pl-9 h-9 w-48 text-sm border-[#E2E8F0]"
					/>
				</div>
				<Button
					type="button"
					onClick={() => setCreateOpen(true)}
					className="ml-auto h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
				>
					<Plus className="h-4 w-4" />
					<Translate
						text={localizationConstants.projectCreateNewLabel}
					/>
				</Button>
			</div>

			<div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
				<div className="grid grid-cols-[1fr_160px_180px_46px] border-b border-[#E2E8F0]">
					<button
						type="button"
						className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
					>
						<Translate
							text={
								localizationConstants.projectTimelineTitleLabel
							}
						/>
						<ArrowUpDown className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
					>
						<Translate
							text={localizationConstants.projectEstTimeLabel}
						/>
						<ArrowUpDown className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
					>
						<Translate
							text={localizationConstants.projectLastUpdatedLabel}
						/>
						<ArrowUpDown className="h-3.5 w-3.5" />
					</button>
					<div className="border-l border-[#E2E8F0] h-12" />
				</div>

				{filtered.length === 0 ? (
					<div className="py-12 text-center text-sm text-slate-400">
						No timelines found
					</div>
				) : (
					filtered.map((p) => (
						<div
							key={p.id}
							className="grid grid-cols-[1fr_160px_180px_46px] items-center hover:bg-slate-50 transition-colors cursor-pointer border-b border-[#E2E8F0] last:border-0"
							onClick={() => openGantt(p)}
						>
							<span className="h-12 flex items-center px-4 text-sm text-[#020617]">
								{p.title}
							</span>
							<span className="h-12 flex items-center px-4 text-sm text-[#020617]">
								{p.estimatedDays} days
							</span>
							<span className="h-12 flex items-center px-4 text-sm text-[#020617]">
								{p.lastUpdated}
							</span>
							<div
								className="h-12 flex items-center justify-center border-l border-[#E2E8F0]"
								onClick={(e) => e.stopPropagation()}
							>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-[6px] text-[#18181B] hover:bg-slate-100 transition-colors"
											aria-label="Actions"
										>
											<MoreVertical className="h-4 w-4" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-[150px]"
									>
										<DropdownMenuItem
											className="gap-2 cursor-pointer py-2"
											onClick={() => openGantt(p)}
										>
											<Pencil className="h-4 w-4 text-accent-foreground" />
											<Translate
												text={
													localizationConstants.open
												}
											/>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700"
											onClick={() => setDeleteTarget(p)}
										>
											<Trash2 className="h-4 w-4 text-accent-foreground" />
											<Translate
												text={
													localizationConstants.delete
												}
											/>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					))
				)}
			</div>

			<ModalWrapper
				open={createOpen}
				onOpenChange={(open) => {
					setCreateOpen(open);
					if (!open) {
						setNewTitle("");
						setNewDays("");
					}
				}}
				title={
					<Translate
						text={localizationConstants.projectCreateNewLabel}
					/>
				}
				footer={
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							className="min-w-24"
							onClick={() => setCreateOpen(false)}
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							className="min-w-24 bg-slate-900 hover:bg-slate-800 text-white"
							disabled={!newTitle.trim()}
							onClick={handleCreate}
						>
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				}
			>
				<div className="space-y-4">
					<div className="space-y-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate
								text={
									localizationConstants.projectTimelineTitleLabel
								}
							/>
						</label>
						<Input
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							placeholder="My Bathroom"
							className="h-9 text-sm"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate
								text={localizationConstants.projectEstTimeLabel}
							/>
						</label>
						<Input
							type="number"
							min={0}
							value={newDays}
							onChange={(e) => setNewDays(e.target.value)}
							placeholder="15"
							className="h-9 text-sm"
						/>
					</div>
				</div>
			</ModalWrapper>

			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold text-slate-800">
							<Translate
								text={
									localizationConstants.deleteTimelineConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate
								text={
									localizationConstants.deleteTimelineConfirmDescription
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel
							className="min-w-24"
							onClick={() => setDeleteTarget(null)}
						>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							className="min-w-24 bg-red-600 hover:bg-red-700 text-white"
							onClick={handleDeleteConfirmed}
						>
							<Translate text={localizationConstants.delete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
