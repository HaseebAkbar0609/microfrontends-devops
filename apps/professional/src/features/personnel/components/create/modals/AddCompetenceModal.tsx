"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompetenceDocItem } from "@/features/personnel/types/createEmployee.types";

interface AddCompetenceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (doc: Omit<CompetenceDocItem, "id">) => void;
}

export function AddCompetenceModal({
	isOpen,
	onClose,
	onAdd,
}: AddCompetenceModalProps) {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [validity, setValidity] = useState("2027-01-01");
	const [fileName, setFileName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		onAdd({
			name: name.trim(),
			date,
			validity,
			fileName: fileName.trim() || `${name.trim().toLowerCase().replace(/\s+/g, "_")}.pdf`,
			fileType: "PDF",
		});

		setName("");
		setFileName("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-base font-semibold text-slate-900">
						{t(localizationConstants.addCompetenceBtn)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 mt-3">
					<div>
						<Label htmlFor="cmpDocName" className="text-xs font-medium text-slate-600 mb-1.5 block">
							{t(localizationConstants.colDocName)}
						</Label>
						<Input
							id="cmpDocName"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="cmpDate" className="text-xs font-medium text-slate-600 mb-1.5 block">
								{t(localizationConstants.colDate)}
							</Label>
							<Input
								id="cmpDate"
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
							/>
						</div>

						<div>
							<Label htmlFor="cmpValidity" className="text-xs font-medium text-slate-600 mb-1.5 block">
								{t(localizationConstants.colValidity)}
							</Label>
							<Input
								id="cmpValidity"
								type="date"
								value={validity}
								onChange={(e) => setValidity(e.target.value)}
								className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="cmpFileName" className="text-xs font-medium text-slate-600 mb-1.5 block">
							{t(localizationConstants.colFile)}
						</Label>
						<Input
							id="cmpFileName"
							value={fileName}
							onChange={(e) => setFileName(e.target.value)}
							placeholder="Document.pdf"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						/>
					</div>

					<DialogFooter className="mt-6 flex flex-row justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="border-slate-200 text-slate-700"
						>
							{t(localizationConstants.btnCancel)}
						</Button>
						<Button
							type="submit"
							className="bg-slate-900 text-white hover:bg-slate-800"
						>
							{t(localizationConstants.btnSave)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
