"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SUPPORT_MODULE_HREF } from "../../constants/supportNav";

/** Shown when a ticket id does not resolve. */
export function TicketNotFound() {
	return (
		<div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-16 text-center">
			<h1 className="text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.supportTicketNotFoundTitle} />
			</h1>
			<Button asChild className="cursor-pointer">
				<Link href={SUPPORT_MODULE_HREF}>
					<Translate text={localizationConstants.supportBackToOverview} />
				</Link>
			</Button>
		</div>
	);
}
