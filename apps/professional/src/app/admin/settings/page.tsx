import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSettingsPage from "@/features/admin/settings/components/AdminSettingsPage";

function AdminSettingsSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Skeleton className="h-6 w-96" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<AdminSettingsSkeleton />}>
			<AdminSettingsPage />
		</Suspense>
	);
}
