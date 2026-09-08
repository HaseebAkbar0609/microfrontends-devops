"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getContentSectionHref } from "../constants/contentNav";
import type { ContentGroupId, ContentSection } from "../types";

type ContentSectionCardProps = {
	groupId: ContentGroupId;
	section: ContentSection;
};

/** One tile in the group grid. The whole card is the link target. */
export function ContentSectionCard({
	groupId,
	section,
}: ContentSectionCardProps) {
	const Icon = section.icon;

	return (
		<Link
			href={getContentSectionHref(groupId, section.slug)}
			className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
		>
			<div className="flex items-center gap-3">
				<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
					<Icon className="size-5" aria-hidden />
				</span>
				<h3 className="min-w-0 truncate text-base font-semibold text-slate-900">
					<Translate text={section.titleKey} />
				</h3>
				<ArrowRight
					className="ml-auto size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-900"
					aria-hidden
				/>
			</div>

			<p className="mt-3 text-sm text-slate-500">
				<Translate text={section.summaryKey} />
			</p>

			<span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-900 opacity-0 transition-opacity group-hover:opacity-100">
				<Translate text={localizationConstants.contentOpenSection} />
				<ArrowRight className="size-3" aria-hidden />
			</span>
		</Link>
	);
}

export default ContentSectionCard;
