"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/**
 * The glyph the frame draws in an empty field. A typographic mark rather than
 * copy — the same character in every locale this app ships — so it is hidden
 * from assistive tech and paired with a translated word instead. A screen
 * reader hears `purchaseInfoValueMissing`, not "em dash".
 */
const EMPTY_VALUE_GLYPH = "—";

/**
 * One read-only label/value pair, label above value.
 *
 * An absent value renders the empty-field treatment rather than an empty cell,
 * so a field with no data still reads as a field. Callers therefore store `""`,
 * never a literal "-".
 */
export function InfoField({
	labelKey,
	value,
	children,
}: {
	labelKey: TranslationKeys;
	/** Plain text value. Use `children` instead for a badge or a link. */
	value?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</dt>
			<dd className="text-sm text-slate-500">
				{children ??
					(value?.trim() ? (
						value
					) : (
						<>
							<span aria-hidden>{EMPTY_VALUE_GLYPH}</span>
							<span className="sr-only">
								<Translate
									text={
										localizationConstants.purchaseInfoValueMissing
									}
								/>
							</span>
						</>
					))}
			</dd>
		</div>
	);
}

/**
 * A titled card wrapping a grid of `InfoField`s, with an optional action in the
 * header.
 *
 * Extracted because this label/value card is re-declared locally in a dozen
 * screens. This shares it across the purchase module; the rest of the app is a
 * separate cleanup.
 */
export function InfoFieldGrid({
	titleKey,
	icon,
	action,
	columns = 2,
	collapsed = false,
	children,
	className,
}: {
	titleKey: TranslationKeys;
	icon?: React.ReactNode;
	/** Right-aligned header slot, e.g. an Edit button. */
	action?: React.ReactNode;
	columns?: 2 | 3 | 4;
	/** Hides the field grid, leaving the titled header as a collapsed row. */
	collapsed?: boolean;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Card
			className={cn(
				"rounded-lg border border-slate-200 bg-white shadow-none",
				className,
			)}
		>
			<CardHeader className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
					{icon}
					<Translate text={titleKey} />
				</CardTitle>
				{action}
			</CardHeader>

			{!collapsed && (
				<CardContent className="p-6">
				<dl
					className={cn(
						"grid grid-cols-1 gap-x-8 gap-y-5",
						columns === 2 && "sm:grid-cols-2",
						columns === 3 && "sm:grid-cols-2 xl:grid-cols-3",
						columns === 4 && "sm:grid-cols-2 xl:grid-cols-4",
					)}
				>
					{children}
				</dl>
			</CardContent>
			)}
		</Card>
	);
}

export default InfoFieldGrid;
