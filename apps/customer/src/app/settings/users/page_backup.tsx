"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.settings },
	{ label: localizationConstants.users },
];

export default function SettingPage() {
	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.users}
				breadcrumbs={BREADCRUMBS}
			/>
			<div className="p-6">
				<p className="text-slate-600">
					<Translate text={localizationConstants.comingSoon} />
				</p>
			</div>
		</div>
	);
}
