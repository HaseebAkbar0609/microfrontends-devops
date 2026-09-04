"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useWatch } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import Image from "next/image";

export interface FormFileUploadProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	control: Control<TFieldValues>;
	name: TName;
	label?: ReactNode;
	accept?: string;
	allowedTypes?: string[];
	buttonLabel?: ReactNode;
	placeholder?: ReactNode;
	helperText?: ReactNode;
	invalidTypeMessage?: ReactNode;
	showPreview?: boolean;
	onFileSelected?: (file: File) => void;
	className?: string;
	labelClassName?: string;
	inputWrapperClassName?: string;
	inputClassName?: string;
	buttonClassName?: string;
	messageClassName?: string;
	errorClassName?: string;
	previewClassName?: string;
	helperClassName?: string;
}

export function FormFileUpload<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	accept,
	allowedTypes,
	buttonLabel = localizationConstants.upload,
	placeholder = localizationConstants.noFileChosen,
	helperText,
	invalidTypeMessage = localizationConstants.unsupportedFileType,
	showPreview = true,
	onFileSelected,
	className,
	labelClassName,
	inputWrapperClassName,
	inputClassName,
	messageClassName,
	buttonClassName,
	errorClassName,
	previewClassName,
	helperClassName,
}: FormFileUploadProps<TFieldValues, TName>) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const watchedFile = useWatch({ control, name }) as File | null;

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [localError, setLocalError] = useState<ReactNode | null>(null);

	const resolvedAccept = accept ?? allowedTypes?.join(", ");

	const resolveNode = (value?: ReactNode) => {
		if (value == null) {
			return null;
		}

		if (typeof value === "string" && value in localizationConstants) {
			return <Translate text={value} />;
		}

		return value;
	};

	const resolvedLabel = resolveNode(label);
	const resolvedButtonLabel = resolveNode(buttonLabel);
	const resolvedPlaceholder = resolveNode(placeholder);
	const resolvedHelperText = resolveNode(helperText);
	const resolvedInvalidTypeMessage = resolveNode(invalidTypeMessage);

	useEffect(() => {
		if (watchedFile instanceof File) {
			setSelectedFile(watchedFile);
			return;
		}

		setSelectedFile(null);
	}, [watchedFile]);

	useEffect(() => {
		if (!selectedFile) {
			setPreviewUrl(null);
			setLocalError(null);
			if (inputRef.current) {
				inputRef.current.value = "";
			}
			return;
		}

		const url = URL.createObjectURL(selectedFile);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [selectedFile]);

	const fileName = selectedFile?.name ?? "";

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("grid gap-2", className)}>
					{resolvedLabel && (
						<FormLabel className={labelClassName}>
							{resolvedLabel}
						</FormLabel>
					)}

					<FormControl>
						<div
							className={cn(
								"flex items-center gap-3",
								inputWrapperClassName,
							)}
						>
							<Input
								ref={(node) => {
									inputRef.current = node;
									field.ref(node);
								}}
								id={inputId}
								type="file"
								name={field.name}
								accept={resolvedAccept}
								className="sr-only"
								onBlur={field.onBlur}
								onChange={(event) => {
									const file =
										event.target.files?.[0] ?? null;
									if (!file) {
										return;
									}

									const isValidType =
										allowedTypes == null ||
										allowedTypes.includes(file.type);

									if (!isValidType) {
										setLocalError(
											resolvedInvalidTypeMessage,
										);
										if (inputRef.current) {
											inputRef.current.value = "";
										}
										return;
									}

									setLocalError(null);
									setSelectedFile(file);
									field.onChange(file);
									onFileSelected?.(file);
								}}
							/>

							<Button
								type="button"
								variant="outline"
								className={cn(
									"flex h-10 flex-1 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-none",
									inputClassName,
								)}
								onClick={() => inputRef.current?.click()}
							>
								<span className="font-medium text-slate-900">
									{resolvedButtonLabel}
								</span>
								<span className="text-slate-500">
									{fileName || resolvedPlaceholder}
								</span>
							</Button>

							<Button
								type="button"
								className={cn("h-10 rounded-md px-3 py-2", buttonClassName)}
								onClick={() => inputRef.current?.click()}
							>
								{resolvedButtonLabel}
							</Button>
						</div>
					</FormControl>

					{localError && (
						<p
							className={cn(
								"text-xs text-red-600",
								errorClassName,
							)}
						>
							{localError}
						</p>
					)}

					{showPreview && previewUrl && (
						<Image
							src={previewUrl}
							alt="File preview"
							width={80}
							height={80}
							className={cn(
								"mt-3 h-20 w-20 rounded-full border border-slate-200 object-cover",
								previewClassName,
							)}
						/>
					)}

					{resolvedHelperText && (
						<p
							className={cn(
								"mt-2 text-sm text-slate-500",
								helperClassName,
							)}
						>
							{resolvedHelperText}
						</p>
					)}

					<FormMessage className={messageClassName} />
				</FormItem>
			)}
		/>
	);
}
