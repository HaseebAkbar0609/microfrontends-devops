import localizationConstants from "@/utils/translation/constants";
import type { InspectionStatus, InspectionType } from "../types/orderInspection.types";

export const MAX_INSPECTION_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_INSPECTION_FILE_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];
export const ALLOWED_INSPECTION_MIME_TYPES = [
	"application/pdf",
	"image/png",
	"image/jpeg",
	"image/jpg",
];

export const INSPECTION_STATUS = {
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
} as const;

export const DEFAULT_INSPECTION_STATUS: InspectionStatus = INSPECTION_STATUS.APPROVED;

export const INSPECTION_TYPES = [
	"Byggmöte",
	"Förbesiktning",
	"Slutbesiktning",
	"Efterbesiktning",
	"Garantibesiktning",
	"Särskild besiktning",
] as const;

export const DEFAULT_INSPECTION_TYPE: InspectionType = INSPECTION_TYPES[0];

export const INSPECTION_TYPE_TRANSLATION_MAP: Record<InspectionType, string> = {
	Byggmöte: localizationConstants.inspectionTypeByggmote,
	Förbesiktning: localizationConstants.inspectionTypeForbesiktning,
	Slutbesiktning: localizationConstants.inspectionTypeSlutbesiktning,
	Efterbesiktning: localizationConstants.inspectionTypeEfterbesiktning,
	Garantibesiktning: localizationConstants.inspectionTypeGarantibesiktning,
	"Särskild besiktning": localizationConstants.inspectionTypeSarskild,
};

export const INSPECTION_STATUS_TRANSLATION_MAP: Record<InspectionStatus, string> = {
	[INSPECTION_STATUS.PENDING]: localizationConstants.inspectionStatusPending,
	[INSPECTION_STATUS.APPROVED]: localizationConstants.inspectionStatusApproved,
	[INSPECTION_STATUS.REJECTED]: localizationConstants.inspectionStatusRejected,
};
