"use client";

import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

const CLASS = "h-9 w-9 cursor-pointer rounded-md border-slate-200 text-slate-900";

/**
 * The pencil in a card header. A link when editing happens elsewhere, a button
 * when it opens something here — either way named for what it edits, since the
 * icon alone says nothing to a screen reader.
 */
export function PlanCardHeaderAction({
	labelKey,
	href,
	onClick,
}: {
	labelKey: TranslationKeys;
	href?: string;
	onClick?: () => void;
}) {
	const t = useTranslate();
	const label = t(labelKey);
	const icon = <PencilLine className="h-4 w-4" aria-hidden />;

	if (href) {
		return (
			<Button asChild variant="outline" size="icon" className={CLASS}>
				<Link href={href} aria-label={label} title={label}>
					{icon}
				</Link>
			</Button>
		);
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={onClick}
			aria-label={label}
			title={label}
			className={CLASS}
		>
			{icon}
		</Button>
	);
}

export default PlanCardHeaderAction;
