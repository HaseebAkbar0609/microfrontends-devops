"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	useAvailableModules,
	useLocalizedText,
} from "../hooks/useAvailableModules";
import ModuleTable, { ModuleSortField } from "./ModuleTable";

const ModuleSettingsTab = () => {
	const localized = useLocalizedText();
	const modulesQuery = useAvailableModules();
	const categories = useMemo(
		() => modulesQuery.data ?? [],
		[modulesQuery.data],
	);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	// Module on/off is UI-state only until the backend exposes an activation
	// endpoint; everything defaults to active.
	const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
	const { sortField, sortDir, toggleSort } =
		useTableSort<ModuleSortField>();

	const selected =
		categories.find((category) => category.id === selectedId) ??
		categories[0];

	const sortedModules = useMemo(() => {
		if (!selected) return [];
		return sortItems(selected.modules, sortField, sortDir, (item, field) =>
			field === "status"
				? String(enabledMap[item.id] ?? true)
				: localized(item.name),
		);
	}, [selected, sortField, sortDir, enabledMap, localized]);

	if (modulesQuery.isLoading)
		return (
			<div className="flex gap-6 rounded-md border border-slate-200 bg-white p-6">
				<Skeleton className="h-64 w-56" />
				<Skeleton className="h-64 flex-1" />
			</div>
		);

	if (modulesQuery.isError || categories.length === 0)
		return (
			<div className="rounded-md border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
				<Translate text={localizationConstants.moduleLoadFailed} />
			</div>
		);

	return (
		<div className="flex flex-col gap-0 rounded-md border border-slate-200 bg-white md:flex-row">
			<aside className="w-full shrink-0 border-b border-slate-200 p-5 md:w-60 md:border-b-0 md:border-r">
				<h2 className="mb-4 text-lg font-semibold text-slate-900">
					<Translate text={localizationConstants.adminSetting} />
				</h2>
				<nav className="flex flex-col gap-1">
					{categories.map((category) => (
						<button
							key={category.id}
							type="button"
							onClick={() => setSelectedId(category.id)}
							className={cn(
								"cursor-pointer rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors",
								selected?.id === category.id
									? "bg-slate-100 text-slate-900"
									: "text-slate-600 hover:bg-slate-50",
							)}
						>
							{localized(category.title)}
						</button>
					))}
				</nav>
			</aside>
			<div className="flex-1 p-5">
				{selected && (
					<>
						<h2 className="mb-4 text-lg font-semibold text-slate-900">
							{localized(selected.title)}
						</h2>
						<ModuleTable
							modules={sortedModules}
							enabledMap={enabledMap}
							onToggle={(moduleId, enabled) =>
								setEnabledMap((current) => ({
									...current,
									[moduleId]: enabled,
								}))
							}
							sortField={sortField}
							onToggleSort={toggleSort}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default ModuleSettingsTab;
