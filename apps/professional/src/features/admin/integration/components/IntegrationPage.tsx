"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicBreadcrumb } from "@/components/common";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listConnectedProviders } from "../services/integrationService";

const IntegrationPage = () => {
	const router = useRouter();
	const [connectedProviders] = useState(() => listConnectedProviders());

	return (
		<div className="flex flex-col gap-5 p-6">
			<div>
				<h1 className="text-2xl font-bold text-slate-900">
					<Translate text={localizationConstants.adminIntegration} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					className="mt-1"
					items={[
						{ translationKey: localizationConstants.adminItem },
						{
							translationKey:
								localizationConstants.adminIntegration,
						},
					]}
				/>
			</div>

			<div className="flex items-start gap-10">
				<div className="max-w-3xl flex-1">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<h2 className="text-lg font-semibold text-slate-700">
						<Translate
							text={localizationConstants.integrationHeading}
						/>
					</h2>
					<Button
						type="button"
						onClick={() =>
							router.push("/admin/integration/create")
						}
						className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<Plus className="h-4 w-4" />
						<Translate
							text={localizationConstants.integrationCreate}
						/>
					</Button>
				</div>

				<div className="mt-4 flex flex-col gap-4 text-sm text-slate-600">
					<p>
						<Translate
							text={localizationConstants.integrationIntro1}
						/>
					</p>
					<p>
						<Translate
							text={localizationConstants.integrationIntro2}
						/>
					</p>
					<p>
						<Translate
							text={localizationConstants.integrationIntro3}
						/>
					</p>
				</div>

				<div className="mt-6 border-t border-slate-200 pt-6">
					<h2 className="text-lg font-semibold text-slate-700">
						<Translate
							text={
								localizationConstants.integrationConnectedTitle
							}
						/>
					</h2>
					<ul className="mt-3 list-disc pl-6 text-sm font-semibold text-slate-900">
						{connectedProviders.map((provider) => (
							<li key={provider} className="py-0.5">
								{provider}
							</li>
						))}
					</ul>
				</div>
				</div>
				<Image
					src="/integrations-illustration.svg"
					alt=""
					width={463}
					height={332}
					priority
					className="hidden shrink-0 lg:block"
				/>
			</div>
		</div>
	);
};

export default IntegrationPage;
