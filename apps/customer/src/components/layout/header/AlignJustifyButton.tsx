"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	AlignJustify,
	LogOut,
} from "lucide-react";

import HeaderIconButton from "./HeaderIconButton";
import { SLATE } from "@/constants/colors";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

type AlignJustifyButtonProps = {
	onLogoutClick?: () => void;
};

const AlignJustifyButton = ({ onLogoutClick }: AlignJustifyButtonProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<HeaderIconButton aria-label="Menu">
					<AlignJustify
						className="w-5 h-5 sm:w-6 sm:h-6"
						color={SLATE[800]}
					/>
				</HeaderIconButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56 px-2.5 py-3">
				{/* Logout */}
				<DropdownMenuItem
					className="gap-3 text-red-600 focus:text-red-600"
					onSelect={() => onLogoutClick?.()}
				>
					<LogOut className="w-4 h-4 text-red-600" />
					<Translate text={localizationConstants.logout} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AlignJustifyButton;
