"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";

interface ComingSoonPageProps {
	titleKey: TranslationKeys;
}

export function ComingSoonPage({ titleKey }: ComingSoonPageProps) {
	return (
		<div className="flex flex-1 items-center justify-center bg-slate-50/50 px-6 py-16">
				<div className="max-w-md rounded-lg border border-slate-200 bg-white px-8 py-10 text-center shadow-2xs">
					<Translate text={titleKey} />
					<p className="mt-3 text-sm text-slate-500">
						<Translate text={localizationConstants.economyComingSoon} />
					</p>
				</div>
		</div>
	);
}

export default ComingSoonPage;