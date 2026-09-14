"use client";

import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface DesignRecordTitleProps {
	projektNr: string;
	sectionKey: TranslationKeys;
}

export function DesignRecordTitle({
	projektNr,
	sectionKey,
}: DesignRecordTitleProps) {
	const t = useTranslate();

	return (
		<span className="flex flex-wrap items-baseline gap-1.5">
			<span className="text-slate-400">
				{t(localizationConstants.designProjektNrLabel)} {projektNr}
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

export default DesignRecordTitle;
