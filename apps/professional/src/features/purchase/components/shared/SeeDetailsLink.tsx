import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** The outline "Se detaljer" button the purchase lists put in their last cell. */
export function SeeDetailsLink({
	href,
	label,
}: {
	href: string;
	label: TranslationKeys;
}) {
	return (
		<Link href={href}>
			<Button
				variant="outline"
				size="sm"
				className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
			>
				<Translate text={label} />
			</Button>
		</Link>
	);
}

export default SeeDetailsLink;
