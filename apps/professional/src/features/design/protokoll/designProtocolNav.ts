import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";

const recordBase = (projektId: string) =>
	`${DESIGN_MODULE_BASE_URL}/${encodeURIComponent(projektId)}`;

export const designProtocolUrls = {
	list: (projektId: string) => `${recordBase(projektId)}/protokoll`,
	view: (projektId: string, protocolId: string) =>
		`${recordBase(projektId)}/protokoll/${encodeURIComponent(protocolId)}`,
};
