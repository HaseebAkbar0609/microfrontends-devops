"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown, Check, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PermissionModule } from "../api/permissions.api";
import {
	MODULE_FALLBACK_ICON,
	MODULE_ICONS,
} from "../constants/moduleIcons";
import { useLocalizedText } from "../hooks/useAvailableModules";

export type ModuleSortField = "name" | "status";

interface ModuleTableProps {
	modules: PermissionModule[];
	enabledMap: Record<string, boolean>;
	onToggle: (moduleId: string, enabled: boolean) => void;
	sortField: ModuleSortField | null;
	onToggleSort: (field: ModuleSortField) => void;
}

const ModuleTable = ({
	modules,
	enabledMap,
	onToggle,
	sortField,
	onToggleSort,
}: ModuleTableProps) => {
	const router = useRouter();
	const localized = useLocalizedText();

	return (
		<div className="w-full overflow-x-auto">
			<Table className="w-full min-w-[40rem]">
				<TableHeader>
					<TableRow className="border-b border-slate-200 hover:bg-transparent">
						<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
							<button
								type="button"
								onClick={() => onToggleSort("name")}
								className="flex cursor-pointer items-center gap-1"
							>
								<Translate
									text={localizationConstants.moduleColModules}
								/>
								<ArrowUpDown
									className={
										sortField === "name"
											? "h-3.5 w-3.5 text-slate-900"
											: "h-3.5 w-3.5 opacity-50"
									}
								/>
							</button>
						</TableHead>
						<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
							<button
								type="button"
								onClick={() => onToggleSort("status")}
								className="flex cursor-pointer items-center gap-1"
							>
								<Translate
									text={
										localizationConstants.myPagesEmpLeaveColStatus
									}
								/>
								<ArrowUpDown
									className={
										sortField === "status"
											? "h-3.5 w-3.5 text-slate-900"
											: "h-3.5 w-3.5 opacity-50"
									}
								/>
							</button>
						</TableHead>
						<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
							<Translate
								text={localizationConstants.moduleColMaker}
							/>
						</TableHead>
						<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
							<Translate
								text={localizationConstants.moduleColAction}
							/>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{modules.map((module) => {
						const enabled = enabledMap[module.id] ?? true;
						const Icon =
							MODULE_ICONS[module.icon] ?? MODULE_FALLBACK_ICON;
						return (
							<TableRow
								key={module.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5">
									<span className="flex items-center gap-2 text-sm font-medium text-slate-900">
										<Icon className="h-4 w-4 text-slate-600" />
										{localized(module.name)}
									</span>
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<span
										className={cn(
											"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
											enabled
												? "bg-green-50 text-green-600"
												: "bg-slate-100 text-slate-600",
										)}
									>
										{enabled ? (
											<Check className="h-3 w-3" />
										) : (
											<Power className="h-3 w-3" />
										)}
										<Translate
											text={
												enabled
													? localizationConstants.moduleStatusActive
													: localizationConstants.moduleStatusClosed
											}
										/>
									</span>
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<Switch
										checked={enabled}
										onCheckedChange={(value) =>
											onToggle(module.id, value)
										}
									/>
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											router.push(
												`/admin/settings/view?module=${module.id}`,
											)
										}
										className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
									>
										<Translate
											text={
												localizationConstants.moduleViewSettings
											}
										/>
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default ModuleTable;
