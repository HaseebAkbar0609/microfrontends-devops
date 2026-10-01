"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Section1DetailsProps {
	checkInDate: string;
	onCheckInDateChange: (val: string) => void;
	checkInType: string;
	onCheckInTypeChange: (val: string) => void;
	manager: string;
	onManagerChange: (val: string) => void;
	employee: string;
	onEmployeeChange: (val: string) => void;
	errors?: { checkInDate?: boolean; checkInType?: boolean };
}

export function Section1Details({
	checkInDate,
	onCheckInDateChange,
	checkInType,
	onCheckInTypeChange,
	manager,
	onManagerChange,
	employee,
	onEmployeeChange,
	errors,
}: Section1DetailsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.nyIncheckningDateLabel} />{" "}
					<span className="text-rose-500">*</span>
				</Label>
				<Input
					type="date"
					value={checkInDate}
					onChange={(e) => onCheckInDateChange(e.target.value)}
					className={`h-9 text-xs ${errors?.checkInDate ? "border-rose-400 bg-rose-50/20" : ""}`}
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.nyIncheckningTypeLabel} />{" "}
					<span className="text-rose-500">*</span>
				</Label>
				<Input
					value={checkInType}
					onChange={(e) => onCheckInTypeChange(e.target.value)}
					placeholder="Avstämning / Årssamtal"
					className={`h-9 text-xs ${errors?.checkInType ? "border-rose-400 bg-rose-50/20" : ""}`}
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.nyIncheckningManagerLabel} />
				</Label>
				<Input
					value={manager}
					onChange={(e) => onManagerChange(e.target.value)}
					placeholder="Robert H"
					className="h-9 text-xs"
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.nyIncheckningEmployeeLabel} />
				</Label>
				<Input
					value={employee}
					onChange={(e) => onEmployeeChange(e.target.value)}
					placeholder="Mayur V"
					className="h-9 text-xs"
				/>
			</div>
		</div>
	);
}
