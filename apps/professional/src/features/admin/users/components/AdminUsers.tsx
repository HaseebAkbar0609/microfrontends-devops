"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useTranslate } from "@/utils/translation/translate";
import { useAuthStatus } from "@/context/AuthContext";
import UserDirectory from "../live/UserDirectory";
import GroupDirectory from "../live/GroupDirectory";

export default function AdminUsers() {
  const t = useTranslate();
  const { company } = useAuthStatus();
  const { query, changeQueries } = useQueryParams();
  return <div className="flex min-w-0 flex-col gap-6 p-4 sm:p-6">
    <h1 className="text-2xl font-semibold">{t("proAdminUsers")}</h1>
    <Tabs value={query.get("tab") === "groups" ? "groups" : "users"} onValueChange={value => changeQueries({ tab: value === "users" ? null : value })}>
      <TabsList variant="line"><TabsTrigger value="users">{t("proAdminUsers")}</TabsTrigger><TabsTrigger value="groups">{t("proAdminGroups")}</TabsTrigger></TabsList>
      <TabsContent value="users" className="mt-6"><UserDirectory key={company?.id} /></TabsContent>
      <TabsContent value="groups" className="mt-6"><GroupDirectory key={company?.id} /></TabsContent>
    </Tabs>
  </div>;
}
