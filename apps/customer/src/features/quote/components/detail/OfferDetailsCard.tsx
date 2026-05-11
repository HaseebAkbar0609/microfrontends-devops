import { FileText } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface OfferDetailsCardProps {
	company: string;
	orgNo: string;
	address: string;
	postalNo: string;
	contactPerson: string;
	mobile: string;
	email: string;
}

export function OfferDetailsCard({
	company,
	orgNo,
	address,
	postalNo,
	contactPerson,
	mobile,
	email,
}: OfferDetailsCardProps) {
	return (
		<DetailCard
			icon={FileText}
			title={localizationConstants.offerDetailsLabel}
			className="h-full"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-6">
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
						<Translate text={localizationConstants.company} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{company}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
						<Translate text={localizationConstants.orgNoLabel} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{orgNo}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
						<Translate text={localizationConstants.address} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{address}</p>
				</div>
				<div className="space-y-1">
					<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
						<Translate text={localizationConstants.postalNo} />
					</p>
					<p className="text-slate-900 text-sm font-medium">{postalNo}</p>
				</div>

				<div className="col-span-full border-t border-slate-100 mt-2 pt-6">
					<p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">
						<Translate
							text={localizationConstants.contactPersonForQuoteLabel}
						/>
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
						<div className="space-y-1 md:col-span-2">
							<p className="text-slate-900 text-sm font-medium">
								{contactPerson}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
								<Translate text={localizationConstants.mobilePhone} />
							</p>
							<p className="text-slate-900 text-sm font-medium">{mobile}</p>
						</div>
						<div className="space-y-1">
							<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
								<Translate text={localizationConstants.emailLabel} />
							</p>
							<p className="text-slate-900 text-sm font-medium">{email}</p>
						</div>
					</div>
				</div>
			</div>
		</DetailCard>
	);
}

