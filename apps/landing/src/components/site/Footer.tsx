import Link from "next/link";
import { useTranslation } from "react-i18next";
import { RegionDropdown } from "./RegionDropdown";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-ink text-stone-400 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div>
            <span className="font-display text-white text-2xl font-bold tracking-tighter">
              TIMEFLOW<span className="text-primary">.</span>
            </span>
            <p className="mt-4 max-w-xs text-sm">
              {t("footer.sub")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <p className="text-white font-bold">{t("footer.solutions")}</p>
              <Link href="/solutions#affar" className="hover:text-white transition-colors">{t("footer.business")}</Link>
              <Link href="/solutions#produktion" className="hover:text-white transition-colors">{t("footer.production")}</Link>
              <Link href="/solutions#ekonomi" className="hover:text-white transition-colors">{t("footer.financials")}</Link>
              <Link href="/solutions#affarsstod" className="hover:text-white transition-colors">{t("footer.businessSupport")}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white font-bold">{t("footer.product")}</p>
              <Link href="/professional" className="hover:text-white transition-colors">{t("footer.forCraftsmen")}</Link>
              <Link href="/consumer" className="hover:text-white transition-colors">{t("footer.forConsumers")}</Link>
              <Link href="/timeflow-work" className="hover:text-white transition-colors">{t("footer.timeflowWorkApp")}</Link>
              <Link href="/timeflow-manager" className="hover:text-white transition-colors">{t("footer.timeflowManagerApp")}</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link>
              <Link href="/cases" className="hover:text-white transition-colors">{t("footer.cases")}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white font-bold">{t("footer.company")}</p>
              <Link href="/about" className="hover:text-white transition-colors">{t("footer.aboutUs")}</Link>
              <Link href="/support" className="hover:text-white transition-colors">{t("footer.support")}</Link>
              <Link href="/contact" className="hover:text-white transition-colors">{t("footer.contactUs")}</Link>
              <a href="mailto:hej@timeflowsystem.se" className="hover:text-white transition-colors">hej@timeflowsystem.se</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white font-bold">{t("footer.region")}</p>
              <RegionDropdown variant="dark" dropDirection="up" />
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs font-mono">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
