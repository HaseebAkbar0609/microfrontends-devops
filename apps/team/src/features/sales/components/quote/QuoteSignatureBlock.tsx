"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

type QuoteSignatureBlockProps = {
	customerName: string;
};

/** Place/date and customer signature lines at the foot of a document. */
export function QuoteSignatureBlock({
	customerName,
}: QuoteSignatureBlockProps) {
	return (
		<div className="mt-6 grid gap-6 pt-4 text-xs text-slate-500 sm:grid-cols-2">
			<div>
				<div className="h-8 border-b border-slate-300" />
				<p className="mt-1">
					<Translate text={localizationConstants.salesQuoteSignaturePlace} />
				</p>
			</div>
			<div>
				<div className="h-8 border-b border-slate-300" />
				<p className="mt-1">
					<Translate text={localizationConstants.salesQuoteSignatureCustomer} />
					{customerName ? `, ${customerName}` : ""}
				</p>
			</div>
		</div>
	);
}
