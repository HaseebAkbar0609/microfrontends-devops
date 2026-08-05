"use client";

import { useState } from "react";
import UserAvatarButton from "./UserAvatarButton";
import AlignJustifyButton from "./AlignJustifyButton";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { useAuthStatus } from "@/context/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const Header = () => {
	const [logoutOpen, setLogoutOpen] = useState(false);
	const { user } = useAuthStatus();

	const initials =
		user?.first_name && user?.last_name
			? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
			: "OR";

	const fullName =
		user?.first_name && user?.last_name
			? `${user.first_name} ${user.last_name}`
			: "Olivia Rhye";

	return (
		<header className="flex h-16 w-full items-center border-b border-slate-200 bg-white px-3 sm:px-5">
			{/* Left spacer (tablet only) */}
			<div className="hidden sm:flex flex-1" />

			{/* Right section */}
			<div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
				{/* Notification */}
				<NotificationBell aria-label="Notifications" showBadge={true} count={3} />

				{/* Avatar (hidden on very small screens) */}
				<div className="hidden sm:block">
					<UserAvatarButton
						name={fullName}
						role="Administrator"
						initials={initials}
					/>
				</div>

				{/* Menu */}

				<AlignJustifyButton onLogoutClick={() => setLogoutOpen(true)} />
			</div>

			<LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
		</header>
	);
};

export default Header;
