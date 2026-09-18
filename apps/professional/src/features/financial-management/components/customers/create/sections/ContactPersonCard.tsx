"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerContactPerson } from "../../../../types/createCustomer.types";
import { CONTACT_ROLE_OPTIONS } from "../../../../constants/createCustomer.constants";

interface ContactPersonCardProps {
	index: number;
	person: CustomerContactPerson;
	onChange: (updated: CustomerContactPerson) => void;
	onRemove?: () => void;
	canRemove: boolean;
}

export function ContactPersonCard({
	index,
	person,
	onChange,
	onRemove,
	canRemove,
}: ContactPersonCardProps) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3">
				<h4 className="text-xs font-bold text-slate-800 tracking-tight">
					Kontaktperson {String(index + 1).padStart(2, "0")}
				</h4>
				{canRemove && onRemove && (
					<button
						type="button"
						onClick={onRemove}
						className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
						aria-label="Ta bort kontaktperson"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.firstNameLabel} />
					</label>
					<Input
						value={person.firstName}
						onChange={(e) => onChange({ ...person, firstName: e.target.value })}
						placeholder="Förnamn"
						className="h-10 text-xs"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.lastNameLabel} />
					</label>
					<Input
						value={person.lastName}
						onChange={(e) => onChange({ ...person, lastName: e.target.value })}
						placeholder="Efternamn"
						className="h-10 text-xs"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.mobilePhoneLabel} />
					</label>
					<Input
						value={person.mobilePhone}
						onChange={(e) => onChange({ ...person, mobilePhone: e.target.value })}
						placeholder="070-123 45 67"
						className="h-10 text-xs"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.emailLabel} />
					</label>
					<Input
						type="email"
						value={person.email}
						onChange={(e) => onChange({ ...person, email: e.target.value })}
						placeholder="namn@foretag.se"
						className="h-10 text-xs"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.roleLabel} />
					</label>
					<Select
						value={person.role || "Beställare"}
						onValueChange={(val) => onChange({ ...person, role: val })}
					>
						<SelectTrigger className="h-10 text-xs bg-white">
							<SelectValue placeholder="Välj roll" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{CONTACT_ROLE_OPTIONS.map((opt: { value: string; label: string }) => (
								<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.personalNoLabel} />
					</label>
					<Input
						value={person.personalNo || ""}
						onChange={(e) => onChange({ ...person, personalNo: e.target.value })}
						placeholder="YYYYMMDD-XXXX"
						className="h-10 text-xs"
					/>
				</div>
			</div>
		</div>
	);
}
