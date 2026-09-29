/** Image types the image bank accepts, matching the planned /media/upload image rules. */
export const PARTNER_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

/** Largest image the bank accepts, in megabytes and bytes. */
export const PARTNER_IMAGE_MAX_MB = 5;
export const PARTNER_IMAGE_MAX_BYTES = PARTNER_IMAGE_MAX_MB * 1024 * 1024;

/**
 * A picture in the partner image bank. There is no partner upload endpoint yet,
 * so the file stays in memory and previews use short-lived object URLs.
 */
export type PartnerImage = {
	id: string;
	name: string;
	file: File;
};
