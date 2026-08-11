import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export default function OrderEconomyPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50 p-6">
			<h1 className="text-2xl font-semibold">
				<Translate text={localizationConstants.economicOverview} />
			</h1>
			<p className="mt-2 text-sm text-slate-600">
				<Translate text={localizationConstants.comingSoon} />
			</p>
		</div>
	);
}
