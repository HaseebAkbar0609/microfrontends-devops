"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, Loader2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { getSupportConfigAPIAction } from "@/api-actions";
import type { SupportConfig } from "@/api-actions";

export function ContactSection() {
	const [config, setConfig] = useState<SupportConfig | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		getSupportConfigAPIAction().then((result) => {
			if (!isMounted) return;
			if (result.success && result.data) {
				setConfig(result.data);
			}
			setLoading(false);
		});
		return () => {
			isMounted = false;
		};
	}, []);

	const phoneValue = config?.support_phone || "";
	const emailValue = config?.support_email || "";

	const hasContactInfo = Boolean(phoneValue || emailValue);

	const sanitizePhone = (phone: string) => phone.replace(/[^\d+]/g, "");

	const contacts = [
		{
			id: "phone",
			title: localizationConstants.supportContactPhone,
			value: phoneValue,
			isTranslatedValue: false,
			icon: Phone,
			href: `tel:${sanitizePhone(phoneValue)}`,
			isExternal: true,
		},
		{
			id: "email",
			title: localizationConstants.supportContactEmail,
			value: emailValue,
			isTranslatedValue: false,
			icon: Mail,
			href: `mailto:${emailValue}`,
			isExternal: true,
		},
	].filter((item) =>
		item.id === "phone" ? Boolean(phoneValue) : Boolean(emailValue),
	);

	return (
		<div className="mt-6">
			<h2 className="mb-8 text-2xl font-bold text-slate-900 md:text-3xl">
				<Translate text={localizationConstants.supportContactUsTitle} />
			</h2>

			{loading ? (
				<div className="flex items-center gap-2 text-sm text-slate-400">
					<Loader2 className="h-4 w-4 animate-spin" />
					<Translate text={localizationConstants.supportLoading} />
				</div>
			) : !hasContactInfo ? (
				<p className="text-sm text-slate-400">
					<Translate text={localizationConstants.supportNoContactInfo} />
				</p>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{contacts.map((item) => {
						const Icon = item.icon;

						return (
							<Link
								key={item.id}
								href={item.href}
								target={
									item.isExternal && item.href.startsWith("http")
										? "_blank"
										: undefined
								}
								rel={
									item.isExternal && item.href.startsWith("http")
										? "noopener noreferrer"
										: undefined
								}
								className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
							>
								<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4ED]">
									<Icon className="h-6 w-6 text-[#FF6B00]" />
								</div>

								<p className="mb-1 text-sm font-medium text-slate-500">
									<Translate text={item.title} />
								</p>

								<p className="text-base font-bold text-slate-900 md:text-lg">
									{item.isTranslatedValue ? (
										<Translate text={item.value} />
									) : (
										item.value
									)}
								</p>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
