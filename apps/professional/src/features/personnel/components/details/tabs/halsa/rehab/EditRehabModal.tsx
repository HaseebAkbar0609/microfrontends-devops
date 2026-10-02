"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RehabData } from "@/features/personnel/types/halsa.types";
import { RehabUploadAndSpecs } from "./RehabUploadAndSpecs";

interface EditRehabModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: RehabData;
	onSave: (data: Partial<RehabData>) => void;
	onUploadDoc: (doc: { name: string; fileFormat: string; fileSize?: string }) => void;
	onDeleteDoc: (docId: string) => void;
	onPreviewDoc: (name: string) => void;
}

export function EditRehabModal({
	isOpen,
	onClose,
	initialData,
	onSave,
	onUploadDoc,
	onDeleteDoc,
	onPreviewDoc,
}: EditRehabModalProps) {
	const { t } = useTranslation();
	const [center, setCenter] = useState(initialData.center);
	const [area, setArea] = useState(initialData.areaForImprovement);
	const [startDate, setStartDate] = useState(initialData.startDate);
	const [returnDate, setReturnDate] = useState(initialData.estimatedReturnDate);
	const [capacity, setCapacity] = useState(initialData.capacityReturnWork);
	const [frequency, setFrequency] = useState(initialData.followUpFrequency);
	const [nextFollowup, setNextFollowup] = useState(initialData.nextFollowUpDate);

	useEffect(() => {
		if (isOpen) {
			setCenter(initialData.center);
			setArea(initialData.areaForImprovement);
			setStartDate(initialData.startDate);
			setReturnDate(initialData.estimatedReturnDate);
			setCapacity(initialData.capacityReturnWork);
			setFrequency(initialData.followUpFrequency);
			setNextFollowup(initialData.nextFollowUpDate);
		}
	}, [isOpen, initialData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			center,
			areaForImprovement: area,
			startDate,
			estimatedReturnDate: returnDate,
			capacityReturnWork: capacity,
			followUpFrequency: frequency,
			nextFollowUpDate: nextFollowup,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.rehabModalTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.rehabFieldCenter} />
						</Label>
						<Input value={center} onChange={(e) => setCenter(e.target.value)} className="h-9 text-xs" />
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.rehabFieldImprovement} />
						</Label>
						<Input value={area} onChange={(e) => setArea(e.target.value)} className="h-9 text-xs" />
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.rehabFieldStartDate} />
							</Label>
							<Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-xs" />
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.rehabFieldReturnDate} />
							</Label>
							<Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="h-9 text-xs" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.rehabFieldCapacity} />
							</Label>
							<Input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="50%" className="h-9 text-xs" />
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.rehabFieldFrequency} />
							</Label>
							<select
								value={frequency}
								onChange={(e) => setFrequency(e.target.value)}
								className="h-9 text-xs border border-slate-200 rounded-md px-2 bg-white text-slate-700 font-medium w-full cursor-pointer"
							>
								<option value={t(localizationConstants.rehabFrequencyEveryWeek)}>{t(localizationConstants.rehabFrequencyEveryWeek)}</option>
								<option value={t(localizationConstants.rehabFrequencyEveryTwoWeeks)}>{t(localizationConstants.rehabFrequencyEveryTwoWeeks)}</option>
								<option value={t(localizationConstants.rehabFrequencyMonthly)}>{t(localizationConstants.rehabFrequencyMonthly)}</option>
							</select>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.rehabFieldNextFollowup} />
						</Label>
						<Input type="date" value={nextFollowup} onChange={(e) => setNextFollowup(e.target.value)} className="h-9 text-xs" />
					</div>

					<RehabUploadAndSpecs
						documents={initialData.documents}
						onUploadDoc={onUploadDoc}
						onDeleteDoc={onDeleteDoc}
						onPreviewDoc={onPreviewDoc}
					/>

					<DialogFooter className="gap-2 pt-3">
						<Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs cursor-pointer">
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button type="submit" size="sm" className="h-9 text-xs bg-[#111721] hover:bg-slate-800 text-white cursor-pointer">
							<Translate text={localizationConstants.save} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
