"use client";

import { BellDot, Inbox } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import HeaderIconButton from "./HeaderIconButton";
import UserAvatarButton from "./UserAvatarButton";
import { SLATE } from "@/constants/colors";
import AlignJustifyButton from "./AlignJustifyButton";
import AppLauncherDropdown from "./AppLauncherDropdown";
import HeaderLanguageSelect from "./HeaderLanguageSelect";
import { useAuthStatus, User, Company } from "@/context/AuthContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
	const { user, company } = useAuthStatus() as { user: User; company: Company | null };

	return (
		<header className="flex h-16 w-full items-center border-b border-slate-200 bg-white px-3 sm:px-5">
			{/* Left spacer (tablet only) */}
			<div className="hidden sm:flex flex-1" />

			{/* Center Logo */}
			<div className="flex flex-1 justify-center sm:flex-none">
				<CompanyLogo name={company?.company_name ?? ""} logoUrl={null} />
			</div>

			{/* Right section */}
			<div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
				<HeaderLanguageSelect />

				{/* Notification */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<HeaderIconButton aria-label="Notifications">
							<BellDot
								className="w-5 h-5 sm:w-6 sm:h-6"
								color={SLATE[800]}
							/>
						</HeaderIconButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80 p-4">
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Inbox className="w-12 h-12 text-slate-300 mb-3" />
							<p className="text-sm text-slate-500">
								No notifications
							</p>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Avatar (hidden on very small screens) */}
				<div className="hidden sm:block">
					<UserAvatarButton
						name={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
						role="Administrator"
						initials={
							`${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""}` ||
							"?"
						}
					/>
				</div>

				{/* Menu */}

				<AlignJustifyButton />

				{/* App Launcher */}
				<AppLauncherDropdown />
			</div>
		</header>
	);
};

export default Header;
