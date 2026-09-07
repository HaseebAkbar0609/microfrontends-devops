"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useContentSections } from "../../hooks/useContentSections";
import type { ContentGroupId, GuideEntry } from "../../types";
import { pickCountKey } from "../../utils/countLabel";
import { MediaInput } from "../MediaInput";

type GuideEntryCardProps = {
	groupId: ContentGroupId;
	categoryId: string;
	subcategoryId: string;
	entry: GuideEntry;
	/** Workspace guides carry a video per entry; customer guides do not. */
	allowVideo: boolean;
};

/** Level three of the guide tree: one explanation with its media. */
export function GuideEntryCard({
	groupId,
	categoryId,
	subcategoryId,
	entry,
	allowVideo,
}: GuideEntryCardProps) {
	const { updateEntry, removeEntry } = useContentSections();
	const t = useTranslate();

	const patch = (values: Partial<GuideEntry>) =>
		updateEntry(groupId, categoryId, subcategoryId, entry.id, values);

	const count = (
		total: number,
		singular: TranslationKeys,
		plural: TranslationKeys,
	) => `${total} ${t(pickCountKey(total, singular, plural))}`;

	const counts = [
		count(
			entry.images.length,
			localizationConstants.contentImageSuffixSingular,
			localizationConstants.contentImagesSuffix,
		),
		count(
			entry.screenshots.length,
			localizationConstants.contentScreenshotSuffixSingular,
			localizationConstants.contentScreenshotsSuffix,
		),
		...(allowVideo
			? [
					count(
						entry.video.length,
						localizationConstants.contentVideoSuffixSingular,
						localizationConstants.contentVideoSuffix,
					),
				]
			: []),
	].join(" · ");

	return (
		<div className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
			<div className="flex items-center gap-2">
				<Input
					value={entry.title}
					aria-label={t(localizationConstants.contentEntryTitleLabel)}
					placeholder={t(localizationConstants.contentEntryTitlePlaceholder)}
					onChange={(event) => patch({ title: event.target.value })}
				/>
				<ConfirmDialog
					title={t(localizationConstants.contentConfirmDeleteTitle)}
					description={t(localizationConstants.contentConfirmDeleteDescription)}
					confirmText={t(localizationConstants.contentConfirmLabel)}
					cancelText={t(localizationConstants.contentCancelButton)}
					onConfirm={() =>
						removeEntry(groupId, categoryId, subcategoryId, entry.id)
					}
					trigger={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={t(localizationConstants.contentDeleteEntry)}
							className="size-8 shrink-0 cursor-pointer"
						>
							<Trash2 className="size-4" aria-hidden />
						</Button>
					}
				/>
			</div>

			<Textarea
				rows={3}
				value={entry.text}
				aria-label={t(localizationConstants.contentEntryTextLabel)}
				placeholder={t(localizationConstants.contentEntryTextPlaceholder)}
				onChange={(event) => patch({ text: event.target.value })}
			/>

			<div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
				<div className="grid gap-2">
					<Label>{t(localizationConstants.contentFieldImages)}</Label>
					<MediaInput
						multiple
						value={entry.images}
						onChange={(images) => patch({ images })}
					/>
				</div>
				<div className="grid gap-2">
					<Label>{t(localizationConstants.contentGuideScreenshots)}</Label>
					<MediaInput
						multiple
						uploadLabelKey={localizationConstants.contentUploadScreenshot}
						value={entry.screenshots}
						onChange={(screenshots) => patch({ screenshots })}
					/>
				</div>
				{allowVideo && (
					<div className="grid gap-2">
						<Label>{t(localizationConstants.contentGuideVideo)}</Label>
						<MediaInput
							kind="video"
							value={entry.video}
							onChange={(video) => patch({ video })}
						/>
					</div>
				)}
			</div>

			<p className="text-xs text-slate-500">{counts}</p>
		</div>
	);
}

export default GuideEntryCard;
