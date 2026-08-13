import { Suspense } from "react";
import ProjectOverviewPage from "@/features/project/components/ProjectOverviewPage";

export default function Page() {
	return (
		<Suspense fallback={null}>
			<ProjectOverviewPage />
		</Suspense>
	);
}
