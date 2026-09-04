"use client";

import type { ReactNode } from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SELLER_LEGAL_NAME } from "../../constants/sales.constants";

type QuoteDocumentHeaderProps = {
	/** Right-hand meta lines, e.g. document number and dates. */
	meta: ReactNode;
};

/** Letterhead shared by the quote sheet and the order confirmation. */
export function QuoteDocumentHeader({ meta }: QuoteDocumentHeaderProps) {
	return (
		<div className="flex items-start justify-between gap-4">
			<div>
				<p className="text-lg font-semibold tracking-tight text-slate-900">
					{SELLER_LEGAL_NAME}
				</p>
				<p className="text-xs text-slate-500">
					<Translate text={localizationConstants.salesSellerTagline} />
				</p>
			</div>
			<div className="text-right text-xs text-slate-500">{meta}</div>
		</div>
	);
}

type PartyBlockProps = {
	headingKey: string;
	name: string;
	lines: (string | null | undefined)[];
	/** Rendered under the plain lines, for content that is not a bare string. */
	extra?: ReactNode;
	align?: "left" | "right";
};

/** Customer / seller block on a document. */
export function QuoteDocumentParty({
	headingKey,
	name,
	lines,
	extra,
	align = "left",
}: PartyBlockProps) {
	return (
		<div className={align === "right" ? "sm:text-right" : undefined}>
			<p className="text-xs uppercase tracking-wide text-slate-500">
				<Translate text={headingKey} />
			</p>
			<p className="font-medium text-slate-900">{name || "—"}</p>
			{lines
				.filter((line): line is string => Boolean(line))
				.map((line) => (
					<p key={line} className="text-slate-500">
						{line}
					</p>
				))}
			{extra ? <p className="text-slate-500">{extra}</p> : null}
		</div>
	);
}
