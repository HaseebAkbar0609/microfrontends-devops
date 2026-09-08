"use client";

import { useContentSections } from "../hooks/useContentSections";
import { useSectionForm } from "../hooks/useSectionForm";
import type { ContentSection } from "../types";
import { SectionFormCard } from "./SectionFormCard";
import { SectionItemList } from "./SectionItemList";

type SectionWorkbenchProps = {
	section: ContentSection;
	sectionKey: string;
};

/**
 * Generic list-CRUD screen: the form on the left, the saved rows on the right.
 *
 * The split uses a container query rather than a viewport breakpoint — the app
 * shell reserves a fixed rail, so `lg:` fires while the column is still narrow.
 */
export function SectionWorkbench({
	section,
	sectionKey,
}: SectionWorkbenchProps) {
	const { getRows } = useContentSections();
	const sectionForm = useSectionForm(section, sectionKey);
	const rows = getRows(sectionKey);

	return (
		<div className="grid grid-cols-1 gap-5 @4xl:grid-cols-[380px_minmax(0,1fr)]">
			<SectionFormCard section={section} sectionForm={sectionForm} />
			<SectionItemList
				section={section}
				sectionKey={sectionKey}
				rows={rows}
				sectionForm={sectionForm}
			/>
		</div>
	);
}

export default SectionWorkbench;
