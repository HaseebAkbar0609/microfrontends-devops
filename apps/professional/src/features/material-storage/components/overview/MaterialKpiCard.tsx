import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export type MaterialKpiTone = "blue" | "green" | "orange" | "violet";

const TONE_TEXT_CLASSES: Record<MaterialKpiTone, string> = {
	blue: "text-blue-600",
	green: "text-emerald-600",
	orange: "text-orange-500",
	violet: "text-violet-500",
};

const TONE_ICON_CLASSES: Record<MaterialKpiTone, string> = {
	blue: "bg-blue-50 text-blue-600",
	green: "bg-emerald-50 text-emerald-600",
	orange: "bg-orange-50 text-orange-500",
	violet: "bg-violet-50 text-violet-500",
};

export interface MaterialKpiCardProps {
	label: TranslationKeys;
	/** Already formatted. Undefined while loading. */
	value: string | undefined;
	icon: LucideIcon;
	tone: MaterialKpiTone;
	/** Draws the value in the tone's colour, as the Figma frame does for low stock. */
	emphasis?: boolean;
	loading: boolean;
}

/**
 * Five cards share one row from xl up, so below 2xl the card is more compact:
 * at 1280px each gets about 214px and still has to fit "1 248 650 kr".
 */
export function MaterialKpiCard({ label, value, icon: Icon, tone, emphasis, loading }: MaterialKpiCardProps) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 2xl:gap-4 2xl:p-5">
			<span
				className={cn(
					"flex size-11 shrink-0 items-center justify-center rounded-full 2xl:size-14",
					TONE_ICON_CLASSES[tone],
				)}
				aria-hidden
			>
				<Icon className="size-5 2xl:size-6" />
			</span>
			<div className="min-w-0">
				<p className="truncate text-sm text-slate-600">
					<Translate text={label} />
				</p>
				{loading || value === undefined ? (
					<Skeleton className="mt-1.5 h-7 w-24 2xl:h-8 2xl:w-28" />
				) : (
					<p
						title={value}
						className={cn(
							"mt-0.5 truncate text-xl font-semibold tracking-tight tabular-nums 2xl:text-2xl",
							emphasis ? TONE_TEXT_CLASSES[tone] : "text-slate-900",
						)}
					>
						{value}
					</p>
				)}
			</div>
		</div>
	);
}
