"use client";

import { useState, useMemo, useEffect } from "react";
import {
	CloudSun,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	CircleFadingPlus,
	Calendar as CalendarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	CONSTRUCTION_LOG_CONSTANTS,
	type TempUnitKey,
	type WeatherConditionKey,
} from "../constants/constructionLog.constants";
import type { WeatherInfo, ConstructionCalendarDay } from "../types/constructionLog.types";

const GRID_ROWS = 35; // 5 rows × 7 days
const GRID_ROWS_ALT = 42; // 6 rows × 7 days

interface ConstructionLogWeatherViewProps {
	weather: WeatherInfo;
	onChange: (updated: Partial<WeatherInfo>) => void;
	onSave: () => void;
	selectedDate: string;
	onDateSelect: (date: string) => void;
	calendarDays: ConstructionCalendarDay[];
}

export function ConstructionLogWeatherView({
	weather,
	onChange,
	onSave,
	selectedDate,
	onDateSelect,
	calendarDays,
}: ConstructionLogWeatherViewProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(true);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	const monthNames = useMemo(() => {
		const formatter = new Intl.DateTimeFormat(undefined, { month: "long" });
		return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2024, i, 1)));
	}, []);

	const weekDays = useMemo(() => {
		const formatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });
		return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2024, 0, i + 1)));
	}, []);

	const initialDate = useMemo(() => {
		if (!selectedDate) return new Date();
		const [y, m, d] = selectedDate.split("-").map(Number);
		return new Date(y, m - 1, d);
	}, [selectedDate]);

	const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
	const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

	useEffect(() => {
		if (selectedDate) {
			const [y, m] = selectedDate.split("-").map(Number);
			setCurrentYear(y);
			setCurrentMonth(m - 1);
		}
	}, [selectedDate]);

	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
	};

	const daysMatrix = useMemo(() => {
		const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
		const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
		const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

		const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

		for (let i = firstDayIndex - 1; i >= 0; i--) {
			const d = prevMonthTotalDays - i;
			const m = currentMonth === 0 ? 12 : currentMonth;
			const y = currentMonth === 0 ? currentYear - 1 : currentYear;
			const mm = String(m).padStart(2, "0");
			const dd = String(d).padStart(2, "0");
			days.push({
				dayNumber: d,
				dateStr: `${y}-${mm}-${dd}`,
				isCurrentMonth: false,
			});
		}

		for (let d = 1; d <= totalDays; d++) {
			const mm = String(currentMonth + 1).padStart(2, "0");
			const dd = String(d).padStart(2, "0");
			days.push({
				dayNumber: d,
				dateStr: `${currentYear}-${mm}-${dd}`,
				isCurrentMonth: true,
			});
		}

		const remaining = GRID_ROWS - days.length > 0 ? GRID_ROWS - days.length : GRID_ROWS_ALT - days.length;
		for (let d = 1; d <= remaining; d++) {
			const m = currentMonth === 11 ? 1 : currentMonth + 2;
			const y = currentMonth === 11 ? currentYear + 1 : currentYear;
			const mm = String(m).padStart(2, "0");
			const dd = String(d).padStart(2, "0");
			days.push({
				dayNumber: d,
				dateStr: `${y}-${mm}-${dd}`,
				isCurrentMonth: false,
			});
		}

		return days;
	}, [currentYear, currentMonth]);

	const getDayType = (dateStr: string) => {
		if (dateStr === selectedDate) return "selected";
		const match = calendarDays.find((cd) => cd.date === dateStr);
		return match?.type || null;
	};

	return (
		<div className="flex flex-col gap-3">
			<h2 className="text-base sm:text-lg font-semibold text-slate-900">
				<Translate text={localizationConstants.orderDagbokSectionWeather} />
			</h2>

			<div className="grid grid-cols-1 min-[1220px]:grid-cols-12 gap-4 min-[1220px]:gap-6 items-start">
				{/* Left: Weather Form (7 cols) */}
				<div className="min-[1220px]:col-span-7 bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setIsOpen(!isOpen)}
						className="w-full px-6 sm:px-8 py-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-200 h-14 min-h-14 rounded-none"
					>
						<div className="flex items-center gap-2.5">
							<CloudSun className="size-6 text-slate-700 shrink-0" />
							<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokCardWeatherTitle} />
							</span>
						</div>
						{isOpen ? (
							<ChevronUp className="w-4 h-4 text-slate-500" />
						) : (
							<ChevronDown className="w-4 h-4 text-slate-500" />
						)}
					</Button>

					{isOpen && (
						<div className="p-5 flex flex-col gap-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<Label className="text-slate-900 tracking-normal">
										<Translate text={localizationConstants.orderDagbokFieldLocation} />
									</Label>
									<Input
										value={weather.location}
										onChange={(e) => onChange({ location: e.target.value })}
										placeholder={weather.location || t(localizationConstants.orderDagbokPlaceholderSolna)}
										className="h-9 bg-slate-50 border-slate-200 text-xs text-slate-800"
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label className="text-slate-900 tracking-normal">
										<Translate text={localizationConstants.orderDagbokDate} />
									</Label>
									<Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className="w-full h-9 justify-start text-left font-normal border-slate-200 text-xs px-3 bg-white hover:bg-slate-50 text-slate-700 gap-2"
											>
												<CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
												<span>{weather.date || t(localizationConstants.orderDagbokPlaceholderPickDate)}</span>
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-lg z-50"
											align="start"
										>
											<Calendar
												mode="single"
												selected={initialDate}
												onSelect={(d) => {
													if (!d) return;
													const y = d.getFullYear();
													const m = String(d.getMonth() + 1).padStart(2, "0");
													const day = String(d.getDate()).padStart(2, "0");
													onChange({ date: `${y}-${m}-${day}` });
													setIsDatePickerOpen(false);
												}}
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<Label className="text-slate-900 tracking-normal">
										<Translate text={localizationConstants.orderDagbokFieldTemperature} />
									</Label>
									<div className="flex items-center">
										<Select
											value={weather.tempUnit}
											onValueChange={(val) => {
												if (val === CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.CELSIUS || val === CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.FAHRENHEIT) {
													onChange({ tempUnit: val as TempUnitKey });
												}
											}}
										>
											<SelectTrigger 											className="w-28 h-9 rounded-r-none border-r-0 text-xs border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer hover:border-slate-200">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="border border-slate-200 bg-white shadow-md z-50">
												<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.CELSIUS} className="text-xs">
													<Translate text={localizationConstants.orderDagbokWeatherCelsius} />
												</SelectItem>
												<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.FAHRENHEIT} className="text-xs">
													<Translate text={localizationConstants.orderDagbokWeatherFahrenheit} />
												</SelectItem>
											</SelectContent>
										</Select>
										<Input
											type="number"
											min={-50}
											max={60}
											value={weather.temperature}
											onChange={(e) => onChange({ temperature: Number(e.target.value) })}
											className="h-9 flex-1 rounded-l-none border-l-0 text-xs border-slate-200 bg-white text-slate-800 shadow-none cursor-text hover:border-slate-200"
										/>
									</div>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label className="text-slate-900 tracking-normal">
										<Translate text={localizationConstants.orderDagbokFieldWeather} />
									</Label>
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
												onChange({ weatherCondition: val as WeatherConditionKey });
											}
										}}
									>
										<SelectTrigger className="w-full h-9 text-xs border-slate-200 bg-white text-slate-700">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border border-slate-200 bg-white shadow-md z-50">
											<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SUNNY} className="text-xs">
												<Translate text={localizationConstants.orderDagbokWeatherSunny} />
											</SelectItem>
											<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.CLOUDY} className="text-xs">
												<Translate text={localizationConstants.orderDagbokWeatherCloudy} />
											</SelectItem>
											<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.RAIN} className="text-xs">
												<Translate text={localizationConstants.orderDagbokWeatherRain} />
											</SelectItem>
											<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SNOW} className="text-xs">
												<Translate text={localizationConstants.orderDagbokWeatherSnow} />
											</SelectItem>
											<SelectItem value={CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.WINDY} className="text-xs">
												<Translate text={localizationConstants.orderDagbokWeatherWindy} />
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<Label className="text-slate-900 tracking-normal">
										<Translate text={localizationConstants.orderDagbokFieldDescription} />
									</Label>
									<Textarea
										rows={4}
										maxLength={500}
										value={weather.description}
										onChange={(e) => onChange({ description: e.target.value })}
										placeholder={t(localizationConstants.orderDagbokPlaceholderDescription)}
										className="resize-y border-slate-200 text-xs bg-white text-slate-800"
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label className="text-slate-900 tracking-normal">
										<Translate text={localizationConstants.orderDagbokFieldOtherNote} />
									</Label>
									<Textarea
										rows={4}
										maxLength={500}
										value={weather.otherNote}
										onChange={(e) => onChange({ otherNote: e.target.value })}
										placeholder={t(localizationConstants.orderDagbokPlaceholderDescription)}
										className="resize-y border-slate-200 text-xs bg-white text-slate-800"
									/>
								</div>
							</div>

							<div className="pt-1">
								<Button
									type="button"
									onClick={onSave}
									className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-none"
								>
									<CircleFadingPlus className="w-3.5 h-3.5" />
									<span>
										<Translate text={localizationConstants.orderDagbokBtnAdd} />
									</span>
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Right: Calendar & Fotnot (5 cols) */}
				<div className="min-[1220px]:col-span-5 flex flex-col sm:flex-row gap-4 items-start min-w-0">
					<div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex-1 min-w-[260px]">
						<div className="flex items-center justify-between mb-3">
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePrevMonth}
								className="h-7 w-7 text-slate-600 hover:text-slate-900 cursor-pointer border border-slate-200 hover:bg-transparent"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-xs font-semibold text-slate-900">
								{monthNames[currentMonth]}
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleNextMonth}
								className="h-7 w-7 text-slate-600 hover:text-slate-900 cursor-pointer border border-slate-200 hover:bg-transparent"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-7 gap-1 text-center mb-1">
							{weekDays.map((wd) => (
								<span key={wd} className="text-[11px] font-medium text-slate-400">
									{wd}
								</span>
							))}
						</div>

						<div className="grid grid-cols-7 gap-1 text-center">
							{daysMatrix.map(({ dayNumber, dateStr, isCurrentMonth }) => {
								const type = getDayType(dateStr);
								const isSelected = dateStr === selectedDate || type === "selected";
								const isFullTime = type === "full_time";
								const isPartTime = type === "part_time";

								let bgClass = "text-slate-700 hover:bg-slate-100";
								if (!isCurrentMonth) {
									bgClass = "text-slate-300";
								}

								if (isSelected) {
									bgClass = "bg-slate-900 text-white font-semibold hover:bg-slate-800 hover:text-white";
								} else if (isFullTime) {
									bgClass = "bg-orange-900 text-white font-semibold hover:bg-orange-950 hover:text-white";
								} else if (isPartTime) {
									bgClass = "bg-orange-500 text-white font-semibold hover:bg-orange-600 hover:text-white";
								}

								return (
									<Button
										key={dateStr}
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => onDateSelect(dateStr)}
										aria-label={`${dateStr}${type ? `, ${type}` : ""}`}
										className={`h-9 w-9 mx-auto flex items-center justify-center text-xs rounded-md transition-colors cursor-pointer p-0 ${bgClass}`}
									>
										{dayNumber}
									</Button>
								);
							})}
						</div>
					</div>

					<div className="bg-transparent flex flex-col gap-2 px-1 pt-1">
						<span className="text-xs font-semibold text-slate-500">
							<Translate text={localizationConstants.orderDagbokFotnot} />
						</span>
						<div className="flex flex-col gap-1.5 text-xs text-slate-600">
							<div className="flex items-center gap-2">
								<span className="w-3.5 h-3.5 bg-slate-900 rounded-2xs shrink-0" />
								<span className="whitespace-nowrap">
									<Translate text={localizationConstants.orderDagbokLegendSelected} />
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="w-3.5 h-3.5 bg-orange-900 rounded-2xs shrink-0" />
								<span className="whitespace-nowrap">
									<Translate text={localizationConstants.orderDagbokLegendFullTime} />
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="w-3.5 h-3.5 bg-orange-500 rounded-2xs shrink-0" />
								<span className="whitespace-nowrap">
									<Translate text={localizationConstants.orderDagbokLegendPartTime} />
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConstructionLogWeatherView;
