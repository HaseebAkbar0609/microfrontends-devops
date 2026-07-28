"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "@/components/search/Search";
import { GuideFolderSection } from "./GuideFolderSection";
import { getGuideFoldersAPIAction } from "@/api-actions";
import type { GuideFolder } from "../types";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Loader2, RefreshCw } from "lucide-react";

interface GuideSidebarProps {
	selectedDocument: string;
	onSelectDocument: (id: string, label: string) => void;
}

export function GuideSidebar({
	selectedDocument,
	onSelectDocument,
}: GuideSidebarProps) {
	const t = useTranslate();
	const [folders, setFolders] = useState<GuideFolder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const isMountedRef = useRef(true);

	const loadGuideFolders = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await getGuideFoldersAPIAction();
			if (!isMountedRef.current) return;
			if (result.success && result.data && Array.isArray(result.data.folders)) {
				setFolders(result.data.folders);
			} else {
				setError(result.error || "Failed to load guide folders");
			}
		} catch {
			if (!isMountedRef.current) return;
			setError("Failed to load guide folders");
		} finally {
			if (isMountedRef.current) {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		isMountedRef.current = true;
		loadGuideFolders();
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const filteredFolders = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		if (!normalizedSearch) {
			return folders;
		}

		return folders.filter((folder) => {
			const folderMatch = t(folder.title)
				.toLowerCase()
				.includes(normalizedSearch);

			const itemMatch = folder.items?.some((item) =>
				t(item.label).toLowerCase().includes(normalizedSearch),
			);

			return folderMatch || itemMatch;
		});
	}, [search, folders, t]);

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
					{loading ? (
						<div className="flex items-center gap-2 px-2 py-4 text-sm text-slate-400">
							<Loader2 className="h-4 w-4 animate-spin" />
							<Translate text={localizationConstants.guideLoading} />
						</div>
					) : error ? (
						<div className="flex flex-col items-start gap-2 px-2 py-4 text-sm text-red-500">
							<p>{error}</p>
							<button
								type="button"
								onClick={loadGuideFolders}
								className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 underline"
							>
								<RefreshCw className="h-3 w-3" />
								<Translate text={localizationConstants.errorRetry} />
							</button>
						</div>
					) : filteredFolders.length === 0 ? (
						<p className="px-2 py-4 text-sm text-slate-400">
							<Translate text={localizationConstants.guideNoFoldersFound} />
						</p>
					) : (
						filteredFolders.map((folder) => (
							<GuideFolderSection
								key={folder.title}
								{...folder}
								selectedDocument={selectedDocument}
								onSelectDocument={onSelectDocument}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
