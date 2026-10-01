"use client";

import { Plus } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { AccessStatusId, AccessTypeId } from "../types/access.types";
import { AccessFilterMenu } from "./AccessFilterMenu";

interface AccessToolbarProps {
	search: string;
	onSearchChange: (search: string) => void;
	status: AccessStatusId | null;
	type: AccessTypeId | null;
	onStatusChange: (status: AccessStatusId | null) => void;
	onTypeChange: (type: AccessTypeId | null) => void;
	onClearFilters: () => void;
	onNew: () => void;
}

/** Search and Filter on the left, "Ny åtkomsthantering" on the right, as in the Figma frame. */
export function AccessToolbar({
	search,
	onSearchChange,
	status,
	type,
	onStatusChange,
	onTypeChange,
	onClearFilters,
	onNew,
}: AccessToolbarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-center gap-3 p-4">
			<Search
				value={search}
				onChange={onSearchChange}
				placeholder={localizationConstants.search}
				aria-label={t(localizationConstants.search)}
				wrapperClassName="w-full md:w-md"
				className="h-10 rounded-md border border-slate-200 bg-white text-sm text-slate-900 focus-visible:border-slate-400"
			/>
			<AccessFilterMenu
				status={status}
				type={type}
				onStatusChange={onStatusChange}
				onTypeChange={onTypeChange}
				onClear={onClearFilters}
			/>
			<Button type="button" className="ml-auto h-10 cursor-pointer gap-2" onClick={onNew}>
				<Plus className="h-4 w-4" aria-hidden />
				<Translate text={localizationConstants.accessNewButton} />
			</Button>
		</div>
	);
}
