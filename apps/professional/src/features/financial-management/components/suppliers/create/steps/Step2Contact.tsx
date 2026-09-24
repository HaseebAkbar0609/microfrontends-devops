"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CreateSupplierFormData,
	SupplierContactPerson,
} from "../../../../types/createSupplier.types";
import { SupplierContactPersonCard } from "../sections/SupplierContactPersonCard";

interface Step2ContactProps {
	form: UseFormReturn<CreateSupplierFormData>;
	contactPersons: SupplierContactPerson[];
	onAddContactPerson: () => void;
	onRemoveContactPerson: (index: number) => void;
	onUpdateContactPerson: (index: number, field: keyof SupplierContactPerson, value: string) => void;
}

export function Step2Contact({
	form,
	contactPersons,
	onAddContactPerson,
	onRemoveContactPerson,
	onUpdateContactPerson,
}: Step2ContactProps) {
	const { t } = useTranslation();
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div className="space-y-6">
			{/* Card 1: Allmän Kontaktinformation */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<div className="border-b border-slate-100 pb-4">
					<h3 className="text-sm font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.supplierCardContact} />
					</h3>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierPhoneLabel} /> *
						</label>
						<Input
							{...register("phone")}
							placeholder={t(localizationConstants.supplierPhonePlaceholder)}
							className={`h-10 text-xs bg-white ${errors.phone ? "border-rose-500" : ""}`}
						/>
						{errors.phone && (
							<p className="text-[11px] text-rose-500">
								<Translate text={errors.phone.message || localizationConstants.supplierValidationPhone} />
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierEmailLabel} /> *
						</label>
						<Input
							type="email"
							{...register("email")}
							placeholder={t(localizationConstants.supplierEmailPlaceholder)}
							className={`h-10 text-xs bg-white ${errors.email ? "border-rose-500" : ""}`}
						/>
						{errors.email && (
							<p className="text-[11px] text-rose-500">
								<Translate text={errors.email.message || localizationConstants.supplierValidationEmail} />
							</p>
						)}
					</div>

					<div className="space-y-1.5 sm:col-span-2">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierWebsiteLabel} />
						</label>
						<Input
							{...register("website")}
							placeholder={t(localizationConstants.supplierWebsitePlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5 sm:col-span-2">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierNotesLabel} />
						</label>
						<Textarea
							{...register("contactNotes")}
							placeholder={t(localizationConstants.supplierNotesPlaceholder)}
							className="text-xs min-h-[80px] bg-white"
						/>
					</div>
				</div>
			</div>

			{/* Card 2: Kontaktpersoner */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-bold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.supplierCardContactPersons} />
						</h3>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onAddContactPerson}
						className="h-9 px-4 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 cursor-pointer"
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.supplierAddContactPersonButton} />
					</Button>
				</div>

				<div className="space-y-4">
					{contactPersons.map((person, idx) => (
						<SupplierContactPersonCard
							key={person.id}
							index={idx}
							person={person}
							onChange={(updated) => {
								onUpdateContactPerson(idx, "firstName", updated.firstName);
								onUpdateContactPerson(idx, "lastName", updated.lastName);
								onUpdateContactPerson(idx, "mobilePhone", updated.mobilePhone);
								onUpdateContactPerson(idx, "email", updated.email);
								onUpdateContactPerson(idx, "role", updated.role);
								onUpdateContactPerson(idx, "personalNo", updated.personalNo || "");
							}}
							onRemove={() => onRemoveContactPerson(idx)}
							canRemove={contactPersons.length > 1}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
