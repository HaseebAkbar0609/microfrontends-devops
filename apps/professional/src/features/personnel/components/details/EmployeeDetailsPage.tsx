"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { personnelBreadcrumbs } from "../../constants/personnelNav.config";

export function EmployeeDetailsPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.personalOverviewTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 py-6">
				<Card className="border-slate-200 shadow-sm">
					<CardContent className="p-6 space-y-4">
						<div className="space-y-2">
							<h2 className="text-xl font-semibold text-slate-900">Employee details</h2>
							<p className="text-sm text-slate-600">
								This placeholder details screen keeps the personnel module route working while the full employee profile view is implemented.
							</p>
						</div>

						<Button type="button" variant="outline" className="h-9 px-4 text-sm">
							Back to overview
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default EmployeeDetailsPage;
