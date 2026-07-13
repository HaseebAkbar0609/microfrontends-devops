import type { ActionResult } from "@/types/api";
import type { ConsultantTypeItem } from "@/features/consultant/types/consultantType";
import { DUMMY_CONSULTANT_TYPES } from "@/features/consultant/constants/directory";

export interface GetConsultantTypesParams {
  search?: string;
}

export async function getConsultantTypesAPIAction(
  params: GetConsultantTypesParams = {},
): Promise<ActionResult<ConsultantTypeItem[]>> {
  try {
    let rows = [...DUMMY_CONSULTANT_TYPES];

    const q = params.search?.trim().toLowerCase();
    if (q) {
      rows = rows.filter((t) => t.name.toLowerCase().includes(q));
    }

    return { success: true, data: rows, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load consultant types",
    };
  }
}
