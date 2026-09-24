"use client";

import React from "react";
import { AccountPlanOverviewTable } from "./AccountPlanOverviewTable";

export function AccountPlanOverviewPage() {
	return (
		<div className="w-full flex flex-col gap-6 py-4">
			<AccountPlanOverviewTable />
		</div>
	);
}
