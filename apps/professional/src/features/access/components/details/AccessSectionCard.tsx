"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

interface AccessSectionCardProps {
	icon: ReactNode;
	title: TranslationKeys;
	/** Omit for a card without an Edit button (the Documents and Images cards). */
	onEdit?: () => void;
	children: ReactNode;
}

/** One card of the details pages: icon, title and an Edit button over a divider, then the content. */
export function AccessSectionCard({ icon, title, onEdit, children }: AccessSectionCardProps) {
	const t = useTranslate();

	return (
		<section className="rounded-xl border border-slate-200 bg-white">
			<header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
				<h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
					{icon}
					<Translate text={title} />
				</h2>
				{onEdit && (
					<Button
						type="button"
						variant="ghost"
						className="h-9 cursor-pointer gap-2 bg-slate-100 text-slate-900 hover:bg-slate-200"
						aria-label={t(localizationConstants.accessEditSectionLabel, { section: t(title) })}
						onClick={onEdit}
					>
						<Pencil className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.edit} />
					</Button>
				)}
			</header>
			{children}
		</section>
	);
}
