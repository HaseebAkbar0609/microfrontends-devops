"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EMPLOYMENT_TABS } from "../constants/mockData";
import { getEmploymentContract } from "../services/employmentService";
import EmploymentContractCard from "./EmploymentContractCard";

export default function EmploymentTabs() {
	const contract = getEmploymentContract();

	return (
		<div className="space-y-6">
			<Tabs defaultValue="contract" className="w-full">
				<div className="px-5 border-b border-slate-200 mb-6">
					<TabsList
						variant="line"
						className="h-auto gap-6 rounded-none px-0 pb-1"
					>
						{EMPLOYMENT_TABS.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="px-0 text-slate-600 data-[state=active]:px-3 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<div className="px-6">
					<TabsContent value="contract">
						<EmploymentContractCard contract={contract} />
					</TabsContent>
					{EMPLOYMENT_TABS.filter((tab) => tab.id !== "contract").map(
						(tab) => (
							<TabsContent key={tab.id} value={tab.id}>
								<p className="py-10 text-center text-sm text-slate-500">
									<Translate
										text={localizationConstants.comingSoon}
									/>
								</p>
							</TabsContent>
						),
					)}
				</div>
			</Tabs>
		</div>
	);
}
