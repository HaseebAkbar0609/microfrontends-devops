"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmergencyContactItem } from "../../../types/createEmployee.types";

interface AddContactPersonModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (contact: Omit<EmergencyContactItem, "id">) => void;
}

export function AddContactPersonModal({
	isOpen,
	onClose,
	onAdd,
}: AddContactPersonModalProps) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [privateEmail, setPrivateEmail] = useState("");
	const [relation, setRelation] = useState("Fru");
	const [comment, setComment] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onAdd({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			mobileNumber: mobileNumber.trim(),
			privateEmail: privateEmail.trim(),
			relation: relation.trim(),
			comment: comment.trim(),
		});
		setFirstName("");
		setLastName("");
		setMobileNumber("");
		setPrivateEmail("");
		setRelation("Fru");
		setComment("");
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalAddEmergencyContactTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldFirstName} />
							</label>
							<Input
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="h-8 text-xs bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldLastName} />
							</label>
							<Input
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="h-8 text-xs bg-white"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldMobile} />
							</label>
							<Input
								value={mobileNumber}
								onChange={(e) => setMobileNumber(e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldPrivateEmail} />
							</label>
							<Input
								type="email"
								value={privateEmail}
								onChange={(e) => setPrivateEmail(e.target.value)}
								className="h-8 text-xs bg-white"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldRelation} />
						</label>
						<Input
							value={relation}
							onChange={(e) => setRelation(e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="Fru, Make, Far, Mor..."
							required
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldComment} />
						</label>
						<Textarea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={3}
							className="text-xs bg-white resize-none"
						/>
					</div>

					<DialogFooter className="pt-3 border-t border-slate-100 flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="h-8 px-4 text-xs"
						>
							<Translate text={localizationConstants.btnCancelCard} />
						</Button>
						<Button
							type="submit"
							size="sm"
							className="h-8 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white shadow-2xs"
						>
							<Translate text={localizationConstants.addContactPersonBtn} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
