import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ShieldCheck } from "lucide-react";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface CreditInformationCardProps {
	companyName: string;
	registeredFTax: string;
	registeredVat: string;
	boardInformation: string;
}

export function CreditInformationCard({
	companyName,
	registeredFTax,
	registeredVat,
	boardInformation,
}: CreditInformationCardProps) {
	return (
		<DetailCard
			icon={ShieldCheck}
			title={localizationConstants.creditInformationLabel}
			className="h-full"
			status={true}
		>
			<div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between border border-slate-100 mb-6">
				<div className="relative w-28 h-8">
					{/* Placeholder for Creditsafe logo */}
					<span className="text-red-500 font-extrabold text-lg italic">
						creditsafe
					</span>
				</div>
				<p className="text-slate-500 text-sm font-medium leading-tight text-right">
					<Translate
						text={
							localizationConstants.creditAssessmentVerifiedByLabel
						}
					/>
				</p>
			</div>

			<div className="grid grid-cols-2 gap-y-6 gap-x-8 px-2">
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.company} />
					</p>
					<p className="text-slate-900 text-sm font-medium">
						{companyName}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate
							text={localizationConstants.registeredFTaxLabel}
						/>
					</p>
					<p className="text-slate-900 text-sm font-medium">
						{registeredFTax}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate
							text={localizationConstants.registeredVatLabel}
						/>
					</p>
					<p className="text-slate-900 text-sm font-medium">
						{registeredVat}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate
							text={localizationConstants.boardInformationLabel}
						/>
					</p>
					<p className="text-slate-900 text-sm font-medium">
						{boardInformation}
					</p>
				</div>
			</div>
		</DetailCard>
	);
}
