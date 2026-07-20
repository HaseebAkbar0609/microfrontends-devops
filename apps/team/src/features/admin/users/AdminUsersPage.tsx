"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldUser, UserCog, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import AddUserForm from "./components/AddUserForm";
import { useTranslation } from "react-i18next";

type UserAccess = "sys-admin" | "admin" | "user";
type UserStatus = "active" | "closed";

interface UserRow {
	id: string;
	name: string;
	personNo: string;
	access: UserAccess;
	group: string;
	role: string;
	status: UserStatus;
}

const MOCK_USERS: UserRow[] = [
	{ id: "1", name: "Kalle Andersson", personNo: "710405-1010", access: "sys-admin", group: "Ekonomi", role: "Manager", status: "active" },
	{ id: "2", name: "Sten Svensson", personNo: "710405-1011", access: "admin", group: "Service", role: "Projektledare", status: "active" },
	{ id: "3", name: "Sture Larsson", personNo: "710405-1012", access: "user", group: "Overhead", role: "Ekonomi", status: "active" },
	{ id: "4", name: "Stina Jonasson", personNo: "710405-1013", access: "sys-admin", group: "Entreprenad", role: "Service", status: "closed" },
	{ id: "5", name: "Petra Karlsson", personNo: "710405-1014", access: "admin", group: "Kalkyl", role: "Projektledare", status: "active" },
	{ id: "6", name: "Uran Lindqvist", personNo: "710405-1015", access: "user", group: "Inköp", role: "Manager", status: "closed" },
];

const ACCESS_CONFIG: Record<UserAccess, { label: string; Icon: typeof ShieldUser }> = {
	"sys-admin": { label: "Sys-admin", Icon: ShieldUser },
	"admin": { label: "Admin", Icon: UserCog },
	"user": { label: "User", Icon: Users },
};

function AccessBadge({ access }: { access: UserAccess }) {
	const { label, Icon } = ACCESS_CONFIG[access];
	return (
		<span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-[#0F172A]">
			<Icon className="h-3.5 w-3.5 shrink-0" />
			{label}
		</span>
	);
}

function StatusBadge({ status }: { status: UserStatus }) {
	if (status === "active") {
		return (
			<span className="inline-flex items-center rounded-md bg-green-500 px-2 py-1.5 text-xs font-medium text-white">
				<Translate text={localizationConstants.activeLabel} />
			</span>
		);
	}
	return (
		<span className="inline-flex items-center rounded-md bg-red-500 px-2 py-1.5 text-xs font-medium text-white">
			<Translate text={localizationConstants.adminStatusClosed} />
		</span>
	);
}

function UsersTable({ onEdit }: { onEdit: (id: string) => void }) {
	const [users] = useState<UserRow[]>(MOCK_USERS);

	return (
		<Table>
			<TableHeader>
				<TableRow className="border-slate-200 hover:bg-transparent">
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.nameLabel} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.personalNumberLabel} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.adminAccessCol} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.adminGroupCol} />
					</TableHead>
					<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.roleLabel} />
					</TableHead>
					<TableHead className="w-[200px] px-4 py-3 text-sm font-medium text-slate-500">
						<Translate text={localizationConstants.statusLabel} />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.length === 0 && (
					<TableRow>
						<TableCell colSpan={6} className="h-32 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.adminNoUsersFound} />
						</TableCell>
					</TableRow>
				)}
				{users.map((user) => (
					<TableRow key={user.id} className="border-slate-200 hover:bg-slate-50/70">
						<TableCell className="px-4 py-3.5 text-sm text-[#020617]">
							{user.name}
						</TableCell>
						<TableCell className="px-4 py-3.5 text-sm text-[#020617]">
							{user.personNo}
						</TableCell>
						<TableCell className="px-4 py-3.5">
							<AccessBadge access={user.access} />
						</TableCell>
						<TableCell className="px-4 py-3.5 text-sm text-[#020617]">
							{user.group}
						</TableCell>
						<TableCell className="px-4 py-3.5 text-sm text-[#020617]">
							{user.role}
						</TableCell>
						<TableCell className="w-[200px] px-4 py-3.5">
							<div className="flex items-center gap-3">
								<StatusBadge status={user.status} />
								<Button
									variant="outline"
									size="sm"
									className="h-8 rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-[#0F172A] hover:bg-slate-50"
									onClick={() => onEdit(user.id)}
								>
									<Translate text={localizationConstants.editLabel} />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export function AdminUsersPage() {
	const router = useRouter();
	const [showAddForm, setShowAddForm] = useState(false);
	const { t } = useTranslation();

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<PageHeader
				title={t(localizationConstants.adminUsers)}
				breadcrumbs={[
					{ label: t(localizationConstants.breadcrumbHome), href: "/dashboard" },
					{ label: t(localizationConstants.adminUsers) },
				]}
			/>

			{showAddForm ? (
				<AddUserForm
					onCancel={() => setShowAddForm(false)}
					onSuccess={() => setShowAddForm(false)}
				/>
			) : (
				<div className="flex-1 overflow-y-auto">
					<div className="flex flex-col gap-6 px-8 pt-6 pb-8">
						<div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
							{/* Card header */}
							<div className="flex min-h-[56px] items-center justify-between gap-4 border-b border-[#E4E4E7] bg-slate-200 px-4 py-2">
								<h2 className="text-base font-medium text-[#09090B]">
									<Translate text={localizationConstants.adminUsersListTitle} />
								</h2>
								<Button
									className="h-9 gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#18181B]/90"
									onClick={() => setShowAddForm(true)}
								>
									<Plus className="h-4 w-4" />
									<Translate text={localizationConstants.addUser} />
								</Button>
							</div>

							{/* Table */}
							<UsersTable onEdit={(id) => router.push(`/admin/users/user-settings?id=${encodeURIComponent(id)}`)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
