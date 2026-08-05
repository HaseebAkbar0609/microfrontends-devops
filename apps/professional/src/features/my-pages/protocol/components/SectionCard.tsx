"use client";

import { ReactNode, useState } from "react";
import { ChevronUp, LucideIcon } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

interface SectionCardProps {
	icon: LucideIcon;
	titleKey: string;
	children: ReactNode;
}

const SectionCard = ({ icon: Icon, titleKey, children }: SectionCardProps) => {
	const [open, setOpen] = useState(true);

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className="rounded-md border border-slate-200 bg-white"
		>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className="flex w-full cursor-pointer items-center justify-between border-b border-slate-100 px-5 py-4"
				>
					<span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Icon className="h-4 w-4 text-slate-600" />
						<Translate text={titleKey} />
					</span>
					<ChevronUp
						className={cn(
							"h-4 w-4 text-slate-400 transition-transform",
							!open && "rotate-180",
						)}
					/>
				</button>
			</CollapsibleTrigger>
			<CollapsibleContent className="px-5 py-4">
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
};

export default SectionCard;
