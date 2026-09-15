"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useCatalogAccess } from "./useCatalogAccess";

export function StripeCatalogLink() {
  const { t } = useTranslation();
  const { access } = useCatalogAccess();
  if (!access.data?.can_sync) return null;
  return <Button asChild variant="outline" className="self-start"><Link href="/admin/stripe-catalog"><RefreshCw className="size-4" />{t(localizationConstants.stripeCatalogTitle)}</Link></Button>;
}
