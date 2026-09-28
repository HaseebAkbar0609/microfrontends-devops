"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";

export interface EconomySubTabItem<T extends string = string> {
	id?: T;
	value?: T;
	labelKey?: string | TranslationKeys;
	label?: string | TranslationKeys;
	count?: number;
}

interface EconomySubTabsProps<T extends string = string> {
	tabs: EconomySubTabItem<T>[];
	activeTab?: T;
	value?: T;
	onTabChange?: (tabId: T) => void;
	onValueChange?: (tabId: T) => void;
	className?: string;
}

export function EconomySubTabs<T extends string = string>({
	tabs,
	activeTab,
	value,
	onTabChange,
	onValueChange,
	className,
}: EconomySubTabsProps<T>) {
	if (tabs.length === 0) return null;

	const currentTab = activeTab ?? value ?? tabs[0]?.id ?? tabs[0]?.value ?? "";
	const handleChange = (newTab: string) => {
		onTabChange?.(newTab as T);
		onValueChange?.(newTab as T);
	};

	return (
		<div className={cn("border-b border-slate-200", className)}>
			<Tabs value={currentTab} onValueChange={handleChange}>
				<TabsList variant="line" className="gap-6 sm:gap-8 bg-transparent p-0 -mb-px">
					{tabs.map((tab) => {
						const tabKey = tab.id ?? tab.value ?? "";
						const tabLabel = tab.labelKey ?? tab.label ?? "";
						return (
							<TabsTrigger
								key={tabKey}
								value={tabKey}
								className="pb-3 pt-1 text-sm font-semibold cursor-pointer gap-1.5"
							>
								{typeof tabLabel === "string" ? (
									<Translate text={tabLabel} />
								) : (
									tabLabel
								)}
								{typeof tab.count === "number" && (
									<span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
										{tab.count}
									</span>
								)}
							</TabsTrigger>
						);
					})}
				</TabsList>
			</Tabs>
		</div>
	);
}

export default EconomySubTabs;
