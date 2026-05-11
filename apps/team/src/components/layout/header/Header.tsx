"use client";

import { useState } from "react";
import { BellDot } from "lucide-react";
import HeaderIconButton from "./HeaderIconButton";
import UserAvatarButton from "./UserAvatarButton";
import { SLATE } from "@/constants/colors";
import AlignJustifyButton from "./AlignJustifyButton";
import AppLauncherDropdown from "./AppLauncherDropdown";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useAuthStatus } from "@/context/AuthContext";

const Header = () => {
	const [logoutOpen, setLogoutOpen] = useState(false);
	const { user } = useAuthStatus();

	return (
		<header className="flex h-16 w-full items-center border-b border-slate-200 bg-white px-3 sm:px-5">
			<div className="hidden flex-1 sm:flex" />

			<div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<HeaderIconButton aria-label="Notifications">
							<BellDot
								className="h-5 w-5 sm:h-6 sm:w-6"
								color={SLATE[800]}
							/>
						</HeaderIconButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-64 rounded-2xl p-3">
						<div className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.notifications} />
						</div>
						<div className="mt-2 rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.noNotifications} />
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="hidden sm:block">
					<UserAvatarButton user={user} />
				</div>

				<AlignJustifyButton onLogoutClick={() => setLogoutOpen(true)} />
				<AppLauncherDropdown />
			</div>

			<LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
		</header>
	);
};

export default Header;
