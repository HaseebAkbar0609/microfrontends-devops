import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import EmploymentTabs from "@/features/my-pages/employment/components/EmploymentTabs";
import localizationConstants from "@/utils/translation/constants";

export default function Page() {
	return (
		<div className="pt-6">
			<div className="px-6">
				<DynamicBreadcrumb
					className="!text-2xl mb-3"
					items={[
						{
							translationKey: localizationConstants.myPages,
							href: "/tools/my-pages",
						},
						{
							translationKey: localizationConstants.employment,
						},
					]}
				/>
			</div>
			<EmploymentTabs />
		</div>
	);
}
