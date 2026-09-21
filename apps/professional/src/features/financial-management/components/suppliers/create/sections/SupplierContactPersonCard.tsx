"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import type { SupplierContactPerson } from "../../../../types/createSupplier.types";
import { SUPPLIER_CONTACT_ROLE_OPTIONS } from "../../../../constants/createSupplier.constants";

interface SupplierContactPersonCardProps {
	index: number;
	person: SupplierContactPerson;
	onChange: (updated: SupplierContactPerson) => void;
	onRemove?: () => void;
	canRemove: boolean;
}

export function SupplierContactPersonCard({
	index,
	person,
	onChange,
	onRemove,
	canRemove,
}: SupplierContactPersonCardProps) {
	const { t } = useTranslation();

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3">
				<h4 className="text-xs font-bold text-slate-800 tracking-tight">
					<Translate text={localizationConstants.supplierCardContactPersons} /> {String(index + 1).padStart(2, "0")}
				</h4>
				{canRemove && onRemove && (
					<button
						type="button"
						onClick={onRemove}
						className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
						aria-label="Remove contact person"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierContactPersonFirstName} />
					</label>
					<Input
						value={person.firstName}
						onChange={(e) => onChange({ ...person, firstName: e.target.value })}
						placeholder={t(localizationConstants.supplierContactPersonFirstName)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierContactPersonLastName} />
					</label>
					<Input
						value={person.lastName}
						onChange={(e) => onChange({ ...person, lastName: e.target.value })}
						placeholder={t(localizationConstants.supplierContactPersonLastName)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierContactPersonMobile} />
					</label>
					<Input
						value={person.mobilePhone}
						onChange={(e) => onChange({ ...person, mobilePhone: e.target.value })}
						placeholder="070-123 45 67"
						className="h-10 text-xs bg-white"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierContactPersonEmail} />
					</label>
					<Input
						type="email"
						value={person.email}
						onChange={(e) => onChange({ ...person, email: e.target.value })}
						placeholder="name@company.com"
						className="h-10 text-xs bg-white"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierContactPersonRole} />
					</label>
					<Select
						value={person.role || "Säljare"}
						onValueChange={(val) => onChange({ ...person, role: val })}
					>
						<SelectTrigger className="h-10 text-xs bg-white">
							<SelectValue placeholder="Välj roll" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{SUPPLIER_CONTACT_ROLE_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierContactPersonPersonalId} />
					</label>
					<Input
						value={person.personalNo || ""}
						onChange={(e) => onChange({ ...person, personalNo: e.target.value })}
						placeholder="YYYYMMDD-XXXX"
						className="h-10 text-xs bg-white"
					/>
				</div>
			</div>
		</div>
	);
}
