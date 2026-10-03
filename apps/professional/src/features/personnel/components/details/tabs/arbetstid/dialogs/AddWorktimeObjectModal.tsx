"use client";

import React, { useState, useEffect } from "react";
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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WorktimeAllocationItem } from "@/features/personnel/types/worktime.types";

interface AddWorktimeObjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (item: Omit<WorktimeAllocationItem, "id">) => void;
}

export function AddWorktimeObjectModal({
	isOpen,
	onClose,
	onSave,
}: AddWorktimeObjectModalProps) {
	const [objectName, setObjectName] = useState("");
	const [regularHours, setRegularHours] = useState("8");
	const [otHours, setOtHours] = useState("0");
	const [ataNr, setAtaNr] = useState("");
	const [ataHours, setAtaHours] = useState("0");
	const [travelKm, setTravelKm] = useState("0");
	const [error, setError] = useState("");

	useEffect(() => {
		if (isOpen) {
			setObjectName("");
			setRegularHours("8");
			setOtHours("0");
			setAtaNr("");
			setAtaHours("0");
			setTravelKm("0");
			setError("");
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!objectName.trim()) {
			setError(localizationConstants.worktimeValidationRequired);
			return;
		}

		onSave({
			object: objectName.trim(),
			regularHours: parseFloat(regularHours) || 0,
			otHours: parseFloat(otHours) || 0,
			ataNr: ataNr.trim() || "N/A",
			ataHours: parseFloat(ataHours) || 0,
			travelKm: parseFloat(travelKm) || 0,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.worktimeModalAddObjectTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.worktimeModalObjectLabel} /> *
						</Label>
						<Input
							value={objectName}
							onChange={(e) => {
								setObjectName(e.target.value);
								if (error) setError("");
							}}
							placeholder={localizationConstants.worktimeModalObjectPlaceholder}
							className="h-9 text-xs"
						/>
						{error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.worktimeModalNormalLabel} />
							</Label>
							<Input
								type="number"
								step="0.5"
								min="0"
								value={regularHours}
								onChange={(e) => setRegularHours(e.target.value)}
								className="h-9 text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.worktimeModalOtLabel} />
							</Label>
							<Input
								type="number"
								step="0.5"
								min="0"
								value={otHours}
								onChange={(e) => setOtHours(e.target.value)}
								className="h-9 text-xs"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.worktimeModalAtaNrLabel} />
							</Label>
							<Input
								value={ataNr}
								onChange={(e) => setAtaNr(e.target.value)}
								placeholder={localizationConstants.worktimeModalAtaNrPlaceholder}
								className="h-9 text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.worktimeModalAtaHoursLabel} />
							</Label>
							<Input
								type="number"
								step="0.5"
								min="0"
								value={ataHours}
								onChange={(e) => setAtaHours(e.target.value)}
								className="h-9 text-xs"
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.worktimeModalTravelLabel} />
						</Label>
						<Input
							type="number"
							step="1"
							min="0"
							value={travelKm}
							onChange={(e) => setTravelKm(e.target.value)}
							className="h-9 text-xs"
						/>
					</div>

					<DialogFooter className="gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="h-9 text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							size="sm"
							className="h-9 text-xs bg-[#111721] hover:bg-slate-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.save} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
