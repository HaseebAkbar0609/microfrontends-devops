"use client";

import { FileText } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { QuoteDetail } from "@/features/leads/types";

type QuoteOfferDetailsCardProps = {
	detail: QuoteDetail;
};

type InfoItemProps = {
	label: string;
	value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
	return (
		<div>
			<div className="text-xs font-semibold uppercase text-slate-900">{label}</div>
			<div className="mt-1 text-sm text-slate-700">{value}</div>
		</div>
	);
}

export default function QuoteOfferDetailsCard({ detail }: QuoteOfferDetailsCardProps) {
	const t = useTranslate();

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
			<div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
				<FileText className="size-6 text-slate-700" />
				<div className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.offerDetails} />
				</div>
			</div>
			<div className="space-y-5 px-5 py-5">
				<div className="grid gap-4 sm:grid-cols-2">
					<InfoItem label={t(localizationConstants.companyLabel)} value={detail.companyName} />
					<InfoItem label={t(localizationConstants.orgNumberLabel)} value={detail.orgNumber} />
					<InfoItem label={t(localizationConstants.addressLabel)} value={detail.address} />
					<InfoItem label={t(localizationConstants.postalNoLabel)} value={detail.postalNo} />
				</div>

				<div className="border-t border-slate-200 pt-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<InfoItem
							label={t(localizationConstants.contactPersonForQuoteLabel)}
							value={detail.contactPerson}
						/>
						<InfoItem label={t(localizationConstants.mobilePhoneLabel)} value={detail.mobilePhone} />
						<InfoItem label={t(localizationConstants.emailLabel)} value={detail.email} />
					</div>
				</div>
			</div>
		</div>
	);
}
