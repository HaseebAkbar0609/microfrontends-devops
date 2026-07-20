"use client";

import { Mail, Phone } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

const contacts = [
	{
		title: localizationConstants.supportContactPhone,
		value: "+46 704261092",
		icon: Phone,
	},
	{
		title: localizationConstants.supportContactEmail,
		value: "info@timeflowsystem.se",
		icon: Mail,
	},
];

export function ContactSection() {
	return (
		<div className="mt-6">
			<h2 className="mb-12 text-3xl font-bold text-slate-900">
				<Translate text={localizationConstants.supportContactUsTitle} />
			</h2>

			<div className="flex gap-4">
				{contacts.map((item) => {
					const Icon = item.icon;

					return (
						<div
							key={item.title}
							className="w-[360px] rounded-md border border-slate-300 bg-white p-6"
						>
							<div className="flex flex-col items-center gap-8 text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
									<Icon className="h-6 w-6 text-orange-500" />
								</div>

								<div className="flex flex-col gap-2">
									<h3 className="text-lg font-semibold text-slate-800">
										<Translate text={item.title} />
									</h3>

									<p className="text-sm text-slate-600">
										{item.value}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
