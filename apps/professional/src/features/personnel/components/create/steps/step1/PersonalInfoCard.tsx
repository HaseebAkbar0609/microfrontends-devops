"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PersonalInfoForm } from "@/features/personnel/types/createEmployee.types";
import { CITY_OPTIONS } from "@/features/personnel/constants/createEmployee.constants";

interface PersonalInfoCardProps {
	data: PersonalInfoForm;
	onChange: (field: keyof PersonalInfoForm, value: string) => void;
}

export function PersonalInfoCard({ data, onChange }: PersonalInfoCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-900 mb-5">
				{t(localizationConstants.sectionPersonalDetails)}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{/* Row 1 */}
				<div>
					<Label htmlFor="firstName" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldFirstName)}
					</Label>
					<Input
						id="firstName"
						value={data.firstName}
						onChange={(e) => onChange("firstName", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						required
					/>
				</div>

				<div>
					<Label htmlFor="lastName" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldLastName)}
					</Label>
					<Input
						id="lastName"
						value={data.lastName}
						onChange={(e) => onChange("lastName", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						required
					/>
				</div>

				<div>
					<Label htmlFor="personalId" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldPersonalId)}
					</Label>
					<Input
						id="personalId"
						value={data.personalId}
						onChange={(e) => onChange("personalId", e.target.value)}
						placeholder="YYYYMMDD-XXXX"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						required
					/>
				</div>

				{/* Row 2 */}
				<div>
					<Label htmlFor="workEmail" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldWorkEmail)}
					</Label>
					<Input
						id="workEmail"
						type="email"
						value={data.workEmail}
						onChange={(e) => onChange("workEmail", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						required
					/>
				</div>

				<div>
					<Label htmlFor="phone" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldMobile)}
					</Label>
					<Input
						id="phone"
						type="tel"
						value={data.phone}
						onChange={(e) => onChange("phone", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="privateEmail" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldPrivateEmail)}
					</Label>
					<Input
						id="privateEmail"
						type="email"
						value={data.privateEmail}
						onChange={(e) => onChange("privateEmail", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				{/* Row 3 */}
				<div>
					<Label htmlFor="address" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldAddress)}
					</Label>
					<Input
						id="address"
						value={data.address}
						onChange={(e) => onChange("address", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="city" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldCity)}
					</Label>
					<Select value={data.city} onValueChange={(val) => onChange("city", val)}>
						<SelectTrigger id="city" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldCity)} />
						</SelectTrigger>
						<SelectContent>
							{CITY_OPTIONS.map((city) => (
								<SelectItem key={city} value={city}>
									{city}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="postalCode" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldPostalCode)}
					</Label>
					<Input
						id="postalCode"
						value={data.postalCode}
						onChange={(e) => onChange("postalCode", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>
			</div>
		</section>
	);
}
