import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function ConsultantDocument() {
	return (
		<div className="pr-0 lg:pr-8">
			<h1 className="text-3xl font-bold text-slate-900">
				<Translate text={localizationConstants.guideConsultant} />
			</h1>

			<div className="mt-4 space-y-1 text-sm text-slate-600">
				<p><Translate text={localizationConstants.guideContractNumber} />: KA-2025-002</p>
				<p><Translate text={localizationConstants.guideDate} />: 2025-01-15</p>
			</div>

			<div className="mt-8 space-y-6">
				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideConsultantSectionTitle} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate text={localizationConstants.guideConsultantSectionIntro} />
					</p>
				</section>

				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideConsultantSectionResponsibilities} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate text={localizationConstants.guideConsultantSectionResponsibilitiesDesc} />
					</p>
				</section>

				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideConsultantSectionDeliverables} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate text={localizationConstants.guideConsultantSectionDeliverablesDesc} />
					</p>
				</section>

				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideConsultantSectionConfidentiality} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate text={localizationConstants.guideConsultantSectionConfidentialityDesc} />
					</p>
				</section>
			</div>
		</div>
	);
}