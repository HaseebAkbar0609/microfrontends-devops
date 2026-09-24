"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MonitorPlay, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getAdminUserOptions } from "@/features/admin/users/api/adminUsers.api";
import {
	usePresentation,
	useUpdatePresentation,
} from "../hooks/useCompanyInformation";
import { uploadCompanyMedia } from "../api/companyInformation.api";
import { PRESENTATION_ALLOWED_TYPES } from "../constants";

interface TeamMemberOption {
	id: string;
	display_name: string;
	email: string;
}

const initials = (name: string) =>
	name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

export function CompanyPresentationTab() {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const presentationQuery = usePresentation();
	const updatePresentation = useUpdatePresentation();
	const teamOptionsQuery = useQuery({
		queryKey: ["admin-users", "options"],
		queryFn: () => getAdminUserOptions({ limit: 100 }),
	});
	const teamOptions: TeamMemberOption[] = teamOptionsQuery.data?.data ?? [];

	const [text, setText] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [existingFileName, setExistingFileName] = useState("");

	useEffect(() => {
		if (!presentationQuery.data) return;
		setText(presentationQuery.data.text ?? "");
		setSelectedIds(presentationQuery.data.teamMemberIds ?? []);
		setExistingFileName(presentationQuery.data.file?.fileName ?? "");
		setFile(null);
	}, [presentationQuery.data]);

	const selected = teamOptions.filter((member) =>
		selectedIds.includes(member.id),
	);

	const toggleMember = (id: string) =>
		setSelectedIds((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		);

	const handleReset = () => {
		setText(presentationQuery.data?.text ?? "");
		setSelectedIds(presentationQuery.data?.teamMemberIds ?? []);
		setFile(null);
		setExistingFileName(presentationQuery.data?.file?.fileName ?? "");
	};

	const handleSave = async () => {
		try {
			const payload: Record<string, unknown> = {
				text,
				teamMemberIds: selectedIds,
			};
			if (file) {
				const uploaded = await uploadCompanyMedia(file);
				payload.fileMediaId = uploaded.mediaId;
			}
			await updatePresentation.mutateAsync(payload);
			showToast("success", t(localizationConstants.profileUpdated));
		} catch (_error) {
			showToast("error", t(localizationConstants.profileUpdateFailed));
		}
	};

	const fileName = file?.name || existingFileName;

	return (
		<div className="flex min-h-[calc(100vh-320px)] flex-col gap-6">
			<CollapsibleSection
				className="rounded-md border border-slate-200 bg-white py-4"
				contentClassName="px-5"
				icon={<MonitorPlay size={24} className="text-slate-700" />}
				title={
					<Translate
						text={localizationConstants.companyPresentationTitle}
					/>
				}
				defaultOpen
			>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-slate-900">
							<Translate
								text={
									localizationConstants.companyPresentationTextLabel
								}
							/>
						</label>
						<Textarea
							value={text}
							onChange={(event) => setText(event.target.value)}
							rows={3}
							placeholder={t(
								localizationConstants.companyPresentationTextPlaceholder,
							)}
							className="border-slate-200 text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-slate-900">
							<Translate
								text={
									localizationConstants.companyPresentationTeamLabel
								}
							/>
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-left text-sm"
								>
									<span className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
										{selected.map((member) => (
											<span
												key={member.id}
												className="flex items-center gap-1.5 border-r border-slate-200 py-0.5 pl-1 pr-2 text-sm text-slate-900 last:border-r-0"
											>
												<span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-600">
													{initials(
														member.display_name ||
															member.email,
													)}
												</span>
												<span className="font-medium">
													{member.display_name}
												</span>
												<span className="text-slate-400">
													{member.email}
												</span>
												<span
													role="button"
													tabIndex={0}
													aria-label={member.display_name}
													onClick={(event) => {
														event.stopPropagation();
														toggleMember(member.id);
													}}
													onKeyDown={(event) => {
														if (
															event.key ===
																"Enter" ||
															event.key === " "
														) {
															event.preventDefault();
															event.stopPropagation();
															toggleMember(
																member.id,
															);
														}
													}}
													className="cursor-pointer"
												>
													<X className="h-3.5 w-3.5 text-slate-400" />
												</span>
											</span>
										))}
									</span>
									<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
								</button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								className="w-[var(--radix-popover-trigger-width)] rounded-md border border-slate-200 bg-white p-1 shadow-md"
							>
								{teamOptions.map((member) => (
									<label
										key={member.id}
										className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
									>
										<Checkbox
											checked={selectedIds.includes(
												member.id,
											)}
											onCheckedChange={() =>
												toggleMember(member.id)
											}
										/>
										{member.display_name}
										<span className="text-slate-400">
											{member.email}
										</span>
									</label>
								))}
							</PopoverContent>
						</Popover>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-slate-900">
							<Translate
								text={
									localizationConstants.companyPresentationFileLabel
								}
							/>
						</label>
						<div className="flex items-center gap-3">
							<label className="flex h-11 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 text-sm">
								<span className="font-medium text-slate-900">
									<Translate
										text={localizationConstants.upload}
									/>
								</span>
								<input
									ref={fileInputRef}
									type="file"
									accept={PRESENTATION_ALLOWED_TYPES.join(
										",",
									)}
									className="hidden"
									onChange={(event) => {
										setFile(event.target.files?.[0] ?? null);
										event.target.value = "";
									}}
								/>
								<span className="text-slate-500">
									{fileName || (
										<Translate
											text={
												localizationConstants.noFileChosen
											}
										/>
									)}
								</span>
							</label>
							<Button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<Upload className="h-4 w-4" />
								<Translate
									text={localizationConstants.upload}
								/>
							</Button>
						</div>
						<p className="text-sm text-slate-400">
							<Translate
								text={
									localizationConstants.companyPresentationFileHint
								}
							/>
						</p>
					</div>
				</div>
			</CollapsibleSection>

			<div className="sticky bottom-0 mt-auto -mx-6 border-t border-slate-200 bg-slate-50 px-6 py-4">
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						className="w-[204px] border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						disabled={updatePresentation.isPending}
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
