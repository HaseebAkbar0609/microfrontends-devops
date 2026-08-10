"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ShieldUser, UserCog, Users, Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type UserAccess = "sys-admin" | "admin" | "user";
type UserStatus = "active" | "closed";
type SortField = "name" | "personNo" | "group" | "role" | "status";

interface UserRow {
	id: string;
	name: string;
	email?: string;
	personNo: string;
	access: UserAccess;
	group: string;
	role: string;
	status: UserStatus;
}

const MOCK_USERS: UserRow[] = [
	{ id: "1", name: "Kalle Andersson", email: "kalle@timeflow.se", personNo: "710405-1010", access: "sys-admin", group: "Ekonomi", role: "Manager", status: "active" },
	{ id: "2", name: "Sten Svensson", email: "sten@timeflow.se", personNo: "710405-1011", access: "admin", group: "Service", role: "Projektledare", status: "active" },
	{ id: "3", name: "Sture Larsson", email: "sture@timeflow.se", personNo: "710405-1012", access: "user", group: "Overhead", role: "Ekonomi", status: "active" },
	{ id: "4", name: "Stina Jonasson", email: "stina@timeflow.se", personNo: "710405-1013", access: "sys-admin", group: "Entreprenad", role: "Service", status: "closed" },
	{ id: "5", name: "Petra Karlsson", email: "petra@timeflow.se", personNo: "710405-1014", access: "admin", group: "Kalkyl", role: "Projektledare", status: "active" },
	{ id: "6", name: "Uran Lindqvist", email: "uran@timeflow.se", personNo: "710405-1015", access: "user", group: "Inköp", role: "Manager", status: "closed" },
];

const ACCESS_CONFIG: Record<UserAccess, { labelKey: keyof typeof localizationConstants; Icon: typeof ShieldUser }> = {
	"sys-admin": { labelKey: "roleSysAdmin", Icon: ShieldUser },
	"admin": { labelKey: "roleAdmin", Icon: UserCog },
	"user": { labelKey: "roleUser", Icon: Users },
};

