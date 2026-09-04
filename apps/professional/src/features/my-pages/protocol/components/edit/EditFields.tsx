"use client";

import { Control, FieldPath } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { EditProtocolValues } from "../../schemas/protocol.schema";

interface BaseFieldProps {
	control: Control<EditProtocolValues>;
	name: FieldPath<EditProtocolValues>;
	labelKey?: string;
	placeholderKey?: string;
}

export const EditTextField = ({
	control,
	name,
	labelKey,
	placeholderKey,
	type = "text",
}: BaseFieldProps & { type?: "text" | "date" | "time" }) => {
	const t = useTranslate();
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col gap-1.5">
					{labelKey && (
						<FormLabel className="text-sm font-medium text-slate-900">
							<Translate text={labelKey} />
						</FormLabel>
					)}
					<FormControl>
						<Input
							{...field}
							value={(field.value as string) ?? ""}
							type={type}
							placeholder={
								placeholderKey ? t(placeholderKey) : undefined
							}
							className="h-10 border-slate-200 text-sm"
						/>
					</FormControl>
					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
};

export const EditTextareaField = ({
	control,
	name,
	labelKey,
	placeholderKey,
}: BaseFieldProps) => {
	const t = useTranslate();
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col gap-1.5">
					{labelKey && (
						<FormLabel className="text-sm font-medium text-slate-900">
							<Translate text={labelKey} />
						</FormLabel>
					)}
					<FormControl>
						<Textarea
							{...field}
							value={(field.value as string) ?? ""}
							rows={3}
							placeholder={
								placeholderKey ? t(placeholderKey) : undefined
							}
							className="border-slate-200 text-sm"
						/>
					</FormControl>
					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
};

export const EditSelectField = ({
	control,
	name,
	labelKey,
	options,
}: BaseFieldProps & { options: readonly string[] }) => {
	const t = useTranslate();
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col gap-1.5">
					{labelKey && (
						<FormLabel className="text-sm font-medium text-slate-900">
							<Translate text={labelKey} />
						</FormLabel>
					)}
					<Select
						value={(field.value as string) ?? ""}
						onValueChange={field.onChange}
					>
						<FormControl>
							<SelectTrigger className="h-10 w-full border-slate-200 text-sm">
								<SelectValue />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
};
