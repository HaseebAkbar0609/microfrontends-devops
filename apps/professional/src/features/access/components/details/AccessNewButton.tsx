"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";

/** "+ New Access Management" of the details frame. The create flow is TFS-1105, so it shows the coming-soon toast. */
export function AccessNewButton() {
	const showComingSoon = useComingSoonToast();

	return (
		<Button type="button" className="h-10 cursor-pointer gap-2" onClick={showComingSoon}>
			<Plus className="h-4 w-4" aria-hidden />
			<Translate text={localizationConstants.accessNewButton} />
		</Button>
	);
}
