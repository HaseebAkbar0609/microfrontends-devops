"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface UsersToolbarProps {
	onCreateClick?: () => void;
	createButtonLabel?: string;
	className?: string;
}

export function UsersToolbar({
	onCreateClick,
	createButtonLabel = localizationConstants.createNewButtonText,
	className,
}: UsersToolbarProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4  px-5 py-6 ",
				className,
			)}
		>
			<div className="flex items-center gap-3 flex-1 max-w-2xl">
			</div>

			{onCreateClick && (
				<Button
					onClick={onCreateClick}
					className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md transition-colors"
				>
					<Plus className="h-4 w-4" />
					<Translate text={createButtonLabel} />
				</Button>
			)}
		</div>
	);
}
