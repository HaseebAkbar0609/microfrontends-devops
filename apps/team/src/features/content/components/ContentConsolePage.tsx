"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CONTENT_GROUPS } from "../constants/contentGroups";
import { getContentGroupHref } from "../constants/contentNav";
import { ContentModuleShell } from "./ContentModuleShell";

/**
 * Front door of the console: pick the dashboard to administer. Each card lists
 * the sections it holds so the choice does not need a second page to explain it.
 */
export function ContentConsolePage() {
	return (
		<ContentModuleShell titleKey={localizationConstants.settings}>
			<p className="max-w-2xl text-sm text-slate-500">
				<Translate text={localizationConstants.contentConsoleSummary} />
			</p>

			<div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
				{CONTENT_GROUPS.map((group) => {
					const Icon = group.icon;
					const href = getContentGroupHref(group.id);

					return (
						<Card key={group.id} className="flex flex-col">
							<CardHeader className="flex flex-row items-center gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
									<Icon size={20} />
								</span>
								<CardTitle className="text-base font-semibold">
									<Translate text={group.titleKey} />
								</CardTitle>
							</CardHeader>

							<CardContent className="flex flex-1 flex-col gap-4">
								<ul className="flex flex-col gap-1 text-sm text-slate-600">
									{group.sections.map((section) => (
										<li key={section.slug} className="flex gap-2">
											<span aria-hidden="true">&middot;</span>
											<Translate text={section.titleKey} />
										</li>
									))}
								</ul>

								<Button asChild className="mt-auto w-fit">
									<Link href={href}>
										<Translate text={localizationConstants.contentConsoleOpen} />
										<ArrowRight size={16} />
									</Link>
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</ContentModuleShell>
	);
}

export default ContentConsolePage;
