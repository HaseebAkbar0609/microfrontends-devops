"use client";

import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.support },
];

interface ContactCardProps {
	icon: React.ReactNode;
	titleKey: string;
	detail: string;
	href: string;
}

function ContactCard({ icon, titleKey, detail, href }: ContactCardProps) {
	return (
		<a
			href={href}
			className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white px-8 py-6 text-center transition-colors hover:border-slate-300 hover:shadow-sm"
		>
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
				{icon}
			</div>
			<h3 className="text-sm font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h3>
			<p className="text-sm text-slate-500">{detail}</p>
		</a>
	);
}

export default function SupportPage() {
	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.support}
				breadcrumbs={BREADCRUMBS}
			/>
			<div className="p-6">
				<h2 className="mb-6 text-xl font-semibold text-slate-900">
					<Translate text={localizationConstants.contactUs} />
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-2xl">
					<ContactCard
						icon={<Phone className="h-5 w-5 text-orange-400" />}
						titleKey={localizationConstants.phone}
						detail="+46 070 - 426 10 92"
						href="tel:+46070426 10 92"
					/>
					<ContactCard
						icon={<Mail className="h-5 w-5 text-orange-400" />}
						titleKey={localizationConstants.email}
						detail="info@timeflowsystem.se"
						href="mailto:info@timeflowsystem.se"
					/>
				</div>
			</div>
		</div>
	);
}
