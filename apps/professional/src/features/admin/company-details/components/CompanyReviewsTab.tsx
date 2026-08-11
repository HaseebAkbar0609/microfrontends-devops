"use client";

import { useState } from "react";
import { MessagesSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MONTH_KEYS } from "@/features/tools/diary/constants/mockData";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	ANSWERED_REVIEWS,
	CompanyReview,
	PENDING_REVIEWS,
	REPLY_PLACEHOLDER,
} from "../constants/reviewsMock";
import ReviewStars from "./ReviewStars";

const initials = (name: string) =>
	name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

const ReviewHeader = ({
	review,
	showChip,
	formatDate,
}: {
	review: CompanyReview;
	showChip: boolean;
	formatDate: (date: string) => string;
}) => (
	<>
		<div className="flex flex-wrap items-center justify-between gap-2">
			<div className="flex items-center gap-2">
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-700">
					{initials(review.reviewer)}
				</span>
				<span className="text-sm font-semibold text-slate-900">
					{review.reviewer}
				</span>
				{showChip && (
					<span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
						<Translate
							text={
								localizationConstants.companyReviewsLatestChip
							}
						/>
					</span>
				)}
			</div>
			<ReviewStars rating={review.rating} />
		</div>
		<p className="mt-1 text-right text-xs text-slate-400">
			{formatDate(review.date)}
		</p>
		<p className="text-sm text-slate-700">{review.text}</p>
		<div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
			<span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
				{initials(review.companyName)}
			</span>
			<span className="text-sm font-semibold text-slate-900">
				{review.companyName}
			</span>
		</div>
	</>
);

export function CompanyReviewsTab() {
	const t = useTranslate();
	// Static phase: reviews are UI state only until the backend exposes a
	// company-reviews endpoint.
	const [pending, setPending] = useState<CompanyReview[]>(PENDING_REVIEWS);
	const [answered, setAnswered] =
		useState<CompanyReview[]>(ANSWERED_REVIEWS);
	const [drafts, setDrafts] = useState<Record<string, string>>({});

	const formatDate = (date: string) => {
		const [, month, day] = date.split("-").map(Number);
		return `${day} ${t(MONTH_KEYS[month - 1]).toLowerCase()}`;
	};

	const handleSend = (review: CompanyReview) => {
		const replyText = drafts[review.id]?.trim() || REPLY_PLACEHOLDER;
		setPending((current) =>
			current.filter((item) => item.id !== review.id),
		);
		setAnswered((current) => [
			{ ...review, reply: { text: replyText, date: review.date } },
			...current,
		]);
		showToast("success", t(localizationConstants.companyReviewsSentToast));
	};

	const clearDraft = (reviewId: string) =>
		setDrafts((current) => ({ ...current, [reviewId]: "" }));

	// Static phase: the backend has no reviews endpoint yet, so Spara only
	// confirms the local UI state. When the API lands, replace this with a
	// mutation + error toast following the CompanyDetail.onSubmit pattern.
	const handleSavePage = () => {
		showToast("success", t(localizationConstants.profileUpdated));
	};

	return (
		<div className="flex min-h-[calc(100vh-320px)] flex-col gap-6">
			<section className="rounded-md border border-slate-200 bg-white">
				<div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
					<MessagesSquare size={22} className="text-slate-700" />
					<Translate
						text={localizationConstants.companyReviewsTitle}
					/>
				</div>

				<div className="flex flex-col gap-6 px-5 py-5">
					<div>
						<h3 className="mb-4 text-base font-semibold text-slate-500">
							<Translate
								text={
									localizationConstants.companyReviewsFromCustomers
								}
							/>
						</h3>
						<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
							{pending.map((review) => (
								<div
									key={review.id}
									className="rounded-md border border-slate-200 p-4"
								>
									<ReviewHeader
										review={review}
										showChip
										formatDate={formatDate}
									/>
									<Textarea
										value={drafts[review.id] ?? ""}
										onChange={(event) =>
											setDrafts((current) => ({
												...current,
												[review.id]:
													event.target.value,
											}))
										}
										rows={3}
										placeholder={REPLY_PLACEHOLDER}
										className="mt-3 border-slate-200 text-sm"
									/>
									<p className="mt-1 text-xs text-slate-400">
										<Translate
											text={
												localizationConstants.companyReviewsLeaveComment
											}
										/>
									</p>
									<div className="mt-3 flex justify-end gap-3">
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												clearDraft(review.id)
											}
											className="h-10 rounded-md border-slate-200 bg-slate-50 px-6 text-sm font-medium text-slate-900 hover:bg-slate-100"
										>
											<Translate
												text={
													localizationConstants.cancel
												}
											/>
										</Button>
										<Button
											type="button"
											onClick={() => handleSend(review)}
											className="h-10 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
										>
											<Translate
												text={
													localizationConstants.companyReviewsSend
												}
											/>
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="border-t border-slate-200 pt-5">
						<h3 className="mb-4 text-base font-semibold text-slate-500">
							<Translate
								text={
									localizationConstants.companyReviewsAnswered
								}
							/>
						</h3>
						<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
							{answered.map((review) => (
								<div
									key={review.id}
									className="rounded-md border border-slate-200 p-4"
								>
									<ReviewHeader
										review={review}
										showChip={false}
										formatDate={formatDate}
									/>
									{review.reply && (
										<div className="mt-2 flex items-start justify-between gap-3">
											<p className="text-sm text-slate-700">
												{review.reply.text}
											</p>
											<span className="shrink-0 text-xs text-slate-400">
												{formatDate(
													review.reply.date,
												)}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<div className="sticky bottom-0 mt-auto -mx-6 border-t border-slate-200 bg-slate-50 px-6 py-4">
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => setDrafts({})}
						className="w-[204px] border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSavePage}
						className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
					>
						<Save size={16} />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</div>
		</div>
	);
}
