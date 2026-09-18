import type { ReactNode } from "react";
import { Translate } from "@/utils/translation/translate";

/** Shown when the partner has not supplied this contact detail. */
const CONTACT_FALLBACK = "-";

interface DiscountContactRowProps {
	icon: ReactNode;
	/** Localization key for the field label. */
	label: string;
	value?: string | null;
	/** Renders the value as an external link, adding a scheme when absent. */
	isLink?: boolean;
}

export function DiscountContactRow({
	icon,
	label,
	value,
	isLink = false,
}: DiscountContactRowProps) {
	const href =
		isLink && value
			? value.includes("://") || value.startsWith("//")
				? value
				: `https://${value}`
			: null;

	return (
		<div className="flex items-start gap-4.5">
			<div className="mt-0.5 shrink-0">{icon}</div>
			<div className="min-w-0">
				<p className="text-xs text-slate-500">
					<Translate text={label} />
				</p>
				{href ? (
					<a
						href={href}
						className="break-all text-sm text-[#FF8100] hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						{value}
					</a>
				) : (
					<p className="break-all text-sm text-[#0A0A0A]">
						{value || CONTACT_FALLBACK}
					</p>
				)}
			</div>
		</div>
	);
}
