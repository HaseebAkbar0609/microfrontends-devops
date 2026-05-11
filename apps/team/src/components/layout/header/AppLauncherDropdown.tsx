"use client";

import { LayoutGrid } from "lucide-react";
import HeaderIconButton from "./HeaderIconButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_GROUPS } from "../constants/header";
import { Translate } from "@/utils/translation/translate";

const AppLauncherDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<HeaderIconButton
					aria-label="App launcher"
					className="bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-0 focus-visible:outline-none"
				>
					<LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
				</HeaderIconButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className="w-72 p-3 bg-[#1e2535] border-[#2d3650] rounded-xl shadow-2xl h-full max-h-80 overflow-y-auto no-scrollbar"
			>
				<div className="space-y-3">
					{APP_GROUPS.map((group) => (
						<div key={group.category}>
							{/* Category label */}
							<p className="text-center text-xs font-medium text-slate-400 mb-2">
								<Translate text={group.category} />
							</p>

							{/* Items grid */}
							<div className="grid grid-cols-3 gap-2">
								{group.items.map((app) => {
									const Icon = app.icon;
									return (
										<button
											key={app.label}
											className="flex flex-col items-center justify-center gap-1.5 rounded-lg bg-[#263047] hover:bg-[#2e3a55] transition-colors p-2.5 cursor-pointer group"
										>
											<Icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
											<span className="text-[10px] leading-tight text-center text-slate-300 group-hover:text-white transition-colors whitespace-pre-line">
												<Translate text={app.label} />
											</span>
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AppLauncherDropdown;
