"use client";

import { useWatch, type Control } from "react-hook-form";

import localizationConstants from "@/utils/translation/constants";
import type { AtaFormValues } from "../ataFormSchema";
import { AtaInfoCards } from "./AtaInfoCards";

export interface AtaReadOnlyCardsProps {
	control: Control<AtaFormValues>;
	meta: { createdBy: string; createdDate: string; revisedDate: string };
}

/** Step 2's read-back of step 1, from the live draft. */
export function AtaReadOnlyCards({ control, meta }: AtaReadOnlyCardsProps) {
	const [client, info] = useWatch({ control, name: ["client", "info"] });

	return (
		<AtaInfoCards
			client={client}
			info={info}
			meta={meta}
			infoTitleKey={localizationConstants.projectAtaProjectInfo}
		/>
	);
}

export default AtaReadOnlyCards;
