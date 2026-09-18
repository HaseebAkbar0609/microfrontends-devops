"use client";

import type { ReactNode } from "react";
import { Translate } from "@/utils/translation/translate";

type SalesDashboardCardProps = {
	titleKey: string;
	children: ReactNode;
};

/** White panel with a title bar, shared by every dashboard section. */
export function SalesDashboardCard({ titleKey, children }: SalesDashboardCardProps) {
	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-lg font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h2>
			{children}
		</section>
	);
}

export function SalesDashboardEmpty({ textKey }: { textKey: string }) {
	return (
		<p className="px-5 py-8 text-center text-sm text-slate-500">
			<Translate text={textKey} />
		</p>
	);
}
