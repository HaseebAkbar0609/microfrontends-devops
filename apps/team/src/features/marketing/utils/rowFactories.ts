import { MARKETING_ROW_ID_PREFIX } from "../constants/marketing.constants";

/**
 * Row ids are generated in event handlers only — never during render — so the
 * server and the client can never disagree about them.
 */

let sequence = 0;

export function createRowId(): string {
	sequence += 1;
	return `${MARKETING_ROW_ID_PREFIX}-${Date.now().toString(36)}-${sequence}`;
}
