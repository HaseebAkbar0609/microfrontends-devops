"use client";

import { useMemo, useState } from "react";
import { Search } from "@/components/search/Search";
import { GuideFolderSection } from "./GuideFolderSection";
import { GUIDE_FOLDERS } from "../constants/guideFolders";
import localizationConstants from "@/utils/translation/constants";
import { t } from "i18next";

interface GuideSidebarProps {
	selectedDocument: string;
	onSelectDocument: (document: string) => void;
}

export function GuideSidebar({
	selectedDocument,
	onSelectDocument,
}: GuideSidebarProps) {
	const [search, setSearch] = useState("");

	const filteredFolders = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		if (!normalizedSearch) {
			return GUIDE_FOLDERS;
		}

		return GUIDE_FOLDERS.filter((folder) => {
			const folderMatch = t(folder.title)
				.toLowerCase()
				.includes(normalizedSearch);

			const itemMatch = folder.items?.some((item) =>
				t(item.label).toLowerCase().includes(normalizedSearch),
			);

			return folderMatch || itemMatch;
		});
	}, [search]);

	return (
		<div className="flex h-full flex-col">
			<div className="p-4">
				<Search
					value={search}
					onChange={setSearch}
					placeholder={localizationConstants.guideSearchFoldersPlaceholder}
					wrapperClassName="rounded-md border border-slate-200 bg-white"
					className="border-0 focus-visible:ring-0"
				/>
			</div>

			<div className="flex-1 overflow-y-auto px-2 pb-4">
				<div className="space-y-0.5">
					{filteredFolders.map((folder) => (
						<GuideFolderSection
							key={folder.title}
							{...folder}
							selectedDocument={selectedDocument}
							onSelectDocument={onSelectDocument}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
