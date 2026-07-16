"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ConsultantTypeItem } from "../../types/consultantType";

interface ConsultantTypeListProps {
	types: ConsultantTypeItem[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function ConsultantTypeList({
	types,
	selectedId,
	onSelect,
}: ConsultantTypeListProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const [canScrollDown, setCanScrollDown] = useState(false);

	const updateScrollHint = useCallback(() => {
		const el = listRef.current;
		if (!el) return;
		setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
	}, []);

	useEffect(() => {
		updateScrollHint();
		window.addEventListener("resize", updateScrollHint);
		return () => window.removeEventListener("resize", updateScrollHint);
	}, [updateScrollHint, types.length]);

	return (
		<div className="relative">
			<ul
				ref={listRef}
				onScroll={updateScrollHint}
				className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto pr-1"
			>
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
								<span className="truncate">
									<Translate text={type.name} />
								</span>
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
			{canScrollDown && (
				<div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-12 items-end justify-center bg-gradient-to-t from-slate-50 to-transparent pb-1">
					<ChevronDown
						className="h-4 w-4 animate-bounce text-slate-400"
						aria-hidden
					/>
				</div>
			)}
		</div>
	);
}
