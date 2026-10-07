"use client";

import { useEffect, useRef, useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { withOptionalSuffix } from "./OptionalLabelSuffix";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/** Radix Select often scrolls the content/viewport, not our inner div — observer root must match the real scroll container. */
function getScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
	if (!el) return null;
	let node: HTMLElement | null = el.parentElement;
	while (node) {
		const { overflowY } = getComputedStyle(node);
		if (
			overflowY === "auto" ||
			overflowY === "scroll" ||
			overflowY === "overlay"
		) {
			return node;
		}
		node = node.parentElement;
	}
	return null;
}

export interface FormSelectOption {
	value: string;
	label: React.ReactNode;
	searchLabel?: string;
}

export interface FormSelectProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	control: Control<TFieldValues>;
	name: TName;
	label?: React.ReactNode;
	/** Appends " (Valfritt)" / " (Optional)" to the label. */
	optional?: boolean;
	placeholder?: string;
	options: FormSelectOption[];
	disabled?: boolean;
	className?: string;
	labelClassName?: string;
	triggerClassName?: string;
	contentClassName?: string;
	messageClassName?: string;
	translateError?: (message: string) => string;
	searchable?: boolean;
	searchPlaceholder?: string;
	/** When true, field value is `string[]` (checkbox list). */
	multiple?: boolean;
	/** When set, debounced search text is sent to the parent (e.g. API). Local option filtering is skipped. */
	onSearchChange?: (query: string) => void | Promise<void>;
	searchDebounceMs?: number;
	hasMore?: boolean;
	isLoadingMore?: boolean;
	onLoadMore?: () => void | Promise<void>;
	loadMoreThreshold?: number;
}

