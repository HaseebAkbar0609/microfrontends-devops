"use client";

import { Check, Link2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { IntegrationOffering } from "../constants/mockData";

interface IntegrationCardProps {
	offering: IntegrationOffering;
	onConnect: (offering: IntegrationOffering) => void;
}

const IntegrationCard = ({ offering, onConnect }: IntegrationCardProps) => {
	const t = useTranslate();

	return (
		<div className="flex flex-col rounded-md border border-slate-200 bg-white shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-2 rounded-t-md bg-slate-100 px-5 py-3">
				<span className="text-base font-semibold text-slate-600">
					{offering.title}
				</span>
				<span className="inline-flex rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
					{offering.provider}
				</span>
			</div>
			<div className="flex flex-1 flex-col gap-3 px-5 py-4">
				<div>
					<p className="text-sm font-semibold text-slate-900">
						<Translate
							text={localizationConstants.integrationTextLabel}
						/>
					</p>
					<p className="text-sm text-slate-600">{offering.text}</p>
				</div>
				<div>
					<p className="text-sm font-semibold text-slate-900">
						<Translate
							text={localizationConstants.integrationModulesLabel}
						/>
					</p>
					<p className="text-sm text-slate-600">
						{offering.modulesDescription}
					</p>
				</div>
				<div className="mt-auto flex justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							showToast(
								"success",
								`${offering.provider} — ${t(
									localizationConstants.comingSoon,
								)}`,
							)
						}
						className="h-10 gap-2 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
					>
						<SlidersHorizontal className="h-4 w-4" />
						<Translate text={localizationConstants.adminSetting} />
					</Button>
					<Button
						type="button"
						onClick={() => onConnect(offering)}
						disabled={offering.connected}
						className="h-10 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						{offering.connected ? (
							<Check className="h-4 w-4" />
						) : (
							<Link2 className="h-4 w-4" />
						)}
						<Translate
							text={localizationConstants.integrationConnectBtn}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default IntegrationCard;
