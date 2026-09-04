import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSubscription from "@/features/admin/subscription/components/AdminSubscription";

function SubscriptionPageSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-4 w-64" />
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-12 lg:col-span-4 xl:col-span-3">
					<Skeleton className="h-56 w-full" />
				</div>
				<div className="col-span-12 lg:col-span-8 xl:col-span-9">
					<Skeleton className="h-72 w-full" />
				</div>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<SubscriptionPageSkeleton />}>
			<AdminSubscription />
		</Suspense>
	);
}
