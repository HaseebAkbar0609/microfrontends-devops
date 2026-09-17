"use client";

import { Lock } from "lucide-react";

import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useDiaryEditor } from "../form/useDiaryEditor";
import type { DiaryProjectFacts } from "../hooks/useDiaryProject";
import type { ProjectDiaryState } from "../hooks/useProjectDiary";
import type { DiaryRowKind, ProjectDiary } from "../types";
import { DiaryDetailsSection } from "./details/DiaryDetailsSection";
import { DiaryDialogs } from "./DiaryDialogs";
import { DiaryFooter } from "./DiaryFooter";
import { DiarySignatures } from "./signatures/DiarySignatures";
import { DiaryMonthCalendar, type WorkdayKind } from "./weather/DiaryMonthCalendar";
import { WeatherCard } from "./weather/WeatherCard";

export interface DiaryEditorProps {
	diary: ProjectDiary;
	facts: DiaryProjectFacts;
	state: ProjectDiaryState;
	query: string;
	section: DiaryRowKind | null;
	kinds: ReadonlyMap<string, WorkdayKind>;
}

/**
 * One day's diary, top to bottom as the frame draws it: Väderinformation with
 * the calendar, Detaljerad information, Bekräfta, and a draft's footer.
 *
 * The form is a provider, not a `<form>` element: the weather fields and the
 * row dialogs have forms of their own, and Enter in a field should never save
 * the whole diary. The footer's buttons call the flows directly.
 */
export function DiaryEditor({ diary, facts, state, query, section, kinds }: DiaryEditorProps) {
	const editor = useDiaryEditor(diary, state);

	return (
		<Form {...editor.form}>
			<div className="flex flex-col gap-8">
				{editor.locked && (
					<p role="status" className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
						<Lock className="h-4 w-4 shrink-0" aria-hidden />
						<Translate text={localizationConstants.projectDiaryLocked} />
					</p>
				)}

				<section aria-labelledby="diary-weather-heading" className="flex flex-col gap-4">
					<h2 id="diary-weather-heading" className="text-xl font-semibold text-slate-900">
						<Translate text={localizationConstants.projectDiarySectionWeather} />
					</h2>
					<div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
						<WeatherCard editor={editor} city={facts.city} date={diary.date} />
						<DiaryMonthCalendar selectedDate={diary.date} kinds={kinds} onSelect={state.selectDate} />
					</div>
				</section>

				<DiaryDetailsSection editor={editor} query={query} section={section} />

				<DiarySignatures
					diary={diary}
					signers={facts.signers}
					dirty={editor.dirty && !editor.locked}
					onSign={(role) => state.sign(diary.id, role)}
				/>

				{!editor.locked && (
					<DiaryFooter
						dirty={editor.dirty}
						onCancel={editor.requestDiscard}
						onSaveDraft={() => void editor.requestSave()}
						onPublish={() => void editor.requestPublish()}
					/>
				)}
			</div>
			<DiaryDialogs editor={editor} />
		</Form>
	);
}

export default DiaryEditor;
