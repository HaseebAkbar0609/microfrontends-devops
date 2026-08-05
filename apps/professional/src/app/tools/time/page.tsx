import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TimePage from "@/features/tools/time/components/TimePage";

function TimeSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Skeleton className="h-6 w-96" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<TimeSkeleton />}>
			<TimePage />
		</Suspense>
	);
}
