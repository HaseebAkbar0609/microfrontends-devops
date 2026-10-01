"use client";

import { useId, useMemo, useRef, useState, type ComponentProps, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MaterialArticle } from "../../types/materialStorage.types";

export const materialOptionLabel = (article: Pick<MaterialArticle, "articleNo" | "name">) =>
	`${article.articleNo} – ${article.name}`;

interface MaterialPickerProps extends Omit<ComponentProps<"button">, "value" | "onSelect"> {
	value: string;
	articles: MaterialArticle[];
	onSelect: (article: MaterialArticle) => void;
	/** Shows a ✕ next to the chevron while a material is chosen. */
	onClear?: () => void;
	hasError?: boolean;
}

/**
 * The Figma material field: search icon, "100245 – Gipsskiva 13 mm", chevron.
 * Opens a list filtered by article number or name, usable with the arrow keys.
 * Remaining button props (id, aria-*) come from FormControl.
 */
export function MaterialPicker({
	value,
	articles,
	onSelect,
	onClear,
	hasError,
	className,
	disabled,
	...triggerProps
}: MaterialPickerProps) {
	const t = useTranslate();
	const listId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);

	const selected = articles.find((article) => article.id === value);
	const canClear = Boolean(onClear && value && !disabled);
	const matches = useMemo(() => {
		const term = query.trim().toLowerCase();
		if (!term) return articles;
		return articles.filter((article) => materialOptionLabel(article).toLowerCase().includes(term));
	}, [articles, query]);

	const changeOpen = (next: boolean) => {
		setOpen(next);
		setQuery("");
		setActiveIndex(0);
	};

	const choose = (article: MaterialArticle | undefined) => {
		if (!article) return;
		onSelect(article);
		changeOpen(false);
	};

	const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const step = event.key === "ArrowDown" ? 1 : -1;
			setActiveIndex((index) => Math.min(Math.max(index + step, 0), Math.max(matches.length - 1, 0)));
		} else if (event.key === "Enter") {
			event.preventDefault();
			choose(matches[activeIndex]);
		}
	};

	const clear = () => {
		onClear?.();
		// The ✕ goes away with the value; focus stays in the field instead of dropping to the page.
		triggerRef.current?.focus();
	};

	return (
		<Popover open={open} onOpenChange={changeOpen}>
			<div className="relative">
				<PopoverTrigger asChild>
					<button
						type="button"
						role="combobox"
						aria-expanded={open}
						aria-controls={listId}
						disabled={disabled}
						className={cn(
							"flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-left text-sm shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
							hasError ? "border-red-500" : "border-slate-200 hover:border-slate-300",
							className,
						)}
						{...triggerProps}
						ref={triggerRef}
					>
						<Search className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
						<span className={cn("flex-1 truncate", selected ? "text-slate-900" : "text-slate-400")}>
							{selected ? materialOptionLabel(selected) : t(localizationConstants.materialPickerPlaceholder)}
						</span>
						{/* Room for the ✕, which sits over it: a button cannot go inside another button. */}
						{canClear && <span className="w-5 shrink-0" aria-hidden />}
						<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
					</button>
				</PopoverTrigger>
				{canClear && (
					<button
						type="button"
						onClick={clear}
						aria-label={t(localizationConstants.materialClearMaterial)}
						className="absolute top-1/2 right-9 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
					>
						<X className="h-4 w-4" aria-hidden />
					</button>
				)}
			</div>
			<PopoverContent align="start" sideOffset={4} className="w-[var(--radix-popover-trigger-width)] min-w-72 bg-white p-0">
				<div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
					<Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
					<input
						type="text"
						role="searchbox"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setActiveIndex(0);
						}}
						onKeyDown={onSearchKeyDown}
						aria-controls={listId}
						aria-activedescendant={matches[activeIndex] ? `${listId}-${matches[activeIndex].id}` : undefined}
						aria-label={t(localizationConstants.materialPickerSearchPlaceholder)}
						placeholder={t(localizationConstants.materialPickerSearchPlaceholder)}
						className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
					/>
				</div>
				<ul id={listId} role="listbox" className="max-h-64 overflow-y-auto p-1 text-sm">
					{matches.length === 0 ? (
						<li className="px-3 py-3 text-center text-slate-500">
							{t(localizationConstants.materialPickerEmpty)}
						</li>
					) : (
						matches.map((article, index) => (
							<li
								key={article.id}
								id={`${listId}-${article.id}`}
								role="option"
								aria-selected={article.id === value}
								onClick={() => choose(article)}
								onMouseEnter={() => setActiveIndex(index)}
								className={cn(
									"flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-slate-700",
									index === activeIndex && "bg-slate-100 text-slate-900",
								)}
							>
								<span className="truncate">{materialOptionLabel(article)}</span>
								{article.id === value && <Check className="h-4 w-4 shrink-0 text-slate-900" aria-hidden />}
							</li>
						))
					)}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
