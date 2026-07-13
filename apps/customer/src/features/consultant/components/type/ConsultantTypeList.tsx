"use client";

import { Folder } from "lucide-react";
import { Search } from "@/components/search/Search";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ConsultantTypeItem } from "../../types/consultantType";

interface ConsultantTypeListProps {
	types: ConsultantTypeItem[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	search: string;
	onSearchChange: (value: string) => void;
}

export function ConsultantTypeList({
	types,
	selectedId,
	onSelect,
	search,
	onSearchChange,
}: ConsultantTypeListProps) {
	return (
		<div className="flex flex-col gap-3">
			<Search
				value={search}
				onChange={onSearchChange}
				placeholder={
					localizationConstants.consultantTypeSearchPlaceholder
				}
				className="h-10 rounded-lg border border-slate-200 bg-white focus:border-slate-300"
			/>
			<ul className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto pr-1">
				{types.map((type) => {
					const isActive = selectedId === type.id;
					return (
						<li key={type.id}>
							<button
								type="button"
								onClick={() => onSelect(type.id)}
								aria-current={isActive ? "true" : undefined}
								className={cn(
									"flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
									isActive
										? "bg-slate-200 font-semibold text-secondary shadow-sm"
										: "text-secondary hover:bg-white/60 font-semibold",
								)}
							>
								<Folder className="h-4 w-4 shrink-0 text-slate-400" />
								<span className="truncate">{type.name}</span>
							</button>
						</li>
					);
				})}
				{types.length === 0 && (
					<li className="px-3 py-6 text-center text-sm text-slate-400">
						<Translate
							text={localizationConstants.noConsultantsFound}
						/>
					</li>
				)}
			</ul>
		</div>
	);
}
