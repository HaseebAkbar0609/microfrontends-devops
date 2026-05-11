import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Building2 } from "lucide-react";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface CompanyDetailsCardProps {
	companyName: string;
	website: string;
	address: string;
	city: string;
	parentCompany?: string;
	mobile: string;
	email: string;
}

export function CompanyDetailsCard({
	companyName,
	website,
	address,
	city,
	parentCompany,
	mobile,
	email,
}: CompanyDetailsCardProps) {
	return (
		<DetailCard
			icon={Building2}
			title={localizationConstants.companyInformationLabel}
			className="h-full"
		>
			<div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-6">
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.companyNameLabel} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{companyName}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.websiteLabel} />
					</p>
					<p className="text-slate-900 text-sm font-medium text-blue-600 underline">
						{website}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.address} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{address}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.cityLabel} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{city}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.company} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{parentCompany || companyName}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.mobilePhone} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{mobile}</p>
				</div>
				<div className="space-y-1 col-span-2">
					<p className="text-slate-500 text-xs font-medium">
						<Translate text={localizationConstants.emailLabel} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{email}</p>
				</div>
			</div>
		</DetailCard>
	);
}

