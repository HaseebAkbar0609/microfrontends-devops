"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DIARY_ROW_KINDS } from "../../projectDiary.config";
import type { DiaryRowByKind, DiaryRowKind } from "../../types";
import type { DiaryWizardValues } from "../wizardSchema";
import { WizardRowCard } from "./WizardRowCard";

export interface WizardRowsSectionProps {
	form: UseFormReturn<DiaryWizardValues>;
	onPut: <K extends DiaryRowKind>(kind: K, row: DiaryRowByKind[K]) => void;
	onRemove: (kind: DiaryRowKind, id: string) => void;
}

/** Step 2's "Detaljerad information": the four cards, one under the other as the frame draws them. */
export function WizardRowsSection({ form, onPut, onRemove }: WizardRowsSectionProps) {
	const [workforce, works, machines, deviations] = useWatch({
		control: form.control,
		name: ["workforce", "works", "machines", "deviations"],
	});
	const rowsOf: { [K in DiaryRowKind]: DiaryRowByKind[K][] } = { workforce, works, machines, deviations };

	return (
		<section aria-labelledby="diary-wizard-details" className="flex flex-col gap-4">
			<h2 id="diary-wizard-details" className="text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.projectDiarySectionDetails} />
			</h2>
			{DIARY_ROW_KINDS.map((kind) => (
				<WizardRowCard
					key={kind}
					kind={kind}
					rows={rowsOf[kind] as DiaryRowByKind[typeof kind][]}
					onPut={(row) => onPut(kind, row as never)}
					onRemove={(id) => onRemove(kind, id)}
				/>
			))}
		</section>
	);
}

export default WizardRowsSection;
