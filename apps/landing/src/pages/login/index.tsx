import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  PROFESSIONAL_LOGIN_URL,
  CUSTOMER_LOGIN_URL,
} from "@/utils/constants";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"password" | "bankid">("password");
  const [accountType, setAccountType] = useState<"professional" | "customer">("professional");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (router.query.type === "customer") {
      setAccountType("customer");
    } else if (router.query.type === "professional" || router.query.type === "business") {
      setAccountType("professional");
    }
  }, [router.query.type]);

  const targetLoginUrl = accountType === "customer" ? CUSTOMER_LOGIN_URL : PROFESSIONAL_LOGIN_URL;
  const targetForgotUrl = accountType === "customer"
    ? CUSTOMER_LOGIN_URL.replace("/login", "/forgot-password")
    : PROFESSIONAL_LOGIN_URL.replace("/login", "/forgot-password");

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = new URL(targetLoginUrl);
      if (email) url.searchParams.set("email", email);
      window.location.href = url.toString();
    } catch {
      window.location.href = targetLoginUrl;
    }
  };

  const handleBankIDLogin = () => {
    window.location.href = targetLoginUrl;
  };

  return (
    <>
      <Head>
        <title>{t("auth.loginTitle", "Logga in — TimeFlow")}</title>
        <meta
          name="description"
          content={t(
            "auth.loginDesc",
            "Logga in på TimeFlow med lösenord eller BankID. Hantverkare och privatpersoner."
          )}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-body">
        <Nav />

        <div className="flex items-center justify-center px-4 py-16 md:py-24">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10 animate-fade-up [animation-delay:100ms]">
              <Link
                href="/"
                className="inline-block font-display text-3xl font-bold tracking-tighter mb-6"
              >
                TIMEFLOW<span className="text-primary">.</span>
              </Link>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">
                {t("auth.loginHeading", "Välkommen tillbaka")}
              </h1>
              <p className="text-muted text-sm">
                {t(
                  "auth.loginSub",
                  "Logga in för att fortsätta till ditt konto"
                )}
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-surface border border-border rounded-sm p-8 animate-fade-up [animation-delay:200ms]">
              {/* Account Type Selector */}
              <div className="flex gap-2 mb-6 bg-background p-1 border border-border rounded-sm">
                <button
                  type="button"
                  onClick={() => setAccountType("professional")}
                  className={`flex-1 py-2 text-xs font-bold rounded-sm transition-colors ${
                    accountType === "professional"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t("auth.proLoginLabel", "Hantverkare / Företag")}
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("customer")}
                  className={`flex-1 py-2 text-xs font-bold rounded-sm transition-colors ${
                    accountType === "customer"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t("auth.customerLoginLabel", "Privatperson")}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("password")}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${activeTab === "password"
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                    }`}
                >
                  {t("auth.tabPassword", "Lösenord")}
                  {activeTab === "password" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bankid")}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${activeTab === "bankid"
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                    }`}
                >
                  {t("auth.tabBankID", "BankID")}
                  {activeTab === "bankid" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              {/* Password Tab */}
              {activeTab === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-bold uppercase tracking-widest text-muted mb-2"
                    >
                      {t("auth.emailLabel", "E-post / Användarnamn")}
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t(
                        "auth.emailPlaceholder",
                        "namn@foretag.se"
                      )}
                      className="w-full px-4 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-bold uppercase tracking-widest text-muted mb-2"
                    >
                      {t("auth.passwordLabel", "Lösenord")}
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background font-bold py-3 rounded-sm hover:bg-ink transition-colors text-sm"
                  >
                    {t("auth.loginBtn", "Logga in")}
                  </button>

                  <div className="text-center">
                    <a
                      href={targetForgotUrl}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {t("auth.forgotPassword", "Glömt lösenordet?")}
                    </a>
                  </div>
                </form>
              )}

              {/* BankID Tab */}
              {activeTab === "bankid" && (
                <div className="space-y-6 text-center py-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-background border border-border rounded-sm flex items-center justify-center">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-12 h-12"
                        fill="none"
                      >
                        <rect
                          x="10"
                          y="20"
                          width="80"
                          height="60"
                          rx="8"
                          fill="currentColor"
                          className="text-primary"
                        />
                        <rect
                          x="20"
                          y="30"
                          width="25"
                          height="8"
                          rx="2"
                          fill="white"
                        />
                        <rect
                          x="20"
                          y="42"
                          width="60"
                          height="4"
                          rx="2"
                          fill="white"
                          opacity="0.6"
                        />
                        <rect
                          x="20"
                          y="50"
                          width="40"
                          height="4"
                          rx="2"
                          fill="white"
                          opacity="0.4"
                        />
                        <circle cx="70" cy="55" r="12" fill="white" />
                        <path
                          d="M65 55l4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted mb-1">
                      {t(
                        "auth.bankidDesc",
                        "Logga in med BankID på denna enhet eller på en annan enhet."
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBankIDLogin}
                    className="w-full bg-foreground text-background font-bold py-3 rounded-sm hover:bg-ink transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    {t("auth.bankidBtn", "Öppna BankID")}
                  </button>

                  <p className="text-xs text-muted">
                    {t(
                      "auth.bankidSteps",
                      "1. Öppna BankID-appen  ·  2. Verifiera med ditt BankID  ·  3. Klart"
                    )}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-surface text-muted uppercase tracking-widest font-bold">
                    {t("auth.or", "eller")}
                  </span>
                </div>
              </div>

              {/* Quick login for specific account types */}
              <div className="space-y-3">
                <p className="text-xs text-muted text-center font-bold uppercase tracking-widest mb-4">
                  {t("auth.directLogin", "Logga in direkt")}
                </p>
                <a
                  href={PROFESSIONAL_LOGIN_URL}
                  className="flex items-center justify-between w-full px-4 py-3 border border-border rounded-sm hover:border-primary/30 hover:bg-background transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary text-sm font-bold">
                      H
                    </span>
                    <div className="text-left">
                      <span className="text-sm font-bold block">
                        {t("auth.proLoginLabel", "Hantverkare / Företag")}
                      </span>
                      <span className="text-xs text-muted">
                        {t("auth.proLoginDesc", "TimeFlow Professional")}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  href={CUSTOMER_LOGIN_URL}
                  className="flex items-center justify-between w-full px-4 py-3 border border-border rounded-sm hover:border-primary/30 hover:bg-background transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary text-sm font-bold">
                      P
                    </span>
                    <div className="text-left">
                      <span className="text-sm font-bold block">
                        {t("auth.customerLoginLabel", "Privatperson")}
                      </span>
                      <span className="text-xs text-muted">
                        {t("auth.customerLoginDesc", "TimeFlow Home")}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Create Account Section */}
            <div className="mt-8 text-center animate-fade-up [animation-delay:300ms]">
              <p className="text-sm text-muted mb-4">
                {t("auth.noAccount", "Har du inget konto?")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register?type=private"
                  className="flex-1 px-5 py-3 border border-border rounded-sm text-sm font-bold hover:bg-surface hover:border-primary/30 transition-all text-center"
                >
                  {t("auth.createPrivate", "Skapa privatkonto")}
                </Link>
                <Link
                  href="/register?type=business"
                  className="flex-1 px-5 py-3 border border-border rounded-sm text-sm font-bold hover:bg-surface hover:border-primary/30 transition-all text-center"
                >
                  {t("auth.createBusiness", "Skapa företagskonto")}
                </Link>
              </div>
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
