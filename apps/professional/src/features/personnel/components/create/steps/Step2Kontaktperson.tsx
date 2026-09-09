"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Plus, Info } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { EmergencyContactItem } from "@/features/personnel/types/createEmployee.types";
import { EmergencyContactCard } from "./step2/EmergencyContactCard";

interface Step2KontaktpersonProps {
	contacts: EmergencyContactItem[];
	onAddContact: () => void;
	onRemoveContact: (id: string) => void;
	onUpdateContact: (id: string, field: keyof EmergencyContactItem, value: string) => void;
}

export function Step2Kontaktperson({
	contacts,
	onAddContact,
	onRemoveContact,
	onUpdateContact,
}: Step2KontaktpersonProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-6">
			{/* Top Bar with Add Button */}
			<div className="flex items-center justify-end">
				<Button
					type="button"
					onClick={onAddContact}
					className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-medium flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					{t(localizationConstants.addContactPersonBtn)}
				</Button>
			</div>

			{/* Info Box */}
			<div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
				<div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shrink-0">
					<Info className="h-5 w-5" />
				</div>
				<div>
					<h3 className="text-sm font-semibold text-slate-900 mb-1">
						{t(localizationConstants.contactInfoWhyTitle)}
					</h3>
					<p className="text-sm text-slate-600 leading-relaxed">
						{t(localizationConstants.contactInfoWhyText)}
					</p>
				</div>
			</div>

			{/* List of Contact Cards */}
			<div className="space-y-6">
				{contacts.map((contact, index) => (
					<EmergencyContactCard
						key={contact.id}
						contact={contact}
						index={index}
						canDelete={contacts.length > 1}
						onChange={onUpdateContact}
						onDelete={onRemoveContact}
					/>
				))}
			</div>
		</div>
	);
}
