"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { permissionRoles } from "@/features/leads/settings/constants";

export function PermissionsSection() {
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
          {permissionRoles.map((role) => (
            <TableRow
              key={role.id}
              className="border-b-0"
            >
              <TableCell className="px-6 py-4 text-sm text-slate-700 border-r border-slate-300">
                <Translate text={role.labelKey} />
              </TableCell>
              <TableCell className="px-6 py-4 text-center border-r border-slate-300">
                <Checkbox
                  className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white data-[state=unchecked]:bg-slate-100"
                  defaultChecked={role.canView}
                />
              </TableCell>
              <TableCell className="px-6 py-4 text-center border-r border-slate-300">
                <Checkbox
                  className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white data-[state=unchecked]:bg-slate-100"
                  defaultChecked={role.canEdit}
                />
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <Checkbox
                  className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white data-[state=unchecked]:bg-slate-100"
                  defaultChecked={role.canDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
  );
}
