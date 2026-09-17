"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../../components/ProjectRowsToolbar";
import { workdayKind } from "../diaryDates";
import type { DiaryProjectFacts } from "../hooks/useDiaryProject";
import { useProjectDiary } from "../hooks/useProjectDiary";
import { DIARY_ROW_KIND_META, DIARY_ROW_KINDS } from "../projectDiary.config";
import type { DiaryRowKind } from "../types";
import { DiaryEditor } from "./DiaryEditor";
import { DiaryRecordBar } from "./DiaryRecordBar";
import { NewDiaryDialog } from "./NewDiaryDialog";
import { DiaryMonthCalendar, type WorkdayKind } from "./weather/DiaryMonthCalendar";

const PRIMARY = "h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800";

function EmptyCard({ titleKey, descriptionKey, values, action }: { titleKey: string; descriptionKey: string; values?: Record<string, string>; action?: React.ReactNode }) {
	return (
		<div className="flex flex-col items-start gap-3 rounded-lg border border-slate-200 bg-white p-6">
			<p className="text-base font-medium text-slate-900"><Translate text={titleKey} values={values} /></p>
			<p className="text-sm text-slate-500"><Translate text={descriptionKey} /></p>
			{action}
		</div>
	);
}

/**
 * Everything under the header: Sök, Filter, print and Ny dagbok, the record
 * bar, and the chosen day — its diary, or a way to start one. Reads the day
 * from the URL, so it renders inside the page's Suspense boundary.
 */
export function DiaryWorkspace({ projectId, facts }: { projectId: string; facts: DiaryProjectFacts }) {
	const t = useTranslate();
	const state = useProjectDiary(projectId, facts);
	const [query, setQuery] = useState("");
	const [section, setSection] = useState<DiaryRowKind | null>(null);
	const [creating, setCreating] = useState(false);

	const filterOptions = DIARY_ROW_KINDS.map((kind) => ({ value: kind, label: t(DIARY_ROW_KIND_META[kind].filterKey) }));
	const kinds = useMemo(
		() => new Map(state.diaries.flatMap((diary): [string, WorkdayKind][] => {
			const kind = workdayKind(diary.workforce);
			return kind ? [[diary.date, kind]] : [];
		})),
		[state.diaries],
	);

	return (
		<div className="flex flex-1 flex-col gap-6 px-4 pt-4 sm:px-6">
			<ProjectRowsToolbar
				search={query}
				onSearchChange={setQuery}
				filter={section}
				onFilterChange={(value) => setSection(value as DiaryRowKind | null)}
				filterOptions={filterOptions}
				action={
					<Button type="button" onClick={() => setCreating(true)} className={PRIMARY}>
						<Plus className="h-4 w-4 shrink-0" aria-hidden />
						<Translate text={localizationConstants.projectDiaryNewDiary} />
					</Button>
				}
			/>

			{state.selectedDate === null ? (
				<EmptyCard titleKey={localizationConstants.projectDiaryEmpty} descriptionKey={localizationConstants.projectDiaryEmptyDesc} />
			) : (
				<>
					<DiaryRecordBar facts={facts} selectedDate={state.selectedDate} status={state.diary?.status ?? null} onSelectDate={state.selectDate} />
					{state.diary ? (
						<DiaryEditor key={state.diary.id} diary={state.diary} facts={facts} state={state} query={query} section={section} kinds={kinds} />
					) : (
						<div className="grid grid-cols-1 items-start gap-4 pb-8 xl:grid-cols-[minmax(0,1fr)_auto]">
							<EmptyCard
								titleKey={localizationConstants.projectDiaryNoDiaryForDay}
								descriptionKey={localizationConstants.projectDiaryNoDiaryForDayDesc}
								values={{ date: state.selectedDate }}
								action={
									<Button type="button" onClick={() => state.create(state.selectedDate as string)} className={PRIMARY}>
										<CalendarPlus className="h-4 w-4 shrink-0" aria-hidden />
										<Translate text={localizationConstants.projectDiaryCreateForDay} />
									</Button>
								}
							/>
							<DiaryMonthCalendar selectedDate={state.selectedDate} kinds={kinds} onSelect={state.selectDate} />
						</div>
					)}
				</>
			)}

			{creating && (
				<NewDiaryDialog
					initialDate={state.selectedDate ?? ""}
					takenDates={state.takenDates}
					onCreate={state.create}
					onClose={() => setCreating(false)}
				/>
			)}
		</div>
	);
}

export default DiaryWorkspace;
