"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	CONTENT_NAV_GROUPS,
	getActiveContentGroupId,
} from "../../constants/contentNav";
import type { ContentGroupId } from "../../types";
import { ContentSubNavGroup } from "./ContentSubNavGroup";

/**
 * Second sidebar for the settings console, shown on every page that
 * administers the customer or workspace dashboard.
 */
export function ContentSubSidebar() {
	const pathname = usePathname();
	const activeGroupId = getActiveContentGroupId(pathname);
	// Holds only what the user has shut, so both dashboards start open.
	const [collapsedIds, setCollapsedIds] = useState<ContentGroupId[]>([]);

	// Arriving in a collapsed dashboard opens it. Keyed on the group rather than
	// the pathname so the chevron still works while you stay inside it.
	useEffect(() => {
		if (!activeGroupId) return;
		setCollapsedIds((ids) => ids.filter((id) => id !== activeGroupId));
	}, [activeGroupId]);

	const toggleGroup = (groupId: ContentGroupId) => {
		setCollapsedIds((ids) =>
			ids.includes(groupId)
				? ids.filter((id) => id !== groupId)
				: [...ids, groupId],
		);
	};

	return (
		<aside className="no-print flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
			<div className="flex h-16 items-center gap-3 border-b border-slate-200 px-3 sm:px-5">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
					<Settings size={18} />
				</div>
				<div className="flex min-w-0 flex-col">
					<span className="text-lg font-semibold leading-6 text-slate-900">
						<Translate text={localizationConstants.settings} />
					</span>
					<span className="truncate text-xs text-slate-500">
						<Translate text={localizationConstants.contentConsoleSubtitle} />
					</span>
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 hide-scrollbar">
				{CONTENT_NAV_GROUPS.map((group) => (
					<ContentSubNavGroup
						key={group.id}
						group={group}
						pathname={pathname}
						isOpen={!collapsedIds.includes(group.id)}
						onToggle={() => toggleGroup(group.id)}
					/>
				))}
			</nav>
		</aside>
	);
}

export default ContentSubSidebar;
