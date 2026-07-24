"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
	PROGRAM_GROUPS,
	SETTINGS_USERS,
	USER_GROUP_OPTIONS,
	USER_ROLE_OPTIONS,
	USER_TYPE_OPTIONS,
} from "../constants";

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
	const initials = name
		.split(" ")
		.map((part) => part[0])
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

	const [selectedUserId, setSelectedUserId] = useState(SETTINGS_USERS[0].id);
	const [infoOpen, setInfoOpen] = useState(true);
	const [isAdmin, setIsAdmin] = useState(true);
	const [group, setGroup] = useState(USER_GROUP_OPTIONS[0]);
	const [role, setRole] = useState(USER_ROLE_OPTIONS[0]);
	const [type, setType] = useState(USER_TYPE_OPTIONS[0]);
	const [reports, setReports] = useState(true);
	const [registerOther, setRegisterOther] = useState(true);
	const [license, setLicense] = useState("pro");
	const [collapsedGroups, setCollapsedGroups] = useState<
		Record<string, boolean>
	>({});
	const [moduleAccess, setModuleAccess] = useState<Record<string, boolean>>(
		() =>
			Object.fromEntries(
				PROGRAM_GROUPS.flatMap((programGroup) =>
					programGroup.modules.map((module) => [
						module.id,
						module.checked,
					]),
				),
			),
	);

	const selectedUser = useMemo(
		() =>
			SETTINGS_USERS.find((user) => user.id === selectedUserId) ??
			SETTINGS_USERS[0],
		[selectedUserId],
	);

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
						onValueChange={setSelectedUserId}
					>
						<SelectTrigger className="h-11 w-full flex-1 border-slate-200">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SETTINGS_USERS.map((user) => (
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
									{selectedUser.name}
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
										{USER_GROUP_OPTIONS.map((option) => (
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
										{USER_ROLE_OPTIONS.map((option) => (
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
										{USER_TYPE_OPTIONS.map((option) => (
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
						</div>

						<RadioGroup
							value={license}
							onValueChange={setLicense}
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
							<div className="flex flex-col gap-1">
								<Label className="flex items-center gap-2 text-sm font-medium text-slate-900">
									<RadioGroupItem value="standard" />
									<Translate
										text={
											localizationConstants.adminUserStandardLicense
										}
									/>
								</Label>
								<span className="pl-6 text-sm text-slate-500">
									<Translate
										text={
											localizationConstants.adminUsersPurchasedCol
										}
									/>
									: 5 |{" "}
									<Translate
										text={
											localizationConstants.adminUsersAvailableCol
										}
									/>
									: 3
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<Label className="flex items-center gap-2 text-sm font-medium text-slate-900">
									<RadioGroupItem value="pro" />
									PRO
								</Label>
								<span className="pl-6 text-sm text-slate-500">
									<Translate
										text={
											localizationConstants.adminUsersPurchasedCol
										}
									/>
									: 5 |{" "}
									<Translate
										text={
											localizationConstants.adminUsersAvailableCol
										}
									/>
									: 3
								</span>
							</div>
						</RadioGroup>

						<div className="flex flex-col gap-4">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.adminUserPrograms
									}
								/>
							</span>
							<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
								{PROGRAM_GROUPS.map((programGroup) => {
									const collapsed =
										collapsedGroups[programGroup.id];
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
												<span className="text-sm font-semibold text-slate-900">
													{programGroup.title}
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
													{programGroup.modules.map(
														(module) => {
															const Icon =
																MODULE_ICONS[
																	module.id
																] ?? File;
															return (
																<div
																	key={
																		module.id
																	}
																	className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0"
																>
																	<span className="flex items-center gap-2 text-sm text-slate-900">
																		<Icon className="h-4 w-4 text-slate-600" />
																		{
																			module.name
																		}
																	</span>
																	<span className="flex items-center gap-3">
																		<Checkbox
																			checked={
																				moduleAccess[
																					module
																						.id
																				]
																			}
																			onCheckedChange={(
																				checked,
																			) =>
																				setModuleAccess(
																					(
																						prev,
																					) => ({
																						...prev,
																						[module.id]:
																							checked ===
																							true,
																					}),
																				)
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
																	</span>
																</div>
															);
														},
													)}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
