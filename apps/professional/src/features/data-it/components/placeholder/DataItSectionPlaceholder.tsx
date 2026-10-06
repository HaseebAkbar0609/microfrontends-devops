"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { dataItBreadcrumbs } from "../../constants/dataItNav.config";

interface DataItSectionPlaceholderProps {
	titleKey: TranslationKeys;
}

export function DataItSectionPlaceholder({
	titleKey,
}: DataItSectionPlaceholderProps) {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={titleKey}
				breadcrumbs={dataItBreadcrumbs(titleKey)}
				className="border-b bg-white px-6 py-4"
			/>
			<div className="flex flex-1 items-center justify-center p-8 text-center">
				<div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
					<h2 className="text-lg font-semibold text-slate-900 mb-2">
						<Translate text={titleKey} />
					</h2>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.comingSoonMessage} />
					</p>
				</div>
			</div>
		</div>
	);
}

export default DataItSectionPlaceholder;
