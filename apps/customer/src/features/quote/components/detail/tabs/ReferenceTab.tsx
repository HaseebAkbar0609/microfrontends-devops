import { TabsContent } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyInsuranceTable } from "../CompanyInsuranceTable";
import { ReferenceImagesTable } from "../ReferenceImagesTable";

export function ReferenceTab() {
	return (
		<TabsContent value="reference">
			<div className="space-y-8 animate-in fade-in duration-300">
				<div>
					<h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
						<Translate text={localizationConstants.customerReviewTitle} />
					</h3>
					<div className="text-center py-8 text-slate-400 text-sm border border-slate-200 rounded-lg bg-white">
						No customer reviews yet.
					</div>
				</div>

				<CompanyInsuranceTable insurance={[]} />

				<ReferenceImagesTable projects={[]} />
			</div>
		</TabsContent>
	);
}
