import { Suspense } from "react";
import { MaterialOverviewPage } from "@/features/material-storage/components/overview/MaterialOverviewPage";

export default function Page() {
	// The overview keeps its filters in the URL (useSearchParams), which needs a Suspense boundary.
	return (
		<Suspense>
			<MaterialOverviewPage />
		</Suspense>
	);
}
