"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getSalesCompanyHref } from "../../constants/salesNav";
import type { SalesCompany, SalesEmailTemplate } from "../../types";
import { PresentationEmailSection } from "./PresentationEmailSection";

type CustomerCardPanelProps = {
	company: SalesCompany | null;
	onLogCall: (company: SalesCompany, text: string) => void;
	onBookMeeting: (company: SalesCompany, meetingAt: string, text: string) => void;
	onSaveReminder: (company: SalesCompany, followUpAt: string, text: string) => void;
	templates: SalesEmailTemplate[];
	onSendPresentation: (company: SalesCompany, template: SalesEmailTemplate) => void;
};

/** Everything the booker does while the customer is on the phone. */
export function CustomerCardPanel({
	company,
	onLogCall,
	onBookMeeting,
	onSaveReminder,
	templates,
	onSendPresentation,
}: CustomerCardPanelProps) {
	const t = useTranslate();
	const [note, setNote] = useState("");
	const [meetingAt, setMeetingAt] = useState("");
	const [reminderAt, setReminderAt] = useState("");
	const [error, setError] = useState<string | null>(null);

	if (!company) {
		return (
			<section className="flex min-h-[220px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xs">
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.salesBookerCardEmpty} />
				</p>
			</section>
		);
	}

	const reset = () => {
		setNote("");
		setError(null);
	};

	const handleLogCall = () => {
		onLogCall(company, note);
		reset();
	};

	const handleBookMeeting = () => {
		if (!meetingAt) {
			setError(localizationConstants.salesBookerMeetingTimeRequired);
			return;
		}
		onBookMeeting(company, meetingAt, note);
		setMeetingAt("");
		reset();
	};

	const handleSaveReminder = () => {
		if (!reminderAt) {
			setError(localizationConstants.salesBookerReminderDateRequired);
			return;
		}
		onSaveReminder(company, reminderAt, note);
		setReminderAt("");
		reset();
	};

	return (
		<section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div>
				<h2 className="text-base font-semibold text-slate-900">{company.name}</h2>
				<p className="text-sm text-slate-500">
					{company.contactPerson}
					{company.contactPerson && company.mobile ? " · " : ""}
					{company.mobile && (
						<a className="hover:underline" href={`tel:${company.mobile}`}>
							{company.mobile}
						</a>
					)}
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					className="text-sm font-medium text-slate-700"
					htmlFor="booker-note"
				>
					<Translate text={localizationConstants.salesBookerNoteLabel} />
				</label>
				<Textarea
					id="booker-note"
					rows={3}
					value={note}
					onChange={(event) => setNote(event.target.value)}
					placeholder={t(localizationConstants.salesBookerNotePlaceholder)}
				/>
			</div>

			<Button
				type="button"
				variant="primary"
				className="h-10 active:scale-[0.98]"
				onClick={handleLogCall}
			>
				<Translate text={localizationConstants.salesBookerLogCallButton} />
			</Button>

			<div className="grid gap-3 border-t border-slate-200 pt-4 @lg:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700" htmlFor="booker-meeting">
						<Translate text={localizationConstants.salesBookerMeetingAtLabel} />
					</label>
					<Input
						id="booker-meeting"
						type="datetime-local"
						value={meetingAt}
						onChange={(event) => {
							setMeetingAt(event.target.value);
							setError(null);
						}}
					/>
					<Button
						type="button"
						variant="outline"
						className="h-10 active:scale-[0.98]"
						onClick={handleBookMeeting}
					>
						<Translate text={localizationConstants.salesBookerBookMeetingButton} />
					</Button>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700" htmlFor="booker-reminder">
						<Translate text={localizationConstants.salesBookerReminderAtLabel} />
					</label>
					<Input
						id="booker-reminder"
						type="date"
						value={reminderAt}
						onChange={(event) => {
							setReminderAt(event.target.value);
							setError(null);
						}}
					/>
					<Button
						type="button"
						variant="outline"
						className="h-10 active:scale-[0.98]"
						onClick={handleSaveReminder}
					>
						<Translate text={localizationConstants.salesBookerSaveReminderButton} />
					</Button>
				</div>
			</div>

			{error && (
				<p className="text-sm text-red-600">
					<Translate text={error} />
				</p>
			)}

			<PresentationEmailSection
				company={company}
				templates={templates}
				onSend={onSendPresentation}
			/>

			<Link
				href={getSalesCompanyHref(company.id)}
				className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:underline"
			>
				<ExternalLink className="h-4 w-4" />
				<Translate text={localizationConstants.salesBookerOpenFullCardLink} />
			</Link>
		</section>
	);
}
