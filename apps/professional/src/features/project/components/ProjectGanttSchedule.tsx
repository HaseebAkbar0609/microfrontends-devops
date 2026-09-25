"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listProfessionalProjects } from "../services/professionalProjectService";
import { flattenTree } from "../production/tidsplan/taskTree";
import { buildTimeline, parseIsoDay } from "../production/tidsplan/timeline";
import type { TimeplanTask } from "../production/tidsplan/types";
import { TimeplanGantt } from "../production/tidsplan/view/TimeplanGantt";

function monthStart(offset: number): string {
	const now = new Date();
	return new Date(Date.UTC(now.getFullYear(), now.getMonth() + offset, 1))
		.toISOString().slice(0, 10);
}

function monthEnd(start: string): string {
	const [year, month] = start.split("-").map(Number);
	return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

/** The overview shows project date spans; detailed activities live inside each timeplan. */
export default function ProjectGanttSchedule() {
	const { company, isAuthenticated } = useAuthStatus();
	const [monthOffset, setMonthOffset] = useState(0);
	const query = useQuery({
		queryKey: ["professional-projects", company?.id, false],
		queryFn: () => listProfessionalProjects(false),
		enabled: Boolean(company?.id && isAuthenticated),
		retry: false,
	});
	const start = monthStart(monthOffset);
	const end = monthEnd(start);
	const timeline = useMemo(() => buildTimeline(start, end), [start, end]);
	const rows = useMemo(() => {
		const tasks: TimeplanTask[] = (query.data ?? [])
			.filter((project) => parseIsoDay(project.startDate) !== null
				&& parseIsoDay(project.endDate) !== null
				&& project.endDate >= start && project.startDate <= end)
			.map((project) => ({
				id: project.id,
				name: `${project.projectNr} ${project.name}`.trim(),
				startDate: project.startDate,
				endDate: project.endDate,
			}));
		return flattenTree(tasks, new Set());
	}, [query.data, start, end]);

	if (query.isLoading) {
		return <p role="status" className="p-6 text-sm text-slate-600"><Translate text={localizationConstants.genericLoading} /></p>;
	}
	if (query.isError) {
		return <p role="alert" className="p-6 text-sm text-red-700"><Translate text={localizationConstants.genericError} /></p>;
	}
	return (
		<div className="p-4">
			<div className="mb-4 flex items-center justify-end gap-2">
				<Button type="button" size="icon" variant="outline" aria-label="Previous month" title="Previous month" onClick={() => setMonthOffset((value) => value - 1)}><ChevronLeft className="h-4 w-4" /></Button>
				<time dateTime={start.slice(0, 7)} className="min-w-24 text-center text-sm font-medium text-slate-700">{start.slice(0, 7)}</time>
				<Button type="button" size="icon" variant="outline" aria-label="Next month" title="Next month" onClick={() => setMonthOffset((value) => value + 1)}><ChevronRight className="h-4 w-4" /></Button>
			</div>
			<TimeplanGantt
				readOnly
				timeline={timeline}
				rows={rows}
				collapsed={new Set()}
				onToggle={() => undefined}
			/>
		</div>
	);
}
