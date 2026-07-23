"use client";

import { useMemo, useState } from "react";
import {
	Check,
	ChevronDown,
	Plus,
	UserCheck,
	UserCog,
	User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Search } from "@/components/search/Search";
import { TablePagination } from "@/components/table/TablePagination";
import { ComingSoonTab } from "@/features/admin/company-details/components/ComingSoonTab";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	ACCESS_LABELS,
	DUMMY_ADMIN_USERS,
	LICENSE_ROWS,
	type AdminUser,
	type AdminUserAccess,
} from "../constants";

const ACCESS_ICONS: Record<
	AdminUserAccess,
	React.ComponentType<{ size?: number; className?: string }>
> = {
	"sys-admin": UserCog,
	admin: UserCheck,
	user: UserIcon,
};

const ACCESS_FILTER_OPTIONS: AdminUserAccess[] = ["sys-admin", "admin", "user"];

const USER_COLUMNS = [
	localizationConstants.adminUsersColName,
	localizationConstants.adminUsersColPersonNo,
	localizationConstants.adminUsersColAccess,
	localizationConstants.adminUsersLicenseCol,
	localizationConstants.adminUsersColAddons,
	localizationConstants.adminUsersColGroup,
	localizationConstants.adminUsersColRole,
	localizationConstants.adminUsersColType,
	localizationConstants.adminUsersColAction,
];

