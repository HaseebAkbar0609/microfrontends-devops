"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PermissionModule } from "../api/permissions.api";
import { MODULE_FALLBACK_ICON, MODULE_ICONS } from "../constants/moduleIcons";
import {
	MODULE_FLOWTALK,
	MODULE_SETTINGS_ROWS,
	ModuleSettingRow,
} from "../constants/moduleSettings";
import {
	useAvailableModules,
	useLocalizedText,
} from "../hooks/useAvailableModules";

type ChoiceValue = "all" | "authorized";

const settingRowsFor = (
	module: PermissionModule,
	localized: (text: { sv: string; en: string }) => string,
): ModuleSettingRow[] =>
	MODULE_SETTINGS_ROWS[module.name.sv] ??
	module.actions.map((action) => ({
		id: action.id,
		label: localized(action.label),
		type: "choice" as const,
	}));

const ModuleSettingsPanel = ({ module }: { module: PermissionModule }) => {
	const localized = useLocalizedText();
	const rows = settingRowsFor(module, localized);
	const flowTalk = MODULE_FLOWTALK[module.name.sv];

	const [choices, setChoices] = useState<Record<string, ChoiceValue>>({});
	const [flowTalkEnabled, setFlowTalkEnabled] = useState(true);
	const [flowTalkPhone, setFlowTalkPhone] = useState(flowTalk?.phone ?? "");

	return (
		<div className="flex-1 p-6">
			<h2 className="text-lg font-semibold text-slate-500">
				{localized(module.name)}{" "}
				<Translate text={localizationConstants.moduleSettingsSuffix} />
			</h2>
			<div className="mt-4 border-t border-slate-200">
				{rows.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-1 items-center gap-2 py-3 sm:grid-cols-[minmax(0,20rem)_1fr]"
					>
						<span className="text-sm text-slate-900">
							{row.label}
						</span>
						{row.type === "fixed" ? (
							<RadioGroup value="fixed" disabled>
								<label className="flex items-center gap-2 text-sm text-slate-700">
									<RadioGroupItem
										value="fixed"
										disabled
										className="border-slate-300"
									/>
									{row.fixedLabel}
								</label>
							</RadioGroup>
						) : (
							<RadioGroup
								value={choices[row.id] ?? "all"}
								onValueChange={(value) =>
									setChoices((current) => ({
										...current,
										[row.id]: value as ChoiceValue,
									}))
								}
								className="grid grid-cols-2 gap-4 [--primary:var(--color-primary-black)]"
							>
								<label className="flex items-center gap-2 text-sm text-slate-800">
									<RadioGroupItem
										value="all"
										className="border-black"
									/>
									<Translate
										text={
											localizationConstants.moduleSettingAll
										}
									/>
								</label>
								<label className="flex items-center gap-2 text-sm text-slate-800">
									<RadioGroupItem
										value="authorized"
										className="border-black"
									/>
									<Translate
										text={
											localizationConstants.moduleSettingAuthorized
										}
									/>
								</label>
							</RadioGroup>
						)}
					</div>
				))}
			</div>

			{flowTalk && (
				<div className="mt-4 grid grid-cols-1 gap-6 border-t border-slate-200 pt-5 sm:grid-cols-[minmax(0,20rem)_1fr_1fr]">
					<h3 className="text-lg font-semibold text-slate-500">
						FlowTalk
					</h3>
					<div>
						<p className="text-sm font-semibold text-slate-900">
							<Translate
								text={
									localizationConstants.myPagesEmpLeaveColStatus
								}
							/>
						</p>
						<div className="mt-3 flex items-center gap-3">
							<Switch
								checked={flowTalkEnabled}
								onCheckedChange={setFlowTalkEnabled}
							/>
							<span className="text-sm text-slate-800">
								<Translate
									text={
										localizationConstants.moduleSettingActivated
									}
								/>
							</span>
						</div>
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-900">
							<Translate
								text={localizationConstants.moduleSettingPhone}
							/>
						</p>
						<Input
							value={flowTalkPhone}
							onChange={(event) =>
								setFlowTalkPhone(event.target.value)
							}
							className="mt-2 h-10 max-w-xs border-slate-200 text-sm"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

const ViewModuleSettingsPage = () => {
	const router = useRouter();
	const { query, changeQueries } = useQueryParams();
	const localized = useLocalizedText();
	const modulesQuery = useAvailableModules();
	const categories = useMemo(
		() => modulesQuery.data ?? [],
		[modulesQuery.data],
	);

	const allModules = useMemo(
		() => categories.flatMap((category) => category.modules),
		[categories],
	);
	const moduleParam = query.get("module");
	const selected =
		allModules.find((module) => module.id === moduleParam) ?? allModules[0];

	return (
		<div className="flex flex-col gap-5 p-6">
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => router.push("/admin/settings")}
					className="h-8 w-8 rounded-md text-slate-700"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold text-slate-900">
					<Translate
						text={localizationConstants.moduleViewSettings}
					/>
				</h1>
			</div>

			{modulesQuery.isLoading && (
				<div className="flex gap-6 rounded-md border border-slate-200 bg-white p-6">
					<Skeleton className="h-96 w-64" />
					<Skeleton className="h-96 flex-1" />
				</div>
			)}

			{!modulesQuery.isLoading &&
				(modulesQuery.isError || allModules.length === 0) && (
					<div className="rounded-md border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
						<Translate
							text={localizationConstants.moduleLoadFailed}
						/>
					</div>
				)}

			{selected && (
				<div className="flex flex-col rounded-md border border-slate-200 bg-white md:flex-row">
					<aside className="max-h-[70vh] w-full shrink-0 overflow-y-auto border-b border-slate-200 p-4 md:w-64 md:border-b-0 md:border-r">
						{categories.map((category, categoryIndex) => (
							<div key={category.id}>
								<p
									className={cn(
										"px-3 pb-2 text-sm text-slate-500",
										categoryIndex > 0 &&
											"mt-3 border-t border-slate-200 pt-4",
									)}
								>
									{localized(category.title)}
								</p>
								<nav className="flex flex-col gap-1">
									{category.modules.map((module) => {
										const Icon =
											MODULE_ICONS[module.icon] ??
											MODULE_FALLBACK_ICON;
										return (
											<button
												key={module.id}
												type="button"
												onClick={() =>
													changeQueries({
														module: module.id,
													})
												}
												className={cn(
													"flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors",
													selected.id === module.id
														? "bg-slate-100 text-slate-900"
														: "text-slate-700 hover:bg-slate-50",
												)}
											>
												<Icon className="h-4 w-4 text-slate-600" />
												{localized(module.name)}
											</button>
										);
									})}
								</nav>
							</div>
						))}
					</aside>
					<ModuleSettingsPanel key={selected.id} module={selected} />
				</div>
			)}
		</div>
	);
};

export default ViewModuleSettingsPage;
