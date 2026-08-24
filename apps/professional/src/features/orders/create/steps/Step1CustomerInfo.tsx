"use client";

import { UserPlus, Contact, CircleFadingPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "../components/SearchableSelect";
import { PhoneInput } from "../components/PhoneInput";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import type { CustomerInfoData, ContactPersonData } from "../types";

interface Step1CustomerInfoProps {
	customerInfo: CustomerInfoData;
	onCustomerInfoChange: (data: Partial<CustomerInfoData>) => void;
	contactPerson: ContactPersonData;
	onContactPersonChange: (data: Partial<ContactPersonData>) => void;
	onSaveCustomer?: () => void;
	errors?: Record<string, string>;
}

const FIRST_NAME_SUGGESTIONS = [
	"Anders",
	"Rachel",
	"Bruno",
	"Anna",
	"Erik",
	"Johan",
	"Maria",
	"Karl",
];

const ROLE_OPTIONS_KEYS = [
	{ value: "Beställare", labelKey: localizationConstants.roleLabel },
	{ value: "Projektledare", label: "Projektledare" },
	{ value: "Platschef", label: "Platschef" },
	{ value: "Arbetsledare", label: "Arbetsledare" },
	{ value: "Ekonom", label: "Ekonom" },
	{ value: "Montör", label: "Montör" },
];

export function Step1CustomerInfo({
	customerInfo,
	onCustomerInfoChange,
	contactPerson,
	onContactPersonChange,
	onSaveCustomer,
	errors = {},
}: Step1CustomerInfoProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4">
			{/* Card 1: Kunduppgifter */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<UserPlus className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderKunduppgifterSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						{/* Kund */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderKundLabel} />
							</Label>
							<Input
								value={customerInfo.customer}
								onChange={(e) => onCustomerInfoChange({ customer: e.target.value })}
								placeholder={t(localizationConstants.orderKundLabel)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.customer && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.customer && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.customer}</p>
							)}
						</div>

						{/* Address */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderAddressLabel} />
							</Label>
							<Input
								value={customerInfo.address}
								onChange={(e) => onCustomerInfoChange({ address: e.target.value })}
								placeholder={t(localizationConstants.placeholderAddress)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.address && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.address && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.address}</p>
							)}
						</div>

						{/* Post nr */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderPostNrLabel} />
							</Label>
							<Input
								value={customerInfo.postalCode}
								onChange={(e) =>
									onCustomerInfoChange({
										postalCode: e.target.value.replace(/[^0-9 ]/g, ""),
									})
								}
								placeholder={t(localizationConstants.placeholderPostalCode)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.postalCode && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.postalCode && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.postalCode}</p>
							)}
						</div>

						{/* Ort */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderCityLabel} />
							</Label>
							<Input
								value={customerInfo.city}
								onChange={(e) => onCustomerInfoChange({ city: e.target.value })}
								placeholder={t(localizationConstants.placeholderCity)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.city && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.city && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.city}</p>
							)}
						</div>

						{/* Mail */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderMailLabel} />
							</Label>
							<Input
								type="email"
								value={customerInfo.email}
								onChange={(e) => onCustomerInfoChange({ email: e.target.value.trim() })}
								placeholder={t(localizationConstants.placeholderEmail)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.email && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.email && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.email}</p>
							)}
						</div>

						{/* Telefon */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderTelefonLabel} />
							</Label>
							<PhoneInput
								value={customerInfo.phone}
								onChange={(val) => onCustomerInfoChange({ phone: val })}
								placeholder={t(localizationConstants.placeholderPhone)}
								hasError={Boolean(errors.phone)}
							/>
							{errors.phone && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.phone}</p>
							)}
						</div>

						{/* Org / Person nr */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderOrgPersonNrLabel} />
							</Label>
							<Input
								value={customerInfo.orgOrPersonalNo}
								onChange={(e) =>
									onCustomerInfoChange({
										orgOrPersonalNo: e.target.value.replace(/[^0-9\-]/g, ""),
									})
								}
								placeholder="556060-2020"
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.orgOrPersonalNo && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.orgOrPersonalNo && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.orgOrPersonalNo}</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Card 2: Kontaktperson */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Contact className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderKontaktpersonSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0 space-y-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						{/* Förnamn */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderFornamLabel} />
							</Label>
							<SearchableSelect
								value={contactPerson.firstName}
								onChange={(val) => onContactPersonChange({ firstName: val })}
								placeholder={t(localizationConstants.orderFornamLabel)}
								searchPlaceholder={t(localizationConstants.customerRegisterSearch)}
								options={FIRST_NAME_SUGGESTIONS}
							/>
							{errors.firstName && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.firstName}</p>
							)}
						</div>

						{/* Efternamn */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderEfternamnLabel} />
							</Label>
							<Input
								value={contactPerson.lastName}
								onChange={(e) =>
									onContactPersonChange({ lastName: e.target.value })
								}
								placeholder={t(localizationConstants.orderEfternamnLabel)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.lastName && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.lastName && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.lastName}</p>
							)}
						</div>

						{/* Mail */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderMailLabel} />
							</Label>
							<Input
								type="email"
								value={contactPerson.email}
								onChange={(e) => onContactPersonChange({ email: e.target.value.trim() })}
								placeholder={t(localizationConstants.placeholderEmail)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.contactEmail && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.contactEmail && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.contactEmail}</p>
							)}
						</div>

						{/* Mobil */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderMobilLabel} />
							</Label>
							<PhoneInput
								value={contactPerson.mobile}
								onChange={(val) => onContactPersonChange({ mobile: val })}
								placeholder={t(localizationConstants.placeholderPhone)}
								hasError={Boolean(errors.mobile)}
							/>
							{errors.mobile && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.mobile}</p>
							)}
						</div>

						{/* Roll */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderRollLabel} />
							</Label>
							<Select
								value={contactPerson.role}
								onValueChange={(val) => onContactPersonChange({ role: val })}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.orderRollLabel)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{ROLE_OPTIONS_KEYS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.labelKey ? (
												<Translate text={opt.labelKey} />
											) : (
												opt.label
											)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Spara kund button bottom right outside card */}
			{onSaveCustomer && (
				<div className="flex justify-end pt-1">
					<Button
						type="button"
						onClick={onSaveCustomer}
						className="h-10 gap-2 px-6 rounded-lg bg-[#111721] text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-none"
					>
						<CircleFadingPlus className="h-4 w-4" />
						<span><Translate text={localizationConstants.orderChangeButton} /></span>
					</Button>
				</div>
			)}
		</div>
	);
}
