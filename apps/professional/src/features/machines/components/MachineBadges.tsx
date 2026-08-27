"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type {
	MachineCategory,
	MachineStatus,
	MachineUnit,
} from "../types/machine.types";

/**
 * Solid status pill. Colours come straight from the Figma design tokens:
 * positive #14AE5C, Colors/Orange #FF9500, Colors/Red #FF3B30.
 */
const STATUS_STYLES: Record<
	MachineStatus,
	{ background: string; labelKey: TranslationKeys }
> = {
	active: {
		background: "#14AE5C",
		labelKey: localizationConstants.machineStatusActive,
	},
	repair: {
		background: "#FF9500",
		labelKey: localizationConstants.machineStatusRepair,
	},
	ended: {
		background: "#FF3B30",
		labelKey: localizationConstants.machineStatusEnded,
	},
};

export function MachineStatusBadge({ status }: { status: MachineStatus }) {
	const { background, labelKey } = STATUS_STYLES[status];

	return (
		<span
			className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white drop-shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
			style={{ backgroundColor: background }}
		>
			<Translate text={labelKey} />
		</span>
	);
}

const CATEGORY_LABELS: Record<MachineCategory, TranslationKeys> = {
	hand_tool: localizationConstants.machineCategoryHandTool,
	establishment: localizationConstants.machineCategoryEstablishment,
	concrete: localizationConstants.machineCategoryConcrete,
};

export function MachineCategoryBadge({
	category,
}: {
	category: MachineCategory;
}) {
	return (
		<span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-3 py-0.5 text-xs font-medium text-slate-700">
			<Translate text={CATEGORY_LABELS[category]} />
		</span>
	);
}

const UNIT_LABELS: Record<MachineUnit, TranslationKeys> = {
	hour: localizationConstants.machineUnitHour,
	day: localizationConstants.machineUnitDay,
	week: localizationConstants.machineUnitWeek,
	month: localizationConstants.machineUnitMonth,
};

export function MachineUnitLabel({ unit }: { unit: MachineUnit }) {
	return <Translate text={UNIT_LABELS[unit]} />;
}
