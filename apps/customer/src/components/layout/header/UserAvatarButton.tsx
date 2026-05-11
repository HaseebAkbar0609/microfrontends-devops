"use client";

import { Tooltip } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface UserAvatarButtonProps {
	name?: string;
	role?: string;
	initials?: string;
	className?: string;
}

const UserAvatarButton = ({
	initials = "OR",
	className,
}: UserAvatarButtonProps) => {
	return (
		<Tooltip
			content={<Translate text={localizationConstants.comingSoon} />}
			position={"bottom"}
		>
			<button
				type="button"
				aria-label="Open user menu"
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white shadow-sm hover:opacity-90",
					className,
				)}
			>
				{initials}
			</button>
		</Tooltip>
	);
};

export default UserAvatarButton;
