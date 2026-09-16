"use client";

import { CircleX, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/**
 * The frame's status pills: green with a folder for a positive state
 * (Skickad, Betald), amber with a crossed circle for a pending one.
 */
export function AcontoBadge({ labelKey, positive }: { labelKey: TranslationKeys; positive: boolean }) {
	const Icon = positive ? FolderOpen : CircleX;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
				positive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
			)}
		>
			<Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
			<Translate text={labelKey} />
		</span>
	);
}

export default AcontoBadge;
