"use client";

import { Inbox } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import UserAvatarButton from "./UserAvatarButton";
import AlignJustifyButton from "./AlignJustifyButton";
import AppLauncherDropdown from "./AppLauncherDropdown";
import HeaderLanguageSelect from "./HeaderLanguageSelect";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuthStatus, User, Company } from "@/context/AuthContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
	const { user, company } = useAuthStatus() as { user: User; company: Company | null };

	return (
		<header className="relative flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-3 sm:px-5">
			{/* Left spacer */}
			<div className="flex items-center gap-2" />

			{/* Keep the compact mark clear of controls on mobile; center it from tablet up. */}
			<div className="pointer-events-auto absolute left-3 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center md:fixed md:left-1/2 md:top-8 md:-translate-x-1/2">
				<CompanyLogo name={company?.company_name || "PhiloMetric"} logoUrl={null} />
			</div>

			{/* Right section */}
			<div className="flex items-center justify-end gap-1 sm:gap-2 ml-auto z-40">
				<HeaderLanguageSelect />

				{/* Notification */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<NotificationBell
							aria-label="Notifications"
							showBadge={true}
							count={12}
						/>
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
						name={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Admin"}
						role="Administrator"
						initials={
							`${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""}` ||
							"A"
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
