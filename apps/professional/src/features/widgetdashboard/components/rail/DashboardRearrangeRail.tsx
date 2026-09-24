"use client";

import { Check, Layers, LayoutList, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { WidgetItem } from "../DraggableSidebarItem";

export interface DashboardRearrangeRailProps {
	/** Widgets offered in the Menu card. */
	items: WidgetItem[];
	/** Id of the highlighted Menu entry. */
	selectedItem: string;
	onSelectItem: (id: string) => void;
	isRearranging: boolean;
	onToggleRearrange: () => void;
	/** False when the page draws the Ordna om button itself, as the Analys frame does. */
	showToggle?: boolean;
	onSave: () => void;
	onDiscard: () => void;
	/** The discard button's label; "Avbryt" unless a dashboard names it otherwise. */
	discardLabel?: TranslationKeys;
	isSaving?: boolean;
	/** Ids already placed on the grid; they render muted and are not selectable. */
	placedItemIds?: string[];
	className?: string;
}

/**
 * Right-hand rail of a module dashboard: a Rearrange toggle, a Save/Discard
 * card and the Menu card listing the module's widgets.
 *
 * Extracted from B2BDashboard so Purchase (and later B2B and Agreement) share
 * one implementation instead of each hand-rolling the same chrome.
 */
export function DashboardRearrangeRail({
	items,
	selectedItem,
	onSelectItem,
	isRearranging,
	onToggleRearrange,
	showToggle = true,
	onSave,
	onDiscard,
	discardLabel = localizationConstants.widgetRailDiscard,
	isSaving = false,
	placedItemIds = [],
	className,
}: DashboardRearrangeRailProps) {
	return (
		<div className={cn("w-full shrink-0 space-y-4 xl:w-90", className)}>
			{showToggle && (
				<div className="flex justify-end">
					<Button
						type="button"
						variant={isRearranging ? "default" : "secondary"}
						size="sm"
						onClick={onToggleRearrange}
						aria-pressed={isRearranging}
						className={cn(
							"flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-all",
							isRearranging
								? "bg-[#111827] text-white shadow-xs hover:bg-black"
								: "bg-[#F4F4F5] text-slate-700 hover:bg-slate-200",
						)}
					>
						<LayoutList size={16} />
						<span>
							<Translate text={localizationConstants.rearrange} />
						</span>
					</Button>
				</div>
			)}

			<div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
				<Button
					type="button"
					onClick={onSave}
					disabled={isSaving}
					className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#111827] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#111827]/90 disabled:opacity-70"
				>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin text-white" />
					) : (
						<Check size={16} />
					)}
					<span>
						<Translate text={localizationConstants.confirmSave} />
					</span>
				</Button>
				<Button
					type="button"
					variant="secondary"
					onClick={onDiscard}
					className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#F4F4F5] px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
				>
					<X size={16} />
					<span>
						<Translate text={discardLabel} />
					</span>
				</Button>
			</div>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
				<div className="mb-3 flex items-center gap-2 rounded-sm bg-[#111827] px-4 py-3">
					<Layers size={16} className="text-white" />
					<span className="text-sm font-medium text-white">
						<Translate
							text={localizationConstants.widgetRailMenuTitle}
						/>
					</span>
				</div>
				<div className="space-y-0.5">
					{items.map((item) => {
						const isPlaced = placedItemIds.includes(item.id);
						const ItemIcon = item.icon;

						return (
							<button
								key={item.id}
								type="button"
								onClick={() => onSelectItem(item.id)}
								aria-pressed={selectedItem === item.id}
								className={cn(
									"flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-left transition-colors",
									"focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 focus-visible:outline-none",
									selectedItem === item.id
										? "bg-[#1E293B] text-white"
										: "text-slate-800 hover:bg-slate-100",
									isPlaced &&
										selectedItem !== item.id &&
										"text-slate-400",
								)}
							>
								<ItemIcon size={16} />
								<span className="text-sm leading-5 font-medium tracking-normal">
									<Translate text={item.label} />
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default DashboardRearrangeRail;
