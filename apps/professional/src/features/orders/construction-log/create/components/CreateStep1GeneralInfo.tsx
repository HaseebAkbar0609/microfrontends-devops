"use client";

import { useState, useMemo } from "react";
import {
	LayoutList,
	CloudSun,
	Calendar as CalendarIcon,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONSTRUCTION_LOG_CONSTANTS } from "../../constants/constructionLog.constants";
import type { WeatherInfo } from "../../types/constructionLog.types";
import type { WeatherConditionKey, TempUnitKey } from "../../constants/constructionLog.constants";

const AUTHORS = [
	{ id: "1", name: "Rachel Meyers", handle: "@rachel", avatar: "RM" },
	{ id: "2", name: "Stefan Lundberg", handle: "@stefan", avatar: "SL" },
	{ id: "3", name: "Kalle Svensson", handle: "@kalle", avatar: "KS" },
	{ id: "4", name: "Anna Andersson", handle: "@anna", avatar: "AA" },
] as const;

interface CreateStep1Props {
	date: string;
	author: string;
	weather: WeatherInfo;
	errors: Record<string, string>;
	onDateChange: (date: string) => void;
	onAuthorChange: (author: string) => void;
	onWeatherChange: (patch: Partial<WeatherInfo>) => void;
}

export function CreateStep1GeneralInfo({
	date,
	author,
	weather,
	errors,
	onDateChange,
	onAuthorChange,
	onWeatherChange,
}: CreateStep1Props) {
	const t = useTranslate();
	const [isInfoOpen, setIsInfoOpen] = useState(true);
	const [isWeatherOpen, setIsWeatherOpen] = useState(true);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	const parsedDate = useMemo(() => {
		if (!date) return new Date();
		const [y, m, d] = date.split("-").map(Number);
		return new Date(y, m - 1, d);
	}, [date]);

	const selectedAuthor = AUTHORS.find((a) => a.name === author) || AUTHORS[0];

	return (
		<div className="flex flex-col gap-4">
			{/* Card 1: General Info */}
			<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
				<div
					onClick={() => setIsInfoOpen(!isInfoOpen)}
					className="flex h-14 min-h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 cursor-pointer"
				>
					<div className="flex items-center gap-2.5">
						<LayoutList className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
						<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
							<Translate text={localizationConstants.orderDagbokStepGeneralInfo} />
						</span>
					</div>
					{isInfoOpen ? (
						<ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
					) : (
						<ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
					)}
				</div>

				{isInfoOpen && (
					<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 sm:gap-x-8 text-sm">
						{/* Project */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokProject} />
							</span>
							<Input
								readOnly
								value={CONSTRUCTION_LOG_CONSTANTS.DEFAULT_PROJECT_NAME}
								className="h-10 bg-slate-50 border-slate-200 text-sm text-zinc-500"
							/>
						</div>

						{/* Project no */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokProjectNo} />
							</span>
							<Input
								readOnly
								value={CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID}
								className="h-10 bg-slate-50 border-slate-200 text-sm text-zinc-500"
							/>
						</div>

						{/* Address */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokAddress} />
							</span>
							<Input
								readOnly
								value={CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ADDRESS}
								className="h-10 bg-slate-50 border-slate-200 text-sm text-zinc-500"
							/>
						</div>

						{/* Author - Dropdown */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokAuthor} />
							</span>
							<Select value={selectedAuthor.name} onValueChange={onAuthorChange}>
								<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900 cursor-pointer">
									<div className="flex items-center gap-2 truncate">
										<div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
											{selectedAuthor.avatar}
										</div>
										<span className="font-medium text-slate-900 text-xs truncate">
											{selectedAuthor.name}
										</span>
										<span className="text-slate-400 text-xs">
											{selectedAuthor.handle}
										</span>
									</div>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{AUTHORS.map((a) => (
										<SelectItem key={a.id} value={a.name}>
											<div className="flex items-center gap-2">
												<div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
													{a.avatar}
												</div>
												<span className="font-medium text-slate-900 text-xs">
													{a.name}
												</span>
												<span className="text-slate-400 text-xs">
													{a.handle}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.author && (
								<p className="text-xs text-red-500">{errors.author}</p>
							)}
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 flex items-center gap-0.5">
								<Translate text={localizationConstants.orderDagbokDate} />
								<span className="text-red-500" aria-hidden="true">*</span>
							</span>
							<Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={`h-10 justify-start text-left font-normal border-slate-200 text-sm bg-white hover:bg-slate-50 text-zinc-500 gap-2 ${
											errors.date ? "border-red-500" : ""
										}`}
									>
										<CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
										<span>{date || t(localizationConstants.orderDagbokPlaceholderPickDate)}</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-lg z-50"
									align="start"
								>
									<Calendar
										mode="single"
										selected={parsedDate}
										onSelect={(d) => {
											if (!d) return;
											const yyyy = d.getFullYear();
											const mm = String(d.getMonth() + 1).padStart(2, "0");
											const dd = String(d.getDate()).padStart(2, "0");
											onDateChange(`${yyyy}-${mm}-${dd}`);
											setIsDatePickerOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
							{errors.date && (
								<p className="text-xs text-red-500">{errors.date}</p>
							)}
						</div>

						{/* Construction Day */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokConstructionDay} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 h-10 flex items-center">
								{CONSTRUCTION_LOG_CONSTANTS.DEFAULT_CONSTRUCTION_DAY}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Card 2: Weather */}
			<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
				<div
					onClick={() => setIsWeatherOpen(!isWeatherOpen)}
					className="flex h-14 min-h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 cursor-pointer"
				>
					<div className="flex items-center gap-2.5">
						<CloudSun className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
						<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
							<Translate text={localizationConstants.orderDagbokCardWeatherTitle} />
						</span>
					</div>
					{isWeatherOpen ? (
						<ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
					) : (
						<ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
					)}
				</div>

				{isWeatherOpen && (
					<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 sm:gap-x-8 text-sm">
						{/* Temperature */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokFieldTemperature} />
							</span>
							<div className="flex items-center">
								<Select
									value={weather.tempUnit}
									onValueChange={(val) => {
										if (val === CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.CELSIUS || val === CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.FAHRENHEIT) {
											onWeatherChange({ tempUnit: val as TempUnitKey });
										}
									}}
								>
									<SelectTrigger className="w-28 h-10 rounded-r-none border-r-0 text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border border-slate-200 bg-white shadow-md z-50">
										<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.CELSIUS} className="text-sm">
											<Translate text={localizationConstants.orderDagbokWeatherCelsius} />
										</SelectItem>
										<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.FAHRENHEIT} className="text-sm">
											<Translate text={localizationConstants.orderDagbokWeatherFahrenheit} />
										</SelectItem>
									</SelectContent>
								</Select>
								<Input
									type="number"
									min={-50}
									max={60}
									value={weather.temperature}
									onChange={(e) => onWeatherChange({ temperature: Number(e.target.value) })}
									className="h-10 flex-1 rounded-l-none border-l-0 text-sm border-slate-200 bg-white text-slate-800 shadow-none cursor-text"
								/>
							</div>
						</div>

						{/* Weather Condition */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokFieldWeather} />
							</span>
							<Select
								value={weather.weatherCondition}
								onValueChange={(val) => {
									const validConditions: WeatherConditionKey[] = [
										CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SUNNY,
										CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.CLOUDY,
										CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.RAIN,
										CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SNOW,
										CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.WINDY,
									];
									if (validConditions.includes(val as WeatherConditionKey)) {
										onWeatherChange({ weatherCondition: val as WeatherConditionKey });
									}
								}}
							>
								<SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border border-slate-200 bg-white shadow-md z-50">
									<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SUNNY} className="text-sm">
										<Translate text={localizationConstants.orderDagbokWeatherSunny} />
									</SelectItem>
									<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.CLOUDY} className="text-sm">
										<Translate text={localizationConstants.orderDagbokWeatherCloudy} />
									</SelectItem>
									<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.RAIN} className="text-sm">
										<Translate text={localizationConstants.orderDagbokWeatherRain} />
									</SelectItem>
									<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SNOW} className="text-sm">
										<Translate text={localizationConstants.orderDagbokWeatherSnow} />
									</SelectItem>
									<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.WINDY} className="text-sm">
										<Translate text={localizationConstants.orderDagbokWeatherWindy} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Description */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokFieldDescription} />
							</span>
							<Textarea
								rows={4}
								maxLength={500}
								value={weather.description}
								onChange={(e) => onWeatherChange({ description: e.target.value })}
								placeholder={t(localizationConstants.orderDagbokPlaceholderDescription)}
								className="resize-y border-slate-200 text-sm bg-white text-slate-800"
							/>
						</div>

						{/* Other Note */}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokFieldOtherNote} />
							</span>
							<Textarea
								rows={4}
								maxLength={500}
								value={weather.otherNote}
								onChange={(e) => onWeatherChange({ otherNote: e.target.value })}
								placeholder={t(localizationConstants.orderDagbokPlaceholderDescription)}
								className="resize-y border-slate-200 text-sm bg-white text-slate-800"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}