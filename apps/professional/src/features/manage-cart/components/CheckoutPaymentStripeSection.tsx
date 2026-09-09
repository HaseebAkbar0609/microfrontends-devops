"use client";

import { FormCheckbox } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { UserCard } from "@/api-actions";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import Image from "next/image";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import type { Control } from "react-hook-form";
import { useEffect } from "react";

import type { PaymentDetailsFormValues } from "../types";

export function CheckoutPaymentStripeSection({
  control,
  cards,
  isCardsLoading,
  selectedCardId,
  onSelectCard,
  onChooseNewCard,
  onSaveCardOnly,
  isSavingCard,
  isPaying,
  onStripeReady,
}: {
  control: Control<PaymentDetailsFormValues>;
  cards: UserCard[];
  isCardsLoading: boolean;
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onChooseNewCard: () => void;
  onSaveCardOnly: () => void;
  isSavingCard: boolean;
  isPaying: boolean;
  onStripeReady: (
    stripe: Stripe | null,
    elements: StripeElements | null,
  ) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    onStripeReady(stripe, elements);
    return () => onStripeReady(null, null);
  }, [elements, onStripeReady, stripe]);

  return (
    <div className="min-w-0 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 [&_button:not([role=checkbox])]:min-h-11">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-primary">3.</span>
        <h2 className="text-lg font-semibold text-primary">
          <Translate
            text={localizationConstants.manageCartCheckoutPaymentOptionsTitle}
          />
        </h2>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-secondary">
              <Translate
                text={localizationConstants.manageCartCheckoutCardSectionTitle}
              />
            </p>
            <p className="text-xs text-emerald-700">
              <Translate
                text={localizationConstants.manageCartCheckoutSecurePaymentText}
              />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/visa-icon.png"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
              alt=""
            />
            <Image
              src="/american-express-icon.png"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
              alt=""
            />
            <Image
              src="/mastercard-icon.png"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
              alt=""
            />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {isCardsLoading ? (
            <p className="text-sm text-gray-500">
              <Translate
                text={
                  localizationConstants.manageCartCheckoutLoadingSavedCardsText
                }
              />
            </p>
          ) : cards.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-secondary">
                  <Translate
                    text={
                      localizationConstants.manageCartCheckoutSavedCardsTitle
                    }
                  />
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onChooseNewCard}
                >
                  <Translate
                    text={
                      localizationConstants.manageCartCheckoutAddNewCardButton
                    }
                  />
                </Button>
              </div>
              <div className="space-y-2">
                {cards.map((card) => {
                  const isSelected = selectedCardId === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => onSelectCard(card.id)}
                      className={[
                        "w-full rounded-md border p-3 text-left transition",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-secondary capitalize">
                            {card.brand} •••• {card.last4}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires {card.exp_month}/{card.exp_year}
                            {card.is_default ? " · Default" : ""}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                <Translate
                  text={
                    localizationConstants.manageCartCheckoutNoSavedCardsText
                  }
                />
              </p>
              <Button type="button" variant="outline" onClick={onChooseNewCard}>
                <Translate
                  text={
                    localizationConstants.manageCartCheckoutAddNewCardButton
                  }
                />
              </Button>
            </div>
          )}

          <div className="pt-2">
            <PaymentElement
              options={{
                wallets: {
                  link: "never",
                },
              }}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveCardOnly}
              disabled={
                !stripe || !elements || isSavingCard || isPaying
              }
            >
              {isSavingCard ? (
                <Translate
                  text={
                    localizationConstants.manageCartCheckoutAddingCardButton
                  }
                />
              ) : (
                <Translate
                  text={localizationConstants.manageCartCheckoutAddCardButton}
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      <FormCheckbox
        control={control}
        name="addNote"
        label={localizationConstants.manageCartCheckoutAddNoteLabel}
        className="pt-1"
      />

      <p className="text-xs text-gray-500">
        Genom att fortsätta med ditt köp samtycker du till våra{" "}
        <span className="underline underline-offset-2">Villkor</span> och vår{" "}
        <span className="underline underline-offset-2">Integritetspolicy</span>.
      </p>
    </div>
  );
}
