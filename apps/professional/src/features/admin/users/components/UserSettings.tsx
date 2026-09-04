"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminUsers, useAdminGroups, useUpdateUserPermissions, useAssignUserLicense, useAvailableModules, useAdminUserDetail, useLicensesSummary, useAdminRoleOptions, useAdminTypeOptions } from "../hooks/useAdminUsers";
import { useTranslation } from "react-i18next";
import {
	ArrowLeft,
	Building2,
	Calculator,
	ChevronDown,
	ChevronUp,
	CircleDollarSign,
	CircleUserRound,
	File,
	FileText,
	Info,
	Landmark,
	LayoutGrid,
	Monitor,
	Package,
	PencilRuler,
	Receipt,
	ShieldCheck,
	ShoppingCart,
	Store,
	Table2,
	TrendingUp,
	Truck,
	User as UserIcon,
	Users,
	Bookmark,
	type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
// Removed static constants imports

const MODULE_ICONS: Record<string, LucideIcon> = {
	faktura: Receipt,
	prognos: TrendingUp,
	personal: UserIcon,
	inkasso: Bookmark,
	juridik: Landmark,
	order: Package,
	projekt: Table2,
	inkop: ShoppingCart,
	kma: ShieldCheck,
	"maskin-fordon": Truck,
	projektering: PencilRuler,
	offert: CircleDollarSign,
	b2b: Building2,
	kalkyl: Calculator,
	avtal: FileText,
	mallar: File,
	"marknad-salj": Store,
	"data-it": Monitor,
	ledningsstod: LayoutGrid,
};

function UserAvatar({ name }: { name: string }) {
	const initials = (name || "U")
		.split(" ")
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
	return (
		<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">
			{initials}
		</span>
	);
}

export default function UserSettings() {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const userIdFromQuery = searchParams.get("userId");

	const { data: usersData } = useAdminUsers({ page: 1, limit: 100 });
	const { data: groupsData } = useAdminGroups({ limit: 100 });

	const apiGroups = useMemo(() => {
		const raw = groupsData?.data?.items || groupsData?.data || [];
		if (!Array.isArray(raw)) return [];
		return raw.map((g: Record<string, unknown>) => (g.name as string) || String(g));
	}, [groupsData]);

	const groupOptions = apiGroups;
	
	const { data: rolesData } = useAdminRoleOptions();
	const roleOptions = useMemo(() => {
		const raw = rolesData?.data || [];
		if (!Array.isArray(raw)) return [];
		return raw.map((r: Record<string, unknown>) => (r.name as string) || String(r));
	}, [rolesData]);

	const apiUsers = useMemo(() => {
		const raw = usersData?.data?.items || usersData?.data || [];
		if (!Array.isArray(raw)) return [];
		return raw.map((u: Record<string, unknown>) => {
			const firstName = (u.first_name as string) || "";
			const lastName = (u.last_name as string) || "";
			const email = (u.email as string) || "";
			const fullName = `${firstName} ${lastName}`.trim() || email || "User";
			const handle = email ? `@${email.split("@")[0]}` : "";
			return {
				id: u.id as string,
				name: fullName,
				handle,
				permission_role_name: (u.permission_role_name as string) || "",
				permission_role_id: (u.permission_role_id as string) || "",
				position_id: (u.position_id as string) || "",
				position: (u.position as string) || "",
				groups: Array.isArray(u.groups) ? u.groups : [],
				status: u.status,
			};
		});
	}, [usersData]);

	const userOptions = apiUsers;

	const [selectedUserId, setSelectedUserId] = useState<string>("");

	useEffect(() => {
		if (userIdFromQuery && userOptions.some((u) => u.id === userIdFromQuery)) {
			setSelectedUserId(userIdFromQuery);
		} else if (userOptions.length > 0 && !userIdFromQuery && !selectedUserId) {
			setSelectedUserId(userOptions[0].id);
		}
	}, [userIdFromQuery, userOptions, selectedUserId]);

	const [infoOpen, setInfoOpen] = useState(true);
	const [isAdmin, setIsAdmin] = useState(true);
	const [group, setGroup] = useState("");
	const [role, setRole] = useState("");
	const [type, setType] = useState("");
	
	const { data: typesData } = useAdminTypeOptions();
	const typeOptions = typesData?.data || [];

	const [reports, setReports] = useState(true);
	const [registerOther, setRegisterOther] = useState(true);
	const [license, setLicense] = useState("pro");
	const [collapsedGroups, setCollapsedGroups] = useState<
		Record<string, boolean>
	>({});
	const { data: availableModulesData } = useAvailableModules();
	const availableModules = availableModulesData?.data || [];
	const { i18n } = useTranslation();
	const currentLang = i18n.language === 'en' ? 'en' : 'sv';

	const { data: userDetailData } = useAdminUserDetail(selectedUserId);
	const { data: licensesData, isLoading: isLoadingLicenses } = useLicensesSummary();
	const licenseRows = (licensesData?.data || []).filter(
		(row: Record<string, unknown>) =>
			(row.purchased as number) > 0 || (row.allocated as number) > 0
	);
	
	const [moduleAccess, setModuleAccess] = useState<Record<string, boolean>>({});

	useEffect(() => {
		if (userDetailData?.data?.module_permissions) {
			setModuleAccess(userDetailData.data.module_permissions);
		} else {
			setModuleAccess({});
		}
		if (userDetailData?.data?.license) {
			setLicense(userDetailData.data.license.toLowerCase());
		} else {
			setLicense("standard");
		}
	}, [userDetailData]);

	const updatePermissionsMutation = useUpdateUserPermissions();
	const assignLicenseMutation = useAssignUserLicense();

	const handleModuleAccessChange = (moduleId: string, checked: boolean) => {
		setModuleAccess((prev) => {
			const newAccess = { ...prev, [moduleId]: checked };
			if (selectedUserId) {
				updatePermissionsMutation.mutate({
					userId: selectedUserId,
					module_permissions: newAccess
				});
			}
			return newAccess;
		});
	};

	const handleLicenseChange = (value: string) => {
		setLicense(value);
		if (selectedUserId) {
			assignLicenseMutation.mutate({
				userId: selectedUserId,
				subscription_plan_id: value
			});
		}
	};

	const selectedUser = useMemo(
		() =>
			userOptions.find((user) => user.id === selectedUserId) ??
			userOptions[0] ??
			null,
		[userOptions, selectedUserId],
	);

	useEffect(() => {
		if (selectedUser) {
			if ("permission_role_name" in selectedUser && selectedUser.permission_role_name) {
				setRole(String(selectedUser.permission_role_name));
			}
			if ("groups" in selectedUser && Array.isArray(selectedUser.groups) && selectedUser.groups.length > 0) {
				setGroup(String(selectedUser.groups[0].name));
			}
			if ("position_id" in selectedUser && selectedUser.position_id) {
				setType(String(selectedUser.position_id));
			}
		}
	}, [selectedUser]);

	const notifyComingSoon = () =>
		showToast("info", t(localizationConstants.comingSoon));

	return (
		<div className="flex min-h-[calc(100vh-180px)] flex-col gap-6 px-6 py-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => router.push("/admin/user")}
					aria-label={t(localizationConstants.adminUsersTitle)}
					className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-2xl font-semibold text-slate-900">
					<Translate
						text={localizationConstants.adminUserSettingsTitle}
					/>
				</h1>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
					<CircleUserRound className="h-5 w-5 text-slate-700" />
					<span className="text-sm font-semibold text-slate-900">
						<Translate
							text={localizationConstants.adminUserSelectUser}
						/>
					</span>
				</div>
				<div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
					<Select
						value={selectedUserId}
						onValueChange={(val) => {
							setSelectedUserId(val);
							router.push(`?userId=${val}`);
						}}
					>
						<SelectTrigger className="h-11 w-full flex-1 border-slate-200">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{userOptions.map((user) => (
								<SelectItem key={user.id} value={user.id}>
									<span className="flex items-center gap-2">
										<UserAvatar name={user.name} />
										<span className="font-medium text-slate-900">
											{user.name}
										</span>
										<span className="text-slate-500">
											{user.handle}
										</span>
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						onClick={() => setInfoOpen(true)}
						className="h-11 shrink-0 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white hover:bg-[#18181B]/90"
					>
						<Translate
							text={localizationConstants.adminUserShowDetails}
						/>
					</Button>
				</div>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<button
					type="button"
					onClick={() => setInfoOpen((prev) => !prev)}
					className="flex w-full cursor-pointer items-center justify-between border-b border-slate-200 px-4 py-4"
				>
					<span className="flex items-center gap-2">
						<Info className="h-5 w-5 text-slate-700" />
						<span className="text-sm font-semibold text-slate-900">
							<Translate
								text={
									localizationConstants.adminUserInformation
								}
							/>
						</span>
					</span>
					{infoOpen ? (
						<ChevronUp className="h-4 w-4 text-slate-500" />
					) : (
						<ChevronDown className="h-4 w-4 text-slate-500" />
					)}
				</button>

				{infoOpen && (
					<div className="flex flex-col gap-6 px-4 py-5">
						{/* User + Admin row */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.adminUserLabel
										}
									/>
								</span>
								<span className="text-sm text-slate-500">
									{selectedUser?.name || ""}
								</span>
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.adminUserAdminLabel
										}
									/>
								</span>
								<span className="flex items-center gap-2">
									<button
										type="button"
										role="switch"
										aria-checked={isAdmin}
										aria-label={t(
											localizationConstants.adminUserAdminLabel,
										)}
										onClick={() =>
											setIsAdmin((prev) => !prev)
										}
										className={cn(
											"relative h-6 w-11 cursor-pointer rounded-full transition-colors",
											isAdmin
												? "bg-green-500"
												: "bg-slate-300",
										)}
									>
										<span
											className={cn(
												"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
												isAdmin
													? "left-[22px]"
													: "left-0.5",
											)}
										/>
									</button>
									<span className="text-sm text-slate-700">
										<Translate
											text={
												isAdmin
													? localizationConstants.adminUserYes
													: localizationConstants.adminUserNo
											}
										/>
									</span>
								</span>
							</div>
						</div>

						{/* Grupp / Roll / Typ selects */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.adminUsersColGroup
										}
									/>
								</span>
								<Select value={group} onValueChange={setGroup}>
									<SelectTrigger className="h-11 w-full border-slate-200">
										<span className="flex items-center gap-2">
											<Users className="h-4 w-4 text-slate-500" />
											<SelectValue />
										</span>
									</SelectTrigger>
									<SelectContent>
										{groupOptions.map((option) => (
											<SelectItem
												key={option}
												value={option}
											>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.adminUsersColRole
										}
									/>
								</span>
								<Select value={role} onValueChange={setRole}>
									<SelectTrigger className="h-11 w-full border-slate-200">
										<span className="flex items-center gap-2">
											<CircleUserRound className="h-4 w-4 text-slate-500" />
											<SelectValue />
										</span>
									</SelectTrigger>
									<SelectContent>
										{roleOptions.map((option) => (
											<SelectItem
												key={option}
												value={option}
											>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.adminUsersColType
										}
									/>
								</span>
								<Select value={type} onValueChange={setType}>
									<SelectTrigger className="h-11 w-full border-slate-200">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{typeOptions.map((option: { id: string; name: string; name_sv: string }) => (
											<SelectItem
												key={option.id}
												value={option.id}
											>
												{currentLang === 'sv' && option.name_sv ? option.name_sv : option.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<RadioGroup
							value={license}
							onValueChange={handleLicenseChange}
							className="grid grid-cols-1 gap-4 md:grid-cols-4"
						>
							<Label className="flex items-center gap-2 text-sm font-medium text-slate-900">
								<Checkbox
									checked={reports}
									onCheckedChange={(checked) =>
										setReports(checked === true)
									}
								/>
								<Translate
									text={
										localizationConstants.adminUserReports
									}
								/>
							</Label>
							<Label className="flex items-center gap-2 text-sm font-medium text-slate-900">
								<Checkbox
									checked={registerOther}
									onCheckedChange={(checked) =>
										setRegisterOther(checked === true)
									}
								/>
								<Translate
									text={
										localizationConstants.adminUserRegisterOther
									}
								/>
							</Label>
							
							{isLoadingLicenses ? (
								<div className="col-span-2 text-sm text-slate-500">
									<Translate text={localizationConstants.genericLoading} />
								</div>
							) : licenseRows.length === 0 ? (
								<div className="col-span-2 text-sm text-slate-500">
									<Translate text={localizationConstants.noDataFound} />
								</div>
							) : (
								licenseRows.map((row: Record<string, unknown>) => (
									<div key={row.plan_key as string} className="flex flex-col gap-1">
										<Label className="flex items-center gap-2 text-sm font-medium text-slate-900 capitalize">
											<RadioGroupItem value={(row.plan_key as string).toLowerCase()} />
											{row.plan_key as string}
										</Label>
										<span className="pl-6 text-sm text-slate-500">
											<Translate text={localizationConstants.adminUsersPurchasedCol} />
											: {row.purchased as number} |{" "}
											<Translate text={localizationConstants.adminUsersAvailableCol} />
											: {(row.available as number) ?? "-"}
										</span>
									</div>
								))
							)}
						</RadioGroup>

						{availableModules.length > 0 && (
							<div className="flex flex-col gap-4">
								<span className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.adminUserPrograms
										}
									/>
								</span>
								<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
									{availableModules.map((programGroup: {id: string, title: Record<string, string>, modules: {id: string, name: Record<string, string>}[]}) => {
										const collapsed = collapsedGroups[programGroup.id];
										return (
											<div
												key={programGroup.id}
												className="overflow-hidden rounded-md border border-slate-200 bg-white"
											>
												<button
													type="button"
													onClick={() =>
														setCollapsedGroups(
															(prev) => ({
																...prev,
																[programGroup.id]:
																	!prev[
																		programGroup
																			.id
																	],
															}),
														)
													}
													className="flex w-full cursor-pointer items-center justify-between bg-slate-100 px-4 py-3"
												>
													<span className="text-sm font-semibold text-slate-900 capitalize">
														{programGroup.title[currentLang] || programGroup.title["sv"]}
													</span>
													{collapsed ? (
														<ChevronDown className="h-4 w-4 text-slate-500" />
													) : (
														<ChevronUp className="h-4 w-4 text-slate-500" />
													)}
												</button>
												{!collapsed && (
													<div>
														<div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-500">
															<Translate
																text={
																	localizationConstants.adminUserModules
																}
															/>
															<Translate
																text={
																	localizationConstants.adminUsersColAccess
																}
															/>
														</div>
														{programGroup.modules.length === 0 ? (
															<div className="px-4 py-6 text-center text-sm text-slate-500">
																<Translate text={localizationConstants.noDataFound} />
															</div>
														) : (
															programGroup.modules.map(
																(module: {id: string, name: Record<string, string>}) => {
																const Icon =
																	MODULE_ICONS[
																		module.id
																	] || Package;
																const checked =
																	moduleAccess[
																		module.id
																	] || false;
																return (
																	<div
																		key={
																			module.id
																		}
																		className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-0"
																	>
																		<div className="flex items-center gap-3">
																			<Icon className="h-4 w-4 text-slate-400" />
																			<span className="text-sm text-slate-700 capitalize">
																				{module.name[currentLang] || module.name["sv"]}
																			</span>
																		</div>
																		<div className="flex items-center gap-2">
																			<Checkbox
																				checked={
																					checked
																				}
																				onCheckedChange={(c) =>
																					handleModuleAccessChange(module.id, c === true)
																				}
																			/>
																			<Button
																				variant="outline"
																				onClick={
																					notifyComingSoon
																				}
																				className="h-8 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
																			>
																				<Translate
																					text={
																						localizationConstants.adminUsersOpen
																					}
																				/>
																			</Button>
																		</div>
																	</div>
																);
															})
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
