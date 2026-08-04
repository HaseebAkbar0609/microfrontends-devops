"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import GroupsTab from "./GroupsTab";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	ACCESS_LABELS,
	type AdminUserAccess,
} from "../constants";
import { useAdminUsers, useLicensesSummary } from "../hooks/useAdminUsers";

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
	const router = useRouter();
	const { query, changeQueries } = useQueryParams();
	const activeTab = query.get("tab") === "groups" ? "groups" : "users";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "users" ? null : value });
	const [search, setSearch] = useState("");
	const [accessFilter, setAccessFilter] = useState<AdminUserAccess | "">("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const notifyComingSoon = () =>
		showToast("info", t(localizationConstants.comingSoon));

	const { data: usersData, isLoading } = useAdminUsers({
		skip: (page - 1) * pageSize,
		limit: pageSize,
		search: search || undefined,
		role: accessFilter === "sys-admin" ? "OWNER" : accessFilter === "admin" ? "MANAGER" : accessFilter === "user" ? "WORKER" : undefined,
	});


	const { data: licensesData, isLoading: isLoadingLicenses } = useLicensesSummary();

	const pageRows = usersData?.data || [];
	const totalItems = usersData?.total_items || 0;
	const totalPages = usersData?.total_pages || 1;
	const licenseRows = (licensesData?.data || []).filter(
		(row: Record<string, unknown>) =>
			(row.purchased as number) > 0 || (row.allocated as number) > 0
	);

	const renderAccess = (userRole: string) => {
		let mappedAccess: AdminUserAccess = "user";
		if (userRole === "owner" || userRole === "OWNER") mappedAccess = "sys-admin";
		if (userRole === "manage" || userRole === "MANAGER") mappedAccess = "admin";
		
		const Icon = ACCESS_ICONS[mappedAccess];
		return (
			<span className="flex items-center gap-2 text-slate-700">
				<Icon size={16} className="shrink-0 text-slate-500" />
				{ACCESS_LABELS[mappedAccess]}
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
							href: "/home",
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
							className="px-0 text-slate-600 data-[state=active]:px-5 data-[state=active]:text-slate-900"
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
									{isLoadingLicenses ? (
										<TableRow>
											<TableCell colSpan={4} className="h-24 text-center text-slate-500">
												<Translate text={localizationConstants.genericLoading} />
											</TableCell>
										</TableRow>
									) : licenseRows.length > 0 ? (
										licenseRows.map((row: Record<string, unknown>) => (
											<TableRow
												key={row.plan_key as string}
												className="border-slate-100 hover:bg-slate-50"
											>
												<TableCell className="px-4 py-4 text-slate-900 capitalize">
													{row.plan_key as string}
												</TableCell>
												<TableCell className="px-4 py-4 text-right tabular-nums text-slate-700">
													{row.purchased as number}
												</TableCell>
												<TableCell className="px-4 py-4 text-right tabular-nums text-slate-700">
													{row.allocated as number}
												</TableCell>
												<TableCell className="px-4 py-4 text-right tabular-nums text-slate-700">
													{(row.available as number) ?? "-"}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} className="h-24 text-center text-slate-500">
												<Translate text={localizationConstants.noDataFound} />
											</TableCell>
										</TableRow>
									)}
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
								onClick={() =>
									router.push("/admin/user/create")
								}
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
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={USER_COLUMNS.length} className="text-center py-8">
												Loading...
											</TableCell>
										</TableRow>
									) : pageRows.map((user: Record<string, unknown>) => (
											<TableRow
												key={user.id as string}
												className="border-slate-100 hover:bg-slate-50"
											>
												<TableCell className="max-w-[10rem] truncate px-4 py-4 font-medium text-slate-900">
													{(user.first_name as string)} {(user.last_name as string)}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4 tabular-nums text-slate-700">
													{(user.personal_id as string) || "-"}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4">
													{renderAccess(user.role as string)}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4">
													{user.license ? (
														<Badge
															className={cn(
																"rounded-[6px] px-2.5 py-0.5 text-xs font-semibold",
																(user.license as string).toUpperCase() === "PRO"
																	? "bg-[#18181B] text-white"
																	: "bg-slate-100 text-slate-700",
															)}
														>
															{(user.license as string).toUpperCase() === "PRO" 
																? "PRO" 
																: (user.license as string).charAt(0).toUpperCase() + (user.license as string).slice(1).toLowerCase()}
														</Badge>
													) : (
														<span className="text-slate-500">-</span>
													)}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
													{(user.addons as string) || "-"}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
													{Array.isArray(user.groups) && user.groups.length > 0 
														? user.groups.map((g: Record<string, unknown>) => g.name).join(", ") 
														: "-"}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
													{(user.permission_role_name as string) || "-"}
												</TableCell>
												<TableCell className="whitespace-nowrap px-4 py-4 text-slate-700">
													{(user.position as string) || "-"}
												</TableCell>
											<TableCell className="whitespace-nowrap px-4 py-4">
												<div className="flex items-center gap-2">
													<Button
														variant="secondary"
														onClick={() =>
															router.push(
																`/admin/user/settings?userId=${user.id}`,
															)
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
									{pageRows.length === 0 && !isLoading && (
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

					{totalItems > 0 && (
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
					)}
				</TabsContent>

				<TabsContent value="groups" className="mt-6">
					<GroupsTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
