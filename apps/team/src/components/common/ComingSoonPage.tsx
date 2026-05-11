"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface ComingSoonPageProps {
	titleKey: string;
}

export default function ComingSoonPage({ titleKey }: ComingSoonPageProps) {
	return (
		<div className="flex flex-1 flex-col gap-2 bg-[#f5f7fb] px-6 py-6">
			<h1 className="text-2xl font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h1>
			<p className="text-sm text-slate-500">
				<Translate text={localizationConstants.comingSoon} />
			</p>
		</div>
	);
}
