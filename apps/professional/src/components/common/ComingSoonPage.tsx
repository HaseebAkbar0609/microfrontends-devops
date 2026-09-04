"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ComingSoonPageProps {
	readonly titleKey?: string;
	readonly title?: string;
	/**
	 * Drop the H1 when the page already renders a `ModulePageHeader` above this
	 * body, so the module title is not repeated.
	 */
	readonly hideTitle?: boolean;
}

export function ComingSoonPage({ titleKey, title, hideTitle }: ComingSoonPageProps) {
	return (
		<div className="flex flex-col gap-3 p-8">
			{!hideTitle && (
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					{titleKey ? <Translate text={titleKey} /> : title}
				</h1>
			)}
			<p className="text-sm text-slate-500">
				<Translate text={localizationConstants.comingSoonMessage || localizationConstants.comingSoon} />
			</p>
		</div>
	);
}
