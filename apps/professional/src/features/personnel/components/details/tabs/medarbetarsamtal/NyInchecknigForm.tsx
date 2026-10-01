"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	NyIncheckningFormData,
	ReviewFeeling,
	ReviewFollowupAction,
	ReviewDocumentItem,
} from "../../../../types/medarbetarsamtal.types";

import { Section1Details } from "./form/Section1Details";
import { Section2Work } from "./form/Section2Work";
import { Section3Goals } from "./form/Section3Goals";
import { Section4Wellbeing } from "./form/Section4Wellbeing";
import { Section5Feedback } from "./form/Section5Feedback";
import { Section6Followups } from "./form/Section6Followups";
import { Section7Documents } from "./form/Section7Documents";

interface NyInchecknigFormProps {
	onSave: (data: NyIncheckningFormData) => void;
	onCancel: () => void;
	onPreviewDoc?: (name: string) => void;
}

export function NyInchecknigForm({
	onSave,
	onCancel,
	onPreviewDoc,
}: NyInchecknigFormProps) {
	// Section collapse state (default section 1 open)
	const [openSections, setOpenSections] = useState<Record<number, boolean>>({
		1: true,
		2: true,
		3: true,
		4: true,
		5: true,
		6: true,
		7: true,
	});

	const toggleSection = (num: number) => {
		setOpenSections((prev) => ({ ...prev, [num]: !prev[num] }));
	};

	// Form state
	// Form state - Clean empty initialization adhering to Gate 3 standards
	const [checkInDate, setCheckInDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [checkInType, setCheckInType] = useState("");
	const [manager, setManager] = useState("");
	const [employee, setEmployee] = useState("");

	const [jobTitle, setJobTitle] = useState("");
	const [currentStatus, setCurrentStatus] = useState("");
	const [worksWell, setWorksWell] = useState("");
	const [challenging, setChallenging] = useState("");

	const [rightPlace, setRightPlace] = useState(true);
	const [progress, setProgress] = useState("");
	const [skillsToDevelop, setSkillsToDevelop] = useState("");
	const [needsTrainingSupport, setNeedsTrainingSupport] = useState(false);

	const [overallFeeling, setOverallFeeling] =
		useState<ReviewFeeling>("positiv");
	const [feelingChangedDate, setFeelingChangedDate] = useState("");
	const [negativeImpactNotes, setNegativeImpactNotes] = useState("");

	const [managerFeedback, setManagerFeedback] = useState("");
	const [employeeFeedback, setEmployeeFeedback] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");

	const [followups, setFollowups] = useState<ReviewFollowupAction[]>([]);
	const [nextCheckInDate, setNextCheckInDate] = useState("");

	const [uploadedChips, setUploadedChips] = useState<string[]>([]);
	const [documents, setDocuments] = useState<ReviewDocumentItem[]>([]);

	const [errors, setErrors] = useState<Record<string, boolean>>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: Record<string, boolean> = {};
		if (!checkInDate) newErrors.checkInDate = true;
		if (!checkInType.trim()) newErrors.checkInType = true;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setOpenSections((prev) => ({ ...prev, 1: true }));
			return;
		}

		const participants = [manager, employee].filter(Boolean).join(", ") || "—";

		onSave({
			date: checkInDate,
			protocolTitle: `Medarbetarsamtal ${checkInDate} - ${checkInType}`,
			person: participants,
			feeling: overallFeeling,
			checkInDate,
			checkInType,
			manager,
			employee,
			jobTitle,
			currentStatus,
			worksWell,
			challenging,
			rightPlace,
			progress,
			skillsToDevelop,
			needsTrainingSupport,
			overallFeeling,
			feelingChangedDate,
			negativeImpactNotes,
			managerFeedback,
			employeeFeedback,
			additionalNotes,
			followups,
			nextCheckInDate,
			documents,
		});
	};

	const sectionTitles: Record<number, string> = {
		1: localizationConstants.nyIncheckningSectionFeeling,
		2: localizationConstants.nyIncheckningSectionWork,
		3: localizationConstants.nyIncheckningSectionGoals,
		4: localizationConstants.nyIncheckningSectionWellbeing,
		5: localizationConstants.nyIncheckningSectionFeedback,
		6: localizationConstants.nyIncheckningSectionActions,
		7: localizationConstants.nyIncheckningSectionProtocol,
	};

	return (
		<div className="space-y-6">
			{/* Top Header */}
			<div className="space-y-1">
				<button
					type="button"
					onClick={onCancel}
					className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.nyIncheckningTitle} />
				</button>
				<p className="text-xs text-slate-400">
					<Translate text={localizationConstants.nyIncheckningSubtitle} />
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* 1. Detaljer */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(1)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[1]} />
						</span>
						{openSections[1] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[1] && (
						<div className="p-5 border-t border-slate-100">
							<Section1Details
								checkInDate={checkInDate}
								onCheckInDateChange={setCheckInDate}
								checkInType={checkInType}
								onCheckInTypeChange={setCheckInType}
								manager={manager}
								onManagerChange={setManager}
								employee={employee}
								onEmployeeChange={setEmployee}
								errors={errors}
							/>
						</div>
					)}
				</div>

				{/* 2. Arbete & Roll */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(2)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[2]} />
						</span>
						{openSections[2] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[2] && (
						<div className="p-5 border-t border-slate-100">
							<Section2Work
								jobTitle={jobTitle}
								onJobTitleChange={setJobTitle}
								currentStatus={currentStatus}
								onCurrentStatusChange={setCurrentStatus}
								worksWell={worksWell}
								onWorksWellChange={setWorksWell}
								challenging={challenging}
								onChallengingChange={setChallenging}
							/>
						</div>
					)}
				</div>

				{/* 3. Mål & Utveckling */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(3)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[3]} />
						</span>
						{openSections[3] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[3] && (
						<div className="p-5 border-t border-slate-100">
							<Section3Goals
								rightPlace={rightPlace}
								onRightPlaceChange={setRightPlace}
								progress={progress}
								onProgressChange={setProgress}
								skillsToDevelop={skillsToDevelop}
								onSkillsToDevelopChange={setSkillsToDevelop}
								needsTrainingSupport={needsTrainingSupport}
								onNeedsTrainingSupportChange={setNeedsTrainingSupport}
							/>
						</div>
					)}
				</div>

				{/* 4. Välbefinnande & Engagemang */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(4)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[4]} />
						</span>
						{openSections[4] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[4] && (
						<div className="p-5 border-t border-slate-100">
							<Section4Wellbeing
								overallFeeling={overallFeeling}
								onOverallFeelingChange={setOverallFeeling}
								feelingChangedDate={feelingChangedDate}
								onFeelingChangedDateChange={setFeelingChangedDate}
								negativeImpactNotes={negativeImpactNotes}
								onNegativeImpactNotesChange={setNegativeImpactNotes}
							/>
						</div>
					)}
				</div>

				{/* 5. Feedback & Dialog */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(5)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[5]} />
						</span>
						{openSections[5] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[5] && (
						<div className="p-5 border-t border-slate-100">
							<Section5Feedback
								managerFeedback={managerFeedback}
								onManagerFeedbackChange={setManagerFeedback}
								employeeFeedback={employeeFeedback}
								onEmployeeFeedbackChange={setEmployeeFeedback}
								additionalNotes={additionalNotes}
								onAdditionalNotesChange={setAdditionalNotes}
							/>
						</div>
					)}
				</div>

				{/* 6. Åtgärder & Uppföljningar */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(6)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[6]} />
						</span>
						{openSections[6] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[6] && (
						<div className="p-5 border-t border-slate-100">
							<Section6Followups
								followups={followups}
								onFollowupsChange={setFollowups}
								nextCheckInDate={nextCheckInDate}
								onNextCheckInDateChange={setNextCheckInDate}
							/>
						</div>
					)}
				</div>

				{/* 7. Protokoll dokument */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
					<button
						type="button"
						onClick={() => toggleSection(7)}
						className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
					>
						<span>
							<Translate text={sectionTitles[7]} />
						</span>
						{openSections[7] ? (
							<ChevronUp className="h-4 w-4 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-400" />
						)}
					</button>
					{openSections[7] && (
						<div className="p-5 border-t border-slate-100">
							<Section7Documents
								documents={documents}
								onDocumentsChange={setDocuments}
								uploadedChips={uploadedChips}
								onUploadedChipsChange={setUploadedChips}
								onPreviewDoc={onPreviewDoc}
							/>
						</div>
					)}
				</div>

				{/* Footer Buttons */}
				<div className="flex items-center gap-3 pt-3">
					<Button
						type="submit"
						className="h-10 px-6 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs"
					>
						<Translate text={localizationConstants.nyIncheckningBtnSave} />
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						className="h-10 px-6 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
					>
						<Translate text={localizationConstants.nyIncheckningBtnCancel} />
					</Button>
				</div>
			</form>
		</div>
	);
}
