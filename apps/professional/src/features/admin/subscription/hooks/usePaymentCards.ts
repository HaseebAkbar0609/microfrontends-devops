"use client";

import { useState } from "react";
import { PaymentCard } from "../constants/mockData";
import { listPaymentCards } from "../services/subscriptionService";

export interface PaymentCardDraft {
	cardName: string;
	firstName: string;
	lastName: string;
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
}

export function usePaymentCards() {
	const [cards, setCards] = useState<PaymentCard[]>(() => listPaymentCards());
	const [selectedCardId, setSelectedCardId] = useState<string | null>(
		() => listPaymentCards()[0]?.id ?? null,
	);

	const toStoredCard = (
		draft: PaymentCardDraft,
		id: string,
	): PaymentCard => ({
		id,
		cardName: draft.cardName,
		firstName: draft.firstName,
		lastName: draft.lastName,
		lastFourDigits: draft.cardNumber.replace(/\D/g, "").slice(-4),
		expiryMonth: draft.expiryMonth,
		expiryYear: draft.expiryYear,
	});

	const addCard = (draft: PaymentCardDraft) => {
		const id = `card-${draft.cardName.toLowerCase().replace(/\s+/g, "-")}-${cards.length + 1}`;
		setCards((current) => [...current, toStoredCard(draft, id)]);
		setSelectedCardId((current) => current ?? id);
	};

	const updateCard = (id: string, draft: PaymentCardDraft) => {
		setCards((current) =>
			current.map((card) =>
				card.id === id ? toStoredCard(draft, id) : card,
			),
		);
	};

	const removeCard = (id: string) => {
		const next = cards.filter((card) => card.id !== id);
		setCards(next);
		setSelectedCardId((selected) =>
			selected === id ? (next[0]?.id ?? null) : selected,
		);
	};

	return {
		cards,
		selectedCardId,
		setSelectedCardId,
		addCard,
		updateCard,
		removeCard,
	};
}
