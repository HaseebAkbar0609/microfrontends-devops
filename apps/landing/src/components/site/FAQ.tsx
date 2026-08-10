import { useTranslation } from "react-i18next";

const FAQ_KEYS = Array.from({ length: 13 }, (_, i) => i + 1);

/**
 * Shared FAQ accordion used on the Home and Pricing pages.
 * Reads from `home.faqNQ` / `home.faqNA` i18n keys.
 */
export function FAQ() {
  const { t } = useTranslation();

  return (
    <div className="divide-y divide-border">
      {FAQ_KEYS.map((n) => {
        const q = t(`home.faq${n}Q`);
        const a = t(`home.faq${n}A`);
        return (
          <details key={n} className="group py-6 cursor-pointer">
            <summary className="list-none flex justify-between items-center font-bold text-lg gap-4">
              <span>{q}</span>
              <span className="text-primary text-2xl group-open:rotate-45 transition-transform shrink-0">
                +
              </span>
            </summary>
            <p className="pt-4 text-muted">{a}</p>
          </details>
        );
      })}
    </div>
  );
}
