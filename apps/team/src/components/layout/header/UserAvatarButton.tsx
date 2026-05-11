"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, Building2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

type HeaderCompany = {
	id: string;
	name: string;
};

interface UserAvatarButtonProps {
	user?: unknown;
	className?: string;
}

const FALLBACK_COMPANIES: HeaderCompany[] = [
	{ id: "timeflow-sweden", name: "Timeflow Sweden" },
	{ id: "timeflow-global", name: "Timeflow - Global" },
	{ id: "timeflow-germany", name: "Timeflow Germany" },
];

function asRecord(value: unknown): Record<string, unknown> | null {
	if (!value || typeof value !== "object" || Array.isArray(value))
		return null;
	return value as Record<string, unknown>;
}

function readString(source: Record<string, unknown> | null, keys: string[]) {
	if (!source) return null;

	for (const key of keys) {
		const value = source[key];
		if (typeof value === "string" && value.trim()) {
			return value.trim();
		}
	}

	return null;
}

function readCompanies(value: unknown): HeaderCompany[] {
	if (!Array.isArray(value)) return [];

	return value
		.map((company, index) => {
			const record = asRecord(company);
			const name =
				readString(record, [
					"name",
					"company_name",
					"label",
					"title",
				]) ?? "";

			if (!name) return null;

			return {
				id:
					readString(record, ["id", "code", "country"]) ??
					`company-${index + 1}`,
				name,
			};
		})
		.filter((company): company is HeaderCompany => company !== null);
}

function buildInitials(name: string) {
	const parts = name
		.split(/\s+/)
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length === 0) return "TF";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function composeFullName(
	firstName: string | null,
	lastName: string | null,
): string | null {
	const value = [firstName, lastName].filter(Boolean).join(" ").trim();
	return value || null;
}

function getUserProfile(user: unknown) {
	const userRecord = asRecord(user);
	const adminDetails = asRecord(userRecord?.admin_details);

	const name =
		readString(adminDetails, ["name", "full_name"]) ??
		composeFullName(
			readString(adminDetails, ["first_name"]),
			readString(adminDetails, ["last_name"]),
		) ??
		readString(userRecord, ["name", "full_name"]) ??
		composeFullName(
			readString(userRecord, ["first_name"]),
			readString(userRecord, ["last_name"]),
		) ??
		"TimeFlow Admin";

	const role =
		readString(adminDetails, ["role"]) ??
		readString(userRecord, ["role"]) ??
		localizationConstants.administratorRole;

	const currentCompany =
		readString(asRecord(adminDetails?.current_company), [
			"name",
			"company_name",
		]) ??
		readString(asRecord(userRecord?.current_company), [
			"name",
			"company_name",
		]) ??
		readString(adminDetails, ["company_name"]) ??
		readString(userRecord, ["company_name"]) ??
		FALLBACK_COMPANIES[0].name;

	const companies = [
		...readCompanies(adminDetails?.companies),
		...readCompanies(userRecord?.companies),
	];

	const uniqueCompanies = new Map<string, HeaderCompany>();

	[
		{ id: "current-company", name: currentCompany },
		...companies,
		...FALLBACK_COMPANIES,
	].forEach((company) => {
		if (!company.name) return;
		const key = company.name.toLowerCase();
		if (!uniqueCompanies.has(key)) {
			uniqueCompanies.set(key, company);
		}
	});

	return {
		name,
		role,
		initials: buildInitials(name),
		currentCompany,
		companies: Array.from(uniqueCompanies.values()),
	};
}

const UserAvatarButton = ({ user, className }: UserAvatarButtonProps) => {
	const profile = getUserProfile(user);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Open user menu"
					className={cn(
						"flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90",
						className,
					)}
				>
					{profile.initials}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
				<div className="rounded-xl bg-slate-50 px-3 py-3">
					<div className="text-sm font-semibold text-slate-900">
						{profile.name}
					</div>
					<div className="text-xs text-slate-500">
						<Translate text={profile.role} />
					</div>
				</div>

				<div className="px-2 py-3">
					<p className="mb-2 text-sm font-semibold uppercase text-slate-700">
						<Translate text={localizationConstants.companies} />
					</p>

					<DropdownMenuItem className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-3 focus:bg-slate-100">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700">
								<Building2 size={18} />
							</div>
							<span className="text-sm font-medium text-slate-900">
								{profile.currentCompany}
							</span>
						</div>
						<ArrowRight size={18} className="text-slate-500" />
					</DropdownMenuItem>
				</div>

				<div className="px-2 pb-2">
					{/* <p className="mb-2 text-sm font-semibold text-slate-700">
						<Translate text={localizationConstants.changeCompany} />
					</p> */}

					{/* {switchableCompanies.map((company) => (
						<DropdownMenuItem
							key={company.id}
							className="flex items-center justify-between rounded-xl px-3 py-3"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
									<Building2 size={18} />
								</div>
								<span className="text-sm text-slate-800">
									{company.name}
								</span>
							</div>
							<ArrowRight size={18} className="text-slate-500" />
						</DropdownMenuItem>
					))} */}
				</div>

				<DropdownMenuItem className="mt-1 flex justify-center gap-2 rounded-xl p-3">
					<Plus size={18} className="text-slate-900" />
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.addAccount} />
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatarButton;
