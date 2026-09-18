"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SALES_CRM_HREF } from "../constants/salesNav";

type SalesNotFoundProps = {
	titleKey: string;
	backHref?: string;
	backLabelKey?: string;
};

/** Shown when a company, quote or order confirmation cannot be resolved. */
export function SalesNotFound({
	titleKey,
	backHref = SALES_CRM_HREF,
	backLabelKey = localizationConstants.salesBackToCrmButton,
}: SalesNotFoundProps) {
	return (
		<div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-16 text-center">
			<h1 className="text-xl font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h1>
			<Button asChild className="cursor-pointer">
				<Link href={backHref}>
					<Translate text={backLabelKey} />
				</Link>
			</Button>
		</div>
	);
}
