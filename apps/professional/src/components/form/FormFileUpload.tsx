"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useWatch } from "react-hook-form";
import { FileText, X } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
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
  /** Rejects a picked file client-side instead of letting the upload round-trip and fail with a 413/400. */
  maxSizeBytes?: number;
  buttonLabel?: ReactNode;
  placeholder?: ReactNode;
  helperText?: ReactNode;
  invalidTypeMessage?: ReactNode;
  tooLargeMessage?: ReactNode;
  showPreview?: boolean;
  previewVariant?: "avatar" | "logo";
  previewLabel?: ReactNode;
  previewLabelClassName?: string;
  allowClear?: boolean;
  clearButtonAriaLabel?: ReactNode;
  className?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;   
  messageClassName?: string;
  errorClassName?: string;
  previewClassName?: string;
  previewContainerClassName?: string;
  helperClassName?: string;
  /**
   * Turns a schema's error into display text. zod messages in this app are
   * translation keys, so without it the key itself would be shown.
   */
  translateError?: (message: string) => string;
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
  maxSizeBytes,
  buttonLabel = localizationConstants.upload,
  placeholder = localizationConstants.noFileChosen,
  helperText,
  invalidTypeMessage = localizationConstants.unsupportedFileType,
  tooLargeMessage = localizationConstants.fileTooLarge,
  showPreview = true,
  previewVariant = "avatar",
  previewLabel,
  previewLabelClassName,
  allowClear = false,
  clearButtonAriaLabel,
  className,
  labelClassName,
  inputWrapperClassName,
  inputClassName,
  messageClassName,
  buttonClassName,
  errorClassName,
  previewClassName,
  previewContainerClassName,
  helperClassName,
  translateError,
}: FormFileUploadProps<TFieldValues, TName>) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const t = useTranslate();

  const watchedFile = useWatch({ control, name }) as File | string | null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
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
  const resolvedTooLargeMessage = resolveNode(tooLargeMessage);
  const resolvedPreviewLabel = resolveNode(previewLabel);
  const resolveText = (value?: ReactNode) => {
    if (value == null) {
      return undefined;
    }

    if (typeof value === "string") {
      return value in localizationConstants ? t(value) : value;
    }

    return undefined;
  };

  const resolvedClearAriaLabel =
    resolveText(clearButtonAriaLabel) ?? "Clear file";

  useEffect(() => {
    if (watchedFile instanceof File) {
      setSelectedFile(watchedFile);
      setRemoteUrl(null);
      return;
    }

    if (typeof watchedFile === "string" && watchedFile.length > 0) {
      setSelectedFile(null);
      setRemoteUrl(watchedFile);
      return;
    }

    setSelectedFile(null);
    setRemoteUrl(null);
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

  const fileName = useMemo(() => {
    if (selectedFile?.name) {
      return selectedFile.name;
    }

    if (!remoteUrl) {
      return "";
    }

    const cleaned = remoteUrl.split("?")[0];
    const name = cleaned.split("/").pop();
    return name ?? "";
  }, [remoteUrl, selectedFile]);

  const isImagePreview = useMemo(() => {
    if (selectedFile) {
      return selectedFile.type.startsWith("image/");
    }

    if (!remoteUrl) {
      return false;
    }

    return /\.(png|jpe?g|gif|webp|svg)$/i.test(remoteUrl);
  }, [remoteUrl, selectedFile]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid gap-2", className)}>
          {resolvedLabel && (
            <FormLabel className={labelClassName}>{resolvedLabel}</FormLabel>
          )}

          <FormControl>
            <div className={cn("flex items-center gap-3", inputWrapperClassName)}>
              <input
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
                  const file = event.target.files?.[0] ?? null;
                  if (!file) {
                    return;
                  }

                  const isValidType =
                    allowedTypes == null || allowedTypes.includes(file.type);

                  if (!isValidType) {
                    setLocalError(resolvedInvalidTypeMessage);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                    return;
                  }

                  if (maxSizeBytes != null && file.size > maxSizeBytes) {
                    setLocalError(resolvedTooLargeMessage);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                    return;
                  }

                  setLocalError(null);
                  setSelectedFile(file);
                  setRemoteUrl(null);
                  field.onChange(file);
                }}
              />

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "flex flex-1 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm",
                  inputClassName
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
                className={buttonClassName}
                onClick={() => inputRef.current?.click()}
              >
                {resolvedButtonLabel}
              </Button>
            </div>
          </FormControl>

          {localError && (
            <p className={cn("text-xs text-red-600 mt-1", errorClassName)}>
              {localError}
            </p>
          )}

          {showPreview && (previewUrl || remoteUrl) && (
            <>
              {resolvedPreviewLabel && (
                <p className={cn("mt-4 text-sm font-medium", previewLabelClassName)}>
                  {resolvedPreviewLabel}
                </p>
              )}
              {previewVariant === "logo" ? (
                <div
                  className={cn(
                    "relative mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4",
                    previewContainerClassName
                  )}
                >
                  {allowClear && (
                    <button
                      type="button"
                      className="absolute right-3 top-3 rounded-full p-1 text-slate-500 hover:text-slate-700"
                      aria-label={
                        typeof resolvedClearAriaLabel === "string"
                          ? resolvedClearAriaLabel
                          : undefined
                      }
                      onClick={() => {
                        setSelectedFile(null);
                        setRemoteUrl(null);
                        setLocalError(null);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                        field.onChange(null);
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    {isImagePreview ? (
                      <Image
                        src={previewUrl ?? remoteUrl ?? ""}
                        alt="Logo preview"
                        width={120}
                        height={60}
                        className={cn(
                          "h-16 w-28 rounded-md border border-slate-200 bg-white object-contain",
                          previewClassName
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-16 w-28 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500",
                          previewClassName
                        )}
                      >
                        <FileText size={20} />
                      </div>
                    )}
                    <span className="text-sm text-slate-700">
                      {fileName || resolvedPlaceholder}
                    </span>
                  </div>
                </div>
              ) : (
                <Image
                  src={previewUrl ?? remoteUrl ?? ""}
                  alt="File preview"
                  width={80}
                  height={80}
                  className={cn(
                    "mt-3 h-20 w-20 rounded-full border border-slate-200 object-cover",
                    previewClassName
                  )}
                />
              )}
            </>
          )}

          {resolvedHelperText && (
            <p className={cn("mt-2 text-sm text-slate-500", helperClassName)}>
              {resolvedHelperText}
            </p>
          )}

          <FormMessage className={messageClassName} translate={translateError} />
        </FormItem>
      )}
    />
  );
}
