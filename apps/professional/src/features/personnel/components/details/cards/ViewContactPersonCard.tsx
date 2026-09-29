"use client";

import React from "react";
import { User, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmergencyContactItem } from "../../../types/createEmployee.types";

interface ViewContactPersonCardProps {
	contact: EmergencyContactItem;
	canDelete: boolean;
	onEdit: (contact: EmergencyContactItem) => void;
	onDelete: (id: string) => void;
}

export function ViewContactPersonCard({
	contact,
	canDelete,
	onEdit,
	onDelete,
}: ViewContactPersonCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
			{/* Card Header */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
						<User className="w-4 h-4" />
					</div>
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.sectionContactPerson} />
					</h2>
				</div>

				<div className="flex items-center gap-1.5">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onEdit(contact)}
						className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 rounded-md cursor-pointer shadow-2xs gap-1.5"
					>
						<Pencil className="w-3.5 h-3.5 text-slate-500" />
						<Translate text={localizationConstants.btnEditCard} />
					</Button>

					{canDelete && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onDelete(contact.id)}
							className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
					)}
				</div>
			</div>

			{/* Card Body Key-Value Grid matching Screenshot 3 */}
			<div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldFirstName} />
					</span>
					<span className="font-medium text-slate-900 text-sm">
						{contact.firstName || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldLastName} />
					</span>
					<span className="font-medium text-slate-900 text-sm">
						{contact.lastName || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldMobile} />
					</span>
					<span className="font-mono font-medium text-slate-900">
						{contact.mobileNumber || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldPrivateEmail} />
					</span>
					<span className="font-medium text-slate-900">
						{contact.privateEmail || "—"}
					</span>
				</div>

				<div className="sm:col-span-2">
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldRelation} />
					</span>
					<span className="font-medium text-slate-900">
						{contact.relation || "—"}
					</span>
				</div>

				<div className="sm:col-span-2">
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldComment} />
					</span>
					<p className="text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
						{contact.comment || "—"}
					</p>
				</div>
			</div>
		</div>
	);
}
