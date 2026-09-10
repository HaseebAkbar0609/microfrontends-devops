"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function EconomySectionHub() {
	return (
		<div className="flex flex-1 items-center justify-center bg-slate-50/50 px-6 py-16">
			<div className="text-center">
				<h2 className="text-lg font-semibold text-slate-900">
					<Translate text={localizationConstants.dashboard} />
				</h2>
				<p className="mt-2 text-sm text-slate-500">
					<Translate text={localizationConstants.economyComingSoon} />
				</p>
			</div>
		</div>
	);
}

export default EconomySectionHub;