"use client";

import { CloudSun } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import localizationConstants from "@/utils/translation/constants";
import { RecordCollapsibleCard } from "../../../components/RecordCollapsibleCard";
import { WeatherReadingFields } from "../../components/weather/WeatherReadingFields";
import type { DiaryWizardValues } from "../wizardSchema";

/**
 * Step 1's "Det lokala vädret". The fields sit on the wizard's own form under
 * `weather`, so what is typed survives a step change and is saved with the day.
 * Plats and Datum are left out — the frame does not draw them here, and the day
 * is picked in the card above.
 */
export function WizardWeatherCard({ form }: { form: UseFormReturn<DiaryWizardValues> }) {
	const unit = useWatch({ control: form.control, name: "weather.unit" });

	return (
		<RecordCollapsibleCard titleKey={localizationConstants.projectDiaryCardWeather} icon={CloudSun}>
			<WeatherReadingFields control={form.control} prefix="weather." unit={unit} context={null} />
		</RecordCollapsibleCard>
	);
}

export default WizardWeatherCard;
