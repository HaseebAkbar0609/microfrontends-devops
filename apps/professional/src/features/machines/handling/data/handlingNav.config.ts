import { MACHINE_MODULE_BASE_URL } from "@/features/machines/data/machineNav.config";

/**
 * Route base for Maskinhantering. Kept in its own module so both the list and
 * the detail page can import it without pulling each other's component tree in.
 */
export const MACHINE_HANDLING_BASE_URL = `${MACHINE_MODULE_BASE_URL}/handling`;
