"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DATA_IT_MODULE_BASE_URL } from "../../constants/dataItNav.config";
import { DataItDashboard } from "./DataItDashboard";

export function DataItDashboardPage() {
	const [isRearranging, setIsRearranging] = useState(false);

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Header matching Image 2 */}
			<div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight text-slate-950">
						<Translate text={localizationConstants.dataItDashboard} />
					</h1>
					<nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
						<Link
							href="/"
							className="hover:text-slate-900 transition-colors"
						>
							<Translate text={localizationConstants.home} />
						</Link>
						<span>&gt;</span>
						<Link
							href={DATA_IT_MODULE_BASE_URL}
							className="hover:text-slate-900 transition-colors"
						>
							<Translate text={localizationConstants.dataIT} />
						</Link>
						<span>&gt;</span>
						<span className="font-medium text-slate-700">
							<Translate text={localizationConstants.dataItDashboardBreadcrumb} />
						</span>
					</nav>
				</div>

				<Button
					type="button"
					variant={isRearranging ? "default" : "secondary"}
					size="sm"
					onClick={() => setIsRearranging((prev) => !prev)}
					aria-pressed={isRearranging}
					className={cn(
						"flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
						isRearranging
							? "bg-[#111827] text-white shadow-xs hover:bg-black"
							: "border border-slate-200 bg-white text-slate-800 shadow-2xs hover:bg-slate-50",
					)}
				>
					<LayoutGrid size={16} />
					<span>
						<Translate text={localizationConstants.rearrange} />
					</span>
				</Button>
			</div>

			{/* Dashboard Grid and Rearrange Rail */}
			<div className="flex flex-1 flex-col px-6 py-6 overflow-y-auto">
				<DataItDashboard
					isRearranging={isRearranging}
					setIsRearranging={setIsRearranging}
				/>
			</div>
		</div>
	);
}

export default DataItDashboardPage;
