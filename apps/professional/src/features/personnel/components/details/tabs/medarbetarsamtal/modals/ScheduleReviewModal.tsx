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
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ScheduleReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSchedule: (data: {
		date: string;
		type: string;
		manager: string;
		notes?: string;
	}) => void;
}

export function ScheduleReviewModal({
	isOpen,
	onClose,
	onSchedule,
}: ScheduleReviewModalProps) {
	const [date, setDate] = useState("");
	const [type, setType] = useState("");
	const [manager, setManager] = useState("");
	const [notes, setNotes] = useState("");
	const [errors, setErrors] = useState<{ date?: boolean; type?: boolean }>({});

	const handleReset = () => {
		setDate("");
		setType("");
		setManager("");
		setNotes("");
		setErrors({});
	};

	const handleClose = () => {
		handleReset();
		onClose();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: { date?: boolean; type?: boolean } = {};
		if (!date) newErrors.date = true;
		if (!type.trim()) newErrors.type = true;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		onSchedule({
			date,
			type: type.trim(),
			manager: manager.trim(),
			notes: notes.trim(),
		});

		handleClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-6">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-1">
						<div className="p-2 rounded-lg bg-slate-100 text-slate-800">
							<Calendar className="w-5 h-5" />
						</div>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.scheduleReviewModalTitle} />
						</DialogTitle>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.scheduleReviewModalDate} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Input
							type="date"
							value={date}
							onChange={(e) => {
								setDate(e.target.value);
								if (errors.date) setErrors((prev) => ({ ...prev, date: false }));
							}}
							className={`h-9 text-xs bg-white ${errors.date ? "border-rose-400 bg-rose-50/20" : "border-slate-200"}`}
						/>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.scheduleReviewModalType} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Input
							value={type}
							onChange={(e) => {
								setType(e.target.value);
								if (errors.type) setErrors((prev) => ({ ...prev, type: false }));
							}}
							placeholder="Avstämning / Årssamtal"
							className={`h-9 text-xs bg-white ${errors.type ? "border-rose-400 bg-rose-50/20" : "border-slate-200"}`}
						/>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.scheduleReviewModalManager} />
						</Label>
						<Input
							value={manager}
							onChange={(e) => setManager(e.target.value)}
							placeholder="Robert H"
							className="h-9 text-xs bg-white border-slate-200"
						/>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.scheduleReviewModalNotes} />
						</Label>
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Agenda för samtalet..."
							className="text-xs bg-white border-slate-200 min-h-[70px] resize-y"
						/>
					</div>

					<DialogFooter className="gap-2 sm:gap-0 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							className="h-9 px-4 text-xs font-medium border-slate-200 hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.scheduleReviewModalBtnCancel} />
						</Button>
						<Button
							type="submit"
							className="h-9 px-4 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs"
						>
							<Translate text={localizationConstants.scheduleReviewModalBtnSubmit} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
