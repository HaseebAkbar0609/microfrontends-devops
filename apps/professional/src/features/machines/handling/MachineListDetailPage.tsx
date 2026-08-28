"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { PermissionGate } from "@/components/common/PermissionGate";
import { MACHINE_HANDLING_BASE_URL } from "./data/handlingNav.config";
import { getMachineListDetail } from "./data/machineHandling.mock";
import { MachineListInformationTab } from "./components/MachineListInformationTab";
import { MachineListMachinesTab } from "./components/MachineListMachinesTab";

type DetailTab = "information" | "machines";

const TABS: { key: DetailTab; labelKey: TranslationKeys }[] = [
	{
		key: "information",
		labelKey: localizationConstants.machineListInfoTab,
	},
	{ key: "machines", labelKey: localizationConstants.machineListMachinesTab },
];

/**
 * A single machine list (TFS-806, views 2 and 3). The Information tab shows the
 * project, the responsible person and the cost split; the Maskin lista tab shows
 * every booked machine grouped by internal/external and category.
 */
export function MachineListDetailPage({ listId }: { listId?: string }) {
	const t = useTranslate();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<DetailTab>("information");

	const detail = getMachineListDetail(listId);

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<div className="flex-1 overflow-y-auto px-6 py-4">
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.backButton)}
						onClick={() => router.push(MACHINE_HANDLING_BASE_URL)}
						className="cursor-pointer rounded-md p-1.5 text-slate-700 hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
						<Translate text={localizationConstants.machineListTitle} />
					</h1>
				</div>

				<p className="mb-3 ml-9 text-xs text-slate-500 sm:text-sm">
					<Translate text={localizationConstants.machineListProject} />{" "}
					{detail.projectNo}
				</p>

				<div className="mb-4 ml-9 flex flex-col gap-4 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex gap-6 overflow-x-auto">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key)}
								className={cn(
									"cursor-pointer border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
									activeTab === tab.key
										? "border-slate-900 text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-700"
								)}
							>
								<Translate text={tab.labelKey} />
							</button>
						))}
					</div>

					<PermissionGate permission="CREATE_MACHINE">
						{/* asChild so this renders a single <a>; a <button> inside an
						    anchor is invalid HTML. */}
						<Button
							asChild
							className="mb-2 h-10 cursor-pointer gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800"
						>
							<Link
								href={`${MACHINE_HANDLING_BASE_URL}/${encodeURIComponent(detail.id)}/book`}
							>
								<Plus className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.machineListBookMachine} />
							</Link>
						</Button>
					</PermissionGate>
				</div>

				<div className="ml-9">
					{activeTab === "information" ? (
						<MachineListInformationTab detail={detail} />
					) : (
						<MachineListMachinesTab detail={detail} />
					)}
				</div>
			</div>
		</div>
	);
}

export default MachineListDetailPage;
