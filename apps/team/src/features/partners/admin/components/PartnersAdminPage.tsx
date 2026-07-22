"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PartnersRegisterTab } from "./PartnersRegisterTab";

const MAIN_TABS = [
	{ value: "register", label: localizationConstants.partnersRegisterTab },
	{ value: "approval-center", label: localizationConstants.approvalCenterTab },
	{ value: "category", label: localizationConstants.categoryLabel },
];

function ComingSoonPanel() {
	return (
		<div className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-16 text-sm text-slate-500 shadow-sm">
			<Translate text={localizationConstants.comingSoon} />
		</div>
	);
}

export default function PartnersAdminPage() {
	const [activeTab, setActiveTab] = useState("register");

	return (
		<div className="flex flex-col gap-0 px-6 pt-6 pb-10">
			<div>
				<h1 className="mb-2 text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.partnersAdminTitle} />
				</h1>
				<DynamicBreadcrumb
					items={[
						{ label: <Translate text={localizationConstants.partners} />, href: "/partners/admin" },
						{ label: <Translate text={localizationConstants.partnerAdminItem} /> },
					]}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<div className="mt-6 border-b border-slate-200">
					<TabsList variant="line" className="h-auto gap-6 rounded-none px-0 pb-1">
						{MAIN_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="px-0 text-slate-600 data-[state=active]:px-5 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="register" className="mt-6">
					<PartnersRegisterTab />
				</TabsContent>
				<TabsContent value="approval-center" className="mt-6">
					<ComingSoonPanel />
				</TabsContent>
				<TabsContent value="category" className="mt-6">
					<ComingSoonPanel />
				</TabsContent>
			</Tabs>
		</div>
	);
}
