"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";
import { SALES_REGIONS } from "../../constants/salesTaxonomy";
import { SALES_TEAM_ROLES } from "../../constants/salesTeamRoles";
import { useSalesTeam } from "../../hooks/useSalesTeam";
import type { SalesTeamRole } from "../../types";

type MemberDraft = {
	name: string;
	role: SalesTeamRole;
	region: string;
	email: string;
	phone: string;
};

const EMPTY_DRAFT: MemberDraft = {
	name: "",
	role: "seller",
	region: "",
	email: "",
	phone: "",
};

/** Adds one person to the sales organisation. */
export function AddTeamMemberForm({ onClose }: { onClose: () => void }) {
	const { members, addMember } = useSalesTeam();
	const t = useTranslate();
	const [draft, setDraft] = useState<MemberDraft>(EMPTY_DRAFT);
	const [error, setError] = useState<string | null>(null);

	const update = (patch: Partial<MemberDraft>) => {
		setDraft((previous) => ({ ...previous, ...patch }));
		setError(null);
	};

	const handleSave = () => {
		const name = draft.name.trim();
		if (!name) {
			setError(localizationConstants.salesTeamNameRequired);
			return;
		}
		// Results are matched to people by name, because the CRM records a seller
		// as a name. Two members sharing a name would silently share their numbers.
		const taken = members.some(
			(member) => member.name.trim().toLowerCase() === name.toLowerCase(),
		);
		if (taken) {
			setError(localizationConstants.salesTeamNameTaken);
			return;
		}
		addMember({ ...draft, name });
		showToast("success", t(localizationConstants.salesTeamMemberAddedToast));
		setDraft(EMPTY_DRAFT);
		onClose();
	};

	const textFields = [
		{ name: "name", labelKey: localizationConstants.salesBookerColumnName },
		{ name: "email", labelKey: localizationConstants.salesFieldEmail },
		{ name: "phone", labelKey: localizationConstants.salesColumnPhone },
	] as const;

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesTeamAddFormTitle} />
			</h2>

			<div className="mt-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
				{textFields.map((field) => (
					<div key={field.name} className="flex flex-col gap-1.5">
						<label
							className="text-sm font-medium text-slate-700"
							htmlFor={`team-member-${field.name}`}
						>
							<Translate text={field.labelKey} />
						</label>
						<Input
							id={`team-member-${field.name}`}
							value={draft[field.name]}
							onChange={(event) => update({ [field.name]: event.target.value })}
						/>
					</div>
				))}

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.salesTeamColumnRole} />
					</label>
					<Select
						value={draft.role}
						onValueChange={(value) => update({ role: value as SalesTeamRole })}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SALES_TEAM_ROLES.map((role) => (
								<SelectItem key={role.id} value={role.id}>
									{t(role.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.salesFieldRegion} />
					</label>
					<Select
						value={draft.region}
						onValueChange={(value) => update({ region: value })}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue
								placeholder={t(localizationConstants.salesSelectRegionPlaceholder)}
							/>
						</SelectTrigger>
						<SelectContent>
							{SALES_REGIONS.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{t(option.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{error && (
				<p className="mt-3 text-sm text-red-600">
					<Translate text={error} />
				</p>
			)}

			<div className="mt-4 flex flex-wrap items-center gap-3">
				<Button
					type="button"
					className={`h-10 cursor-pointer active:scale-[0.98] ${SALES_PRIMARY_BUTTON_CLASS}`}
					onClick={handleSave}
				>
					<Translate text={localizationConstants.salesTeamSaveButton} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					className="h-10 active:scale-[0.98]"
					onClick={onClose}
				>
					<Translate text={localizationConstants.salesCancelButton} />
				</Button>
			</div>
		</section>
	);
}
