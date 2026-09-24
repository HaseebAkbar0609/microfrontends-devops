"use client";

import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MONTH_KEYS } from "@/features/tools/diary/constants/mockData";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CompanyReview } from "../types";
import { useReplyToReview, useReviews } from "../hooks/useCompanyInformation";
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
	formatDate: (date: number) => string;
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
	</>
);

export function CompanyReviewsTab() {
	const t = useTranslate();
	const reviewsQuery = useReviews();
	const replyToReview = useReplyToReview();
	const [drafts, setDrafts] = useState<Record<string, string>>({});

	const reviews: CompanyReview[] = reviewsQuery.data ?? [];
	const pending = reviews.filter((review) => !review.reply);
	const answered = reviews.filter((review) => review.reply);

	const formatDate = (date: number) => {
		if (!date) return "";
		const parsed = new Date(date);
		return `${parsed.getDate()} ${t(
			MONTH_KEYS[parsed.getMonth()],
		).toLowerCase()}`;
	};

	const handleSend = async (review: CompanyReview) => {
		const replyText = drafts[review.id]?.trim();
		if (!replyText) return;
		try {
			await replyToReview.mutateAsync({ id: review.id, reply: replyText });
			clearDraft(review.id);
			showToast("success", t(localizationConstants.companyReviewsSentToast));
		} catch (_error) {
			showToast("error", t(localizationConstants.profileUpdateFailed));
		}
	};

	const clearDraft = (reviewId: string) =>
		setDrafts((current) => ({ ...current, [reviewId]: "" }));

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
											disabled={
												replyToReview.isPending ||
												!drafts[review.id]?.trim()
											}
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
		</div>
	);
}
