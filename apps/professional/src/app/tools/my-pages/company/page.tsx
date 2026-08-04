import { Suspense } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import CompanyTabs from "@/features/my-pages/company/components/CompanyTabs";
import localizationConstants from "@/utils/translation/constants";

function CompanySkeleton() {
	return (
		<div className="flex flex-col gap-6 px-6">
			<Skeleton className="h-6 w-96" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

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
							translationKey: localizationConstants.company,
						},
					]}
				/>
			</div>
			<Suspense fallback={<CompanySkeleton />}>
				<CompanyTabs />
			</Suspense>
		</div>
	);
}
