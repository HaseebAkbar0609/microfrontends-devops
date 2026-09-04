"use client";

import { useRef, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

type DefaultSettings = {
	markupByCalc: boolean;
	baseCosts: boolean;
	aPriceList: boolean;
};

type IndustrySettingRow = {
	id: string;
	label: string;
	checked: boolean;
};

const CATEGORY_ITEMS = [
	{ id: "cat-1", label: "Cleaning industry" },
	{ id: "cat-2", label: "Cleaning industry" },
];

const INDUSTRY_TYPES = ["Cleaning industry", "Construction", "Manufacturing"];

const INITIAL_SETTINGS: DefaultSettings = {
	markupByCalc: false,
	baseCosts: true,
	aPriceList: true,
};

const INITIAL_INDUSTRY_ROWS: IndustrySettingRow[] = [
	{ id: "irow-1", label: "Vacant", checked: true },
	{ id: "irow-2", label: "Vacant", checked: true },
	{ id: "irow-3", label: "Vacant", checked: false },
];

const CHECKBOX_CLASS =
	"border-gray-900 data-[state=checked]:bg-neutral-950 data-[state=checked]:border-neutral-950 data-[state=checked]:text-white";

interface SectionHeaderProps {
	titleKey: string;
	action?: React.ReactNode;
}

function SectionHeader({ titleKey, action }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between bg-slate-200 px-4 py-3">
			<span className="text-base font-medium tracking-normal text-zinc-950">
				<Translate text={titleKey} />
			</span>
			{action}
		</div>
	);
}

function ActiveBadge({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
			{label}
		</span>
	);
}

