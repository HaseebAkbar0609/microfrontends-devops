import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Nav() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { href: "/professional", labelKey: "nav.craftsmen" },
    { href: "/consumer", labelKey: "nav.consumers" },
    { href: "/solutions", labelKey: "nav.solutions" },
    { href: "/pricing", labelKey: "nav.pricing" },
    { href: "/cases", labelKey: "nav.cases" },
    { href: "/about", labelKey: "nav.about" },
  ];

  const getLinkClass = (path: string) => {
    const isActive = router.pathname === path;
    return `hover:text-foreground transition-colors ${isActive ? "text-foreground font-semibold" : ""
      }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-xl font-bold tracking-tighter">
            TIMEFLOW<span className="text-primary">.</span>
          </Link>
          <div className="hidden lg:flex gap-6 text-sm font-medium text-muted">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={getLinkClass(link.href)}>
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login" className="text-sm font-medium px-4 py-2 hidden sm:block hover:text-primary transition-colors">
            {t("nav.login")}
          </Link>
          <Link href="/register" className="bg-foreground text-background text-sm font-bold px-5 py-2 rounded-sm hover:bg-ink transition-colors">
            {t("nav.getStarted")}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground focus:outline-none"
            aria-label={t("nav.toggleMenu")}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-3 text-sm font-medium text-muted animate-fade-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={getLinkClass(link.href)}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 font-medium text-foreground hover:text-primary transition-colors">
              {t("nav.login")}
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="bg-foreground text-background text-center font-bold py-2 rounded-sm hover:bg-ink transition-colors">
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
