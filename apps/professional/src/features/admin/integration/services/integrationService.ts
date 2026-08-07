import {
	INTEGRATION_OFFERINGS,
	IntegrationOffering,
} from "../constants/mockData";

// Mock-backed store shared for the session. Replace with the integration API
// when the backend exposes catalog/connect endpoints.
let offerings: IntegrationOffering[] = INTEGRATION_OFFERINGS.map(
	(offering) => ({ ...offering }),
);

export function listIntegrationOfferings(): IntegrationOffering[] {
	return [...offerings];
}

export function listConnectedProviders(): string[] {
	return [
		...new Set(
			offerings
				.filter((offering) => offering.connected)
				.map((offering) => offering.provider),
		),
	];
}

export function connectIntegration(id: string): IntegrationOffering[] {
	offerings = offerings.map((offering) =>
		offering.id === id ? { ...offering, connected: true } : offering,
	);
	return [...offerings];
}
