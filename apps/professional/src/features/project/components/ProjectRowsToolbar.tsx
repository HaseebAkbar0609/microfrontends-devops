"use client";

import { ChevronDown, Printer, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface ProjectRowsToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	filter: string | null;
	onFilterChange: (value: string | null) => void;
	/** Values drawn from the rows themselves, so the list cannot drift. */
	filterOptions: string[];
	/** Right-hand slot — the list puts "Skapa nytt" here; Arkiv has nothing. */
	action?: React.ReactNode;
}

/**
 * Sök, Filter and Skriv ut, above a project table.
 *
 * Lifted out of `ProjectListTab` so Arkiv shows the same toolbar rather than a
 * second copy of the markup. The Filter dropdown deliberately keeps its
 * existing behaviour of listing Kategori and Avdelning values together, so the
 * two screens behave alike; splitting them is its own decision.
 */
export function ProjectRowsToolbar({
	search,
	onSearchChange,
	filter,
	onFilterChange,
	filterOptions,
	action,
}: ProjectRowsToolbarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-wrap items-center gap-4">
				<div className="relative w-72 max-w-full">
					<Search
						aria-hidden
						className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-slate-400"
					/>
					<Input
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder={t(localizationConstants.search)}
						aria-label={t(localizationConstants.search)}
						className="h-10 rounded-none border-0 border-b border-slate-200 pl-6 shadow-none focus-visible:border-slate-900 focus-visible:ring-0"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-10 cursor-pointer gap-2 rounded-md border-slate-200 text-sm font-normal text-slate-700"
						>
							{filter ?? (
								<Translate text={localizationConstants.filter} />
							)}
							<ChevronDown className="h-4 w-4 text-slate-500" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-56 rounded-md border border-slate-200 bg-white p-1 shadow-md"
					>
						<DropdownMenuItem
							onClick={() => onFilterChange(null)}
							className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
						>
							<Translate
								text={localizationConstants.projectListFilterAll}
							/>
						</DropdownMenuItem>
						{filterOptions.map((option) => (
							<DropdownMenuItem
								key={option}
								onClick={() => onFilterChange(option)}
								className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
							>
								{option}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => window.print()}
					title={t(localizationConstants.projectListPrint)}
					aria-label={t(localizationConstants.projectListPrint)}
					className="h-10 w-10 cursor-pointer rounded-md border-slate-200 text-slate-700"
				>
					<Printer className="h-4 w-4" />
				</Button>
				{action}
			</div>
		</div>
	);
}

export default ProjectRowsToolbar;