export function FormSelect<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	optional,
	placeholder,
	options,
	disabled,
	className,
	labelClassName,
	triggerClassName,
	contentClassName,
	messageClassName,
	translateError,
	searchable,
	searchPlaceholder = "Search...",
	multiple = false,
	onSearchChange,
	searchDebounceMs = 350,
	hasMore = false,
	isLoadingMore = false,
	onLoadMore,
	loadMoreThreshold = 32,
}: FormSelectProps<TFieldValues, TName>) {
	const { t } = useTranslation();
	const [searchInput, setSearchInput] = useState("");
	const [selectOpen, setSelectOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const listOpen = multiple ? dropdownOpen : selectOpen;
	const loadMoreTriggeredRef = useRef(false);
	const listScrollRef = useRef<HTMLDivElement | null>(null);
	const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
	const isLoadingMoreRef = useRef(isLoadingMore);
	isLoadingMoreRef.current = isLoadingMore;

	const resolvedPlaceholder =
		placeholder != null ? t(placeholder) : undefined;

	const resolvedLabel =
		typeof label === "string" ? <Translate text={label} /> : label;

	const resolvedSearchPlaceholder = t(searchPlaceholder);

	const remoteSearch = Boolean(onSearchChange);
	const skipSearchEffectRef = useRef(true);

	function optionMatchesQuery(opt: FormSelectOption, query: string): boolean {
		const searchText = (
			opt.searchLabel ??
			(typeof opt.label === "string" ? opt.label : "")
		)
			.toString()
			.toLowerCase()
			.trim();
		return searchText.includes(query);
	}

	useEffect(() => {
		if (!remoteSearch || !searchable || !onSearchChange) {
			return;
		}
		if (skipSearchEffectRef.current) {
			skipSearchEffectRef.current = false;
			return;
		}

		const q = searchInput.trim();
		const timer = window.setTimeout(() => {
			void Promise.resolve(onSearchChange(q));
		}, searchDebounceMs);

		return () => window.clearTimeout(timer);
	}, [remoteSearch, searchable, onSearchChange, searchInput, searchDebounceMs]);

	// When the list is shorter than the viewport there is no scroll event — observe a bottom sentinel inside the same scroll root.
	useEffect(() => {
		if (!listOpen || !onLoadMore || !hasMore) {
			return;
		}

		let cancelled = false;
		let observer: IntersectionObserver | null = null;

		const setup = () => {
			if (cancelled) {
				return;
			}
			const target = loadMoreSentinelRef.current;
			if (!target) {
				return;
			}
			const root =
				getScrollableAncestor(target) ?? listScrollRef.current ?? null;
			if (!root) {
				return;
			}

			observer = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					if (!entry?.isIntersecting) {
						return;
					}
					if (isLoadingMoreRef.current || loadMoreTriggeredRef.current) {
						return;
					}
					loadMoreTriggeredRef.current = true;
					void Promise.resolve(onLoadMore()).finally(() => {
						loadMoreTriggeredRef.current = false;
					});
				},
				{ root, rootMargin: `${loadMoreThreshold}px`, threshold: 0 },
			);

			observer.observe(target);
		};

		const id = requestAnimationFrame(() => {
			requestAnimationFrame(setup);
		});

		return () => {
			cancelled = true;
			cancelAnimationFrame(id);
			observer?.disconnect();
		};
	}, [
		listOpen,
		onLoadMore,
		hasMore,
		options.length,
		loadMoreThreshold,
	]);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				function matchingOptionsList(): FormSelectOption[] {
					const query = searchInput.trim().toLowerCase();
					const isSearching = Boolean(searchable && query);
					if (remoteSearch) return options;
					if (isSearching) {
						return options.filter((opt) => optionMatchesQuery(opt, query));
					}
					return options;
				}

				const searchBlock = searchable && (
					<div
						className="bg-popover border-b px-3 py-2 shrink-0"
						onMouseDown={(e) => e.stopPropagation()}
					>
						<div className="relative">
							<Input
								placeholder={resolvedSearchPlaceholder}
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="h-9 w-full pr-8 border border-gray-300 outline-none focus:border-gray-300"
								onClick={(e) => e.stopPropagation()}
								onMouseDown={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
								autoComplete="off"
							/>
							{searchInput && (
								<button
									type="button"
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => setSearchInput("")}
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
								>
									<X className="h-3 w-3 text-muted-foreground" />
								</button>
							)}
						</div>
					</div>
				);

				const listFooter = (
					<>
						{isLoadingMore && (
							<div className="px-3 py-2 text-xs text-muted-foreground text-center">
								Loading more...
							</div>
						)}
						{!isLoadingMore && hasMore && options.length > 0 && (
							<div className="px-3 py-2 text-xs text-muted-foreground text-center">
								Scroll for more
							</div>
						)}
						{onLoadMore && hasMore && (
							<div
								ref={loadMoreSentinelRef}
								className="h-px w-full shrink-0"
								aria-hidden
							/>
						)}
					</>
				);

				if (multiple) {
					const selected = Array.isArray(field.value)
						? (field.value as string[])
						: [];
					const maxVisibleBadges = 4;
					const visibleIds = selected.slice(0, maxVisibleBadges);
					const overflowCount = selected.length - maxVisibleBadges;
					const matching = matchingOptionsList();
					return (
						<FormItem className={cn("grid gap-2 ", className)}>
							{label && (
								<FormLabel className={labelClassName}>
									{withOptionalSuffix(resolvedLabel, optional)}
								</FormLabel>
							)}
							<DropdownMenu
								open={dropdownOpen}
								onOpenChange={(open) => {
									setDropdownOpen(open);
									if (!open) setSearchInput("");
								}}
							>
								<FormControl>
									{/*
										Full-width div as trigger so the menu anchors to the field (chevron-only trigger misaligned the list).
										Remove controls stay <button> inside <div> — valid HTML.
									*/}
									<DropdownMenuTrigger asChild disabled={disabled}>
										<div
											ref={field.ref}
											tabIndex={disabled ? -1 : 0}
											onBlur={field.onBlur}
											className={cn(
												"border-input data-[placeholder]:text-muted-foreground flex w-full 2xl:min-h-12 min-h-10 cursor-pointer items-start justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-gray-300 focus-visible:outline-none focus-visible:ring-0 ring-0 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
												"w-full !h-auto",
												triggerClassName,
											)}
										>
										<div
											className="flex min-w-0 flex-1 flex-wrap gap-1.5 content-center items-center py-0.5 text-left"
										>
											{selected.length === 0 ? (
												<span className="text-muted-foreground">
													{resolvedPlaceholder}
												</span>
											) : (
												<>
													{visibleIds.map((id) => {
														const opt = options.find(
															(o) => o.value === id,
														);
														return (
															<Badge
																key={id}
																variant="category"
																className="inline-flex max-w-full shrink-0 items-center gap-1 pr-1 pl-2 py-1 text-xs font-normal"
															>
																<span className="min-w-0 truncate">
																	{!opt ? (
																		id
																	) : typeof opt.label ===
																		"string" ? (
																		<Translate
																			text={opt.label}
																		/>
																	) : (
																		opt.label
																	)}
																</span>
																{/* <button
																	type="button"
																	data-remove-badge
																	aria-label="Remove"
																	disabled={disabled}
																	className="relative z-10 rounded-sm p-0.5 text-slate-600 opacity-70 hover:bg-slate-200/80 hover:opacity-100"
																	onMouseDown={(e) => {
																		e.stopPropagation();
																	}}
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		field.onChange(
																			selected.filter(
																				(v) =>
																					v !== id,
																			),
																		);
																	}}
																>
																	<X className="h-3 w-3" />
																</button> */}
															</Badge>
														);
													})}
													{overflowCount > 0 && (
														<span
															className="shrink-0 text-sm font-medium text-muted-foreground"
															aria-label={`${overflowCount} more selected`}
														>
															..
														</span>
													)}
												</>
											)}
										</div>
										<span
											className="mt-1 shrink-0 p-0.5 text-muted-foreground pointer-events-none"
											aria-hidden
										>
											<ChevronDownIcon className="size-4 opacity-50" />
										</span>
									</div>
									</DropdownMenuTrigger>
								</FormControl>
								<DropdownMenuContent
									className={cn(
										"max-h-[min(320px,var(--radix-dropdown-menu-content-available-height))] flex flex-col p-0 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)]",
										contentClassName,
									)}
									align="start"
									sideOffset={4}
									onCloseAutoFocus={(e) => e.preventDefault()}
								>
									{searchBlock}
									<div
										ref={listScrollRef}
										className="max-h-[min(272px,var(--radix-dropdown-menu-content-available-height))] min-h-0 flex-1 overflow-y-auto overscroll-contain p-1"
									>
										{matching.length === 0 ? (
											<div className="px-3 py-4 text-sm text-muted-foreground text-center">
												No results found
											</div>
										) : (
											matching.map((opt) => (
												<DropdownMenuCheckboxItem
													key={opt.value}
													checked={selected.includes(opt.value)}
													onCheckedChange={(checked) => {
														if (checked) {
															field.onChange([
																...selected,
																opt.value,
															]);
														} else {
															field.onChange(
																selected.filter(
																	(v) =>
																		v !==
																		opt.value,
																),
															);
														}
													}}
													onSelect={(e) =>
														e.preventDefault()
													}
													className={cn(
														"cursor-pointer",
														selected.includes(
															opt.value,
														) &&
															"bg-primary/10 focus:bg-primary/10 text-primary font-medium",
													)}
												>
													{typeof opt.label ===
													"string" ? (
														<Translate
															text={opt.label}
														/>
													) : (
														opt.label
													)}
												</DropdownMenuCheckboxItem>
											))
										)}
										{listFooter}
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
							<FormMessage
								className={messageClassName}
								translate={translateError ?? t}
							/>
						</FormItem>
					);
				}

				return (
					<FormItem className={cn("grid gap-2 ", className)}>
						{label && (
							<FormLabel className={labelClassName}>
								{withOptionalSuffix(resolvedLabel, optional)}
							</FormLabel>
						)}
						<Select
							onOpenChange={setSelectOpen}
							onValueChange={(value) => {
								field.onChange(value);
								setSearchInput("");
							}}
							value={field.value ?? ""}
							disabled={disabled}
						>
							<FormControl>
								<SelectTrigger
									ref={field.ref}
									className={cn("w-full 2xl:h-12 h-10 focus-visible:border-gray-300 focus-visible:outline-none focus-visible:ring-0 ring-0", triggerClassName)}
								>
									<SelectValue
										placeholder={resolvedPlaceholder}
									/>
								</SelectTrigger>
							</FormControl>
							<SelectContent
								className={cn(
									"max-h-[min(320px,var(--radix-select-content-available-height))] flex flex-col p-0",
									contentClassName,
								)}
							>
								{searchBlock}
								<div
									ref={listScrollRef}
									className="max-h-[min(272px,var(--radix-select-content-available-height))] min-h-0 flex-1 overflow-y-auto overscroll-contain p-1"
								>
									{(() => {
										const matching = matchingOptionsList();

										if (matching.length === 0) {
											return (
												<div className="px-3 py-4 text-sm text-muted-foreground text-center">
													No results found
												</div>
											);
										}

										return matching.map((opt) => (
											<SelectItem
												key={opt.value}
												value={opt.value}
												className={cn(
													"cursor-pointer",
													field.value === opt.value &&
														"bg-primary/10 hover:bg-primary/10 text-primary font-medium",
												)}
											>
												{typeof opt.label === "string" ? (
													<Translate text={opt.label} />
												) : (
													opt.label
												)}
											</SelectItem>
										));
									})()}
									{listFooter}
								</div>
							</SelectContent>
						</Select>
						<FormMessage
							className={messageClassName}
							translate={translateError ?? t}
						/>
					</FormItem>
				);
			}}
		/>
	);
}
