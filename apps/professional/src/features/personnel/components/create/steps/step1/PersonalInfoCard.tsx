"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser } from "lucide-react";
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
	fieldErrors?: Record<string, string>;
	onChange: (field: keyof PersonalInfoForm, value: string) => void;
}

export function PersonalInfoCard({ data, fieldErrors, onChange }: PersonalInfoCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionPersonalDetails)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{/* Row 1: Förnamn & Efternamn */}
				<div>
					<Label htmlFor="firstName" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldFirstName)} <span className="text-red-500">*</span>
					</Label>
					<Input
						id="firstName"
						value={data.firstName}
						onChange={(e) => onChange("firstName", e.target.value)}
						placeholder="Johan"
						className={`h-10 bg-white text-slate-900 rounded-lg text-sm placeholder:text-slate-400 ${
							fieldErrors?.firstName ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
						}`}
						required
					/>
					{fieldErrors?.firstName && (
						<p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
					)}
				</div>

				<div>
					<Label htmlFor="lastName" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldLastName)} <span className="text-red-500">*</span>
					</Label>
					<Input
						id="lastName"
						value={data.lastName}
						onChange={(e) => onChange("lastName", e.target.value)}
						placeholder="Andersson"
						className={`h-10 bg-white text-slate-900 rounded-lg text-sm placeholder:text-slate-400 ${
							fieldErrors?.lastName ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
						}`}
						required
					/>
					{fieldErrors?.lastName && (
						<p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
					)}
				</div>

				{/* Row 2: Person nr & Mail företag */}
				<div>
					<Label htmlFor="personalId" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldPersonalId)} <span className="text-red-500">*</span>
					</Label>
					<Input
						id="personalId"
						value={data.personalId}
						onChange={(e) => onChange("personalId", e.target.value)}
						placeholder="1985-05-05-1010"
						className={`h-10 bg-white text-slate-900 rounded-lg text-sm placeholder:text-slate-400 ${
							fieldErrors?.personalId ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
						}`}
						required
					/>
					{fieldErrors?.personalId && (
						<p className="text-xs text-red-500 mt-1">{fieldErrors.personalId}</p>
					)}
				</div>

				<div>
					<Label htmlFor="workEmail" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldWorkEmail)} <span className="text-red-500">*</span>
					</Label>
					<Input
						id="workEmail"
						type="email"
						value={data.workEmail}
						onChange={(e) => onChange("workEmail", e.target.value)}
						placeholder="info@byggbolaget.se"
						className={`h-10 bg-white text-slate-900 rounded-lg text-sm placeholder:text-slate-400 ${
							fieldErrors?.workEmail ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
						}`}
						required
					/>
					{fieldErrors?.workEmail && (
						<p className="text-xs text-red-500 mt-1">{fieldErrors.workEmail}</p>
					)}
				</div>

				{/* Row 3: Mobil & Mail privat */}
				<div>
					<Label htmlFor="phone" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldMobile)}
					</Label>
					<Input
						id="phone"
						type="tel"
						value={data.phone}
						onChange={(e) => onChange("phone", e.target.value)}
						placeholder="070-560 50 60"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div>
					<Label htmlFor="privateEmail" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldPrivateEmail)}
					</Label>
					<Input
						id="privateEmail"
						type="email"
						value={data.privateEmail}
						onChange={(e) => onChange("privateEmail", e.target.value)}
						placeholder="john@gmail.com"
						className={`h-10 bg-white text-slate-900 rounded-lg text-sm placeholder:text-slate-400 ${
							fieldErrors?.privateEmail ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
						}`}
					/>
					{fieldErrors?.privateEmail && (
						<p className="text-xs text-red-500 mt-1">{fieldErrors.privateEmail}</p>
					)}
				</div>

				{/* Row 4: Adress (full width across both columns) */}
				<div className="col-span-1 md:col-span-2">
					<Label htmlFor="address" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldAddress)}
					</Label>
					<Input
						id="address"
						value={data.address}
						onChange={(e) => onChange("address", e.target.value)}
						placeholder="Stengatan 10"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				{/* Row 5: Ort & Post nr */}
				<div>
					<Label htmlFor="city" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldCity)}
					</Label>
					<Select value={data.city} onValueChange={(val) => onChange("city", val)}>
						<SelectTrigger id="city" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder="Solna" />
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
					<Label htmlFor="postalCode" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldPostalCode)}
					</Label>
					<Input
						id="postalCode"
						value={data.postalCode}
						onChange={(e) => onChange("postalCode", e.target.value)}
						placeholder="171 63"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>
			</div>
		</section>
	);
}
