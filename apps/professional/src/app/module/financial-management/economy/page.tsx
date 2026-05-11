import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
export default function Page() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold">
				<Translate text={localizationConstants.economy} />
			</h1>
			<p className="mt-2 text-sm text-slate-600">
				<Translate text={localizationConstants.comingSoon} />{" "}
			</p>
		</div>
	);
}
