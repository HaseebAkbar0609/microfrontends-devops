"use client";

import { ChevronDown, X, Check } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MultiTagSelectProps {
	placeholder: string;
	options: string[];
	selected: string[];
	onToggle: (val: string) => void;
	className?: string;
}

export function MultiTagSelect({
	placeholder,
	options,
	selected,
	onToggle,
	className = "",
}: MultiTagSelectProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={`flex min-h-10 h-auto w-full cursor-pointer flex-wrap items-center justify-start gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-left text-sm font-normal shadow-none hover:bg-white hover:border-slate-300 focus:ring-0 ${className}`}
				>
					{selected.length === 0 ? (
						<span className="text-slate-400 text-sm">{placeholder}</span>
					) : (
						selected.map((val) => (
							<Badge
								key={val}
								variant="secondary"
								className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-800 hover:bg-slate-200"
								onClick={(e) => {
									e.stopPropagation();
									onToggle(val);
								}}
							>
								{val}
								<X size={12} className="cursor-pointer text-slate-500 hover:text-slate-900" aria-hidden />
							</Badge>
						))
					)}
					<ChevronDown size={14} className="ml-auto shrink-0 text-slate-950 opacity-100" aria-hidden />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56 bg-white">
				{options.map((opt) => {
					const isChecked = selected.includes(opt);
					return (
						<DropdownMenuItem
							key={opt}
							onClick={() => onToggle(opt)}
							className="cursor-pointer text-sm flex items-center justify-between py-2"
						>
							<span>{opt}</span>
							{isChecked && <Check size={14} className="text-slate-900" />}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
