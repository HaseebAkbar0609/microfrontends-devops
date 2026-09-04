import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import ItSupportPage from "@/features/my-pages/it-support/components/ItSupportPage";
import localizationConstants from "@/utils/translation/constants";

export default function Page() {
	return (
		<div className="pt-6">
			<div className="px-6">
				<DynamicBreadcrumb
					className="text-2xl mb-3"
					items={[
						{
							translationKey: localizationConstants.myPages,
							href: "/tools/my-pages",
						},
						{
							translationKey:
								localizationConstants.myPagesItSupport,
						},
					]}
				/>
			</div>
			<div className="px-6 pb-6">
				<ItSupportPage />
			</div>
		</div>
	);
}
