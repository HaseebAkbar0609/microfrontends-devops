"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { economyBreadcrumbs } from "../../constants/economyNav.config";
import type { TranslationKeys } from "@/utils/translation/constants";

interface ComingSoonPageProps {
	titleKey: TranslationKeys;
}

export function ComingSoonPage({ titleKey }: ComingSoonPageProps) {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={titleKey}
				breadcrumbs={economyBreadcrumbs(titleKey)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex flex-1 items-center justify-center px-6 pb-12">
				<div className="max-w-md rounded-lg border border-slate-200 bg-white px-8 py-10 text-center shadow-2xs">
					<Translate text={titleKey} />
					<p className="mt-3 text-sm text-slate-500">
						<Translate text={localizationConstants.economyComingSoon} />
					</p>
				</div>
			</div>
		</div>
	);
}

export default ComingSoonPage;