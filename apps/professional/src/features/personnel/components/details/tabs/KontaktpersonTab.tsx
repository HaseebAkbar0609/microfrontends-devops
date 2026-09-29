"use client";

import React from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmergencyContactItem } from "../../../types/createEmployee.types";
import { ViewContactPersonCard } from "../cards/ViewContactPersonCard";

interface KontaktpersonTabProps {
	contacts: EmergencyContactItem[];
	onAddContact: () => void;
	onEditContact: (contact: EmergencyContactItem) => void;
	onDeleteContact: (id: string) => void;
}

export function KontaktpersonTab({
	contacts,
	onAddContact,
	onEditContact,
	onDeleteContact,
}: KontaktpersonTabProps) {
	return (
		<div className="space-y-6">
			{/* Top Bar with Add Button */}
			<div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-2xs">
				<div>
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.personnelProfileTabContactPerson} />
					</h2>
					<p className="text-xs text-slate-500">
						Hantera anhöriga och kontaktpersoner vid nödsituationer
					</p>
				</div>

				<Button
					type="button"
					onClick={onAddContact}
					className="bg-[#111721] hover:bg-slate-800 text-white text-xs h-8 px-3.5 rounded-lg cursor-pointer shadow-2xs gap-1.5"
				>
					<Plus className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.addContactPersonBtn} />
				</Button>
			</div>

			{/* Contact Cards Grid matching Screenshot 3 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{contacts.map((contact) => (
					<ViewContactPersonCard
						key={contact.id}
						contact={contact}
						canDelete={contacts.length > 1}
						onEdit={onEditContact}
						onDelete={onDeleteContact}
					/>
				))}
			</div>

			{contacts.length === 0 && (
				<div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
					<div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
						<Users className="w-6 h-6" />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.emptyContactsTitle} />
						</h3>
						<p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
							<Translate text={localizationConstants.emptyContactsDesc} />
						</p>
					</div>
					<Button
						type="button"
						onClick={onAddContact}
						className="bg-[#111721] hover:bg-slate-800 text-white text-xs h-8 px-4 rounded-lg cursor-pointer shadow-2xs gap-1.5 mt-2"
					>
						<Plus className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.addContactPersonBtn} />
					</Button>
				</div>
			)}
		</div>
	);
}
