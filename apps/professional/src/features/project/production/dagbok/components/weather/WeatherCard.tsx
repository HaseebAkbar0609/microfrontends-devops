"use client";

import { CirclePlus, CloudSun } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { generateTempId } from "@/lib/tempId";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { RecordCollapsibleCard } from "../../../components/RecordCollapsibleCard";
import type { DiaryEditorState } from "../../form/useDiaryEditor";
import {
	EMPTY_WEATHER_READING,
	toWeatherReading,
	weatherReadingSchema,
	type WeatherReadingDraft,
} from "../../form/weatherReadingSchema";
import { DIARY_LIMITS } from "../../projectDiary.config";
import { WeatherReadingFields } from "./WeatherReadingFields";
import { WeatherReadingList } from "./WeatherReadingList";

export interface WeatherCardProps {
	editor: DiaryEditorState;
	city: string;
	date: string;
}

/**
 * "Det lokala vädret". While the diary is a draft, the fields take one reading
 * and "Lägg till ny" adds it to the day's list, then clears them for the next —
 * keeping the unit. The readings are saved with the diary. A published diary
 * shows its readings only.
 *
 * The fields are not a `<form>`: they sit inside the diary's, and a nested form
 * is invalid HTML. The button runs the reading's own validation instead.
 */
export function WeatherCard({ editor, city, date }: WeatherCardProps) {
	const readingForm = useForm<WeatherReadingDraft>({
		resolver: zodResolver(weatherReadingSchema) as Resolver<WeatherReadingDraft>,
		defaultValues: EMPTY_WEATHER_READING,
		mode: "onTouched",
	});
	const readings = useWatch({ control: editor.form.control, name: "weather" });
	const full = readings.length >= DIARY_LIMITS.rows;

	const add = readingForm.handleSubmit((draft) => {
		editor.addReading(toWeatherReading(generateTempId(), draft));
		readingForm.reset({ ...EMPTY_WEATHER_READING, unit: draft.unit });
	});

	return (
		<RecordCollapsibleCard titleKey={localizationConstants.projectDiaryCardWeather} icon={CloudSun} contentClassName="flex flex-col gap-4">
			{!editor.locked && (
				<Form {...readingForm}>
					<WeatherReadingFields form={readingForm} city={city} date={date} />
					<div>
						<Button
							type="button"
							onClick={() => void add()}
							disabled={full}
							className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
						>
							<CirclePlus className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.projectDiaryAddReading} />
						</Button>
					</div>
				</Form>
			)}
			<WeatherReadingList readings={readings} locked={editor.locked} onRemove={editor.removeReading} />
		</RecordCollapsibleCard>
	);
}

export default WeatherCard;
