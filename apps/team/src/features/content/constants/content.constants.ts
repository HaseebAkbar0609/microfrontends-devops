import type { LanguageCode } from "@/constants/constant";
import type { ContentGroupId } from "../types";

/** The two dashboards this console administers. */
export const CONTENT_GROUP_IDS: ContentGroupId[] = ["kund", "workspace"];

export const CONTENT_BASE_HREF = "/admin/content";

/** Id prefixes for records created at runtime. */
export const CONTENT_ROW_ID_PREFIX = "row";
export const GUIDE_CATEGORY_ID_PREFIX = "cat";
export const GUIDE_SUBCATEGORY_ID_PREFIX = "sub";
export const GUIDE_ENTRY_ID_PREFIX = "entry";

/**
 * Uploaded media is held in memory as data URLs — there is no upload endpoint
 * yet. This caps a single file so a stray large image cannot bloat React state.
 */
export const MAX_MEDIA_FILE_BYTES = 5 * 1024 * 1024;

/** Accept attributes for the media picker. */
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
export const VIDEO_ACCEPT = "video/mp4,video/webm";

/** Field types whose value is an array of data URLs rather than a string. */
export const MEDIA_FIELD_TYPES = ["image", "images", "video"] as const;

/** React Query cache key for the consultant type list. */
export const CONSULTANT_TYPES_QUERY_KEY = ["team-content-consultant-types"] as const;

/** The server's limits for a consultant type; the form schema mirrors them. */
export const CONSULTANT_TYPE_LIMITS = {
	nameLength: 100,
	sections: 20,
	sectionTitleLength: 200,
	bulletsPerSection: 30,
	bulletLength: 500,
} as const;

/**
 * The team app stores "swe", the backend reads "sv" from Accept-Language. Sent
 * so its translated error messages match the language the console is shown in.
 */
export const API_LANGUAGE = {
	swe: "sv",
	en: "en",
} as const satisfies Record<LanguageCode, string>;
