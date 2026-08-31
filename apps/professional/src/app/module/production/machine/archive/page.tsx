"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	MACHINE_MODULE_TITLE,
	machineBreadcrumbs,
} from "@/features/machines/data/machineNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Archive } from "lucide-react";

export default function MachineArchivePage() {
	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={MACHINE_MODULE_TITLE}
				breadcrumbs={machineBreadcrumbs(
					localizationConstants.machineSidebarArchive
				)}
			/>

			<div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
					<Archive className="h-8 w-8" />
				</div>
				<h2 className="text-lg font-semibold text-slate-800 mb-1">
					<Translate text={localizationConstants.machineSidebarArchive} />
				</h2>
				<p className="text-sm text-slate-500 max-w-sm">
					Inga arkiverade maskiner eller fordon hittades i systemet just nu.
				</p>
			</div>
		</div>
	);
}
