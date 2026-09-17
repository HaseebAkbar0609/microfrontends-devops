"use client";

import { CirclePlus, X } from "lucide-react";

import type { QAThreadStatus } from "@/components/common/QAThreadColumn";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/** The Figma "Quick Filter": a dashed chip with its selections inline. */
const CHIP_CLASS =
	"flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-200 bg-white px-3 text-xs leading-5 font-medium text-slate-950 shadow-none transition-colors hover:border-slate-300 hover:bg-slate-50";

export interface QAThreadStatusOption {
	value: QAThreadStatus;
	label: TranslationKeys;
}

export interface QAThreadFilterChipsLabels {
	company: TranslationKeys;
	role: TranslationKeys;
	status: TranslationKeys;
	reset: TranslationKeys;
}

export interface QAThreadFilterChipsProps {
	companies: string[];
	companyOptions: string[];
	onToggleCompany: (value: string) => void;
	roles: string[];
	roleOptions: string[];
	onToggleRole: (value: string) => void;
	/**
	 * How a role value reads. Roles are stored as the chip value drawn on the
	 * card ("UE", "Beställare"), so a board translates them here; without it
	 * the raw value is shown.
	 */
	formatRole?: (value: string) => string;
	statuses: QAThreadStatus[];
	statusOptions: QAThreadStatusOption[];
	onToggleStatus: (value: QAThreadStatus) => void;
	onReset: () => void;
	hasFilters: boolean;
	labels: QAThreadFilterChipsLabels;
}

function GroupSeparator() {
	return <div aria-hidden className="h-5 w-px shrink-0 bg-slate-200" />;
}

/** The chip's selected values, shown inline as the frame draws them. */
function SelectedValues({ values }: { values: string[] }) {
	if (values.length === 0) return null;

	return (
		<>
			<div aria-hidden className="h-4 w-px shrink-0 bg-slate-200" />
			<div className="flex items-center gap-1">
				{values.map((value) => (
					<span
						key={value}
						className="rounded-sm bg-slate-100 px-1 py-0.5 text-xs leading-4 font-normal text-slate-900"
					>
						{value}
					</span>
				))}
			</div>
		</>
	);
}

interface ChipProps {
	label: string;
	options: { value: string; label: string }[];
	selected: string[];
	onToggle: (value: string) => void;
}

function Chip({ label, options, selected, onToggle }: ChipProps) {
	const labelOf = new Map(options.map((option) => [option.value, option.label]));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={CHIP_CLASS}>
					<CirclePlus size={16} className="shrink-0" aria-hidden />
					<span>{label}</span>
					<SelectedValues
						values={selected.map((value) => labelOf.get(value) ?? value)}
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-52 rounded-lg border border-slate-200 bg-white shadow-lg"
			>
				<DropdownMenuLabel className="text-xs font-semibold text-slate-500">
					{label}
				</DropdownMenuLabel>
				{options.map((option) => (
					<DropdownMenuCheckboxItem
						key={option.value}
						checked={selected.includes(option.value)}
						onCheckedChange={() => onToggle(option.value)}
						className="cursor-pointer text-xs"
					>
						{option.label}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/**
 * Företag / Kund / Status chips and Reset, under a Fråga/Svar board's search.
 *
 * Lifted out of the purchase board so the project record's board draws the same
 * row. Every chip narrows the list — including Status, which is a bare
 * decorative button on the b2b board this was first modelled on.
 */
export function QAThreadFilterChips({
	companies,
	companyOptions,
	onToggleCompany,
	roles,
	roleOptions,
	onToggleRole,
	formatRole,
	statuses,
	statusOptions,
	onToggleStatus,
	onReset,
	hasFilters,
	labels,
}: QAThreadFilterChipsProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Chip
				label={t(labels.company)}
				options={companyOptions.map((value) => ({ value, label: value }))}
				selected={companies}
				onToggle={onToggleCompany}
			/>

			<GroupSeparator />

			<Chip
				label={t(labels.role)}
				options={roleOptions.map((value) => ({
					value,
					label: formatRole ? formatRole(value) : value,
				}))}
				selected={roles}
				onToggle={onToggleRole}
			/>

			<GroupSeparator />

			<Chip
				label={t(labels.status)}
				options={statusOptions.map((option) => ({
					value: option.value,
					label: t(option.label),
				}))}
				selected={statuses}
				onToggle={(value) => onToggleStatus(value as QAThreadStatus)}
			/>

			<GroupSeparator />

			<Button
				variant="ghost"
				onClick={onReset}
				disabled={!hasFilters}
				className="flex h-9 min-w-16 cursor-pointer items-center gap-1 px-2 text-sm leading-6 font-medium text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-default disabled:opacity-40"
			>
				<span>{t(labels.reset)}</span>
				<X size={16} className="shrink-0" aria-hidden />
			</Button>
		</div>
	);
}

export default QAThreadFilterChips;
