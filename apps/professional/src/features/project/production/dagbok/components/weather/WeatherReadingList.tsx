"use client";

import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../../components/RowActionMenu";
import { TEMPERATURE_UNIT_SYMBOLS, WEATHER_CONDITION_LABELS } from "../../projectDiary.config";
import type { WeatherReading } from "../../types";

const HEAD = "h-10 px-3 text-sm font-medium whitespace-nowrap text-slate-500";
const CELL = "px-3 py-2 text-sm text-slate-900";

export interface WeatherReadingListProps {
	readings: WeatherReading[];
	locked: boolean;
	onRemove: (id: string) => void;
}

/** The day's readings, in the order they were added, each with ⋮ Radera while the diary is a draft. */
export function WeatherReadingList({ readings, locked, onRemove }: WeatherReadingListProps) {
	const t = useTranslate();
	const { i18n } = useTranslation();
	const number = new Intl.NumberFormat(i18n.language === "en" ? "en-GB" : "sv-SE", { maximumFractionDigits: 1 });

	if (readings.length === 0) {
		return (
			<p className="text-sm text-slate-500">
				<Translate text={localizationConstants.projectDiaryReadingsEmpty} />
			</p>
		);
	}

	return (
		<div className="w-full overflow-x-auto rounded-md border border-slate-200">
			<Table className="min-w-[32rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className={HEAD}><Translate text={localizationConstants.projectDiaryFieldTemperature} /></TableHead>
						<TableHead className={HEAD}><Translate text={localizationConstants.projectDiaryFieldCondition} /></TableHead>
						<TableHead className={HEAD}><Translate text={localizationConstants.projectDiaryFieldDescription} /></TableHead>
						<TableHead className={HEAD}><Translate text={localizationConstants.projectDiaryFieldOtherNote} /></TableHead>
						{!locked && <TableHead className="w-12" />}
					</TableRow>
				</TableHeader>
				<TableBody>
					{readings.map((reading) => {
						const temperature = `${number.format(reading.temperature)} ${TEMPERATURE_UNIT_SYMBOLS[reading.unit]}`;
						const condition = t(WEATHER_CONDITION_LABELS[reading.condition]);
						return (
							<TableRow key={reading.id}>
								<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>{temperature}</TableCell>
								<TableCell className={CELL}>{condition}</TableCell>
								<TableCell className={`${CELL} whitespace-normal`}>{reading.description || "—"}</TableCell>
								<TableCell className={`${CELL} whitespace-normal`}>{reading.otherNote || "—"}</TableCell>
								{!locked && (
									<TableCell className="w-12 px-2 py-2 text-right">
										<RowActionMenu ariaLabel={t(localizationConstants.projectDiaryRowActions, { label: `${temperature} ${condition}` })}>
											<RowMenuAction icon={Trash2} labelKey={localizationConstants.projectDiaryRowDelete} reasonKey={null} destructive onSelect={() => onRemove(reading.id)} />
										</RowActionMenu>
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default WeatherReadingList;
