"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
	getProjectContractsAPIAction,
	saveProjectContractAPIAction,
	deleteProjectContractAPIAction,
	uploadMediaAPIAction,
	deleteMediaAPIAction,
} from "@/api-actions";
import {
	Search,
	ChevronDown,
	Check,
	Plus,
	ArrowUpDown,
	MoreVertical,
	Pencil,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ContractCreateForm } from "./ContractCreateForm";
import { ContractDocumentEditor } from "./ContractDocumentEditor";
import { ContractTemplatesView } from "./ContractTemplateDetail";

// ─── Types ────────────────────────────────────────────────────────────────────

import type { ActiveProject } from "../../types";
import type { ContractFormData, StagedDocument } from "./ContractCreateForm";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContractSubTab = "list" | "contract" | "templates";

type ContractView =
	| { kind: "sub"; tab: ContractSubTab }
	| { kind: "contract-detail"; contract: Contract }
	| { kind: "create-form" }
	| { kind: "create-editor" };

type ContractStatus = "not-signed" | "signed";

const CONTRACT_STATUS_OPTIONS: { value: "" | ContractStatus; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "signed", label: "Signed" },
	{ value: "not-signed", label: "Not Signed" },
];

interface ContractClause {
	id: string;
	date: string;
	name: string;
	fileType: string;
	fileUrl?: string;
}

