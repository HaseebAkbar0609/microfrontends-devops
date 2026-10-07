"use client";

import type { ReactNode } from "react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** Marks an optional field: " (Valfritt)" / " (Optional)" after its label. Required fields stay unmarked. */
export function OptionalLabelSuffix() {
	return (
		<span>
			{" "}
			<Translate text={localizationConstants.optionalFieldLabelSuffix} />
		</span>
	);
}

/** For flex labels (FormLabel has a gap): keeps label and suffix in one inline run so the suffix sits one space away. */
export function withOptionalSuffix(label: ReactNode, optional?: boolean) {
	if (!optional) return label;
	return (
		<span>
			{label}
			<OptionalLabelSuffix />
		</span>
	);
}