export function CalculationProContent() {
	const t = useTranslate();
	const idCounterRef = useRef(100);

	const [settings, setSettings] = useState<DefaultSettings>(INITIAL_SETTINGS);
	const [savedSettings, setSavedSettings] =
		useState<DefaultSettings>(INITIAL_SETTINGS);

	const [selectedType, setSelectedType] = useState(INDUSTRY_TYPES[0]);
	const [industryRows, setIndustryRows] = useState<IndustrySettingRow[]>(
		INITIAL_INDUSTRY_ROWS,
	);
	const [savedIndustryRows, setSavedIndustryRows] = useState<
		IndustrySettingRow[]
	>(INITIAL_INDUSTRY_ROWS);

	function handleToggleSetting(field: keyof DefaultSettings) {
		setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
	}

	function handleToggleRow(id: string) {
		setIndustryRows((prev) =>
			prev.map((row) =>
				row.id === id ? { ...row, checked: !row.checked } : row,
			),
		);
	}

	function handleDeleteRow(id: string) {
		setIndustryRows((prev) => prev.filter((row) => row.id !== id));
	}

	function handleAddRow() {
		const newRow: IndustrySettingRow = {
			id: `irow-${++idCounterRef.current}`,
			label: t(localizationConstants.calcProVacant),
			checked: false,
		};
		setIndustryRows((prev) => [...prev, newRow]);
	}

	function handleSave() {
		setSavedSettings(settings);
		setSavedIndustryRows(industryRows);
	}

	function handleCancel() {
		setSettings(savedSettings);
		setIndustryRows(savedIndustryRows);
	}

	const activeLabel = t(localizationConstants.activeLabel);

	return (
		<div className="flex flex-1 flex-col gap-4">
			{/* Industry category */}
			<div className="overflow-hidden rounded-md border border-slate-200">
				<SectionHeader
					titleKey={localizationConstants.calcProIndustryCategory}
					action={
						<Button
							size="sm"
							className="h-9 cursor-pointer gap-1.5 bg-neutral-950 text-xs text-white hover:bg-neutral-800"
						>
							<Plus size={12} aria-hidden />
							{t(localizationConstants.calcProPurchaseLicense)}
						</Button>
					}
				/>
				<div className="grid grid-cols-2 divide-x divide-slate-200 bg-white">
					{CATEGORY_ITEMS.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between px-4 py-4"
						>
							<span className="text-sm font-medium text-slate-900">
								{item.label}
							</span>
							<ActiveBadge label={activeLabel} />
						</div>
					))}
				</div>
			</div>

			{/* Default settings */}
			<div className="overflow-hidden rounded-md border border-slate-200">
				<SectionHeader
					titleKey={localizationConstants.calcProDefaultSettings}
				/>
				<div className="flex flex-col gap-2 bg-white px-4 py-4">
					<label className="flex w-133.75 max-w-full cursor-pointer items-center gap-3 rounded-md border border-gray-300 px-3 py-2.5 hover:bg-slate-50">
						<Checkbox
							checked={settings.markupByCalc}
							onCheckedChange={() =>
								handleToggleSetting("markupByCalc")
							}
							className={CHECKBOX_CLASS}
						/>
						<span className="text-sm text-slate-700">
							{t(localizationConstants.calcProMarkupByCalc)}
						</span>
					</label>
					<label className="flex w-133.75 max-w-full cursor-pointer items-center gap-3 rounded-md border border-gray-300 px-3 py-2.5 hover:bg-slate-50">
						<Checkbox
							checked={settings.baseCosts}
							onCheckedChange={() =>
								handleToggleSetting("baseCosts")
							}
							className={CHECKBOX_CLASS}
						/>
						<span className="text-sm text-slate-700">
							{t(localizationConstants.calcBaseCosts)}
						</span>
					</label>
					<label className="flex w-133.75 max-w-full cursor-pointer items-center gap-3 rounded-md border border-gray-300 px-3 py-2.5 hover:bg-slate-50">
						<Checkbox
							checked={settings.aPriceList}
							onCheckedChange={() =>
								handleToggleSetting("aPriceList")
							}
							className={CHECKBOX_CLASS}
						/>
						<span className="text-sm text-slate-700">
							{t(localizationConstants.calcProAPriceList)}
						</span>
					</label>
				</div>
			</div>

			{/* Industry settings */}
			<div className="overflow-hidden rounded-md border border-slate-200">
				<SectionHeader
					titleKey={localizationConstants.calcProIndustrySettings}
				/>
				<div className="bg-white px-4 pt-4 pb-3">
					<label className="mb-1.5 block text-sm font-medium text-zinc-950">
						{t(localizationConstants.calcProType)}
					</label>
					<Select
						value={selectedType}
						onValueChange={setSelectedType}
					>
						<SelectTrigger className="h-9 w-133.75 max-w-full border-gray-300 text-sm [&_svg]:opacity-100 [&_svg]:text-gray-500!">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{INDUSTRY_TYPES.map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-2 bg-white px-4 pb-3">
					{industryRows.map((row) => (
						<div key={row.id} className="flex items-center gap-3">
							<label className="flex w-133.75 max-w-full cursor-pointer items-center gap-3 rounded-md border border-gray-300 px-3 py-2.5 hover:bg-slate-50">
								<Checkbox
									checked={row.checked}
									onCheckedChange={() =>
										handleToggleRow(row.id)
									}
									className={CHECKBOX_CLASS}
								/>
								<span className="flex-1 text-sm text-slate-700">
									{row.label}
								</span>
							</label>
							<button
								type="button"
								onClick={() => handleDeleteRow(row.id)}
								className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-slate-100 hover:text-gray-600"
								aria-label={`Delete ${row.label}`}
							>
								<Trash2 aria-hidden size={17} />
							</button>
						</div>
					))}
				</div>

				<div className="bg-white  px-4 pt-1 pb-3 ">
					<Button
						variant="outline"
						size="sm"
						onClick={handleAddRow}
						className="h-9 w-[561px] max-w-full cursor-pointer gap-1.5 border-dotted border-slate-200 bg-slate-200/28 text-sm font-medium text-slate-900"
					>
						<Plus size={13} aria-hidden />
						{t(localizationConstants.calcNewRow)}
					</Button>
				</div>

				<div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3">
					<Button
						variant="outline"
						onClick={handleCancel}
						className="h-10 w-24 cursor-pointer border-none bg-bg-secondary px-5 text-sm font-medium text-zinc-950 shadow-none hover:bg-bg-secondary/80"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						onClick={handleSave}
						className="h-10 w-24 cursor-pointer bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800"
					>
						<Save size={16} aria-hidden className="text-zinc-50" />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</div>
		</div>
	);
}
