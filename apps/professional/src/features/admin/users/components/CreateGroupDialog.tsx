"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	GROUP_PERMISSION_TIERS,
	type PermissionSection,
} from "../constants";

interface CreateGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (name: string, description: string) => void;
}

function buildDefaultPermissions(): Record<string, boolean> {
	const state: Record<string, boolean> = {};
	for (const tier of GROUP_PERMISSION_TIERS) {
		for (const section of tier.sections) {
			for (const option of section.options) {
				state[`${tier.id}.${section.id}.${option.id}`] =
					option.defaultChecked;
			}
		}
	}
	return state;
}

function PermissionSectionCard({
	tierId,
	section,
	permissions,
	onToggleOption,
	onToggleAll,
}: {
	tierId: string;
	section: PermissionSection;
	permissions: Record<string, boolean>;
	onToggleOption: (key: string, checked: boolean) => void;
	onToggleAll: (tierId: string, section: PermissionSection, checked: boolean) => void;
}) {
	const [collapsed, setCollapsed] = useState(false);

	const allChecked = section.options.every(
		(option) => permissions[`${tierId}.${section.id}.${option.id}`],
	);

	return (
		<div className="overflow-hidden rounded-md border border-slate-200">
			<button
				type="button"
				onClick={() => setCollapsed((prev) => !prev)}
				className="flex w-full cursor-pointer items-center justify-between bg-slate-100 px-3 py-2"
			>
				<span className="text-sm font-semibold text-slate-900">
					<Translate text={section.title} />
				</span>
				<ChevronUp
					className={
						collapsed
							? "h-4 w-4 rotate-180 text-slate-500 transition-transform"
							: "h-4 w-4 text-slate-500 transition-transform"
					}
				/>
			</button>
			{!collapsed && (
				<div className="grid grid-cols-1 gap-x-6 gap-y-2.5 px-3 py-3 sm:grid-cols-2">
					<Label className="flex items-center gap-2 text-sm font-normal text-slate-900 sm:col-span-2">
						<Checkbox
							checked={allChecked}
							onCheckedChange={(checked) =>
								onToggleAll(tierId, section, checked === true)
							}
						/>
						<Translate
							text={localizationConstants.adminGroupsPermAll}
						/>
					</Label>
					{section.options.map((option) => {
						const key = `${tierId}.${section.id}.${option.id}`;
						return (
							<Label
								key={key}
								className="flex items-center gap-2 text-sm font-normal text-slate-900"
							>
								<Checkbox
									checked={permissions[key]}
									onCheckedChange={(checked) =>
										onToggleOption(key, checked === true)
									}
								/>
								<Translate text={option.label} />
							</Label>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default function CreateGroupDialog({
	open,
	onOpenChange,
	onCreate,
}: CreateGroupDialogProps) {
	const t = useTranslate();
	const [step, setStep] = useState<1 | 2>(1);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [nameError, setNameError] = useState(false);
	const [permissions, setPermissions] = useState<Record<string, boolean>>(
		buildDefaultPermissions,
	);

	const resetAndClose = (nextOpen: boolean) => {
		if (!nextOpen) {
			setStep(1);
			setName("");
			setDescription("");
			setNameError(false);
			setPermissions(buildDefaultPermissions());
		}
		onOpenChange(nextOpen);
	};

	const goToStep2 = () => {
		if (!name.trim()) {
			setNameError(true);
			return;
		}
		setNameError(false);
		setStep(2);
	};

	const handleToggleOption = (key: string, checked: boolean) => {
		setPermissions((prev) => ({ ...prev, [key]: checked }));
	};

	const handleToggleAll = (
		tierId: string,
		section: PermissionSection,
		checked: boolean,
	) => {
		setPermissions((prev) => {
			const next = { ...prev };
			for (const option of section.options) {
				next[`${tierId}.${section.id}.${option.id}`] = checked;
			}
			return next;
		});
	};

	const handleCreate = () => {
		onCreate(name.trim(), description.trim());
		showToast(
			"success",
			t(localizationConstants.adminGroupsCreatedSuccess),
		);
		resetAndClose(false);
	};

	const stepOne = (
		<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="group-name"
						className="text-sm font-medium text-slate-900"
					>
						<Translate
							text={localizationConstants.adminGroupsNameLabel}
						/>{" "}
						<span className="text-red-500">*</span>
					</Label>
					<Input
						id="group-name"
						value={name}
						onChange={(event) => {
							setName(event.target.value);
							if (event.target.value.trim()) {
								setNameError(false);
							}
						}}
						placeholder={t(
							localizationConstants.adminGroupsNamePlaceholder,
						)}
						className="h-11 border-slate-200"
					/>
					{nameError && (
						<p className="text-sm text-red-600">
							<Translate
								text={
									localizationConstants.adminCreateValidationRequired
								}
							/>
						</p>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="group-description"
						className="text-sm font-medium text-slate-900"
					>
						<Translate
							text={
								localizationConstants.adminGroupsDescriptionLabel
							}
						/>
					</Label>
					<Textarea
						id="group-description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder={t(
							localizationConstants.adminGroupsDescriptionPlaceholder,
						)}
						className="min-h-[110px] border-slate-200"
					/>
				</div>
				<div className="flex items-center justify-end gap-3">
					<Button
						variant="outline"
						onClick={() => resetAndClose(false)}
						className="h-10 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						onClick={goToStep2}
						className="h-10 rounded-md bg-[#18181B] px-5 text-sm font-medium text-white hover:bg-[#18181B]/90"
					>
						<Translate
							text={localizationConstants.adminGroupsCreate}
						/>
					</Button>
				</div>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={resetAndClose}>
			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-slate-900">
						<Translate
							text={
								step === 1
									? localizationConstants.adminGroupsCreate
									: localizationConstants.adminGroupsPermissionsTitle
							}
						/>
					</DialogTitle>
					{step === 2 && (
						<p className="text-xs text-slate-500">
							<Translate
								text={localizationConstants.adminGroupsStep2}
							/>
						</p>
					)}
				</DialogHeader>

				{step === 1 ? (
					stepOne
				) : (
					<div className="flex flex-col gap-5">
						{GROUP_PERMISSION_TIERS.map((tier) => (
							<div key={tier.id} className="flex flex-col gap-3">
								<h3 className="text-lg font-bold text-slate-900">
									{tier.title}
								</h3>
								{tier.sections.map((section) => (
									<PermissionSectionCard
										key={`${tier.id}-${section.id}`}
										tierId={tier.id}
										section={section}
										permissions={permissions}
										onToggleOption={handleToggleOption}
										onToggleAll={handleToggleAll}
									/>
								))}
							</div>
						))}
						<div className="flex items-center justify-end gap-3">
							<Button
								variant="outline"
								onClick={() => resetAndClose(false)}
								className="h-10 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={localizationConstants.cancel}
								/>
							</Button>
							<Button
								onClick={handleCreate}
								className="h-10 rounded-md bg-[#18181B] px-5 text-sm font-medium text-white hover:bg-[#18181B]/90"
							>
								<Translate
									text={
										localizationConstants.adminGroupsAddRole
									}
								/>
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
