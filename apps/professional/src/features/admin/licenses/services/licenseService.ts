import { LicenseCartItem } from "../constants/licenseCatalog.constants";

/** The cart always starts empty — there is no persisted "current cart" on the backend. */
export function getInitialCartItems(): LicenseCartItem[] {
	return [];
}
