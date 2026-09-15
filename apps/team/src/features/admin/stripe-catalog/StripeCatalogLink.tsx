"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { catalogCapabilityKey, getCatalogCapability } from "./stripeCatalog.api";

export function StripeCatalogLink() {
  const { t } = useTranslation();
  const access = useQuery({ queryKey: catalogCapabilityKey, queryFn: getCatalogCapability, retry: false });
  if (!access.data?.can_sync) return null;
  return <Button asChild variant="outline" className="self-start"><Link href="/admin/stripe-catalog"><RefreshCw className="size-4" />{t(localizationConstants.stripeCatalogTitle)}</Link></Button>;
}
