"use client";

import React from "react";
import { FileText, PenLine, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface DetailSectionCardProps {
	titleKey: string;
	editAriaLabelKey: string;
	onEdit: () => void;
	icon?: LucideIcon;
	children: React.ReactNode;
}

export function DetailSectionCard({
	titleKey,
	editAriaLabelKey,
	onEdit,
	icon: Icon = FileText,
	children,
}: DetailSectionCardProps) {
	const t = useTranslate();
	return (
		<Card className="w-full border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
			<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<Icon className="h-5 w-5 text-slate-700" aria-hidden />
					<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
						<Translate text={titleKey} />
					</h2>
				</div>

				<button
					type="button"
					onClick={onEdit}
					aria-label={t(editAriaLabelKey)}
					className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm transition-colors"
				>
					<PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" aria-hidden />
					<Translate text={localizationConstants.editLabel} />
				</button>
			</div>

			<CardContent className="px-6 py-3 bg-white">{children}</CardContent>
		</Card>
	);
}
