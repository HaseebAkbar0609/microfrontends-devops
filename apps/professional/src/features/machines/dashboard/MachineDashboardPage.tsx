"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Activity,
	ClipboardList,
	DollarSign,
	CircleDot,
	Sparkles,
	MoreVertical,
	Check,
	X,
	SlidersHorizontal,
	Layers,
} from "lucide-react";
import { ModulePageHeader } from "@/components/layout/navigation";
import { machineDashboardBreadcrumbs } from "@/features/machines/data/machineNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WidgetVisibility {
	kpiOverview: boolean;
	upcomingService: boolean;
	linkedProjects: boolean;
	purchasesOverview: boolean;
	quickActions: boolean;
}

export function MachineDashboardPage() {
	const [visibility, setVisibility] = useState<WidgetVisibility>({
		kpiOverview: true,
		upcomingService: true,
		linkedProjects: true,
		purchasesOverview: true,
		quickActions: true,
	});

	const toggleWidget = (key: keyof WidgetVisibility) => {
		setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const resetToDefault = () => {
		setVisibility({
			kpiOverview: true,
			upcomingService: true,
			linkedProjects: true,
			purchasesOverview: true,
			quickActions: true,
		});
	};

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			{/* Top Module Header */}
			<div className="relative">
				<ModulePageHeader
					title={localizationConstants.machineSidebarDashboard}
					breadcrumbs={machineDashboardBreadcrumbs()}
				/>
				{/* Rearrange button on the right */}
				<div className="absolute right-6 top-5 hidden sm:block">
					<button
						type="button"
						onClick={resetToDefault}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
					>
						<SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
						<span>
							<Translate text={localizationConstants.machineDashRearrange} />
						</span>
					</button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-6 pb-12 overflow-y-auto">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_260px] items-start">
					{/* Left & Center Columns (Widgets Area) */}
					<div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
						{/* Widget 1: KPI Machine Park Overview */}
						{visibility.kpiOverview && (
							<div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all">
								<div className="flex items-center justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
											<Activity className="h-4 w-4" />
										</div>
										<h3 className="text-sm font-bold text-slate-900">
											<Translate text={localizationConstants.machineDashKpiTitle} />
										</h3>
									</div>
									<button
										type="button"
										className="text-slate-400 hover:text-slate-600"
										aria-label="Widget options"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600">
									<div className="flex items-center justify-between">
										<span>
											<Translate text={localizationConstants.machineDashInOperation} />
										</span>
										<span className="font-semibold text-slate-900">42</span>
									</div>
									<div className="flex items-center justify-between">
										<span>
											<Translate text={localizationConstants.machineDashServicePending} />
										</span>
										<span className="font-semibold text-slate-900">3</span>
									</div>
									<div className="flex items-center justify-between">
										<span>
											<Translate text={localizationConstants.machineDashOutOfService} />
										</span>
										<span className="font-semibold text-slate-900">1</span>
									</div>
									<div className="flex items-center justify-between">
										<span>
											<Translate text={localizationConstants.machineDashUpcomingService} />
										</span>
										<span className="font-semibold text-slate-900">5</span>
									</div>
									<div className="flex items-center justify-between">
										<span>
											<Translate text={localizationConstants.machineDashLogbookNotCompleted} />
										</span>
										<span className="font-semibold text-slate-900">2</span>
									</div>
								</div>
							</div>
						)}

						{/* Widget 2: Ongoing / Upcoming Service (Top 5) */}
						{visibility.upcomingService && (
							<div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all">
								<div className="flex items-center justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
											<ClipboardList className="h-4 w-4" />
										</div>
										<h3 className="text-sm font-bold text-slate-900">
											<Translate text={localizationConstants.machineDashOngoingServiceTitle} />
										</h3>
									</div>
									<button
										type="button"
										className="text-slate-400 hover:text-slate-600"
										aria-label="Widget options"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600">
									<div className="flex items-center justify-between py-1">
										<span className="font-medium text-slate-800">
											<Translate text={localizationConstants.machineDashServiceItem1} />
										</span>
									</div>
									<div className="flex items-center justify-between py-1">
										<span className="font-medium text-slate-800">
											<Translate text={localizationConstants.machineDashServiceItem2} />
										</span>
									</div>
									<div className="flex items-center justify-between py-1">
										<span className="font-medium text-slate-800">
											<Translate text={localizationConstants.machineDashServiceItem3} />
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Widget 3: Machines linked to project / order */}
						{visibility.linkedProjects && (
							<div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all">
								<div className="flex items-center justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
											<DollarSign className="h-4 w-4" />
										</div>
										<h3 className="text-sm font-bold text-slate-900">
											<Translate text={localizationConstants.machineDashLinkedProjectsTitle} />
										</h3>
									</div>
									<button
										type="button"
										className="text-slate-400 hover:text-slate-600"
										aria-label="Widget options"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
									<p className="font-medium text-slate-700 mb-1">
										<Translate text={localizationConstants.machineDashLinkedProjectsSubtitle} />
									</p>
									<div className="py-1 text-slate-800">
										<Translate text={localizationConstants.machineDashLinkedItem1} />
									</div>
									<div className="py-1 text-slate-800">
										<Translate text={localizationConstants.machineDashLinkedItem2} />
									</div>
									<div className="py-1 text-slate-800">
										<Translate text={localizationConstants.machineDashLinkedItem3} />
									</div>
								</div>
							</div>
						)}

						{/* Widget 4: Machine Purchases – Overview */}
						{visibility.purchasesOverview && (
							<div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all">
								<div className="flex items-center justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
											<CircleDot className="h-4 w-4" />
										</div>
										<h3 className="text-sm font-bold text-slate-900">
											<Translate text={localizationConstants.machineDashPurchasesTitle} />
										</h3>
									</div>
									<button
										type="button"
										className="text-slate-400 hover:text-slate-600"
										aria-label="Widget options"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600">
									<div className="py-1 text-slate-800">
										<Translate text={localizationConstants.machineDashPurchaseItem1} />
									</div>
									<div className="py-1 text-slate-800">
										<Translate text={localizationConstants.machineDashPurchaseBudgetPrefix} />
										<span className="font-semibold text-slate-900">75%</span>
										<Translate text={localizationConstants.machineDashPurchaseBudgetSuffix} />
									</div>
									<div className="py-1 text-slate-800">
										<Translate text={localizationConstants.machineDashPurchaseItem3} />
									</div>
								</div>
							</div>
						)}

						{/* Widget 5: Quick Actions */}
						{visibility.quickActions && (
							<div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all">
								<div className="flex items-center justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
											<Sparkles className="h-4 w-4" />
										</div>
										<h3 className="text-sm font-bold text-slate-900">
											<Translate text={localizationConstants.machineDashQuickActionsTitle} />
										</h3>
									</div>
									<button
										type="button"
										className="text-slate-400 hover:text-slate-600"
										aria-label="Widget options"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-4 flex flex-col gap-2 text-xs font-medium">
									<Link
										href="/module/production/machine/create"
										className="py-1 text-slate-700 hover:text-slate-900 transition-colors"
									>
										<Translate text={localizationConstants.machineDashActionAddMachine} />
									</Link>
									<Link
										href="/module/production/machine/handling"
										className="py-1 text-slate-700 hover:text-slate-900 transition-colors"
									>
										<Translate text={localizationConstants.machineDashActionRegisterService} />
									</Link>
									<div className="py-1 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
										<Translate text={localizationConstants.machineDashActionAddVehicle} />
									</div>
									<div className="py-1 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
										<Translate text={localizationConstants.machineDashActionVehicleMap} />
									</div>
									<div className="py-1 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
										<Translate text={localizationConstants.machineDashActionLogbook} />
									</div>
									<div className="py-1 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
										<Translate text={localizationConstants.machineDashActionNewKey} />
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Right Column: Actions & Menu Panel */}
					<div className="flex flex-col gap-4">
						{/* Action Buttons Box */}
						<div className="flex flex-col gap-2.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
							<button
								type="button"
								className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#111827] text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors cursor-pointer"
							>
								<Check className="h-4 w-4" />
								<span>
									<Translate text={localizationConstants.machineDashSave} />
								</span>
							</button>

							<button
								type="button"
								onClick={resetToDefault}
								className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
							>
								<X className="h-4 w-4 text-slate-500" />
								<span>
									<Translate text={localizationConstants.machineDashDiscard} />
								</span>
							</button>
						</div>

						{/* Menu Box */}
						<div className="flex flex-col rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs">
							<div className="flex items-center gap-2.5 rounded-lg bg-[#1E293B] px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs mb-3">
								<Layers className="h-4 w-4 text-white" />
								<span>
									<Translate text={localizationConstants.machineDashMenuTitle} />
								</span>
							</div>

							<div className="flex flex-col gap-1 text-xs text-slate-700">
								<button
									type="button"
									onClick={() => toggleWidget("kpiOverview")}
									className={`flex items-center gap-2.5 py-2 text-left transition-colors cursor-pointer ${
										visibility.kpiOverview ? "text-slate-900 font-medium" : "text-slate-400 line-through"
									}`}
								>
									<Layers className="h-4 w-4 text-slate-500 shrink-0" />
									<span>
										<Translate text={localizationConstants.machineDashKpiTitle} />
									</span>
								</button>

								<button
									type="button"
									onClick={() => toggleWidget("upcomingService")}
									className={`flex items-center gap-2.5 py-2 text-left transition-colors cursor-pointer ${
										visibility.upcomingService ? "text-slate-900 font-medium" : "text-slate-400 line-through"
									}`}
								>
									<Layers className="h-4 w-4 text-slate-500 shrink-0" />
									<span>
										<Translate text={localizationConstants.machineDashOngoingServiceTitle} />
									</span>
								</button>

								<button
									type="button"
									onClick={() => toggleWidget("linkedProjects")}
									className={`flex items-center gap-2.5 py-2 text-left transition-colors cursor-pointer ${
										visibility.linkedProjects ? "text-slate-900 font-medium" : "text-slate-400 line-through"
									}`}
								>
									<Layers className="h-4 w-4 text-slate-500 shrink-0" />
									<span>
										<Translate text={localizationConstants.machineDashLinkedProjectsTitle} />
									</span>
								</button>

								<button
									type="button"
									onClick={() => toggleWidget("purchasesOverview")}
									className={`flex items-center gap-2.5 py-2 text-left transition-colors cursor-pointer ${
										visibility.purchasesOverview ? "text-slate-900 font-medium" : "text-slate-400 line-through"
									}`}
								>
									<Layers className="h-4 w-4 text-slate-500 shrink-0" />
									<span>
										<Translate text={localizationConstants.machineDashPurchasesTitle} />
									</span>
								</button>

								<button
									type="button"
									onClick={() => toggleWidget("quickActions")}
									className={`flex items-center gap-2.5 py-2 text-left transition-colors cursor-pointer ${
										visibility.quickActions ? "text-slate-900 font-medium" : "text-slate-400 line-through"
									}`}
								>
									<Layers className="h-4 w-4 text-slate-500 shrink-0" />
									<span>
										<Translate text={localizationConstants.machineDashQuickActionsTitle} />
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
