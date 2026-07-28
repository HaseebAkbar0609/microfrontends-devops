import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function OfferDocument() {
	return (
		<div className="pr-0 lg:pr-8">
			<h1 className="text-3xl font-bold text-slate-900">
				<Translate text={localizationConstants.guideQuote} />
			</h1>

			<div className="mt-4 space-y-1 text-sm text-slate-600">
				<p>
					<Translate text={localizationConstants.guideContractNumber} />: KA-2025-001
				</p>
				<p>
					<Translate text={localizationConstants.guideDate} />: 2025-01-10
				</p>
			</div>

			<div className="mt-8 space-y-6">
				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideSectionParties} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate text={localizationConstants.guideSectionPartiesIntro} />
					</p>
					<div className="mt-4 space-y-4 text-sm text-slate-700">
						<div>
							<p className="font-bold text-slate-900">
								<Translate text={localizationConstants.guideSectionPartiesClient} />{" "}
								<span className="font-normal text-slate-700">
									<Translate
										text={localizationConstants.guideSectionPartiesClientName}
									/>
								</span>
							</p>
							<p className="text-slate-600">
								<Translate text={localizationConstants.guideSectionPartiesClientOrg} />
							</p>
							<p className="text-slate-600">
								<Translate text={localizationConstants.guideSectionPartiesClientAddress} />
							</p>
						</div>

						<div>
							<p className="font-bold text-slate-900">
								<Translate text={localizationConstants.guideSectionPartiesConsultant} />{" "}
								<span className="font-normal text-slate-700">
									<Translate
										text={
											localizationConstants.guideSectionPartiesConsultantName
										}
									/>
								</span>
							</p>
							<p className="text-slate-600">
								<Translate text={localizationConstants.guideSectionPartiesConsultantId} />
							</p>
							<p className="text-slate-600">
								<Translate text={localizationConstants.guideSectionPartiesConsultantAddress} />
							</p>
						</div>
					</div>
				</section>

				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideSectionScope} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate text={localizationConstants.guideSectionScopeDescription} />
					</p>
					<ul className="mt-2 list-disc space-y-1 pl-8 text-sm text-slate-700">
						<li>
							<Translate text={localizationConstants.guideSectionScopeItem1} />
						</li>
						<li>
							<Translate text={localizationConstants.guideSectionScopeItem2} />
						</li>
						<li>
							<Translate text={localizationConstants.guideSectionScopeItem3} />
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.guideSectionContractPeriod} />
					</h2>
					<p className="mt-2 text-sm text-slate-700">
						<Translate
							text={localizationConstants.guideSectionContractPeriodDescription}
						/>
					</p>
				</section>
			</div>
		</div>
	);
}
