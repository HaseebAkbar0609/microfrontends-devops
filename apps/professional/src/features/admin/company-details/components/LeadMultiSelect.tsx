"use client";

import { Check, ChevronDown, X } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface LeadMultiSelectProps {
	options: string[];
	selected: string[];
	onToggle: (option: string) => void;
	showHeader?: boolean;
}

const LeadMultiSelect = ({
	options,
	selected,
	onToggle,
	showHeader = false,
}: LeadMultiSelectProps) => (
	<Popover>
		<PopoverTrigger asChild>
			<button
				type="button"
				className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-left text-sm"
			>
				<span className="flex flex-wrap items-center gap-1.5">
					{selected.map((option) => (
						<span
							key={option}
							className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-sm text-slate-700"
						>
							{option}
							<span
								role="button"
								tabIndex={0}
								aria-label={option}
								onClick={(event) => {
									event.stopPropagation();
									onToggle(option);
								}}
								onKeyDown={(event) => {
									if (
										event.key === "Enter" ||
										event.key === " "
									) {
										event.preventDefault();
										event.stopPropagation();
										onToggle(option);
									}
								}}
								className="cursor-pointer"
							>
								<X className="h-3.5 w-3.5 text-slate-400" />
							</span>
						</span>
					))}
				</span>
				<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
			</button>
		</PopoverTrigger>
		<PopoverContent
			align="start"
			className="w-[var(--radix-popover-trigger-width)] rounded-md border border-slate-200 bg-white p-1 shadow-md"
		>
			{showHeader && (
				<p className="border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">
					<Translate
						text={localizationConstants.companyLeadsAllCategories}
					/>
				</p>
			)}
			{options.map((option) => {
				const isSelected = selected.includes(option);
				return (
					<button
						key={option}
						type="button"
						onClick={() => onToggle(option)}
						className={cn(
							"flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50",
							isSelected && "text-slate-900",
						)}
					>
						{option}
						{isSelected && (
							<Check className="h-4 w-4 text-slate-700" />
						)}
					</button>
				);
			})}
		</PopoverContent>
	</Popover>
);

export default LeadMultiSelect;
