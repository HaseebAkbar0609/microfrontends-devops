import axiosInstance from "@/lib/axiosInstance";
import { ContactFormValues } from "../schemas/profile.schema";

export interface ProfileSettingsMeta {
	cityName?: string;
}

export type ProfileSettingsData = Partial<ContactFormValues> &
	ProfileSettingsMeta;

const mapNextOfKinFromApi = (
	items:
		| Array<{
				name?: string;
				relation?: string;
				phone?: string;
				email?: string;
		  }>
		| undefined,
) =>
	items?.map((item) => ({
		name: item.name ?? "",
		relation: item.relation ?? "",
		phone: item.phone ?? "",
		email: item.email ?? "",
	})) ?? [];

export const getProfileSettings = async (): Promise<ProfileSettingsData> => {
	const res = await axiosInstance.get("/professionals/profile/me");
	const user = res.data?.data?.user ?? {};
	const companyUser = res.data?.data?.company_user ?? {};
	return {
		firstName: user.first_name ?? "",
		lastName: user.last_name ?? "",
		email: user.email ?? "",
		phone: user.phone_number ?? "",
		streetAddress: user.address ?? "",
		postalCode: user.postal_code ?? "",
		countryId: user.country_id ?? "",
		cityId: user.city_id ?? "",
		// Not a form field — passed to FormCitySelect as ensureOptionLabelIfMissing
		cityName: user.city_name ?? "",
		personalId: user.personal_id ?? "",
		nextOfKin: mapNextOfKinFromApi(user.next_of_kin),
		employmentNumber: companyUser.employment_number ?? "",
		position: companyUser.position ?? "",
		department: companyUser.department ?? "",
		// A remote URL string — FormFileUpload renders it via its `remoteUrl` preview path.
		profilePicture: user.profile_picture_url ?? undefined,
		languagePreference: user.language_preference ?? "",
		languageOther: user.language_other ?? "",
		notifications: {
			email: user.notify_email ?? false,
			sms: user.notify_sms ?? false,
			webPush: user.notify_web_push ?? false,
		},
	};
};

export const uploadMedia = async (
	file: File,
	mediaType: string,
): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("media_type", mediaType);
	const res = await axiosInstance.post("/media/upload", formData);
	const id = res.data?.data?.id;
	if (!id) {
		throw new Error(
			"Media upload failed: response did not include a media id",
		);
	}
	return id;
};

export const updateProfileSettings = async (data: ContactFormValues) => {
	let profilePictureMediaId: string | null | undefined;
	if (data.profilePicture instanceof File) {
		profilePictureMediaId = await uploadMedia(
			data.profilePicture,
			"profile_picture",
		);
	} else if (data.profilePicture == null) {
		profilePictureMediaId = null;
	}
	// else: unchanged remote URL string — omit the field so it isn't touched.

	const payload: Record<string, unknown> = {
		first_name: data.firstName,
		last_name: data.lastName,
		phone_number: data.phone ?? null,
		address: data.streetAddress ?? null,
		postal_code: data.postalCode ?? null,
		city_id: data.cityId || null,
		country_id: data.countryId || null,
		personal_id: data.personalId ?? null,
		language_preference: data.languagePreference ?? null,
		language_other: data.languageOther ?? null,
		notify_email: data.notifications?.email ?? false,
		notify_sms: data.notifications?.sms ?? false,
		notify_web_push: data.notifications?.webPush ?? false,
		next_of_kin: (data.nextOfKin ?? []).filter(
			(kin) => kin.name || kin.phone || kin.email,
		),
	};
	if (profilePictureMediaId !== undefined) {
		payload.profile_picture_media_id = profilePictureMediaId;
	}

	const res = await axiosInstance.patch("/professionals/profile/me", payload);
	return res.data;
};

export const changePassword = async (data: {
	currentPassword: string;
	newPassword: string;
}) => {
	const res = await axiosInstance.post(
		"/professionals/profile/change-password",
		{
			current_password: data.currentPassword,
			new_password: data.newPassword,
		},
	);
	return res.data;
};