function AccessBadge({ access }: { access: UserAccess }) {
	const { labelKey, Icon } = ACCESS_CONFIG[access];
	return (
		<span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-[#0F172A]">
			<Icon className="h-3.5 w-3.5 shrink-0" />
			<Translate text={localizationConstants[labelKey]} />
		</span>
	);
}

function StatusBadge({ status }: { status: UserStatus }) {
	if (status === "active") {
		return (
			<span className="inline-flex items-center rounded-md bg-green-500 px-2 py-1.5 text-xs font-medium text-white">
				<Translate text={localizationConstants.statusActive} />
			</span>
		);
	}
	return (
		<span className="inline-flex items-center rounded-md bg-red-500 px-2 py-1.5 text-xs font-medium text-white">
			<Translate text={localizationConstants.statusClosed} />
		</span>
	);
}

export function AdminUsersPage() {
	const { t } = useTranslation();
	const [users, setUsers] = useState<UserRow[]>(MOCK_USERS);
	const [searchQuery, setSearchQuery] = useState("");
	const [accessFilter, setAccessFilter] = useState<string>("all");
	const [groupFilter, setGroupFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<SortField>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (field: SortField) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const handleDeleteUser = (userId: string) => {
		if (confirm(t(localizationConstants.confirmDeleteUser))) {
			setUsers((prev) => prev.filter((u) => u.id !== userId));
		}
	};

	const renderSortIcon = (field: SortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
		}
		if (sortOrder === "asc") {
			return <ArrowUp className="h-3.5 w-3.5 text-slate-700 font-semibold" />;
		}
		return <ArrowDown className="h-3.5 w-3.5 text-slate-700 font-semibold" />;
	};

	const filteredAndSortedUsers = useMemo(() => {
		return users
			.filter((user) => {
				const query = searchQuery.trim().toLowerCase();
				if (query) {
					const matchesName = user.name.toLowerCase().includes(query);
					const matchesEmail = user.email?.toLowerCase().includes(query) ?? false;
					const matchesPersonNo = user.personNo.toLowerCase().includes(query);
					const matchesGroup = user.group.toLowerCase().includes(query);
					const matchesRole = user.role.toLowerCase().includes(query);
					if (!matchesName && !matchesEmail && !matchesPersonNo && !matchesGroup && !matchesRole) {
						return false;
					}
				}

				if (accessFilter !== "all" && user.access !== accessFilter) {
					return false;
				}

				if (groupFilter !== "all" && user.group.toLowerCase() !== groupFilter.toLowerCase()) {
					return false;
				}

				if (statusFilter !== "all" && user.status !== statusFilter) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				let valA = a[sortBy] || "";
				let valB = b[sortBy] || "";

				if (typeof valA === "string") valA = valA.toLowerCase();
				if (typeof valB === "string") valB = valB.toLowerCase();

				let comparison = 0;
				if (valA < valB) comparison = -1;
				if (valA > valB) comparison = 1;

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [users, searchQuery, accessFilter, groupFilter, statusFilter, sortBy, sortOrder]);

	return (
		<div className="flex h-full flex-col">
			<PageHeader
				title={t(localizationConstants.adminUsers)}
				breadcrumbs={[
					{ label: t(localizationConstants.breadcrumbHome), href: "/home" },
					{ label: t(localizationConstants.adminUsers) },
				]}
			/>

			<div className="flex flex-col gap-6 px-8 pt-6 pb-8">
				<div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
					{/* Card header */}
					<div className="flex flex-col sm:flex-row min-h-14 sm:items-center justify-between gap-4 border-b border-[#E4E4E7] bg-slate-200 px-4 py-3">
						<h2 className="text-base font-medium text-[#09090B]">
							<Translate text={localizationConstants.adminUsersListTitle} />
						</h2>
						<Link href="/admin/users/add-user">
							<Button className="h-9 gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#18181B]/90 w-full sm:w-auto">
								<Plus className="h-4 w-4" />
								<Translate text={localizationConstants.addUser} />
							</Button>
						</Link>
					</div>

					{/* Toolbar: Search & Filters */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
						{/* Search Input */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
							<Input
								type="text"
								placeholder={t(localizationConstants.searchUsersPlaceholder)}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-9 pl-9 pr-3 text-sm bg-white border-slate-200"
							/>
						</div>

						{/* Filters */}
						<div className="flex flex-wrap items-center gap-2">
							{/* Filter by Access */}
							<div className="flex items-center gap-1.5">
								<Filter className="h-3.5 w-3.5 text-slate-500 hidden sm:inline" />
								<Select value={accessFilter} onValueChange={setAccessFilter}>
									<SelectTrigger className="h-9 w-32.5 bg-white border-slate-200 text-xs">
										<SelectValue placeholder={t(localizationConstants.filterByAccess)} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">{t(localizationConstants.filterAllRoles)}</SelectItem>
										<SelectItem value="sys-admin">{t(localizationConstants.roleSysAdmin)}</SelectItem>
										<SelectItem value="admin">{t(localizationConstants.roleAdmin)}</SelectItem>
										<SelectItem value="user">{t(localizationConstants.roleUser)}</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Filter by Group/Department */}
							<Select value={groupFilter} onValueChange={setGroupFilter}>
								<SelectTrigger className="h-9 w-32.5 bg-white border-slate-200 text-xs">
									<SelectValue placeholder={t(localizationConstants.filterByDepartment)} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">{t(localizationConstants.filterAllDepartments)}</SelectItem>
									<SelectItem value="ekonomi">{t(localizationConstants.deptEkonomi)}</SelectItem>
									<SelectItem value="service">{t(localizationConstants.deptService)}</SelectItem>
									<SelectItem value="overhead">{t(localizationConstants.deptOverhead)}</SelectItem>
									<SelectItem value="entreprenad">{t(localizationConstants.deptEntreprenad)}</SelectItem>
									<SelectItem value="kalkyl">{t(localizationConstants.deptKalkyl)}</SelectItem>
									<SelectItem value="inköp">{t(localizationConstants.deptInkop)}</SelectItem>
								</SelectContent>
							</Select>

							{/* Filter by Status */}
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="h-9 w-27.5 bg-white border-slate-200 text-xs">
									<SelectValue placeholder={t(localizationConstants.filterByStatus)} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">{t(localizationConstants.filterAllStatuses)}</SelectItem>
									<SelectItem value="active">{t(localizationConstants.statusActive)}</SelectItem>
									<SelectItem value="closed">{t(localizationConstants.statusClosed)}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Table with Column Sorting and 3-dot Actions Menu */}
					<Table>
						<TableHeader>
							<TableRow className="border-slate-200 hover:bg-transparent">
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<button
										type="button"
										onClick={() => handleSort("name")}
										className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
									>
										<Translate text={localizationConstants.nameLabel} />
										{renderSortIcon("name")}
									</button>
								</TableHead>
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<button
										type="button"
										onClick={() => handleSort("personNo")}
										className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
									>
										<Translate text={localizationConstants.personalNumberLabel} />
										{renderSortIcon("personNo")}
									</button>
								</TableHead>
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<Translate text={localizationConstants.adminAccessCol} />
								</TableHead>
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<button
										type="button"
										onClick={() => handleSort("group")}
										className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
									>
										<Translate text={localizationConstants.adminGroupCol} />
										{renderSortIcon("group")}
									</button>
								</TableHead>
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<button
										type="button"
										onClick={() => handleSort("role")}
										className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
									>
										<Translate text={localizationConstants.roleLabel} />
										{renderSortIcon("role")}
									</button>
								</TableHead>
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<button
										type="button"
										onClick={() => handleSort("status")}
										className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
									>
										<Translate text={localizationConstants.statusLabel} />
										{renderSortIcon("status")}
									</button>
								</TableHead>
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500 text-right">
									<Translate text={localizationConstants.adminActionsCol} />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAndSortedUsers.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} className="h-32 text-center text-sm text-slate-500">
										<Translate text={localizationConstants.adminNoUsersFound} />
									</TableCell>
								</TableRow>
							)}
							{filteredAndSortedUsers.map((user) => (
								<TableRow key={user.id} className="border-slate-200 hover:bg-slate-50/70">
									<TableCell className="px-4 py-3.5 text-sm text-[#020617]">
										<div>
											<div className="font-medium text-slate-900">{user.name}</div>
											{user.email && <div className="text-xs text-slate-400">{user.email}</div>}
										</div>
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
									<TableCell className="px-4 py-3.5">
										<StatusBadge status={user.status} />
									</TableCell>
									<TableCell className="px-4 py-3.5 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
												>
													<span className="sr-only">Open menu</span>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36 bg-white">
												<DropdownMenuItem asChild>
													<Link href={`/admin/users/user-settings?id=${user.id}`} className="flex items-center gap-2 cursor-pointer w-full">
														<Eye className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.actionView} /></span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={`/admin/users/add-user?id=${user.id}`} className="flex items-center gap-2 cursor-pointer w-full">
														<Pencil className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.actionEdit} /></span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													variant="destructive"
													onClick={() => handleDeleteUser(user.id)}
													className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
												>
													<Trash2 className="h-4 w-4 text-red-500" />
													<span><Translate text={localizationConstants.actionDelete} /></span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
