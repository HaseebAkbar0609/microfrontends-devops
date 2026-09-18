"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CreateCustomerFormData,
	CustomerContactPerson,
} from "../../../../types/createCustomer.types";
import { ContactPersonCard } from "../sections/ContactPersonCard";

interface Step2ContactProps {
	form: UseFormReturn<CreateCustomerFormData>;
	contactPersons: CustomerContactPerson[];
	onAddContactPerson: () => void;
	onRemoveContactPerson: (id: string) => void;
	onUpdateContactPerson: (id: string, updates: Partial<CustomerContactPerson>) => void;
}

export function Step2Contact({
	form,
	contactPersons,
	onAddContactPerson,
	onRemoveContactPerson,
	onUpdateContactPerson,
}: Step2ContactProps) {
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div className="space-y-6">
			{/* Card 1: Allmän Kontaktinformation */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.contactSection} />
				</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.phoneLabel} /> *
						</label>
						<Input
							{...register("phone")}
							placeholder="070-510 10 00"
							className={`h-10 text-xs ${errors.phone ? "border-rose-500" : ""}`}
						/>
						{errors.phone && (
							<p className="text-[11px] text-rose-500">
								<Translate text={errors.phone.message || ""} />
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.emailLabel} /> *
						</label>
						<Input
							type="email"
							{...register("email")}
							placeholder="info@kund.se"
							className={`h-10 text-xs ${errors.email ? "border-rose-500" : ""}`}
						/>
						{errors.email && (
							<p className="text-[11px] text-rose-500">
								<Translate text={errors.email.message || ""} />
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.websiteLabel} />
						</label>
						<Input {...register("website")} placeholder="www.kund.se" className="h-10 text-xs" />
					</div>

					<div className="space-y-1.5 sm:col-span-2">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.notesLabel} />
						</label>
						<Textarea
							{...register("contactNotes")}
							placeholder="Anteckningar om kundens kontaktpersoner..."
							className="text-xs min-h-[80px]"
						/>
					</div>
				</div>
			</div>

			{/* Card 2: Kontaktpersoner */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-bold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.contactPersonsSection} />
						</h3>
						<p className="text-xs text-slate-500 mt-0.5">
							Hantera nyckelpersoner och roller hos kunden
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onAddContactPerson}
						className="h-9 px-4 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 cursor-pointer"
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.addContactButton} />
					</Button>
				</div>

				<div className="space-y-4">
					{contactPersons.map((person, idx) => (
						<ContactPersonCard
							key={person.id}
							index={idx}
							person={person}
							onChange={(updated) => onUpdateContactPerson(person.id, updated)}
							onRemove={() => onRemoveContactPerson(person.id)}
							canRemove={contactPersons.length > 1}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
