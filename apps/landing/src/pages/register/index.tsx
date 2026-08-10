import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  getCustomerRegisterUrl,
  getProfessionalRegisterUrl,
} from "@/utils/constants";

type AccountType = "private" | "business" | null;

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  // Read the query param to pre-select account type
  useEffect(() => {
    const type = router.query.type as string;
    if (type === "private" || type === "business") {
      setSelectedType(type);
    }
  }, [router.query.type]);

  const handleContinue = () => {
    if (selectedType === "business") {
      window.location.href = getProfessionalRegisterUrl();
    } else if (selectedType === "private") {
      window.location.href = getCustomerRegisterUrl();
    }
  };

  return (
    <>
      <Head>
        <title>{t("auth.registerTitle", "Skapa konto — TimeFlow")}</title>
        <meta
          name="description"
          content={t(
            "auth.registerDesc",
            "Skapa ditt TimeFlow-konto. Välj mellan privat konto och företagskonto för hantverkare."
          )}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <div className="flex items-center justify-center px-4 py-16 md:py-24">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-up [animation-delay:100ms]">
              <Link
                href="/"
                className="inline-block font-display text-3xl font-bold tracking-tighter mb-6"
              >
                TIMEFLOW<span className="text-primary">.</span>
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {t("auth.registerHeading", "Kom igång med TimeFlow")}
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                {t(
                  "auth.registerSub",
                  "Välj kontotyp för att skapa ditt konto. Du kan alltid uppgradera senare."
                )}
              </p>
            </div>

            {/* Account Type Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-up [animation-delay:200ms]">
              {/* Private Account */}
              <button
                type="button"
                onClick={() => setSelectedType("private")}
                className={`text-left p-8 border rounded-sm transition-all group relative overflow-hidden ${
                  selectedType === "private"
                    ? "border-primary bg-surface shadow-md"
                    : "border-border bg-surface hover:border-primary/30"
                }`}
              >
                {selectedType === "private" && (
                  <div className="absolute top-4 right-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <h2 className="font-display text-xl font-bold mb-2">
                  {t("auth.privateTitle", "Privat konto")}
                </h2>
                <p className="text-sm text-muted mb-5">
                  {t(
                    "auth.privateDesc",
                    "Hitta hantverkare, ta emot offerter och följ dina projekt i TimeFlow Home — helt kostnadsfritt."
                  )}
                </p>

                <ul className="space-y-2">
                  {[
                    t("auth.privateFeat1", "Gratis — alltid"),
                    t("auth.privateFeat2", "Upp till 5 offerter per projekt"),
                    t("auth.privateFeat3", "TimeFlow Home-appen"),
                    t("auth.privateFeat4", "ROT/RUT-stöd"),
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-xs text-muted"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </button>

              {/* Business Account */}
              <button
                type="button"
                onClick={() => setSelectedType("business")}
                className={`text-left p-8 border rounded-sm transition-all group relative overflow-hidden ${
                  selectedType === "business"
                    ? "border-primary bg-surface shadow-md"
                    : "border-border bg-surface hover:border-primary/30"
                }`}
              >
                {selectedType === "business" && (
                  <div className="absolute top-4 right-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Popular badge */}
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  {t("auth.popular", "Populärt")}
                </div>

                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>

                <h2 className="font-display text-xl font-bold mb-2">
                  {t("auth.businessTitle", "Företagskonto (Hantverkare)")}
                </h2>
                <p className="text-sm text-muted mb-5">
                  {t(
                    "auth.businessDesc",
                    "Driv hela firman i TimeFlow — offert, projekt, tidrapportering, fakturering och mer."
                  )}
                </p>

                <ul className="space-y-2">
                  {[
                    t("auth.businessFeat1", "30 dagar gratis provperiod"),
                    t("auth.businessFeat2", "23 smarta moduler"),
                    t("auth.businessFeat3", "Mobilappar för fält och ledning"),
                    t("auth.businessFeat4", "Obegränsade leads och kunder"),
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-xs text-muted"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </button>
            </div>

            {/* Continue Button */}
            <div className="animate-fade-up [animation-delay:300ms]">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedType}
                className={`w-full py-4 rounded-sm font-bold text-sm transition-all ${
                  selectedType
                    ? "bg-foreground text-background hover:bg-ink cursor-pointer"
                    : "bg-border text-muted cursor-not-allowed"
                }`}
              >
                {selectedType === "private"
                  ? t("auth.continuePrv", "Skapa privatkonto →")
                  : selectedType === "business"
                  ? t("auth.continueBiz", "Skapa företagskonto →")
                  : t("auth.selectType", "Välj kontotyp för att fortsätta")}
              </button>
            </div>

            {/* Already have an account */}
            <div className="mt-8 text-center animate-fade-up [animation-delay:400ms]">
              <p className="text-sm text-muted">
                {t("auth.hasAccount", "Har du redan ett konto?")}{" "}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  {t("auth.loginLink", "Logga in")}
                </Link>
              </p>
            </div>


          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { hasHeader: false },
  };
};