export default function AdminUsers() {
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState("users");
	const [search, setSearch] = useState("");
	const [accessFilter, setAccessFilter] = useState<AdminUserAccess | "">("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const notifyComingSoon = () =>
		showToast("info", t(localizationConstants.comingSoon));

	const filteredUsers = useMemo(() => {
		const q = search.trim().toLowerCase();
		return DUMMY_ADMIN_USERS.filter((user) => {
			const matchesSearch =
				!q ||
				user.name.toLowerCase().includes(q) ||
				user.personNo.toLowerCase().includes(q);
			const matchesAccess = !accessFilter || user.access === accessFilter;
			return matchesSearch && matchesAccess;
		});
	}, [search, accessFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
	const pageRows = filteredUsers.slice(
		(page - 1) * pageSize,
		page * pageSize,
	);

	const renderAccess = (user: AdminUser) => {
		const Icon = ACCESS_ICONS[user.access];
		return (
			<span className="flex items-center gap-2 text-slate-700">
				<Icon size={16} className="shrink-0 text-slate-500" />
				{ACCESS_LABELS[user.access]}
			</span>
		);
	};

	return (
		<div className="flex min-h-[calc(100vh-180px)] flex-col gap-6 px-6 py-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.adminUsersTitle} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.home,
							href: "/dashboard",
						},
						{
							translationKey:
								localizationConstants.adminUsersTitle,
						},
					]}
				/>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<div className="border-b border-slate-200">
					<TabsList
						variant="line"
						className="h-auto gap-6 rounded-none px-0 pb-1"
					>
						<TabsTrigger
							value="users"
							className="px-0 text-slate-600 data-[state=active]:px-5 data-[state=active]:text-slate-900"
						>
							<Translate
								text={localizationConstants.adminUsersTitle}
							/>
						</TabsTrigger>
						<TabsTrigger
							value="groups"
							className="px-0 text-slate-400 data-[state=active]:px-5 data-[state=active]:text-slate-900"
						>
							<Translate
								text={localizationConstants.adminUsersTabGroups}
							/>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="users" className="mt-6 flex flex-col gap-6">
					<div className="flex flex-col gap-4 xl:flex-row xl:items-start">
						<div className="w-full overflow-hidden rounded-md border border-slate-200 bg-white xl:w-[55%]">
							<div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 px-4 py-3">
								<span className="text-sm font-semibold text-slate-900">
									<Translate
										text={
											localizationConstants.adminUsersModulesTitle
										}
									/>
								</span>
								<div className="flex items-center gap-2">
									<Button
										onClick={notifyComingSoon}
										className="h-9 gap-1.5 rounded-md bg-[#18181B] px-3 text-sm font-medium text-white hover:bg-[#18181B]/90"
									>
										<Plus className="h-4 w-4" />
										<Translate
											text={
												localizationConstants.adminUsersBuyLicenses
											}
										/>
									</Button>
									<Button
										variant="outline"
										onClick={notifyComingSoon}
										className="h-9 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
									>
										<Translate
											text={
												localizationConstants.adminUsersCancelLicense
											}
										/>
									</Button>
								</div>
							</div>
							<Table className="w-full table-auto">
								<TableHeader>
									<TableRow className="border-slate-200 hover:bg-transparent">
										<TableHead className="px-4 py-3 text-left font-medium text-slate-500">
											<Translate
												text={
													localizationConstants.adminUsersLicenseCol
												}
											/>
										</TableHead>
										<TableHead className="px-4 py-3 text-right font-medium text-slate-500">
											<Translate
												text={
													localizationConstants.adminUsersPurchasedCol
												}
											/>
										</TableHead>
										<TableHead className="px-4 py-3 text-right font-medium text-slate-500">
											<Translate
												text={
													localizationConstants.adminUsersAllocatedCol
												}
											/>
										</TableHead>
										<TableHead className="px-4 py-3 text-right font-medium text-slate-500">
											<Translate
												text={
													localizationConstants.adminUsersAvailableCol
												}
											/>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{LICENSE_ROWS.map((row) => (
										<TableRow
											key={row.id}
											className="border-slate-100 hover:bg-slate-50"
										>
											<TableCell className="px-4 py-4 text-slate-900">
												{row.license}
											</TableCell>
											<TableCell className="px-4 py-4 text-right tabular-nums text-slate-700">
												{row.purchased}
											</TableCell>
											<TableCell className="px-4 py-4 text-right tabular-nums text-slate-700">
												{row.allocated}
											</TableCell>
											<TableCell className="px-4 py-4 text-right tabular-nums text-slate-700">
												{row.available ?? "-"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="flex flex-1 items-center justify-end gap-3">
							<Search
								value={search}
								onChange={(value) => {
									setSearch(value);
									setPage(1);
								}}
								placeholder={t(localizationConstants.search)}
								wrapperClassName="w-full max-w-[280px]"
								className="h-10"
							/>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"h-10 gap-2 border-slate-200 bg-white px-4 text-sm font-normal text-slate-700 hover:bg-slate-50",
											accessFilter &&
												"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
										)}
									>
										<Translate
											text={localizationConstants.filter}
										/>
										{accessFilter &&
											` · ${ACCESS_LABELS[accessFilter]}`}
										<ChevronDown className="h-4 w-4 text-slate-500" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-[170px]"
								>
									<DropdownMenuItem
										onClick={() => {
											setAccessFilter("");
											setPage(1);
										}}
										className="flex items-center justify-between"
									>
										<Translate
											text={
												localizationConstants.adminUsersFilterAll
											}
										/>
										{!accessFilter && (
											<Check className="h-3.5 w-3.5 text-blue-600" />
										)}
									</DropdownMenuItem>
									{ACCESS_FILTER_OPTIONS.map((access) => (
										<DropdownMenuItem
											key={access}
											onClick={() => {
												setAccessFilter(access);
												setPage(1);
											}}
											className="flex items-center justify-between"
										>
											{ACCESS_LABELS[access]}
											{accessFilter === access && (
												<Check className="h-3.5 w-3.5 text-blue-600" />
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="w-full overflow-hidden rounded-md border border-slate-200 bg-white">
						<div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 px-4 py-3">
							<span className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.adminUsersListTitle
									}
								/>
							</span>
							<Button
								onClick={notifyComingSoon}
								className="h-9 gap-1.5 rounded-md bg-[#18181B] px-3 text-sm font-medium text-white hover:bg-[#18181B]/90"
							>
								<Plus className="h-4 w-4" />
								<Translate
									text={
										localizationConstants.adminUsersAddUser
									}
								/>
							</Button>
						</div>
						<div className="overflow-x-auto">
							<Table className="w-full min-w-[64rem] table-auto">
								<TableHeader>
									<TableRow className="border-slate-200 hover:bg-transparent">
										{USER_COLUMNS.map((column) => (
											<TableHead
												key={column}
												className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-500"
											>
												<Translate text={column} />
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{pageRows.map((user) => (
										<TableRow
											key={user.id}
											className="border-slate-100 hover:bg-slate-50"
										>
											<TableCell className="max-w-[10rem] truncate px-4 py-4 font-medium text-slate-900">
												{user.name}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4 tabular-nums text-slate-700">
												{user.personNo}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4">
												{renderAccess(user)}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4">
												<Badge
													className={cn(
														"rounded-[6px] px-2.5 py-0.5 text-xs font-semibold",
														user.license === "PRO"
															? "bg-[#18181B] text-white"
															: "bg-slate-100 text-slate-700",
													)}
												>
													{user.license}
												</Badge>
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
												{user.addons}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
												{user.group}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
												{user.role}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
												{user.type}
											</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4">
												<div className="flex items-center gap-2">
													<Button
														variant="secondary"
														onClick={
															notifyComingSoon
														}
														className="h-8 rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200"
													>
														<Translate
															text={
																localizationConstants.adminUsersOpen
															}
														/>
													</Button>
													<Button
														variant="outline"
														onClick={
															notifyComingSoon
														}
														className="h-8 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
													>
														<Translate
															text={
																localizationConstants.adminUsersEdit
															}
														/>
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
									{pageRows.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={USER_COLUMNS.length}
												className="h-32 text-center text-slate-500"
											>
												<Translate
													text={
														localizationConstants.adminUsersNoUsersFound
													}
												/>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>

					<TablePagination
						currentPage={page}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={(size) => {
							setPageSize(size);
							setPage(1);
						}}
					/>
				</TabsContent>

				<TabsContent value="groups" className="mt-6">
					<ComingSoonTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
