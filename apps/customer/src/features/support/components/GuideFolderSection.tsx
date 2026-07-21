"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { GuideFolder } from "../types";
import { Translate } from "@/utils/translation/translate";

interface GuideFolderSectionProps extends GuideFolder {
	selectedDocument: string;
	onSelectDocument: (document: string) => void;
}

export function GuideFolderSection({
	title,
	count,
	defaultOpen = false,
	items = [],
	href,
	selectedDocument,
	onSelectDocument,
}: GuideFolderSectionProps) {
	const router = useRouter();
	const [open, setOpen] = useState(defaultOpen);

	const handleFolderClick = () => {
		if (items.length > 0) {
			setOpen(!open);
		} else if (href) {
			router.push(href);
		}
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleFolderClick}
				className="flex w-full items-center rounded-md px-2 py-1.5 text-left transition-colors hover:bg-slate-100"
			>
				{open ? (
					<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
				) : (
					<ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
				)}

				{open ? (
					<FolderOpen className="ml-1.5 h-4 w-4 shrink-0 text-orange-500" />
				) : (
					<Folder className="ml-1.5 h-4 w-4 shrink-0 text-slate-400" />
				)}

				<span className="ml-2 flex-1 truncate text-sm font-medium text-slate-700">
					<Translate text={title} />
				</span>

				{count !== undefined && (
					<span className="ml-2 text-xs text-slate-400">{count}</span>
				)}
			</button>

			{open && items.length > 0 && (
				<div className="mt-0.5 space-y-0.5">
					{items.map((item) => (
						<button
							type="button"
							key={item.id}
							onClick={() =>
								item.href
									? router.push(item.href)
									: onSelectDocument(item.id)
							}
							className={cn(
								"flex h-8 w-full items-center rounded-md pl-10 pr-2 text-left text-sm transition-colors",
								selectedDocument === item.id
									? "bg-slate-200 text-slate-900"
									: "text-slate-600 hover:bg-slate-100",
							)}
						>
							<span className="flex-1 truncate">
								<Translate text={item.label} />
							</span>

							{item.count !== undefined && (
								<span className="ml-2 text-xs text-slate-400">{item.count}</span>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
