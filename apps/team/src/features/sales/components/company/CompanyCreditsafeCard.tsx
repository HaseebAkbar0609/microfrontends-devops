"use client";

import { RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SalesCompany } from "../../types";
import { simulateCreditsafeLookup } from "../../utils/creditsafeSimulation";
import {
	EMPTY_VALUE_PLACEHOLDER,
	formatDate,
} from "../../utils/salesFormatters";
import { SalesSectionCard } from "../SalesSectionCard";

type CompanyCreditsafeCardProps = {
	company: SalesCompany;
	onChange: (patch: Partial<SalesCompany>) => void;
};

function InfoRow({
	labelKey,
	children,
}: {
	labelKey: string;
	children: React.ReactNode;
}) {
	return (
		<p className="text-sm text-slate-700">
			<span className="text-slate-500">
				<Translate text={labelKey} />
				{": "}
			</span>
			{children}
		</p>
	);
}

function YesNo({ value }: { value: boolean }) {
	return (
		<Translate
			text={
				value
					? localizationConstants.salesCreditsafeApproved
					: localizationConstants.salesCreditsafeNotApproved
			}
		/>
	);
}

export function CompanyCreditsafeCard({
	company,
	onChange,
}: CompanyCreditsafeCardProps) {
	const creditsafe = company.creditsafe;

	return (
		<SalesSectionCard
			titleKey={localizationConstants.salesCreditsafeTitle}
			icon={ShieldCheck}
			action={
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="cursor-pointer gap-2"
					onClick={() =>
						onChange({ creditsafe: simulateCreditsafeLookup(company) })
					}
				>
					<RefreshCw className="h-3.5 w-3.5" />
					<Translate
						text={
							creditsafe
								? localizationConstants.salesCreditsafeRefreshButton
								: localizationConstants.salesCreditsafeFetchButton
						}
					/>
				</Button>
			}
		>
			{creditsafe ? (
				<div className="grid gap-2 @lg:grid-cols-2">
					<InfoRow labelKey={localizationConstants.salesCreditsafeFTax}>
						<span
							className={
								creditsafe.hasFTax
									? "font-medium text-emerald-700"
									: "font-medium text-red-600"
							}
						>
							<YesNo value={creditsafe.hasFTax} />
						</span>
					</InfoRow>
					<InfoRow
						labelKey={localizationConstants.salesCreditsafeVatRegistered}
					>
						<YesNo value={creditsafe.vatRegistered} />
					</InfoRow>
					<InfoRow
						labelKey={localizationConstants.salesCreditsafeEmployerRegistered}
					>
						<YesNo value={creditsafe.employerRegistered} />
					</InfoRow>
					<InfoRow labelKey={localizationConstants.salesCreditsafeRating}>
						{creditsafe.rating}
					</InfoRow>
					<InfoRow labelKey={localizationConstants.salesCreditsafeRiskLevel}>
						<Translate text={creditsafe.riskLevelKey} />
					</InfoRow>
					<InfoRow labelKey={localizationConstants.salesCreditsafeLegalForm}>
						<Translate text={creditsafe.legalFormKey} />
					</InfoRow>
					<InfoRow labelKey={localizationConstants.salesCreditsafeRegisteredAt}>
						{creditsafe.registeredAt || EMPTY_VALUE_PLACEHOLDER}
					</InfoRow>
					<InfoRow labelKey={localizationConstants.salesCreditsafeAddress}>
						{creditsafe.address || EMPTY_VALUE_PLACEHOLDER}
					</InfoRow>
					<p className="text-xs text-slate-500 @lg:col-span-2">
						<Translate text={localizationConstants.salesCreditsafeFetchedAt} />{" "}
						{formatDate(creditsafe.fetchedAt)} ·{" "}
						<Translate
							text={localizationConstants.salesCreditsafeSourceNote}
						/>
					</p>
				</div>
			) : (
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.salesCreditsafeEmpty} />{" "}
					<Translate text={localizationConstants.salesCreditsafeSourceNote} />
				</p>
			)}
		</SalesSectionCard>
	);
}
