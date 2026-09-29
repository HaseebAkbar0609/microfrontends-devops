import client from "@/lib/axiosInstance";
import { APP_GROUPS } from "@/components/layout/constants/header";

export type HomeModule = { id: string; name: string; name_sv: string | null; icon: string | null };
export type HomeModuleGroup = { category: string; modules: HomeModule[] };
const MODULE_ALIASES: Record<string, string> = {
  offered: "/module/business/offer/dashboard", legal: "/module/financial-management/law",
  personal: "/module/financial-management/personnel", "project planning": "/module/production/design",
  "machine-vehicle": "/module/production/machine", goods: "/module/production/material-storage",
  "market-sell": "/module/business-support/marketing-sales", "data-it": "/module/business-support/data-it",
};

export function homeModuleApp(module: HomeModule, translate: (key: string) => string) {
  const name = module.name.trim().toLowerCase();
  const knownPath = MODULE_ALIASES[name];
  return APP_GROUPS.flatMap(group => group.items).find(app => app.href === knownPath ||
    translate(app.label).toLowerCase() === name || translate(app.label).toLowerCase() === module.name_sv?.toLowerCase());
}

export async function getHomeModules(companyId: string): Promise<HomeModuleGroup[]> {
  if (!companyId) throw new Error("HOME_MODULES_COMPANY_REQUIRED");
  const response = await client.get("/widgets/modules", { headers: { "X-Company-ID": companyId } });
  const groups = response.data?.data;
  if (!Array.isArray(groups) || groups.some(group => !group || typeof group.category !== "string" ||
    !Array.isArray(group.modules) || group.modules.some((module: HomeModule) => !module ||
      typeof module.id !== "string" || typeof module.name !== "string"))) throw new Error("HOME_MODULES_REQUEST_FAILED");
  return response.data.data;
}
