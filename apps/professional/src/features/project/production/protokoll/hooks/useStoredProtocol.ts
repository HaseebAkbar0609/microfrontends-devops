"use client";

import { useState } from "react";

import * as store from "../services/projectProtocolService";

/**
 * One of the project's protocols, read once from the store — `undefined` for
 * an id that is not this project's. Resolved on the client: a protocol created
 * in this browser exists only in this browser's store.
 */
export function useStoredProtocol(projectId: string, protocolId: string) {
	const [protocol] = useState(() => store.getProtocol(projectId, protocolId));
	return protocol;
}
