"use client";

import React from "react";
import { ChevronDown, HeartPulse, Activity } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { HalsaSubView } from "@/features/personnel/types/halsa.types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HalsaHeaderToolbarProps {
	subView: HalsaSubView;
	onSelectSubView: (view: HalsaSubView) => void;
}

export function HalsaHeaderToolbar({
	subView,
	onSelectSubView,
}: HalsaHeaderToolbarProps) {
	return (
		<div className="flex items-center justify-between pb-1">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="h-9 px-3.5 border-slate-200 bg-white font-semibold text-slate-900 shadow-2xs gap-2 cursor-pointer hover:bg-slate-50"
					>
						{subView === "friskvard" ? (
							<>
								<HeartPulse className="w-4 h-4 text-emerald-600" />
								<Translate text={localizationConstants.halsaDropdownFriskvard} />
							</>
						) : (
							<>
								<Activity className="w-4 h-4 text-rose-600" />
								<Translate text={localizationConstants.halsaDropdownRehab} />
							</>
						)}
						<ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-48">
					<DropdownMenuItem
						onClick={() => onSelectSubView("friskvard")}
						className="flex items-center gap-2 text-xs font-medium cursor-pointer"
					>
						<HeartPulse className="w-4 h-4 text-emerald-600" />
						<Translate text={localizationConstants.halsaDropdownFriskvard} />
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSelectSubView("rehab")}
						className="flex items-center gap-2 text-xs font-medium cursor-pointer"
					>
						<Activity className="w-4 h-4 text-rose-600" />
						<Translate text={localizationConstants.halsaDropdownRehab} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
