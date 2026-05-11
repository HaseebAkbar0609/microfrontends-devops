"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";
import type { TagSelectorProps } from "@/features/leads/management/types";

export default function TagSelector({
	label,
	options,
	selected,
	onToggle,
	open,
	onOpenChange,
	isEditing,
}: TagSelectorProps) {
	return (
		<div className="space-y-3">
			<button
				type="button"
				onClick={() => onOpenChange(!open)}
				className="flex w-full items-center justify-between rounded-md h-8 border border-slate-200 bg-slate-50 px-4 py-3 text-left"
			>
				<span className="text-sm font-medium text-slate-900">{label}</span>
				<ChevronDown
					className={`size-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			<div className="flex flex-wrap gap-2">
				{selected.map((item) => (
					<div
						key={item}
						className="inline-flex items-center gap-2 h-6 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
					>
						<span>{item}</span>
						{isEditing ? (
							<button type="button" onClick={() => onToggle(item)} className="text-slate-500">
								<X className="size-4" />
							</button>
						) : null}
					</div>
				))}
			</div>

			{open && isEditing ? (
				<div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-2">
					{options.map((option) => (
						<label
							key={option}
							className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
						>
							<Checkbox
								checked={selected.includes(option)}
								onCheckedChange={() => onToggle(option)}
							/>
							<span className="text-sm text-slate-700">{option}</span>
						</label>
					))}
				</div>
			) : null}
		</div>
	);
}
