"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormInput, FormFileUpload, FormCheckbox } from "@/components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userProfileSchema, UserProfileFormValues } from "../schemas/userProfile.schema";
import { DEFAULT_USER_PERMISSIONS, USER_PERMISSION_OPTIONS } from "../constants";

import type { User } from "../types/types";
import { maskPersonalNumber } from "../utils/userFormatters";

type Props = {
	mode: "create" | "edit";
	user: User | null;
	readOnly: boolean;
	isOwnProfile: boolean;
	onCancel: () => void;
	onSaved: () => void;
};

export function UserProfileForm({
	mode,
	user,
	readOnly,
	isOwnProfile,
	onCancel,
	onSaved,
}: Props) {
	const isEdit = mode === "edit";

	const form = useForm<UserProfileFormValues>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			first_name: user?.first_name ?? "",
			last_name: user?.last_name ?? "",
			mobile_number: user?.mobile_number ?? "",
			private_email: user?.private_email ?? "",
			address: user?.address ?? "",
			city: user?.city ?? "",
			postal_code: user?.postal_code ?? "",
			personal_number: user?.personal_number ?? "",
			profile_photo: null,
			permissions: user?.permissions ?? DEFAULT_USER_PERMISSIONS,
		},
	});

	const onSubmit = async (values: UserProfileFormValues) => {
		const payload = {
			...values,
			personal_number: isEdit && user ? user.personal_number : values.personal_number,
		};

		console.log("TODO save user", payload);
		onSaved();
	};

	const personalNumberValue = form.watch("personal_number");

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-md">
				<Tabs defaultValue="profile" className="gap-0">
					<div className="border-b border-slate-200 px-5 pt-4">
						<TabsList variant="line">
							<TabsTrigger value="profile">Profile</TabsTrigger>
							<TabsTrigger value="permissions">Permissions</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="profile" className="p-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
							<FormInput control={form.control} name="first_name" label="First name" disabled={readOnly} />
							<FormInput control={form.control} name="last_name" label="Last name" disabled={readOnly} />
							<FormInput control={form.control} name="mobile_number" label="Mobile number" disabled={readOnly} />
							<FormInput control={form.control} name="private_email" label="Private email" type="email" disabled={readOnly} />
							<FormInput control={form.control} name="address" label="Address" disabled={readOnly} />
							<FormInput control={form.control} name="city" label="City" disabled={readOnly} />
							<FormInput control={form.control} name="postal_code" label="Postal code" disabled={readOnly} />

							<FormInput
								control={form.control}
								name="personal_number"
								label="Personal number"
								disabled={readOnly || isEdit}
								inputProps={{
									value: isEdit ? maskPersonalNumber(personalNumberValue) : personalNumberValue,
									onChange: isEdit ? undefined : form.register("personal_number").onChange,
								}}
							/>

							{!readOnly && (
								<FormFileUpload
									control={form.control}
									name="profile_photo"
									label="Upload photo"
									allowedTypes={["image/png", "image/jpeg"]}
									showPreview
									className="md:col-span-2"
								/>
							)}
						</div>
					</TabsContent>

					<TabsContent value="permissions" className="p-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
							{USER_PERMISSION_OPTIONS.map((permission) => (
								<FormCheckbox
									key={permission.key}
									control={form.control}
									name={`permissions.${permission.key}`}
									label={permission.label}
									disabled={readOnly}
								/>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex items-center justify-between border-t border-slate-200 p-5">
					<div>
						{isEdit && !isOwnProfile && !readOnly && (
							<Button
								type="button"
								variant="destructive"
								className="gap-2"
								onClick={() => {
									console.log("TODO delete user", user?.id);
									onSaved();
								}}
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</Button>
						)}
					</div>

					<div className="flex items-center gap-3">
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>

						{!readOnly && (
							<Button type="submit" className="gap-2">
								<Save className="h-4 w-4" />
								Save
							</Button>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}
