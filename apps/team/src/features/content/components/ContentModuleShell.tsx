"use client";

import type { ReactNode } from "react";
import {
	ModulePageHeader,
	type RecordNavRowProps,
} from "@/components/layout/navigation";
import {
	CONTENT_BREADCRUMBS,
	CONTENT_MODULE_TABS,
	CONTENT_MODULE_TITLE_KEY,
} from "../constants/contentNav";

type ContentModuleShellProps = {
	children: ReactNode;
	/** Present on section pages; the section name replaces the breadcrumb. */
	record?: RecordNavRowProps;
};

/**
 * Shell for every page in the content console.
 *
 * The prototype had three navigation levels — a landing page, a group index and
 * a section page. The title stays constant here and the group tabs carry the
 * first level, so drilling into a section costs one click instead of two.
 */
export function ContentModuleShell({
	children,
	record,
}: ContentModuleShellProps) {
	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			{record ? (
				<ModulePageHeader
					title={CONTENT_MODULE_TITLE_KEY}
					tabs={CONTENT_MODULE_TABS}
					record={record}
				/>
			) : (
				<ModulePageHeader
					title={CONTENT_MODULE_TITLE_KEY}
					tabs={CONTENT_MODULE_TABS}
					breadcrumbs={CONTENT_BREADCRUMBS}
				/>
			)}
			<div className="flex flex-col gap-5 px-5 py-5">{children}</div>
		</div>
	);
}

export default ContentModuleShell;
