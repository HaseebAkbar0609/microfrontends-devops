"use client";

import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type {
	BookableMachine,
	BookedMachine,
} from "../types/bookMachine.types";

interface MachinePickerPaneProps {
	titleKey: TranslationKeys;
	/** Shown as the orange pill beside the title; omitted on the booked pane. */
	count?: number;
	machines: (BookableMachine | BookedMachine)[];
	/** Rows render checked on the booked pane, unchecked on the available one. */
	checked: boolean;
	onToggle: (machineId: string) => void;
	emptyKey: TranslationKeys;
	search: string;
	onSearchChange: (value: string) => void;
	expanded: boolean;
	onToggleExpanded: () => void;
}

function bookedUntil(machine: BookableMachine | BookedMachine) {
	return "bookedUntil" in machine ? machine.bookedUntil : undefined;
}

/**
 * One side of the "Boka maskin" picker. The left pane lists what is still
 * available and the right what is already booked; ticking a row moves it
 * across, so the same pane renders both sides.
 */
export function MachinePickerPane({
	titleKey,
	count,
	machines,
	checked,
	onToggle,
	emptyKey,
	search,
	onSearchChange,
	expanded,
	onToggleExpanded,
}: MachinePickerPaneProps) {
	const t = useTranslate();

	return (
		<div className="flex w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
			<button
				type="button"
				onClick={onToggleExpanded}
				aria-expanded={expanded}
				className="flex h-14 shrink-0 cursor-pointer items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/60 px-4 text-left"
			>
				<span className="flex items-center gap-2 text-base font-medium text-slate-900">
					<Translate text={titleKey} />
					{count !== undefined && (
						<span className="rounded-md bg-[#F97316] px-2 py-0.5 text-xs font-medium text-white">
							{count}
						</span>
					)}
				</span>
				{expanded ? (
					<ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
				) : (
					<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
				)}
			</button>

			{expanded && (
				<>
					<div className="relative shrink-0 border-b border-slate-200 px-4 py-3">
						<Search className="pointer-events-none absolute top-1/2 left-7 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={search}
							onChange={(event) => onSearchChange(event.target.value)}
							placeholder={t(localizationConstants.machineBookSearch)}
							aria-label={t(localizationConstants.machineBookSearch)}
							className="h-9 border-none bg-transparent pl-8 text-sm shadow-none focus-visible:ring-0"
						/>
					</div>

					<div className="flex max-h-96 flex-col gap-2 overflow-y-auto p-3">
						{machines.length === 0 ? (
							<p className="px-1 py-8 text-center text-xs text-slate-500">
								<Translate text={emptyKey} />
							</p>
						) : (
							machines.map((machine) => {
								const until = bookedUntil(machine);

								return (
									<label
										key={machine.id}
										className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50/60"
									>
										<Checkbox
											checked={checked}
											onCheckedChange={() => onToggle(machine.id)}
											aria-label={`${machine.machineNo} ${machine.name}`}
											// The design ticks the box in the page's dark accent,
											// not the theme's orange primary.
											className="size-5 cursor-pointer rounded-md data-[state=checked]:border-[#111721] data-[state=checked]:bg-[#111721] data-[state=checked]:text-white"
										/>
										<span className="flex min-w-0 flex-1 flex-col">
											<span className="truncate text-sm font-semibold text-slate-900">
												{machine.machineNo}
											</span>
											<span className="truncate text-xs text-slate-400">
												{machine.name}
												{machine.supplier ? ` · ${machine.supplier}` : ""}
											</span>
										</span>
										{until && (
											<span className="flex shrink-0 flex-col text-right">
												<span className="text-[11px] text-slate-400">
													<Translate
														text={localizationConstants.machineBookBookedUntil}
													/>
												</span>
												<span className="text-xs text-slate-400">{until}</span>
											</span>
										)}
									</label>
								);
							})
						)}
					</div>
				</>
			)}
		</div>
	);
}
