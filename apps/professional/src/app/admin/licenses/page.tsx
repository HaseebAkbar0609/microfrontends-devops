import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLicenses from "@/features/admin/licenses/components/AdminLicenses";

function LicensesPageSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Skeleton className="h-8 w-40" />
			<Skeleton className="h-4 w-64" />
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-12 flex flex-col gap-5 xl:col-span-8">
					<Skeleton className="h-48 w-full" />
					<Skeleton className="h-48 w-full" />
				</div>
				<div className="col-span-12 xl:col-span-4">
					<Skeleton className="h-72 w-full" />
				</div>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<LicensesPageSkeleton />}>
			<AdminLicenses />
		</Suspense>
	);
}
