"use client";

import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { Translate } from "@/utils/translation/translate";

type SupportSettingsCardProps = {
	titleKey: string;
	children: ReactNode;
};

export function SupportSettingsCard({
	titleKey,
	children,
}: SupportSettingsCardProps) {
	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h2>
			<div className="mt-4 space-y-4">{children}</div>
		</section>
	);
}

type SettingsToggleProps = {
	labelKey: string;
	hintKey?: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
};

/** Label plus description on the left, switch on the right. */
export function SettingsToggle({
	labelKey,
	hintKey,
	checked,
	onCheckedChange,
}: SettingsToggleProps) {
	return (
		<div className="flex items-start justify-between gap-4">
			<div className="min-w-0">
				<p className="text-sm font-medium text-slate-900">
					<Translate text={labelKey} />
				</p>
				{hintKey ? (
					<p className="mt-0.5 text-xs text-slate-500">
						<Translate text={hintKey} />
					</p>
				) : null}
			</div>
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				className="cursor-pointer"
			/>
		</div>
	);
}
