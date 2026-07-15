"use client";

import { useState } from "react";
import {
	ChevronLeft,
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
import { ModalWrapper } from "@/components/modal";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrgContact {
	id: string;
	name: string;
	phone: string;
	mail: string;
	role: string;
}

interface OrgCompany {
	id: string;
	company: string;
	category: string;
	role: string;
	phone: string;
	mail: string;
	contacts: OrgContact[];
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_ORG_COMPANIES: OrgCompany[] = [
	{
		id: "1",
		company: "Pelle bygg",
		category: "Målare",
		role: "-",
		phone: "070-450 50 10",
		mail: "pelle@pellebygg.se",
		contacts: [
			{
				id: "c1",
				name: "Kalle Andersson",
				phone: "070-450 50 10",
				mail: "pelle@pellebygg.se",
				role: "Badrum Designer",
			},
			{
				id: "c2",
				name: "Stina Larsson",
				phone: "070-450 50 10",
				mail: "pelle@pellebygg.se",
				role: "Electrician",
			},
			{
				id: "c3",
				name: "Sven Eriksson",
				phone: "070-450 50 10",
				mail: "pelle@pellebygg.se",
				role: "Wall Painter",
			},
			{
				id: "c4",
				name: "Lars Gustavsson",
				phone: "070-450 50 10",
				mail: "pelle@pellebygg.se",
				role: "Supervisor",
			},
		],
	},
	{
		id: "2",
		company: "Pelle bygg",
		category: "EL Tekniker",
		role: "-",
		phone: "070-450 50 10",
		mail: "pelle@pellebygg.se",
		contacts: [
			{
				id: "c5",
				name: "Johan Holm",
				phone: "070-450 50 10",
				mail: "pelle@pellebygg.se",
				role: "Lead Electrician",
			},
			{
				id: "c6",
				name: "Anna Berg",
				phone: "070-450 50 10",
				mail: "anna@pellebygg.se",
				role: "Assistant",
			},
		],
	},
];

// ─── Detail view ─────────────────────────────────────────────────────────────

function CompanyDetail({
	company,
	onBack,
}: {
	company: OrgCompany;
	onBack: () => void;
}) {
	return (
		<div className="pb-10">
			<div className="flex items-center gap-1 mb-4">
				<button
					type="button"
					onClick={onBack}
					className="cursor-pointer text-[#64748B] hover:text-[#09090B] transition-colors"
					aria-label="Back"
				>
					<ChevronLeft className="h-5 w-5" />
				</button>
				<span className="text-base font-semibold text-[#0A0A0A]">
					{company.company}
				</span>
			</div>

			<div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
				<div className="grid grid-cols-[1fr_180px_1fr_160px] border-b border-[#E2E8F0]">
					{[
						localizationConstants.projectContactPersonLabel,
						localizationConstants.projectOrgPhoneLabel,
						localizationConstants.projectOrgMailLabel,
						localizationConstants.projectOrgRoleLabel,
					].map((key) => (
						<button
							key={key}
							type="button"
							className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
						>
							<Translate text={key} />
							<ArrowUpDown className="h-3.5 w-3.5" />
						</button>
					))}
				</div>

				{company.contacts.map((contact) => (
					<div
						key={contact.id}
						className="grid grid-cols-[1fr_180px_1fr_160px] items-center border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors"
					>
						<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
							{contact.name}
						</span>
						<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
							{contact.phone}
						</span>
						<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
							{contact.mail}
						</span>
						<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
							{contact.role}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── List view ────────────────────────────────────────────────────────────────

const EMPTY_NEW_COMPANY = {
	company: "",
	category: "",
	role: "",
	phone: "",
	mail: "",
};

export function OrgPlanTab() {
	const t = useTranslate();
	const [selected, setSelected] = useState<OrgCompany | null>(null);
	const [companies, setCompanies] =
		useState<OrgCompany[]>(DUMMY_ORG_COMPANIES);
	const [createOpen, setCreateOpen] = useState(false);
	const [newCompany, setNewCompany] = useState(EMPTY_NEW_COMPANY);
	const [deleteTarget, setDeleteTarget] = useState<OrgCompany | null>(null);

	const setField = (field: keyof typeof EMPTY_NEW_COMPANY, value: string) =>
		setNewCompany((prev) => ({ ...prev, [field]: value }));

	const handleCreate = () => {
		const company = newCompany.company.trim();
		if (!company) return;
		setCompanies((prev) => [
			...prev,
			{
				id: String(Date.now()),
				company,
				category: newCompany.category.trim() || "-",
				role: newCompany.role.trim() || "-",
				phone: newCompany.phone.trim() || "-",
				mail: newCompany.mail.trim() || "-",
				contacts: [],
			},
		]);
		setCreateOpen(false);
		setNewCompany(EMPTY_NEW_COMPANY);
		showToast("success", t(localizationConstants.projectOrgCreatedSuccess));
	};

	const handleDeleteConfirmed = () => {
		if (!deleteTarget) return;
		setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
		setDeleteTarget(null);
		showToast("success", t(localizationConstants.projectOrgDeletedSuccess));
	};

	if (selected) {
		return (
			<CompanyDetail
				company={selected}
				onBack={() => setSelected(null)}
			/>
		);
	}

	return (
		<div className="pb-10">
			<div className="flex items-center mb-4">
				<Button
					type="button"
					onClick={() => setCreateOpen(true)}
					className="ml-auto h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
				>
					<Plus className="h-4 w-4" />
					<Translate
						text={localizationConstants.projectCreateNewLabel}
					/>
				</Button>
			</div>

			{/* Table */}
			<div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
				{/* Header */}
				<div className="grid grid-cols-[1fr_140px_140px_160px_1fr_46px] border-b border-[#E2E8F0]">
					{[
						localizationConstants.projectOrgCompanyLabel,
						localizationConstants.projectOrgCategoryLabel,
						localizationConstants.projectOrgRoleLabel,
						localizationConstants.projectOrgPhoneLabel,
						localizationConstants.projectOrgMailLabel,
					].map((key) => (
						<button
							key={key}
							type="button"
							className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
						>
							<Translate text={key} />
							<ArrowUpDown className="h-3.5 w-3.5" />
						</button>
					))}
					<div className="border-l border-[#E2E8F0] h-12" />
				</div>

				{/* Rows */}
				{companies.length === 0 ? (
					<div className="py-12 text-center text-sm text-slate-400">
						No members found
					</div>
				) : (
					companies.map((member) => (
						<div
							key={member.id}
							className="grid grid-cols-[1fr_140px_140px_160px_1fr_46px] items-center border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
							onClick={() => setSelected(member)}
						>
							<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
								{member.company}
							</span>
							<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
								{member.category}
							</span>
							<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
								{member.role}
							</span>
							<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
								{member.phone}
							</span>
							<span className="h-14 flex items-center px-4 text-sm text-[#020617]">
								{member.mail}
							</span>
							<div
								className="h-14 flex items-center justify-center border-l border-[#E2E8F0]"
								onClick={(e) => e.stopPropagation()}
							>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-[6px] text-[#18181B] hover:bg-slate-100 transition-colors"
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
											onClick={() => setSelected(member)}
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
												setDeleteTarget(member)
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
							</div>
						</div>
					))
				)}
			</div>

			<ModalWrapper
				open={createOpen}
				onOpenChange={(open) => {
					setCreateOpen(open);
					if (!open) setNewCompany(EMPTY_NEW_COMPANY);
				}}
				title={
					<Translate
						text={localizationConstants.projectCreateNewLabel}
					/>
				}
				footer={
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							className="min-w-24"
							onClick={() => setCreateOpen(false)}
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							className="min-w-24 bg-slate-900 hover:bg-slate-800 text-white"
							disabled={!newCompany.company.trim()}
							onClick={handleCreate}
						>
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				}
			>
				<div className="space-y-4">
					{(
						[
							{
								field: "company",
								label: localizationConstants.projectOrgCompanyLabel,
								placeholder: "Pelle bygg",
							},
							{
								field: "category",
								label: localizationConstants.projectOrgCategoryLabel,
								placeholder: "Målare",
							},
							{
								field: "role",
								label: localizationConstants.projectOrgRoleLabel,
								placeholder: "Subcontractor",
							},
							{
								field: "phone",
								label: localizationConstants.projectOrgPhoneLabel,
								placeholder: "070-450 50 10",
							},
							{
								field: "mail",
								label: localizationConstants.projectOrgMailLabel,
								placeholder: "pelle@pellebygg.se",
							},
						] as const
					).map(({ field, label, placeholder }) => (
						<div key={field} className="space-y-1.5">
							<label className="text-sm font-medium text-slate-700">
								<Translate text={label} />
							</label>
							<Input
								value={newCompany[field]}
								onChange={(e) =>
									setField(field, e.target.value)
								}
								placeholder={placeholder}
								className="h-9 text-sm"
							/>
						</div>
					))}
				</div>
			</ModalWrapper>

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
									localizationConstants.deleteOrgConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate
								text={
									localizationConstants.deleteOrgConfirmDescription
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
