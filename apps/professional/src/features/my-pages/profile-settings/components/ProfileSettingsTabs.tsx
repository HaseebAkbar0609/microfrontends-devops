"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactSection from "./ContactSection";
import BankSection from "./BankSection";
import SecuritySection from "./SecuritySection";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function ProfileSettingsTabs() {
	return (
		<div className="space-y-6 ">
			<Tabs defaultValue="contact" className="w-full">
				<div className="px-5 border-b border-slate-200 mb-6">
					<TabsList
						variant="line"
						className="h-auto gap-6 rounded-none px-0 pb-1"
					>
						<TabsTrigger value="contact" className="px-0 text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:px-3">
							<Translate text={localizationConstants.contactInformation} />
						</TabsTrigger>
						<TabsTrigger value="bank" className="px-0 data-[state=active]:px-3 text-slate-600 data-[state=active]:text-slate-900">
							<Translate text={localizationConstants.bank} />
						</TabsTrigger>
						<TabsTrigger value="security" className="px-0 data-[state=active]:px-3 text-slate-600 data-[state=active]:text-slate-900">
							<Translate text={localizationConstants.security} />
						</TabsTrigger>
					</TabsList>
				</div>
				<div className="px-6">
					<TabsContent value="contact">
						<ContactSection />
					</TabsContent>

					<TabsContent value="bank">
						<BankSection />
					</TabsContent>

					<TabsContent value="security">
						<SecuritySection />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
