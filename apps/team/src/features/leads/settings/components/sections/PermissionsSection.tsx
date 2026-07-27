"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { permissionRoles } from "@/features/leads/settings/constants";
import { fetchPermissions, updatePermissions } from "@/features/leads/settings/api/permissionsApi";
import { showToast } from "@/lib/toast";

export function PermissionsSection() {
  const t = useTranslate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

  const updateMutation = useMutation({
    mutationFn: updatePermissions,
    onSuccess: (updated) => {
      queryClient.setQueryData(["permissions"], updated);
      showToast("success", t(localizationConstants.settingsSavedToast));
    },
    onError: () => {
      showToast("error", t(localizationConstants.settingsSaveErrorToast));
    },
  });

  const handlePermissionChange = (roleId: string, field: string, next: boolean) => {
    const currentPermissions = data && data.length > 0 ? data : permissionRoles;
    const nextPermissions = currentPermissions.map((role) =>
      role.id === roleId ? { ...role, [field]: next } : role
    );
    updateMutation.mutate({ permissions_matrix: nextPermissions });
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading permissions settings...</div>;
  }

  const permissions = data && data.length > 0 ? data : permissionRoles;
  return (
    <div className="text-sm border border-slate-300 rounded-2xl overflow-hidden bg-white">
      <Table >
        <TableHeader>
          <TableRow className="border-b border-slate-300 bg-white">
            <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700 border-r border-slate-300">
              <Translate text={localizationConstants.roleLabel} />
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700 text-center border-r border-slate-300">
              <Translate text={localizationConstants.viewLeadsLabel} />
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700 text-center border-r border-slate-300">
              <Translate text={localizationConstants.editLeadsLabel} />
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">
              <Translate text={localizationConstants.deleteLeadsLabel} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((role, idx) => {
            const r = role as unknown as Record<string, unknown>;
            return (
              <TableRow
                key={role.id || (r.role as string) || idx}
                className="border-b-0"
              >
                <TableCell className="px-6 py-4 text-sm text-slate-700 border-r border-slate-300">
                  <Translate text={role.labelKey || (r.role as string) || ""} />
                </TableCell>
                <TableCell className="px-6 py-4 text-center border-r border-slate-300">
                  <Checkbox
                    className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white data-[state=unchecked]:bg-slate-100"
                    checked={Boolean(role.canView ?? r.view_leads)}
                    onCheckedChange={(checked) => handlePermissionChange(role.id || (r.role as string), "canView", Boolean(checked))}
                  />
                </TableCell>
                <TableCell className="px-6 py-4 text-center border-r border-slate-300">
                  <Checkbox
                    className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white data-[state=unchecked]:bg-slate-100"
                    checked={Boolean(role.canEdit ?? r.edit_leads)}
                    onCheckedChange={(checked) => handlePermissionChange(role.id || (r.role as string), "canEdit", Boolean(checked))}
                  />
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Checkbox
                    className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white data-[state=unchecked]:bg-slate-100"
                    checked={Boolean(role.canDelete ?? r.delete_leads)}
                    onCheckedChange={(checked) => handlePermissionChange(role.id || (r.role as string), "canDelete", Boolean(checked))}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
  );
}
