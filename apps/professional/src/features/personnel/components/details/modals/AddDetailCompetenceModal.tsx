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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CompetenceDocItem } from "../../../types/createEmployee.types";

interface AddDetailCompetenceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (doc: Omit<CompetenceDocItem, "id">) => void;
}

export function AddDetailCompetenceModal({
	isOpen,
	onClose,
	onAdd,
}: AddDetailCompetenceModalProps) {
	const [name, setName] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [validity, setValidity] = useState("Tillsvidare");
	const [fileName, setFileName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onAdd({
			name: name.trim(),
			date,
			validity: validity.trim(),
			fileName: fileName.trim() || `${name.trim().replace(/\s+/g, "_")}.pdf`,
			fileType: fileName.endsWith(".doc") ? "doc" : "pdf",
		});
		setName("");
		setFileName("");
		setValidity("Tillsvidare");
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.addCompetenceBtn} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.colDocName} />
						</label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="t.ex. ID06 - Säkerhetskort, Heta Arbeten"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.colDate} />
							</label>
							<Input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.colValidity} />
							</label>
							<Input
								value={validity}
								onChange={(e) => setValidity(e.target.value)}
								className="h-8 text-xs bg-white"
								placeholder="Tillsvidare, 2028-12-31"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.colFile} /> (Filnamn)
						</label>
						<Input
							value={fileName}
							onChange={(e) => setFileName(e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="certifikat.pdf"
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
							<Translate text={localizationConstants.addCompetenceBtn} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
