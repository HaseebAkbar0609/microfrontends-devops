"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface CategoryPanelProps {
	headerKey: string;
	items: { id: string; label: string; count?: number }[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	searchKey: string;
}

export function CategoryPanel({ headerKey, items, selectedId, onSelect, searchKey }: CategoryPanelProps) {
	const t = useTranslate();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return items.filter((i) => i.label.toLowerCase().includes(q));
	}, [items, search]);

	return (
		<div className="flex w-56 shrink-0 flex-col border-r border-slate-200">
			<div className="border-b border-slate-200 px-4 py-3">
				<p className="text-xs font-semibold tracking-wide text-slate-500">
					<Translate text={headerKey} />
				</p>
			</div>
			<div className="relative border-b border-slate-200">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t(searchKey)}
					className="h-9 w-full bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
				/>
			</div>
			<div className="flex-1 overflow-y-auto">
				{filtered.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onSelect(item.id)}
						className={cn(
							"flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-xs transition-colors hover:bg-slate-50",
							selectedId === item.id
								? "border-l-2 border-slate-800 bg-slate-50 font-medium text-slate-900"
								: "border-l-2 border-transparent text-slate-600",
						)}
					>
						<span className="flex items-center gap-2">
							<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
							<span className="truncate">{item.label}</span>
						</span>
						{item.count !== undefined && (
							<span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
								{item.count}
							</span>
						)}
					</button>
				))}
			</div>
			<div className="border-t border-slate-200 px-4 py-3">
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.kmaQualityAddNew} />
				</button>
			</div>
		</div>
	);
}
