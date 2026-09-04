"use client";

import React, { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface OrderAccordionSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	hideToggle?: boolean;
}

export function OrderAccordionSection({
	title,
	icon,
	children,
	defaultOpen = true,
	hideToggle = false,
}: OrderAccordionSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (hideToggle) {
		return (
			<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
				<div className="flex h-14 min-h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
					<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
						<span className="flex items-center shrink-0 text-slate-800">{icon}</span>
						<h3 className="font-sans text-base font-medium leading-6 text-slate-900 truncate">
							{title}
						</h3>
					</div>
				</div>
				<div className="p-4 sm:p-6">{children}</div>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 text-left hover:bg-slate-50/50 rounded-none shadow-none font-normal"
					>
						<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
							<span className="flex items-center shrink-0 text-slate-800">{icon}</span>
							<h3 className="font-sans text-base font-medium leading-6 text-slate-900 truncate">
								{title}
							</h3>
						</div>
						<ChevronUp
							size={18}
							className={cn(
								"text-zinc-500 transition-transform duration-200 shrink-0",
								!isOpen && "rotate-180"
							)}
							aria-hidden={true}
						/>
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="p-4 sm:p-6">{children}</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