interface Contract {
	id: string;
	nr: string;
	contactPerson: string;
	project: string;
	phone: string;
	email: string;
	role: string;
	status: ContractStatus;
	period: string;
	company: string;
	startDate: string;
	endDate: string;
	signedDate: string;
	nextReview: string;
	clauses: ContractClause[];
	jobDescription: string;
	jobLevel: string;
	hoursPerWeek: string;
	supervisor: string;
	offerPrice: string;
	paymentTerms: string;
	paidUntil: string;
	expensesAllowed: string;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContractStatus }) {
	if (status === "signed") {
		return (
			<span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-[#F0FDF4] text-[#047857]">
				<Translate text={localizationConstants.contractStatusSigned} />
			</span>
		);
	}
	return (
		<span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
			<Translate text={localizationConstants.contractStatusNotSigned} />
		</span>
	);
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function ContractEmptyState({ onCreate }: { onCreate: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center py-20 gap-4">
			<div className="w-16 h-16 rounded-full flex items-center justify-center">
				<Image
					src="/assets/icons/union.svg"
					alt=""
					width={90}
					height={89}
				/>
			</div>
			<div className="text-center max-w-sm">
				<p className="text-base font-semibold text-[#09090B] mb-1">
					<Translate
						text={localizationConstants.contractEmptyTitle}
					/>
				</p>
				<p className="text-sm text-[#71717A]">
					<Translate
						text={localizationConstants.contractEmptySubtitle}
					/>
				</p>
			</div>
			<Button
				type="button"
				onClick={onCreate}
				className="h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
			>
				<Plus className="h-4 w-4" />
				<Translate text={localizationConstants.projectCreateNewLabel} />
			</Button>
		</div>
	);
}

// ─── Contract list ────────────────────────────────────────────────────────────

function ContractList({
	contracts,
	onSelect,
	onCreateNew,
	onDelete,
}: {
	contracts: Contract[];
	onSelect: (contract: Contract) => void;
	onCreateNew: () => void;
	onDelete?: (contract: Contract) => void;
}) {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"" | ContractStatus>("");
	const [filterOpen, setFilterOpen] = useState(false);
	const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);

	const handleDeleteConfirmed = () => {
		if (!deleteTarget) return;
		const target = deleteTarget;
		setDeleteTarget(null);
		onDelete?.(target);
		showToast(
			"success",
			t(localizationConstants.projectContractDeletedSuccess),
		);
	};

	useEffect(() => {
		if (!filterOpen) return;
		const close = () => { setFilterOpen(false); setFilterAnchor(null); };
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [filterOpen]);

	function toggleFilter(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();
		if (filterOpen) { setFilterOpen(false); setFilterAnchor(null); return; }
		const rect = e.currentTarget.getBoundingClientRect();
		setFilterOpen(true);
		setFilterAnchor({ top: rect.bottom + 4, left: rect.left });
	}

	const filtered = contracts.filter(
		(c) =>
			(c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
				c.project.toLowerCase().includes(search.toLowerCase()) ||
				c.nr.toLowerCase().includes(search.toLowerCase())) &&
			(statusFilter === "" || c.status === statusFilter),
	);

	return (
		<div className="pb-10">
			<div className="flex items-center gap-3 mb-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.searchPlaceholder)}
						className="pl-9 h-9 w-48 text-sm border-[#E2E8F0]"
					/>
				</div>
				<button
					type="button"
					onClick={toggleFilter}
					className={`cursor-pointer h-9 px-3 flex items-center gap-1.5 text-sm font-medium border rounded-lg transition-colors ${
						statusFilter
							? "bg-blue-50 border-blue-200 text-blue-700"
							: "bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50"
					}`}
				>
					<Translate text={localizationConstants.contractFilterLabel} />
					{statusFilter && <span className="text-xs font-normal">· {statusFilter === "signed" ? "Signed" : "Not Signed"}</span>}
					<ChevronDown className="h-4 w-4 text-slate-400" />
				</button>
				<Button
					type="button"
					onClick={onCreateNew}
					className="ml-auto h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.projectCreateNewLabel} />
				</Button>
			</div>

			<div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
				{filtered.length === 0 ? (
					<ContractEmptyState onCreate={onCreateNew} />
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-175 border-collapse">
							<thead>
								<tr className="border-b border-[#E2E8F0]">
									<th className="px-4 h-12 text-left text-sm font-medium text-[#64748B] w-16">
										<button
											type="button"
											className="cursor-pointer flex items-center gap-1 hover:text-slate-700"
										>
											<Translate
												text={
													localizationConstants.contractNrLabel
												}
											/>
											<ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
										</button>
									</th>
									{[
										localizationConstants.contractContactPersonLabel,
										localizationConstants.contractProjectLabel,
										localizationConstants.projectOrgPhoneLabel,
										localizationConstants.contractEmailLabel,
										localizationConstants.contractRoleLabel,
										localizationConstants.contractStatusLabel,
									].map((key) => (
										<th
											key={key}
											className="px-4 h-12 text-left text-sm font-medium text-[#64748B]"
										>
											<button
												type="button"
												className="flex items-center gap-1 hover:text-slate-700 whitespace-nowrap"
											>
												<Translate text={key} />
												<ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
											</button>
										</th>
									))}
									<th className="w-10 border-l border-[#E2E8F0]" />
								</tr>
							</thead>
							<tbody>
								{filtered.map((contract) => (
									<tr
										key={contract.id}
										className="border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
										onClick={() => onSelect(contract)}
									>
										<td className="px-4 py-0 h-14 text-sm font-semibold text-[#020617] whitespace-nowrap">
											{contract.nr}
										</td>
										<td className="px-4 py-0 h-14 text-sm text-[#020617]">
											<span className="block truncate max-w-40">
												{contract.contactPerson}
											</span>
										</td>
										<td className="px-4 py-0 h-14 text-sm text-[#020617]">
											<span className="block truncate max-w-40">
												{contract.project}
											</span>
										</td>
										<td className="px-4 py-0 h-14 text-sm text-[#020617] whitespace-nowrap">
											{contract.phone}
										</td>
										<td className="px-4 py-0 h-14 text-sm text-[#020617]">
											<span className="block truncate max-w-50">
												{contract.email}
											</span>
										</td>
										<td className="px-4 py-0 h-14 text-sm text-[#020617] whitespace-nowrap">
											{contract.role}
										</td>
										<td className="px-4 py-0 h-14">
											<StatusBadge
												status={contract.status}
											/>
										</td>
										<td
											className="py-0 h-14 w-10 border-l border-[#E2E8F0]"
											onClick={(e) => e.stopPropagation()}
										>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type="button"
														className="cursor-pointer flex items-center justify-center h-full w-10 text-[#64748B] hover:text-[#18181B] hover:bg-slate-100 transition-colors"
														aria-label="Actions"
													>
														<MoreVertical className="h-4 w-4" />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-[150px]"
												>
													<DropdownMenuItem
														className="gap-2 cursor-pointer py-2"
														onClick={() =>
															onSelect(contract)
														}
													>
														<Pencil className="h-4 w-4 text-accent-foreground" />
														<Translate
															text={
																localizationConstants.open
															}
														/>
													</DropdownMenuItem>
													<DropdownMenuItem
														className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700"
														onClick={() =>
															setDeleteTarget(
																contract,
															)
														}
													>
														<Trash2 className="h-4 w-4 text-accent-foreground" />
														<Translate
															text={
																localizationConstants.delete
															}
														/>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Filter portal */}
			{filterOpen && filterAnchor && (
				<div
					style={{ position: "fixed", top: filterAnchor.top, left: filterAnchor.left, zIndex: 9999 }}
					className="w-40 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
					onClick={(e) => e.stopPropagation()}
				>
					<p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Status</p>
					{CONTRACT_STATUS_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => { setStatusFilter(opt.value); setFilterOpen(false); setFilterAnchor(null); }}
							className="cursor-pointer w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
						>
							{opt.label}
							{statusFilter === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
						</button>
					))}
				</div>
			)}

			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold text-slate-800">
							<Translate
								text={
									localizationConstants.deleteContractConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate
								text={
									localizationConstants.deleteContractConfirmDescription
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel
							className="min-w-24"
							onClick={() => setDeleteTarget(null)}
						>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							className="min-w-24 bg-red-600 hover:bg-red-700 text-white"
							onClick={handleDeleteConfirmed}
						>
							<Translate text={localizationConstants.delete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

// ─── Contract detail ──────────────────────────────────────────────────────────

function ContractDetail({ contract }: { contract?: Contract }) {
	if (!contract) {
		return <ContractEmptyState onCreate={() => { }} />;
	}
	return (
		<div className="pb-10">
			<div className="grid grid-cols-2 gap-5">

				{/* Top-left: Contract details */}
				<div className="bg-white border border-[#E5E5E5] rounded-lg">
					<div className="flex items-center gap-2 p-4 border-b border-[#E4E4E7]">
						<Image src="/assets/icons/personal-info.svg" alt="" width={24} height={24} className="shrink-0" />
						<h3 className="text-base font-medium text-[#09090B]">
							<Translate text={localizationConstants.contractDetailsTitle} />
						</h3>
					</div>
					<div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4">
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractPeriodLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.period}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractCompanyLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.company}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractIdLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.nr.replace("K", "CN-2025-0")}</p>
						</div>
						<div />
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractStartDateLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.startDate}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractEndDateLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.endDate}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractSignedLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.signedDate}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.contractNextReviewLabel} />
							</p>
							<p className="text-sm text-[#71717A]">{contract.nextReview}</p>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-sm font-medium text-[#09090B] mb-3">
						<Translate
							text={localizationConstants.contractClausesTitle}
						/>
					</h3>
					<div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
						<div className="grid grid-cols-[126px_1fr_73px_107px] border-b border-[#E2E8F0]">
							{[
								localizationConstants.projectFileDateLabel,
								localizationConstants.contractDocNameLabel,
								localizationConstants.projectFileLabel,
							].map((key) => (
								<button
									key={key}
									type="button"
									className="cursor-pointer flex items-center gap-1 h-12 px-3 text-sm font-medium text-[#64748B] hover:text-slate-700 whitespace-nowrap"
								>
									<Translate text={key} />
									<ArrowUpDown className="h-4 w-4 shrink-0" />
								</button>
							))}
							<div className="h-12 border-l border-[#E2E8F0]" />
						</div>
						{contract.clauses.map((clause) => (
							<div
								key={clause.id}
								className="grid grid-cols-[126px_1fr_73px_107px] items-stretch border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors"
							>
								<span className="h-12 flex items-center px-3 text-sm text-[#020617]">
									{clause.date}
								</span>
								<div className="h-12 flex items-center px-3 gap-2 min-w-0 overflow-hidden">
									<Image
										src="/assets/icons/file-pdf-icon.svg"
										alt="PDF"
										width={24}
										height={24}
										className="shrink-0"
									/>
									<span className="text-sm text-[#020617] truncate min-w-0">
										{clause.name}
									</span>
								</div>
								<span className="h-12 flex items-center px-3 text-sm text-[#020617]">
									{clause.fileType}
								</span>
								<div className="h-12 flex items-center px-3 border-l border-[#E2E8F0]">
									{clause.fileUrl && (
										<a
											href={clause.fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center min-w-16 h-9 px-2 text-sm font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
										>
											<Translate
												text={
													localizationConstants.contractViewFileLabel
												}
											/>
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white border border-[#E5E5E5] rounded-lg">
					<div className="flex items-center justify-between p-4 border-b border-[#E4E4E7]">
						<div className="flex items-center gap-2">
							<Image
								src="/assets/icons/personal-info.svg"
								alt=""
								width={24}
								height={24}
								className="shrink-0"
							/>
							<h3 className="text-base font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractPositionTitle
									}
								/>
							</h3>
						</div>
						<Button
							type="button"
							size="sm"
							className="h-9 gap-2 text-sm font-medium bg-[#F4F4F5] text-[#09090B] hover:bg-zinc-200 border-0 shadow-sm"
						>
							<Pencil className="h-4 w-4" />
							<Translate text={localizationConstants.edit} />
						</Button>
					</div>
					<div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4">
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractJobDescLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.jobDescription}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractJobLevelLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.jobLevel}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractHoursPerWeekLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.hoursPerWeek}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractSupervisorLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.supervisor}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white border border-[#E5E5E5] rounded-lg">
					<div className="flex items-center justify-between p-4 border-b border-[#E4E4E7]">
						<div className="flex items-center gap-2">
							<Image
								src="/assets/icons/personal-info.svg"
								alt=""
								width={24}
								height={24}
								className="shrink-0"
							/>
							<h3 className="text-base font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractCompensationTitle
									}
								/>
							</h3>
						</div>
						<Button
							type="button"
							size="sm"
							className="h-9 gap-2 text-sm font-medium bg-[#F4F4F5] text-[#09090B] hover:bg-zinc-200 border-0 shadow-sm"
						>
							<Pencil className="h-4 w-4" />
							<Translate text={localizationConstants.edit} />
						</Button>
					</div>
					<div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4">
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractOfferPriceLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.offerPrice}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractPaymentTermsLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.paymentTerms}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractPaidUntilLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.paidUntil}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-[#09090B]">
								<Translate
									text={
										localizationConstants.contractExpensesAllowedLabel
									}
								/>
							</p>
							<p className="text-sm text-[#71717A]">
								{contract.expensesAllowed}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface ContractTabProps {
	project?: ActiveProject;
	onFullscreenChange?: (v: boolean) => void;
}

export function ContractTab({ project, onFullscreenChange }: ContractTabProps) {
	const [view, setView] = useState<ContractView>({ kind: "sub", tab: "list" });
	const [contracts, setContracts] = useState<Contract[]>([]);
	const [stagedData, setStagedData] = useState<{
		form?: ContractFormData;
		documents?: StagedDocument[];
	}>({});

	const [error, setError] = useState<string | null>(null);

	const fetchContracts = useCallback(async (activeGuard?: { active: boolean; projectId?: string }) => {
		if (!project?.id) return;
		setError(null);
		const currentProjectId = project.id;
		const res = await getProjectContractsAPIAction(currentProjectId);
		if (activeGuard && (!activeGuard.active || activeGuard.projectId !== currentProjectId)) return;
		if (res.success && Array.isArray(res.data)) {
			const mapped: Contract[] = res.data.map((item: {
				id: string;
				title?: string;
				engagement?: {
					contract_no?: string;
					consultant_name?: string;
					job_description?: string;
					contract_status?: string;
					contract_period_days?: number;
					client_company_name?: string;
					start_date?: string;
					end_date?: string;
					signed_date?: string;
					job_level?: string;
					expected_weekly_hours?: number;
					offered_price?: number;
					payment_terms?: string;
					expense_submission_allowed?: boolean;
					clauses?: Array<{ id: string; clause_date?: string; document_name: string }>;
				};
			}) => ({
				id: item.id,
				nr: item.engagement?.contract_no || `CN-${item.id.substring(0, 6).toUpperCase()}`,
				contactPerson: item.engagement?.consultant_name || project?.contactPersonName || "Customer",
				project: project?.name || item.title || "Project",
				phone: project?.mobileNumber || "-",
				email: project?.email || "-",
				role: item.engagement?.job_description || "Contractor",
				status: item.engagement?.contract_status === "signed" ? "signed" : "not-signed",
				period: `${item.engagement?.contract_period_days || 365} Days`,
				company: item.engagement?.client_company_name || project?.companyName || "Assigned Supplier",
				startDate: item.engagement?.start_date ? new Date(item.engagement.start_date).toISOString().split("T")[0] : "-",
				endDate: item.engagement?.end_date ? new Date(item.engagement.end_date).toISOString().split("T")[0] : "-",
				signedDate: item.engagement?.signed_date ? new Date(item.engagement.signed_date).toISOString().split("T")[0] : "-",
				nextReview: "-",
				clauses: (item.engagement?.clauses || []).map((c) => ({
					id: c.id,
					date: c.clause_date ? new Date(c.clause_date).toISOString().split("T")[0] : "-",
					name: c.document_name,
					fileType: "PDF",
				})),
				jobDescription: item.engagement?.job_description || "Consultant",
				jobLevel: item.engagement?.job_level || "Standard",
				hoursPerWeek: item.engagement?.expected_weekly_hours ? String(item.engagement.expected_weekly_hours) : "40",
				supervisor: "Supervisor",
				offerPrice: item.engagement?.offered_price ? `${item.engagement.offered_price} SEK` : "-",
				paymentTerms: item.engagement?.payment_terms || "30 Days Net",
				paidUntil: "-",
				expensesAllowed: item.engagement?.expense_submission_allowed ? "Yes" : "No",
			}));
			setContracts(mapped);
		} else if (!res.success) {
			setError(res.error || "Failed to load project contracts");
		}
	}, [project?.id, project?.contactPersonName, project?.name, project?.mobileNumber, project?.email, project?.companyName]);

	useEffect(() => {
		setContracts([]);
		setError(null);
		setView({ kind: "sub", tab: "list" });
		setStagedData({});
		if (!project?.id) return;
		const guard = { active: true, projectId: project.id };
		void fetchContracts(guard);
		return () => {
			guard.active = false;
		};
	}, [project?.id, fetchContracts]);

	useEffect(() => {
		const isFullscreen =
			view.kind === "create-form" || view.kind === "create-editor";
		onFullscreenChange?.(isFullscreen);
	}, [view.kind, onFullscreenChange]);

	const handleDeleteContract = async (contract: Contract) => {
		if (project?.id) {
			await deleteProjectContractAPIAction(project.id, contract.id);
		}
		setContracts((prev) => prev.filter((c) => c.id !== contract.id));
	};

	const handleSaveContract = async () => {
		if (stagedData.form && project?.id) {
			const f = stagedData.form;
			const docs = stagedData.documents || [];

			const uploadedClauses: Array<{ document_name: string; media_id: string }> = [];
			const newlyUploadedMediaIds: string[] = [];

			for (const d of docs) {
				let mediaId = d.id;
				if (d.file) {
					const uploadRes = await uploadMediaAPIAction(d.file);
					if (uploadRes.success && uploadRes.data?.id) {
						mediaId = uploadRes.data.id;
						newlyUploadedMediaIds.push(mediaId);
					} else {
						for (const idToClean of newlyUploadedMediaIds) {
							try { await deleteMediaAPIAction(idToClean); } catch {}
						}
						showToast("error", uploadRes.error || `Failed to upload ${d.name}`);
						return;
					}
				}
				if (mediaId && !mediaId.startsWith("new-") && !mediaId.startsWith("c-")) {
					uploadedClauses.push({
						document_name: d.name,
						media_id: mediaId,
					});
				}
			}

			const payload = {
				title: f.projectName || project.name,
				client_company_name: f.supplier || project.companyName,
				consultant_name: `${f.firstName} ${f.lastName}`.trim() || project.contactPersonName,
				contract_period_days: 365,
				job_description: f.category || "Consultant",
				contract_status: "not_signed",
				clauses: uploadedClauses,
			};

			const res = await saveProjectContractAPIAction(project.id, payload);

			if (res.success && res.data) {
				const serverData = res.data;
				const newContract: Contract = {
					id: serverData.id || `cnt-${Date.now()}`,
					nr: serverData.contract_number || `KA-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, "0")}`,
					contactPerson: `${f.firstName} ${f.lastName}`.trim() || project?.contactPersonName || "Customer",
					project: f.projectName || project?.name || "Project",
					phone: f.mobile || project?.mobileNumber || "-",
					email: f.privateEmail || project?.email || "-",
					role: f.category || project?.category || "Contractor",
					status: "not-signed",
					period: "12 Months",
					company: f.supplier || project?.companyName || "Assigned Supplier",
					startDate: new Date().toISOString().split("T")[0],
					endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
					signedDate: "-",
					nextReview: "-",
					clauses: docs.map((d, idx) => ({
						id: d.id || `c-${idx}`,
						date: d.validity || new Date().toISOString().split("T")[0],
						name: d.name,
						fileType: d.fileType || "PDF",
					})),
					jobDescription: f.category || "Consultant",
					jobLevel: "Standard",
					hoursPerWeek: "40",
					supervisor: f.contactPerson || "Supervisor",
					offerPrice: "-",
					paymentTerms: "30 Days Net",
					paidUntil: "-",
					expensesAllowed: "No",
				};

				setContracts((prev) => [newContract, ...prev]);
				setView({ kind: "contract-detail", contract: newContract });
				setStagedData({});
			} else {
				for (const idToClean of newlyUploadedMediaIds) {
					try { await deleteMediaAPIAction(idToClean); } catch {}
				}
				showToast("error", res.error || "Failed to save contract");
			}
		} else {
			setView({ kind: "sub", tab: "list" });
		}
	};

	const subTabTriggerClass =
		"h-8 rounded-[6px] border-0 bg-transparent px-3 py-1.5 text-sm font-medium text-[#64748B] shadow-none " +
		"transition-all hover:text-slate-700 cursor-pointer select-none";
	const subTabActiveClass =
		"bg-white text-slate-900 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

	const SUB_TABS: { value: ContractSubTab; labelKey: string }[] = [
		{ value: "list", labelKey: localizationConstants.contractSubTabList },
		{
			value: "contract",
			labelKey: localizationConstants.contractSubTabContract,
		},
		{
			value: "templates",
			labelKey: localizationConstants.contractSubTabTemplates,
		},
	];

	const activeSubTab: ContractSubTab =
		view.kind === "sub"
			? view.tab
			: view.kind === "contract-detail"
				? "contract"
				: "list";

	const handleSubTabClick = (tab: ContractSubTab) => {
		setView({ kind: "sub", tab });
	};

	const showSubTabs = view.kind === "sub" || view.kind === "contract-detail";

	return (
		<div>
			{showSubTabs && (
				<div className="inline-flex h-10 items-center rounded-xl bg-[#F1F5F9] p-1 mb-6 w-fit gap-0">
					{SUB_TABS.map((tab) => (
						<button
							key={tab.value}
							type="button"
							onClick={() => handleSubTabClick(tab.value)}
							className={`${subTabTriggerClass} ${activeSubTab === tab.value ? subTabActiveClass : ""}`}
						>
							<Translate text={tab.labelKey} />
						</button>
					))}
				</div>
			)}

			{/* ── Views ── */}

			{view.kind === "sub" && view.tab === "list" && (
				error ? (
					<div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
						<p className="text-red-600 text-sm font-medium">{error}</p>
						<button
							type="button"
							onClick={() => void fetchContracts()}
							className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-md hover:bg-slate-700"
						>
							Retry
						</button>
					</div>
				) : (
					<ContractList
						contracts={contracts}
						onSelect={(contract) =>
							setView({ kind: "contract-detail", contract })
						}
						onCreateNew={() => setView({ kind: "create-form" })}
						onDelete={handleDeleteContract}
					/>
				)
			)}

			{view.kind === "sub" && view.tab === "contract" && (
				error ? (
					<div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
						<p className="text-red-600 text-sm font-medium">{error}</p>
					</div>
				) : contracts[0] ? (
					<ContractDetail contract={contracts[0]} />
				) : (
					<ContractEmptyState onCreate={() => setView({ kind: "create-form" })} />
				)
			)}

			{view.kind === "sub" && view.tab === "templates" && (
				<ContractTemplatesView
					onNewTemplate={() => setView({ kind: "create-editor" })}
				/>
			)}

			{view.kind === "contract-detail" && (
				<ContractDetail contract={view.contract} />
			)}

			{view.kind === "create-form" && (
				<ContractCreateForm
					project={project}
					initialForm={stagedData.form}
					initialDocuments={stagedData.documents}
					onBack={() => setView({ kind: "sub", tab: "list" })}
					onNext={(formData, docs) => {
						setStagedData({ form: formData, documents: docs });
						setView({ kind: "create-editor" });
					}}
				/>
			)}

			{view.kind === "create-editor" && (
				<ContractDocumentEditor
					onBack={() => setView({ kind: "create-form" })}
					onSave={handleSaveContract}
				/>
			)}
		</div>
	);
}
