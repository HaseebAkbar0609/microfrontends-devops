"use client";

import { ArrowUpDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { InspectionDateItem } from "../../types/warranty.types";
import { VisitDateRowMenu } from "./VisitDateRowMenu";

/** The frame's four column headings, each with its sort affordance. */
const VISIT_DATE_HEADERS: TranslationKeys[] = [
	localizationConstants.dateHeaderLabel,
	localizationConstants.reminderEmailLabel,
	localizationConstants.reminderRuleLabel,
	localizationConstants.documentNameHeader,
];

const CELL_CLASS =
	"px-4 py-3.5 font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap";

export interface VisitDatesCardProps {
	inspectionDates: InspectionDateItem[];
	onAdd: () => void;
	onEdit: (item: InspectionDateItem) => void;
	onDownload: (item: InspectionDateItem) => void;
	onDelete: (id: string) => void;
}

/**
 * Besöksdatum — the visit-date table and its per-row menu.
 *
 * The header cells carry the frame's sort glyph but no handler; sorting this
 * table is not in the frames or the ticket, so the glyph is decorative and
 * hidden from assistive tech rather than announced as a control that does
 * nothing.
 */
export function VisitDatesCard({
	inspectionDates,
	onAdd,
	onEdit,
	onDownload,
	onDelete,
}: VisitDatesCardProps) {
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white w-full shadow-2xs">
			<div className="flex flex-col sm:flex-row gap-2.5 sm:gap-0 sm:h-14 sm:min-h-14 w-full sm:items-center justify-between bg-slate-100 p-3.5 sm:px-6 border-b border-slate-200">
				<h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
					<Translate text={localizationConstants.visitDatesSection} />
				</h2>

				<Button
					type="button"
					onClick={onAdd}
					className="h-8 gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer shadow-none w-full sm:w-auto justify-center"
				>
					<Plus className="h-3.5 w-3.5" />
					<span>
						<Translate text={localizationConstants.addVisitDateButton} />
					</span>
				</Button>
			</div>

			<div className="p-2 sm:p-3">
				<div className="w-full overflow-x-auto relative bg-white">
					<Table className="w-full min-w-[650px] table-auto border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								{VISIT_DATE_HEADERS.map((labelKey) => (
									<TableHead
										key={labelKey}
										className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap"
									>
										<span className="flex items-center gap-1">
											<Translate text={labelKey} />
											<ArrowUpDown
												aria-hidden
												className="h-3.5 w-3.5 text-slate-400 opacity-60"
											/>
										</span>
									</TableHead>
								))}
								<TableHead className="w-12 px-4 py-3.5" />
							</TableRow>
						</TableHeader>

						<TableBody>
							{inspectionDates.map((item) => (
								<TableRow
									key={item.id}
									className="group border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className={CELL_CLASS}>{item.date}</TableCell>
									<TableCell className={CELL_CLASS}>
										{item.reminderEmail}
									</TableCell>
									<TableCell className={CELL_CLASS}>{item.rule}</TableCell>
									<TableCell className="px-4 py-3.5">
										<div className="flex items-center gap-3 min-w-0">
											<PdfFileIcon className="h-11 w-9 shrink-0" />
											<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 truncate min-w-0">
												{item.documentName}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-center whitespace-nowrap">
										<VisitDateRowMenu
											item={item}
											onEdit={onEdit}
											onDownload={onDownload}
											onDelete={onDelete}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

export default VisitDatesCard;
