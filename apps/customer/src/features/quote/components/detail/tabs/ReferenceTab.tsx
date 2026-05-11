import { TabsContent } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ReviewCard } from "../ReviewCard";
import { CompanyInsuranceTable } from "../CompanyInsuranceTable";
import { ReferenceImagesTable } from "../ReferenceImagesTable";
import {
	DUMMY_REVIEWS,
	DUMMY_INSURANCE,
	DUMMY_REFERENCE_PROJECTS,
} from "../../../constants";

export function ReferenceTab() {
	return (
		<TabsContent value="reference">
			<div className="space-y-8 animate-in fade-in duration-300">
				<div>
					<h3 className="text-xl font-bold text-slate-900 mb-6  tracking-tight">
						<Translate
							text={localizationConstants.customerReviewTitle}
						/>
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{DUMMY_REVIEWS.map((review) => (
							<ReviewCard
								key={review.id}
								name={review.name}
								review={review.review}
								rating={review.rating}
								date={review.date}
								imageUrl={review.imageUrl}
							/>
						))}
					</div>
				</div>

				<CompanyInsuranceTable insurance={DUMMY_INSURANCE} />

				<ReferenceImagesTable projects={DUMMY_REFERENCE_PROJECTS} />
			</div>
		</TabsContent>
	);
}
