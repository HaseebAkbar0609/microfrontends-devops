"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CONTENT_GROUPS } from "../constants/contentGroups";
import { CONTENT_BASE_HREF } from "../constants/content.constants";
import type { ContentGroupId } from "../types";
import { ContentModuleShell } from "./ContentModuleShell";
import { ContentSectionCard } from "./ContentSectionCard";

/**
 * The grid of content sections for one dashboard.
 *
 * The two prototype routes `/installningar/kund` and `/installningar/workspace`
 * were near-identical files; the group comes from the route here instead.
 */
export function ContentGroupPage({ groupId }: { groupId: ContentGroupId }) {
	const group = CONTENT_GROUPS.find((item) => item.id === groupId);
	if (!group) return null;

	return (
		<ContentModuleShell
			titleKey={group.titleKey}
			parents={[
				{ label: localizationConstants.settings, href: CONTENT_BASE_HREF },
			]}
		>
			<p className="max-w-2xl text-sm text-slate-500">
				<Translate text={group.summaryKey} />
			</p>

			<div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
				{group.sections.map((section) => (
					<ContentSectionCard
						key={section.slug}
						groupId={group.id}
						section={section}
					/>
				))}
			</div>
		</ContentModuleShell>
	);
}

export default ContentGroupPage;
