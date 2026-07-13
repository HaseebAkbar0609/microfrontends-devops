"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Plus } from "lucide-react";

const rotRutTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-4 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-[3px] border-transparent -mb-[3px] after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-[3px] data-[state=active]:!border-slate-900";

export default function RootRutOverviewPage() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-1 flex-col bg-white min-h-screen font-inter">
			<Tabs defaultValue="rot" className="flex flex-1 flex-col">
				{/* Header Area */}
				<PageHeader
					title={localizationConstants.rotRutTitle}
					breadcrumbs={[
						{ label: localizationConstants.home, href: "/home" },
						{ label: localizationConstants.tools, href: "#" },
						{ label: localizationConstants.rotRutTitle, href: "/rotRut" },
					]}
					className="border-none pb-0"
				>
					<TabsList className="mt-2 flex h-auto w-full justify-start gap-x-4 rounded-none bg-transparent p-0 border-b border-slate-200 px-5">
						<TabsTrigger value="rot" className={rotRutTabTriggerClass}>
							<Translate text={localizationConstants.rotTab} />
						</TabsTrigger>
						<TabsTrigger value="rut" className={rotRutTabTriggerClass}>
							<Translate text={localizationConstants.rutTab} />
						</TabsTrigger>
					</TabsList>
				</PageHeader>

				{/* Main Content */}
				<div className="p-8">
					<TabsContent value="rot" className="mt-0 flex flex-col">
						{/* Toolbar */}
						<div className="flex items-center justify-end gap-4 mb-6">
							<div className="flex items-center gap-2">
								<Link href="/rotRut/create">
									<Button className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md">
										<Plus className="h-4 w-4" />
										{t(localizationConstants.createRotBtn)}
									</Button>
								</Link>
							</div>
						</div>

						<div className="text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-200">
							<Translate text={localizationConstants.comingSoon} />
						</div>
					</TabsContent>

					<TabsContent value="rut" className="mt-0">
						<div className="text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-200">
							<Translate text={localizationConstants.comingSoon} />
						</div>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
