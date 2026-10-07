import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_CREATION_MODE } from "@/features/quote/constants";
import type { ProjectCreationMode } from "@/features/quote/types/types";

interface ProjectOriginBadgeProps {
	creationMode?: ProjectCreationMode;
}

/** Tells a project started from Projects apart from an accepted offer */
export function ProjectOriginBadge({ creationMode }: ProjectOriginBadgeProps) {
	return (
		<span className="ml-2 inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs text-[#64748B]">
			<Translate
				text={
					creationMode === PROJECT_CREATION_MODE.directOrder
						? localizationConstants.projectOriginDirect
						: localizationConstants.projectOriginAcceptedOffer
				}
			/>
		</span>
	);
}
