import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** The white bordered boxes of the Översikt tab, with an optional title. */
export function ArticleCard({
	title,
	className,
	children,
}: {
	title?: TranslationKeys;
	className?: string;
	children: ReactNode;
}) {
	return (
		<section className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}>
			{title && (
				<h3 className="mb-3 text-base font-semibold text-slate-900">
					<Translate text={title} />
				</h3>
			)}
			{children}
		</section>
	);
}

/** A label–value row, separated from the next by a line, as in the Figma cards. */
export function ArticleCardRow({
	label,
	children,
	className,
}: {
	label: TranslationKeys;
	children: ReactNode;
	className?: string;
}) {
	return (
		// When label and value do not fit side by side ("Purchase price", "SEK 85.00/pcs" in a narrow
		// card), the value moves to its own line, still right-aligned, instead of running out of the card.
		<div
			className={cn(
				"flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-slate-100 py-2.5 text-sm last:border-b-0",
				className,
			)}
		>
			<dt className="text-slate-600">
				<Translate text={label} />
			</dt>
			<dd className="ml-auto text-right whitespace-nowrap text-slate-900 tabular-nums">{children}</dd>
		</div>
	);
}

/** Said in a tab or card that has nothing to list yet. */
export function ArticleEmptyText({ text }: { text: TranslationKeys }) {
	return (
		<p className="py-6 text-center text-sm text-slate-500">
			<Translate text={text} />
		</p>
	);
}
