"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/user";
import type { ActiveProject, ApiQuoteItem } from "../types";
import { cn } from "@/lib/utils";
import {
	getActiveProjectsAPIAction,
	getProjectListAPIAction,
} from "@/api-actions";
import type { ActiveProjectItem } from "@/api-actions/project/active";
import { resolveCompanyName } from "../utils/activeProject";
import { normalizeProjectStatus } from "@/utils/statusNormalizer";
import { ActiveProjectRowActions } from "./ActiveProjectRowActions";

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

const PROJECT_LIST_QUERY = { page: 1, pageSize: 10 } as const;

type SortKey =
	| "referenceNo"
	| "name"
	| "orderNo"
	| "quoteReferenceNo"
	| "companyName"
	| "status";

function mapActiveProjectToFrontend(item: ActiveProjectItem): ActiveProject {
	const normStatus = normalizeProjectStatus(item.status);
	const rawItem = item as unknown as Record<string, unknown>;
	const rawOrderNo = (rawItem.orderNo || rawItem.order_no) as
		| string
		| undefined;
	const orderNo = rawOrderNo && rawOrderNo !== "-" ? rawOrderNo : "—";
	return {
		id: item.id,
		name: item.name || "Untitled Project",
		referenceNo:
			item.projectCode ||
			(item.id ? item.id.substring(0, 8).toUpperCase() : "PROJ-1"),
		clientNo: "-",
		projectNo: item.projectCode || "-",
		startDate: item.startDate || "-",
		endDate: item.dueDate || "-",
		contactPersonName: item.primaryContact?.name || "-",
		mobileNumber: "-",
		email: "-",
		address: "-",
		postalCode: "-",
		companyName: resolveCompanyName(item, item.name),
		status: normStatus,
		statusLabel: item.statusLabel || item.status,
		orderNo: orderNo,
		quoteReferenceNo: "-",
		progressPercent: item.progressPercent ?? 0,
		updatedAt: item.updatedAt,
		category: "-",
	};
}

function mapListProjectToFrontend(q: ApiQuoteItem): ActiveProject {
	const projName =
		q.projectName || q.project_name || q.name || "Untitled Project";
	const rawId = q.project_id || q.id || "";
	const rawRef = q.refNo || q.ref_no || q.project_code || q.projectCode;
	const refCode =
		rawRef && rawRef !== "-"
			? rawRef
			: rawId
				? rawId.substring(0, 8).toUpperCase()
				: "-";
	const normStatus = normalizeProjectStatus(q.quote_status || q.status);
	const rawOrderNo = q.orderNo || q.order_no;
	const orderNo = rawOrderNo && rawOrderNo !== "-" ? rawOrderNo : "—";
	return {
		id: rawId,
		name: projName,
		referenceNo: refCode,
		clientNo: q.clientNo || q.client_no || "-",
		projectNo: refCode,
		startDate: "-",
		endDate: "-",
		contactPersonName: "-",
		mobileNumber: "-",
		email: "-",
		address: "-",
		postalCode: "-",
		companyName:
			q.companyName || q.company_name || resolveCompanyName({}, projName),
		status: normStatus,
		statusLabel: q.quote_status || q.status || "Active",
		orderNo: orderNo,
		quoteReferenceNo: refCode,
		progressPercent: 0,
		category: q.category || "-",
	};
}

export function ProjectList() {
	const [projects, setProjects] = useState<ActiveProject[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sortKey, setSortKey] = useState<SortKey>("referenceNo");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		let cancelled = false;
		async function loadProjects() {
			setLoading(true);
			setError(null);

			const combinedMap = new Map<string, ActiveProject>();

			const activeRes = await getActiveProjectsAPIAction({
				limit: PROJECT_LIST_QUERY.pageSize,
			});
			if (cancelled) return;

			let hasError = false;
			if (!activeRes.success) {
				hasError = true;
				setError(activeRes.error || "Failed to load active projects");
			} else if (activeRes.data?.data) {
				activeRes.data.data.forEach((item) => {
					const mapped = mapActiveProjectToFrontend(item);
					if (mapped.id) {
						combinedMap.set(mapped.id, mapped);
					}
				});
			}

			if (!hasError) {
				const listRes = await getProjectListAPIAction({
					page: PROJECT_LIST_QUERY.page,
					pageSize: PROJECT_LIST_QUERY.pageSize,
					sortBy: sortKey || undefined,
					sortOrder: sortDir || undefined,
				});
				if (cancelled) return;
				if (listRes.success && listRes.data?.quotes) {
					listRes.data.quotes.forEach((q: ApiQuoteItem) => {
						const item = mapListProjectToFrontend(q);
						if (item.id) {
							const existing = combinedMap.get(item.id);
							combinedMap.set(
								item.id,
								existing
									? {
											...existing,
											clientNo:
												existing.clientNo !== "-"
													? existing.clientNo
													: item.clientNo,
											quoteReferenceNo:
												existing.quoteReferenceNo !==
												"-"
													? existing.quoteReferenceNo
													: item.quoteReferenceNo,
											category:
												existing.category !== "-"
													? existing.category
													: item.category,
										}
									: item,
							);
						}
					});
				} else {
					hasError = true;
					setError(listRes.error || "Failed to load projects list");
				}
			}

			if (cancelled) return;

			if (!hasError) {
				setProjects(Array.from(combinedMap.values()));
			}
			setLoading(false);
		}

		void loadProjects();
		return () => {
			cancelled = true;
		};
	}, [sortKey, sortDir, reloadKey]);

	function toggleSort(key: SortKey) {
		if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortKey(key);
			setSortDir("asc");
		}
	}

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
							href="/business/offer/create"
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
							href="/business/offer/create"
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
										] as { key: SortKey; label: string }[]
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
														href={`/projectmanagement/${project.id}`}
														className="text-[#09090B] font-medium hover:underline"
													>
														{project.referenceNo}
													</Link>
												</td>
												<td className="px-4 py-3">
													<Link
														href={`/projectmanagement/${project.id}`}
														className="text-[#374151] hover:underline"
													>
														{project.name}
													</Link>
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
														onStatusChanged={() =>
															setReloadKey(
																(k) => k + 1,
															)
														}
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
