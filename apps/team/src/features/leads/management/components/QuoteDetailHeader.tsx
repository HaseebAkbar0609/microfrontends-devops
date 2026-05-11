"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

type QuoteDetailHeaderProps = {
	title: string;
	backHref: string;
};

export default function QuoteDetailHeader({ title, backHref }: QuoteDetailHeaderProps) {
	return (
		<div className="flex flex-col gap-2">
			<Button asChild variant="ghost" className="w-fit gap-2 text-slate-600 hover:text-slate-900">
				<Link href={backHref}>
					<ArrowLeft className="size-4" />
					<Translate text={localizationConstants.backToQuoteList} />
				</Link>
			</Button>
			<h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
		</div>
	);
}
