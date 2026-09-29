"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import type { BreadcrumbItem } from "@/types/common";
import type { TranslationKeys } from "@/utils/translation/constants";
import { getContentBreadcrumbs } from "../constants/contentNav";

type ContentModuleShellProps = {
	/** The page's own name; the console's navigation lives in the sub-sidebar. */
	titleKey: TranslationKeys;
	/** Crumbs between the dashboard link and this page. */
	parents?: BreadcrumbItem[];
	children: ReactNode;
};

/**
 * Shell for every page in the settings console. The sub-sidebar says where you
 * can go, so the header only has to say where you are.
 */
export function ContentModuleShell({
	titleKey,
	parents,
	children,
}: ContentModuleShellProps) {
	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<PageHeader
				title={titleKey}
				breadcrumbs={getContentBreadcrumbs(titleKey, parents)}
			/>
			<div className="flex flex-col gap-5 px-5 py-5">{children}</div>
		</div>
	);
}

export default ContentModuleShell;
