"use client";

import Link from "next/link";
import { Plus, Loader2, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/user";
import { cn } from "@/lib/utils";
import { projectHref, type ProjectSortKey } from "../utils/activeProject";
import { useActiveProjectList } from "../hooks/useActiveProjectList";
import { ActiveProjectRowActions } from "./ActiveProjectRowActions";
import { ProjectOriginBadge } from "./ProjectOriginBadge";
import { CREATE_DIRECT_PROJECT_PATH } from "@/features/quote/constants";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.projectMyProjects },
	{ label: localizationConstants.projectmanagement },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
	"received-quote": { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
	completed: { bg: "bg-[#F0FDF4]", text: "text-[#047857]" },
	draft: { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
	active: { bg: "bg-[#F0FDF4]", text: "text-[#047857]" },
	"on-hold": { bg: "bg-yellow-50", text: "text-yellow-600" },
};

export function ProjectList() {
	const { projects, loading, error, sortKey, toggleSort, reload } =
		useActiveProjectList();

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.projectmanagement}
				breadcrumbs={BREADCRUMBS}
			/>

			<div className="p-6 flex-1">
				{/* Toolbar */}
				<div className="flex items-center gap-3 mb-5">
					<div className="ml-auto flex items-center gap-3">
						<Link
							href={CREATE_DIRECT_PROJECT_PATH}
							className="h-9 px-4 flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
						>
							<Plus className="h-4 w-4" />
							<Translate
								text={
									localizationConstants.projectNewOrderDirect
								}
							/>
						</Link>
						<Link
							href={CREATE_DIRECT_PROJECT_PATH}
							className="h-9 px-4 flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
						>
							<Plus className="h-4 w-4" />
							<Translate
								text={localizationConstants.projectNewProject}
							/>
						</Link>
					</div>
				</div>

				{/* Table card */}
				<div className="w-[90%] bg-white rounded-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full min-w-175 text-sm">
							<thead>
								<tr className="border-b border-[#E2E8F0] bg-white">
									{(
										[
											{
												key: "referenceNo",
												label: localizationConstants.refNo,
											},
											{
												key: "name",
												label: localizationConstants.projectName,
											},
											{
												key: "orderNo",
												label: localizationConstants.projectOrderNoCol,
											},
											{
												key: "quoteReferenceNo",
												label: localizationConstants.projectQuoteRefNoCol,
											},
											{
												key: "companyName",
												label: localizationConstants.projectSupplierCol,
											},
											{
												key: "status",
												label: localizationConstants.status,
											},
										] as { key: ProjectSortKey; label: string }[]
									).map(({ key, label }) => (
										<th
											key={key}
											className="px-4 py-3 text-left text-xs font-medium text-[#64748B] whitespace-nowrap cursor-pointer select-none"
											onClick={() => toggleSort(key)}
										>
											<span className="inline-flex items-center gap-1">
												<Translate text={label} />
												<ArrowUpDown
													className={cn(
														"h-3.5 w-3.5 transition-colors",
														sortKey === key
															? "text-[#09090B]"
															: "text-[#CBD5E1]",
													)}
												/>
											</span>
										</th>
									))}
									<th className="px-4 py-3 w-10" />
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan={7}
											className="px-4 py-16 text-center text-sm text-[#94A3B8]"
										>
											<Loader2
												className="h-6 w-6 animate-spin mx-auto text-slate-500 mb-2"
												role="status"
												aria-label="Loading projects"
											/>
											Loading projects...
										</td>
									</tr>
								) : error && projects.length === 0 ? (
									<tr>
										<td
											colSpan={7}
											className="px-4 py-16 text-center text-sm text-red-500"
										>
											{error}
										</td>
									</tr>
								) : projects.length === 0 ? (
									<tr>
										<td
											colSpan={7}
											className="px-4 py-16 text-center text-sm text-[#94A3B8]"
										>
											<Translate
												text={
													localizationConstants.projectNoProjectsFound
												}
											/>
										</td>
									</tr>
								) : (
									projects.map((project) => {
										const href = projectHref(project);
										const badge =
											STATUS_STYLE[project.status] ??
											STATUS_STYLE["draft"];
										return (
											<tr
												key={project.id}
												className="border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50/60 transition-colors"
											>
												<td className="px-4 py-3">
													<Link
														href={href}
														className="text-[#09090B] font-medium hover:underline"
													>
														{project.referenceNo}
													</Link>
												</td>
												<td className="px-4 py-3">
													<Link
														href={href}
														className="text-[#374151] hover:underline"
													>
														{project.name}
													</Link>
													<ProjectOriginBadge
														creationMode={project.creationMode}
													/>
												</td>
												<td className="px-4 py-3 text-[#374151]">
													{project.orderNo ?? "—"}
												</td>
												<td className="px-4 py-3 text-[#374151]">
													{project.quoteReferenceNo ??
														"—"}
												</td>
												<td className="px-4 py-3 text-[#374151]">
													{project.companyName}
												</td>
												<td className="px-4 py-3">
													<span
														className={cn(
															"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
															badge.bg,
															badge.text,
														)}
													>
														{project.statusLabel ??
															project.status}
													</span>
												</td>
												<td className="px-4 py-3 text-right">
													<ActiveProjectRowActions
														projectId={project.id}
														editHref={href}
														onStatusChanged={reload}
													/>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
