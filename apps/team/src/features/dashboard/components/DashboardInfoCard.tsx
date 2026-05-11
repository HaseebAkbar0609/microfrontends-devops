"use client";

import { MoreVertical, type LucideIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";

interface DashboardInfoCardProps {
	title: string;
	lines: string[];
	icon: LucideIcon;
	className?: string;
	isEmpty?: boolean;
}

export default function DashboardInfoCard({
	title,
	lines,
	icon: Icon,
	className,
	isEmpty,
}: DashboardInfoCardProps) {
	if (isEmpty) {
		return (
			<div
				className={`h-full rounded-md border-2 border-dashed border-slate-200 bg-transparent p-4 ${className ?? ""}`}
			>
				<div className="flex items-start justify-between">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
						<Icon size={16} className="text-slate-400" />
					</div>
				</div>
				<div className="mt-3 text-sm font-semibold uppercase text-slate-400">
					<Translate text={title} />
				</div>
				<div className="mt-2 text-xs text-slate-400">
					<Translate text={localizationConstants.placeHere} />
				</div>
			</div>
		);
	}

	return (
		<div
			className={`h-full rounded-md border border-slate-200 bg-app-surface p-4 ${className ?? ""}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
					<Icon size={16} className="text-slate-700" />
				</div>
				<Button
					type="button"
					variant="ghost"
					aria-label="More"
					className="rounded-md p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-600"
				>
					<MoreVertical size={16} />
				</Button>
			</div>
			<div className="mt-3 text-sm font-semibold text-slate-900">
				<Translate text={title} />
			</div>
			<div className="mt-2 space-y-1 text-xs text-slate-500">
				{lines.map((line) => (
					<div key={line}>
						<Translate text={line} />
					</div>
				))}
			</div>
		</div>
	);
}
