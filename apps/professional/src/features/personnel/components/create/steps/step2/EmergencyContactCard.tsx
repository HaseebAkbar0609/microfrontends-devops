"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EmergencyContactItem } from "@/features/personnel/types/createEmployee.types";
import { RELATION_OPTIONS } from "@/features/personnel/constants/createEmployee.constants";

interface EmergencyContactCardProps {
	contact: EmergencyContactItem;
	index: number;
	canDelete: boolean;
	onChange: (id: string, field: keyof EmergencyContactItem, value: string) => void;
	onDelete: (id: string) => void;
}

export function EmergencyContactCard({
	contact,
	index,
	canDelete,
	onChange,
	onDelete,
}: EmergencyContactCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<div className="flex items-center justify-between mb-5">
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionContactPerson)} {index + 1}
				</h2>
				{canDelete && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onDelete(contact.id)}
						className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 h-auto"
						aria-label={`${t(localizationConstants.btnCancel)} ${contact.firstName || ""}`}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{/* Row 1 */}
				<div>
					<Label htmlFor={`contact-first-${contact.id}`} className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldFirstName)}
					</Label>
					<Input
						id={`contact-first-${contact.id}`}
						value={contact.firstName}
						onChange={(e) => onChange(contact.id, "firstName", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor={`contact-last-${contact.id}`} className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldLastName)}
					</Label>
					<Input
						id={`contact-last-${contact.id}`}
						value={contact.lastName}
						onChange={(e) => onChange(contact.id, "lastName", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor={`contact-mobile-${contact.id}`} className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldMobile)}
					</Label>
					<Input
						id={`contact-mobile-${contact.id}`}
						type="tel"
						value={contact.mobileNumber}
						onChange={(e) => onChange(contact.id, "mobileNumber", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				{/* Row 2 */}
				<div>
					<Label htmlFor={`contact-email-${contact.id}`} className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldPrivateEmail)}
					</Label>
					<Input
						id={`contact-email-${contact.id}`}
						type="email"
						value={contact.privateEmail}
						onChange={(e) => onChange(contact.id, "privateEmail", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor={`contact-rel-${contact.id}`} className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldRelation)}
					</Label>
					<Select
						value={contact.relation}
						onValueChange={(val) => onChange(contact.id, "relation", val)}
					>
						<SelectTrigger id={`contact-rel-${contact.id}`} className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldRelation)} />
						</SelectTrigger>
						<SelectContent>
							{RELATION_OPTIONS.map((rel) => (
								<SelectItem key={rel} value={rel}>
									{rel}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor={`contact-comm-${contact.id}`} className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldComment)}
					</Label>
					<Input
						id={`contact-comm-${contact.id}`}
						value={contact.comment}
						onChange={(e) => onChange(contact.id, "comment", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>
			</div>
		</section>
	);
}
