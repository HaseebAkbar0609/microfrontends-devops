"use client";

import { useCallback, useMemo, useState } from "react";
import { findSectionKeyBySlug } from "../constants/marketingGroups";
import type { MarketingRow, NewsletterAudience, NewsletterRecipient } from "../types";
import { useMarketingRegisters } from "./useMarketingRegisters";

/** Contact statuses both registers share, in the order they are offered. */
export const CONTACT_STATUS_IDS = [
	"prospect",
	"lead",
	"quoted",
	"active",
	"inactive",
];

const TRADESPEOPLE_KEY = findSectionKeyBySlug("hantverkare");
const PRIVATE_KEY = findSectionKeyBySlug("privatpersoner");

function toRecipient(
	row: MarketingRow,
	nameField: string,
	audience: NewsletterRecipient["audience"],
): NewsletterRecipient {
	return {
		name: String(row.values[nameField] ?? ""),
		email: String(row.values.epost ?? ""),
		status: String(row.values.status ?? ""),
		audience,
	};
}

/**
 * Cross-references the two contact registers into a recipient list.
 *
 * Reads the registers live, so a contact edited in `hantverkare` is reflected
 * here without a reload.
 */
export function useNewsletterAudience() {
	const { getRows } = useMarketingRegisters();
	const [audience, setAudience] = useState<NewsletterAudience>("tradespeople");
	const [statuses, setStatuses] = useState<string[]>(["active"]);
	const [subscribersOnly, setSubscribersOnly] = useState(true);

	const tradespeople = getRows(TRADESPEOPLE_KEY ?? "");
	const privateCustomers = getRows(PRIVATE_KEY ?? "");

	const recipients = useMemo(() => {
		const source: { row: MarketingRow; recipient: NewsletterRecipient }[] = [];

		if (audience !== "privateIndividuals") {
			for (const row of tradespeople) {
				source.push({ row, recipient: toRecipient(row, "foretag", "tradespeople") });
			}
		}
		if (audience !== "tradespeople") {
			for (const row of privateCustomers) {
				source.push({
					row,
					recipient: toRecipient(row, "namn", "privateIndividuals"),
				});
			}
		}

		return source
			.filter(({ row, recipient }) => {
				if (!recipient.email) return false;
				if (statuses.length > 0 && !statuses.includes(recipient.status)) {
					return false;
				}
				// The opt-in flag lives on the contact row, not on the recipient.
				return !subscribersOnly || String(row.values.nyhetsbrev ?? "") === "yes";
			})
			.map(({ recipient }) => recipient);
	}, [audience, statuses, subscribersOnly, tradespeople, privateCustomers]);

	const toggleStatus = useCallback((status: string) => {
		setStatuses((previous) =>
			previous.includes(status)
				? previous.filter((entry) => entry !== status)
				: [...previous, status],
		);
	}, []);

	return {
		audience,
		setAudience,
		statuses,
		toggleStatus,
		subscribersOnly,
		setSubscribersOnly,
		recipients,
	};
}

/**
 * The stored `segment` value for a selection.
 *
 * The prototype wrote "Alla" for any selection that was not exactly one status,
 * so targeting Lead + Aktiv was recorded as targeting everyone.
 */
export function resolveSegmentId(statuses: string[]): string {
	if (statuses.length === 0 || statuses.length === CONTACT_STATUS_IDS.length) {
		return "all";
	}
	return statuses.length === 1 ? (statuses[0] ?? "all") : "several";
}
