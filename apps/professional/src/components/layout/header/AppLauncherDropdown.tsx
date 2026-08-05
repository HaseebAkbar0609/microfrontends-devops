"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import HeaderIconButton from "./HeaderIconButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_GROUPS } from "../constants/header";
import { Translate, useTranslate } from "@/utils/translation/translate";

const AppLauncherDropdown = () => {
	const t = useTranslate();
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<HeaderIconButton
					aria-label="App launcher"
					className="bg-slate-900 text-white shadow-xs hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
				>
					<LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
				</HeaderIconButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className="w-[300px] sm:w-[330px] p-3.5 bg-[#141b2d] border-[#252f48] rounded-2xl shadow-2xl max-h-[80vh] lg:max-h-none overflow-y-auto no-scrollbar"
			>
				<TooltipProvider delayDuration={150}>
					<div className="space-y-5">
						{APP_GROUPS.map((group) => (
							<div key={group.category} className="space-y-2.5">
								{/* Category label */}
								<p className="text-center text-xs font-semibold tracking-wide text-[#94a3b8]">
									<Translate text={group.category} />
								</p>

								{/* Items grid */}
								<div className="grid grid-cols-3 gap-2.5">
									{group.items.map((app) => {
										const Icon = app.icon;
										const translatedLabel = t(app.label);

										return (
											<Tooltip key={app.label}>
												<TooltipTrigger asChild>
													<DropdownMenuItem asChild>
														<Link
															href={app.href}
															onClick={() => setOpen(false)}
															aria-label={translatedLabel}
															className="group flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1c2538] hover:bg-[#3b4e78] focus:bg-[#3b4e78] data-[highlighted]:bg-[#3b4e78] p-3 border border-[#27344f] hover:border-[#526c9e] data-[highlighted]:border-[#526c9e] transition-all cursor-pointer outline-none select-none shadow-2xs"
														>
															<Icon className="w-6 h-6 text-slate-200 group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors shrink-0" />
															<span className="text-[11px] font-medium leading-tight text-center text-slate-200 group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors whitespace-pre-line">
																<Translate text={app.label} />
															</span>
														</Link>
													</DropdownMenuItem>
												</TooltipTrigger>

												{/* Hover & Focus Floating Tooltip */}
												<TooltipContent side="top" className="bg-slate-950 text-white border border-slate-700 shadow-lg text-xs font-medium px-2.5 py-1">
													{translatedLabel}
												</TooltipContent>
											</Tooltip>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</TooltipProvider>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AppLauncherDropdown;
