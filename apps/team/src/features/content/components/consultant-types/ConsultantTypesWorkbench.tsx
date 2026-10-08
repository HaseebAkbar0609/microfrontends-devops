"use client";

import { useConsultantTypeForm } from "../../hooks/useConsultantTypeForm";
import { useConsultantTypes } from "../../hooks/useConsultantTypes";
import type { ContentSection } from "../../types";
import { ConsultantTypeFormCard } from "./ConsultantTypeFormCard";
import { ConsultantTypeList } from "./ConsultantTypeList";

type ConsultantTypesWorkbenchProps = {
	section: ContentSection;
};

/**
 * The `variant: "consultantTypes"` screen. Same split as the generic workbench,
 * but the rows come from the API and the form edits a list of sections, so the
 * form column is the wider one.
 */
export function ConsultantTypesWorkbench({ section }: ConsultantTypesWorkbenchProps) {
	const consultantTypes = useConsultantTypes();
	const typeForm = useConsultantTypeForm(consultantTypes);

	return (
		<div className="grid grid-cols-1 gap-5 @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
			<ConsultantTypeFormCard section={section} typeForm={typeForm} />
			<ConsultantTypeList
				section={section}
				consultantTypes={consultantTypes}
				typeForm={typeForm}
			/>
		</div>
	);
}

export default ConsultantTypesWorkbench;
