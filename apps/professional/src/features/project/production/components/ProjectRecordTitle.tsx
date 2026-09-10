"use client";

import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface ProjectRecordTitleProps {
	/** As stored, e.g. `"#5001"`. */
	projectNo: string;
	/** The section being shown, bold after the separator. */
	sectionKey: TranslationKeys;
}

/**
 * The frame's `Projekt nr 5001 / Projektinformation` — record muted, section
 * bold.
 *
 * The stored number already carries a `#`, so it is dropped here rather than
 * printed as "Projekt nr #5001". The list column keeps the `#`, which is where
 * it reads correctly.
 */
export function ProjectRecordTitle({
	projectNo,
	sectionKey,
}: ProjectRecordTitleProps) {
	const t = useTranslate();

	return (
		<span className="flex flex-wrap items-baseline gap-1.5">
			<span className="text-slate-400">
				{t(localizationConstants.projectNumberLabel)}{" "}
				{projectNo.replace(/^#/, "")}
			</span>
			<span aria-hidden className="text-slate-300">
				/
			</span>
			<span className="font-semibold text-slate-900">
				<Translate text={sectionKey} />
			</span>
		</span>
	);
}

export default ProjectRecordTitle;
