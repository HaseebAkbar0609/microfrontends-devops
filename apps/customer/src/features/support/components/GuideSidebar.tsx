"use client";

import { useMemo, useState } from "react";

import { Search } from "@/components/search/Search";

import { GUIDE_FOLDERS } from "@/features/support";
import { GuideFolderSection } from "./GuideFolderSection";

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
			const folderMatch = folder.title
				.toLowerCase()
				.includes(normalizedSearch);

			const itemMatch = folder.items?.some((item) =>
				item.label.toLowerCase().includes(normalizedSearch),
			);

			return folderMatch || itemMatch;
		});
	}, [search]);

	return (
		<div className="h-[712px] w-[280px] border-r border-slate-200 bg-[#FAFAFA]">
			<div className="flex flex-col gap-3 p-4">
				<Search
					value={search}
					onChange={setSearch}
					placeholder="Search folders..."
				/>

				<div className="space-y-1">
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