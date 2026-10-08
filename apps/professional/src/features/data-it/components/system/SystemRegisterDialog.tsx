"use client";

import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SYSTEM_CATEGORY_TRANSLATION_MAP } from "@/features/data-it/constants/dataItSystem.constants";
import type { SystemItem } from "@/features/data-it/types/dataItSystem.types";
import {
	SystemFormFields,
	type SystemFormValues,
} from "./SystemFormFields";

interface SystemRegisterDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (item: SystemItem) => void;
}

const defaultValues: SystemFormValues = {
	systemId: "",
	program: "",
	category: "CALCULATION",
	status: "ACTIVE",
	pricePerMonth: 0,
	email: "",
	password: "",
	description: "",
};

export const SystemRegisterDialog: React.FC<SystemRegisterDialogProps> = ({
	isOpen,
	onClose,
	onCreate,
}) => {
	const t = useTranslate();
	const [values, setValues] = useState<SystemFormValues>(defaultValues);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		if (isOpen) {
			setValues(defaultValues);
			setErrors({});
		}
	}, [isOpen]);

	const handleChange = (updates: Partial<SystemFormValues>) => {
		setValues((prev) => ({ ...prev, ...updates }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const validationErrors: { [key: string]: string } = {};

		if (!values.systemId?.trim()) {
			validationErrors.systemId = t(
				localizationConstants.dataItSystemValidationRequired,
			);
		}
		if (!values.program.trim()) {
			validationErrors.program = t(
				localizationConstants.dataItSystemValidationRequired,
			);
		}
		if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			validationErrors.email = t(
				localizationConstants.dataItSystemValidationEmail,
			);
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		const rawId = values.systemId!.trim();
		const cleanId = rawId.replace(/^#/, "");
		const displaySystemId = rawId.startsWith("#") ? rawId : `#${rawId}`;

		const newItem: SystemItem = {
			id: cleanId,
			systemId: displaySystemId,
			program: values.program.trim(),
			category: values.category,
			categoryLabel: t(SYSTEM_CATEGORY_TRANSLATION_MAP[values.category]),
			status: values.status,
			pricePerMonth: Number(values.pricePerMonth) || 0,
			email: values.email.trim() || undefined,
			password: values.password.trim() || undefined,
			description: values.description.trim() || undefined,
			documents: [],
			assignedUsers: [],
		};

		onCreate(newItem);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{t(localizationConstants.dataItSystemRegisterTitle)}
					</DialogTitle>
					<DialogDescription>
						{t(localizationConstants.dataItSystemRegisterDesc)}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<SystemFormFields
						values={values}
						onChange={handleChange}
						errors={errors}
						isCreate
					/>

					<DialogFooter className="pt-4">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
						>
							{t(localizationConstants.dataItSystemBtnCancel)}
						</button>
						<button
							type="submit"
							className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
						>
							{t(localizationConstants.dataItSystemRegisterTitle)}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SystemRegisterDialog;
