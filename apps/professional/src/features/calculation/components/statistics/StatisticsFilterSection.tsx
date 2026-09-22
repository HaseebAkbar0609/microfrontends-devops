"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MultiTagSelect } from "./MultiTagSelect";

interface StatisticsFilterSectionProps {
	bestellare: string;
	onBestellareChange: (val: string) => void;
	bestellareOptions: string[];
	selectedKategori: string[];
	onToggleKategori: (val: string) => void;
	kategoriOptions: string[];
	selectedTyp: string[];
	onToggleTyp: (val: string) => void;
	typOptions: string[];
	entreprenadform: string;
	onEntreprenadformChange: (val: string) => void;
	entreprenadformOptions: string[];
	startDate: string;
	onStartDateChange: (val: string) => void;
	startDateOptions?: string[];
	endDate: string;
	onEndDateChange: (val: string) => void;
	endDateOptions?: string[];
	onApply: () => void;
	onReset: () => void;
}

export function StatisticsFilterSection({
	bestellare,
	onBestellareChange,
	bestellareOptions,
	selectedKategori,
	onToggleKategori,
	kategoriOptions,
	selectedTyp,
	onToggleTyp,
	typOptions,
	entreprenadform,
	onEntreprenadformChange,
	entreprenadformOptions,
	startDate,
	onStartDateChange,
	startDateOptions = [],
	endDate,
	onEndDateChange,
	endDateOptions = [],
	onApply,
	onReset,
}: StatisticsFilterSectionProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4">
			{/* Section Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.calcStatFilterTitle} />
				</h2>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onReset}
					className="h-auto p-0 flex cursor-pointer items-center gap-1 text-sm font-normal text-slate-700 hover:text-slate-950 hover:bg-transparent"
				>
					<Translate text={localizationConstants.calcStatReset} />
					<X size={14} aria-hidden />
				</Button>
			</div>

			{/* Filter Form Controls */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* 1. Beställare */}
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs font-medium text-slate-600 mb-0">
						<Translate text={localizationConstants.calcStatBestellare} />
					</Label>
					<Select value={bestellare} onValueChange={onBestellareChange}>
						<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0 [&_svg]:text-slate-950 [&_svg]:opacity-100 cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.calcStatBestellare)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{bestellareOptions.map((opt) => (
								<SelectItem key={opt} value={opt} className="cursor-pointer text-sm">
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 2. Kategori */}
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs font-medium text-slate-600 mb-0">
						<Translate text={localizationConstants.category} />
					</Label>
					<MultiTagSelect
						placeholder={t(localizationConstants.category)}
						options={kategoriOptions}
						selected={selectedKategori}
						onToggle={onToggleKategori}
						className="w-full"
					/>
				</div>

				{/* 3. Typ */}
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs font-medium text-slate-600 mb-0">
						<Translate text={localizationConstants.calcProType} />
					</Label>
					<MultiTagSelect
						placeholder={t(localizationConstants.calcProType)}
						options={typOptions}
						selected={selectedTyp}
						onToggle={onToggleTyp}
						className="w-full"
					/>
				</div>

				{/* 4. Entreprenadform */}
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs font-medium text-slate-600 mb-0">
						<Translate text={localizationConstants.calcStatEntreprenadform} />
					</Label>
					<Select value={entreprenadform} onValueChange={onEntreprenadformChange}>
						<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0 [&_svg]:text-slate-950 [&_svg]:opacity-100 cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.calcStatEntreprenadform)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{entreprenadformOptions.map((opt) => (
								<SelectItem key={opt} value={opt} className="cursor-pointer text-sm">
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 5. Start datum */}
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs font-medium text-slate-600 mb-0">
						<Translate text={localizationConstants.calcStatStartDate} />
					</Label>
					<Select value={startDate} onValueChange={onStartDateChange}>
						<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0 [&_svg]:text-slate-950 [&_svg]:opacity-100 cursor-pointer">
							<SelectValue placeholder={startDate} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{startDateOptions.map((dateOpt) => (
								<SelectItem key={dateOpt} value={dateOpt} className="cursor-pointer text-sm">
									{dateOpt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 6. Slut datum */}
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs font-medium text-slate-600 mb-0">
						<Translate text={localizationConstants.calcStatEndDate} />
					</Label>
					<Select value={endDate} onValueChange={onEndDateChange}>
						<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0 [&_svg]:text-slate-950 [&_svg]:opacity-100 cursor-pointer">
							<SelectValue placeholder={endDate} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{endDateOptions.map((dateOpt) => (
								<SelectItem key={dateOpt} value={dateOpt} className="cursor-pointer text-sm">
									{dateOpt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Empty 7th column for responsive balance on desktop */}
				<div className="hidden lg:block" />

				{/* 8. Välj Button */}
				<div className="flex items-end justify-end">
					<Button
						type="button"
						size="sm"
						onClick={onApply}
						className="h-10 w-full sm:w-auto px-8 cursor-pointer rounded-md bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800 shadow-none"
					>
						<Translate text={localizationConstants.calcStatApply} />
					</Button>
				</div>
			</div>
		</div>
	);
}
