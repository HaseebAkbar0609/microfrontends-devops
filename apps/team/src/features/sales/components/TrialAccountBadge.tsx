"use client";

import { Beaker, FlaskConical } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { TrialAccount, TrialKind } from "../types";
import {
	EMPTY_VALUE_PLACEHOLDER,
	daysUntil,
	formatDate,
} from "../utils/salesFormatters";
import { getActiveTrial } from "../utils/trialAccounts";

type TrialAccountBadgeProps = {
	accounts: TrialAccount[];
	kind: TrialKind;
};

/** Compact demo/test trial summary used in the company table. */
export function TrialAccountBadge({ accounts, kind }: TrialAccountBadgeProps) {
	const account = getActiveTrial(accounts);

	if (!account) {
		return (
			<span className="text-xs text-slate-400">{EMPTY_VALUE_PLACEHOLDER}</span>
		);
	}

	const daysLeft = daysUntil(account.expiresAt);
	const isActive = daysLeft > 0;
	const Icon = kind === "demo" ? FlaskConical : Beaker;

	return (
		<div className="text-xs">
			<span
				className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${
					isActive
						? "bg-emerald-50 text-emerald-700"
						: "bg-red-50 text-red-600"
				}`}
			>
				<Icon className="h-3 w-3" />
				{isActive ? (
					<>
						{daysLeft}{" "}
						<Translate
							text={
								daysLeft === 1
									? localizationConstants.salesTrialDayLeftSuffix
									: localizationConstants.salesTrialDaysLeftSuffix
							}
						/>
					</>
				) : (
					<Translate text={localizationConstants.salesTrialExpired} />
				)}
			</span>
			<span className="mt-1 block text-slate-500">
				{formatDate(account.startedAt)} → {formatDate(account.expiresAt)}
			</span>
		</div>
	);
}
