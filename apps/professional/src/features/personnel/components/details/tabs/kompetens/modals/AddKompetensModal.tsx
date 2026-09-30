"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	CompetenceItem,
	CompetenceSpecDoc,
	CreateCompetenceFormData,
} from "@/features/personnel/types/competence.types";
import { KompetensUploadAndSpecs } from "./KompetensUploadAndSpecs";

interface AddKompetensModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: CreateCompetenceFormData) => void;
	initialData?: CompetenceItem | null;
}

const TRAINING_OPTIONS = [
	"Byggutbildning 3åring",
	"Heta arbeten kurs 1",
	"Högjöds kurs BAS 1",
	"HLR-utbildning - Grundkurs",
	"Ställningsbyggnad",
	"Annan utbildning",
];

export function AddKompetensModal({
	isOpen,
	onClose,
	onSave,
	initialData,
}: AddKompetensModalProps) {
	const { t } = useTranslation();

	const [name, setName] = useState("");
	const [certNo, setCertNo] = useState("");
	const [training, setTraining] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [uploadedChips, setUploadedChips] = useState<string[]>([]);
	const [specs, setSpecs] = useState<CompetenceSpecDoc[]>([]);
	const [errors, setErrors] = useState<Record<string, boolean>>({});

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setName(initialData.name);
				setCertNo(initialData.certNo === "—" ? "" : initialData.certNo);
				setTraining(initialData.training);
				setExpiryDate(initialData.expiryDate);
				setSpecs(initialData.specifications || []);
				setUploadedChips(
					(initialData.specifications || []).map(
						(s: CompetenceSpecDoc) => s.fileName || `${s.name}.pdf`
					)
				);
			} else {
				// Clean Form Reset - Gate 3 standard
				setName("");
				setCertNo("");
				setTraining("");
				setExpiryDate("");
				setUploadedChips([]);
				setSpecs([]);
			}
			setErrors({});
		}
	}, [isOpen, initialData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: Record<string, boolean> = {};
		if (!name.trim()) newErrors.name = true;
		if (!training.trim()) newErrors.training = true;
		if (!expiryDate.trim()) newErrors.expiryDate = true;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		onSave({
			name: name.trim(),
			certNo: certNo.trim() || "—",
			training: training.trim(),
			expiryDate: expiryDate.trim(),
			specifications: specs,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-white">
				<DialogHeader className="px-6 pt-6 pb-2">
					<DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-900">
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
							<User className="h-4 w-4" />
						</div>
						<Translate
							text={
								initialData
									? localizationConstants.kompetensDetailEdit
									: localizationConstants.kompetensModalTitle
							}
						/>
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="px-6 py-2 space-y-4">
					{/* 1. Kompetens */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.kompetensModalNameLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Input
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
							}}
							placeholder={t(localizationConstants.kompetensModalNamePlaceholder)}
							className={`h-9 text-xs ${errors.name ? "border-rose-400 bg-rose-50/20" : ""}`}
						/>
					</div>

					{/* 2. Certifikation nummer */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.kompetensModalCertLabel} />
						</Label>
						<Input
							value={certNo}
							onChange={(e) => setCertNo(e.target.value)}
							placeholder={t(localizationConstants.kompetensModalCertPlaceholder)}
							className="h-9 text-xs"
						/>
					</div>

					{/* 3. Utbildning */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.kompetensModalTrainingLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Select
							value={training}
							onValueChange={(val) => {
								setTraining(val);
								if (errors.training) setErrors((prev) => ({ ...prev, training: false }));
							}}
						>
							<SelectTrigger
								className={`h-9 text-xs ${errors.training ? "border-rose-400 bg-rose-50/20" : ""}`}
							>
								<SelectValue
									placeholder={
										<Translate
											text={localizationConstants.kompetensModalTrainingSelect}
										/>
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{TRAINING_OPTIONS.map((opt) => (
									<SelectItem key={opt} value={opt} className="text-xs">
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* 4. Förnyas */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.kompetensModalExpiryLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Input
							type="date"
							value={expiryDate}
							onChange={(e) => {
								setExpiryDate(e.target.value);
								if (errors.expiryDate)
									setErrors((prev) => ({ ...prev, expiryDate: false }));
							}}
							className={`h-9 text-xs ${errors.expiryDate ? "border-rose-400 bg-rose-50/20" : ""}`}
						/>
					</div>

					{/* 5 & 6. Upload and Specifications Subcomponent */}
					<KompetensUploadAndSpecs
						uploadedChips={uploadedChips}
						onUploadedChipsChange={setUploadedChips}
						specs={specs}
						onSpecsChange={setSpecs}
					/>

					<DialogFooter className="pt-3 pb-4 gap-2">
						<Button
							type="submit"
							className="h-9 px-5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.btnSaveChanges} />
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="h-9 px-4 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.nyIncheckningBtnCancel} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
