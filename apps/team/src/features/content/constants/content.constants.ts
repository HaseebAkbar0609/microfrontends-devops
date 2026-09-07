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
