import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hooks/useQueryParams";
import { isAllowedQueryValue } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { fetchSupplierOrToolDetail } from "@/services/tools-suppliers/api";
import type { BreadcrumbItem } from "@/types/user";
import type {
  SupplierDetail,
  ToolDetail,
  Supplier,
} from "@/types/tools-suppliers";
import { toast } from "sonner";

export function useSupplierDetail(supplierId: string) {
  const t = useTranslate();
  const searchParams = useSearchParams();
  const { changeQueries, replaceQueries } = useQueryParams();

  const [detail, setDetail] = useState<SupplierDetail | ToolDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supplier-specific details
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  const allowedTabs = useMemo(() => {
    if (detail?.type === "tool") {
      return ["overview", "settings", "activity", "permissions"];
    }
    return ["overview", "projects", "services", "documents", "reviews"];
  }, [detail]);

  const activeTab = useMemo(() => {
    const raw = searchParams.get("tab");
    if (isAllowedQueryValue(raw, allowedTabs)) return raw;
    return "overview";
  }, [searchParams, allowedTabs]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetchSupplierOrToolDetail(supplierId).then((result) => {
      if (cancelled) return;
      if (result.success && result.data) {
        setDetail(result.data);
        if (result.data.type === "supplier") {
          setSupplier(result.data);
        }
      } else {
        setError(result.error || "Misslyckades att ladda information.");
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [supplierId]);

  useEffect(() => {
    if (loading || error) return;
    const raw = searchParams.get("tab");
    if (!isAllowedQueryValue(raw, allowedTabs)) {
      replaceQueries({ tab: "overview" });
    }
  }, [searchParams, allowedTabs, replaceQueries, loading, error]);

  const handleTabChange = (value: string) => {
    changeQueries({ tab: value });
  };

  const handleDisconnect = () => {
    toast.success(t(localizationConstants.toolDisconnectSuccess));
  };

  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const name = detail?.name || "...";
    const parentLabel =
      detail?.type === "tool"
        ? localizationConstants.tools
        : localizationConstants.suppliers;
    const parentHref = detail?.type === "tool" ? "#" : "/suppliers";
    return [
      { label: localizationConstants.home, href: "/home" },
      { label: parentLabel, href: parentHref },
      { label: name },
    ];
  }, [detail]);

  return {
    detail,
    loading,
    error,
    supplier,
    services: [],
    reviews: [],
    starBreakdown: [],
    popularTags: [],
    allowedTabs,
    activeTab,
    breadcrumbs,
    handleTabChange,
    handleDisconnect,
  };
}
