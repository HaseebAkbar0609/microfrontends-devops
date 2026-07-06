import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ActiveProject } from "../../types";

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-[#09090B]">
        <Translate text={label} />
      </p>
      <p className="text-sm font-medium text-[#71717A]">{value || "-"}</p>
    </div>
  );
}

interface PersonalInfoTabProps {
  project: ActiveProject;
}

export function PersonalInfoTab({ project }: PersonalInfoTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      {/* Project Information */}
      <Card className="border border-slate-200 shadow-none rounded-xl overflow-hidden bg-white p-0">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center gap-2 !p-4">
          <Image
            src="/assets/icons/personal-info.svg"
            alt=""
            width={20}
            height={20}
          />
          <CardTitle className="text-sm font-semibold text-slate-900 flex-1">
            <Translate text={localizationConstants.projectInfoTitle} />
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1.5 text-sm font-medium text-slate-700 border-slate-200"
          >
            <Image
              src="/assets/icons/edit.svg"
              alt=""
              width={14}
              height={14}
            />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <InfoRow
              label={localizationConstants.projectNameLabel}
              value={project.name}
            />
            <InfoRow
              label={localizationConstants.projectReferenceNoLabel}
              value={project.referenceNo}
            />
            <InfoRow
              label={localizationConstants.projectStartDateLabel}
              value={project.startDate}
            />
            <InfoRow
              label={localizationConstants.projectClientNoLabel}
              value={project.clientNo}
            />
            <InfoRow
              label={localizationConstants.projectNoLabel}
              value={project.projectNo}
            />
            <InfoRow
              label={localizationConstants.projectEndDateLabel}
              value={project.endDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="border border-slate-200 shadow-none rounded-xl overflow-hidden bg-white p-0">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center gap-2 !p-4">
          <Image
            src="/assets/icons/personal-info.svg"
            alt=""
            width={20}
            height={20}
          />
          <CardTitle className="text-sm font-semibold text-slate-900 flex-1">
            <Translate text={localizationConstants.projectCompanyInfoTitle} />
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1.5 text-sm font-medium text-slate-700 border-slate-200"
          >
            <Image
              src="/assets/icons/edit.svg"
              alt=""
              width={14}
              height={14}
            />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <InfoRow
              label={localizationConstants.projectCompanyNameLabel}
              value={project.companyName}
            />
            <InfoRow
              label={localizationConstants.projectContactPersonNameLabel}
              value={project.contactPersonName}
            />
            <InfoRow
              label={localizationConstants.projectMobileNumberLabel}
              value={project.mobileNumber}
            />
            <InfoRow
              label={localizationConstants.projectEmailAddressLabel}
              value={project.email}
            />
            <InfoRow
              label={localizationConstants.projectAddressLabel}
              value={project.address}
            />
            <InfoRow
              label={localizationConstants.projectPostalCodeLabel}
              value={project.postalCode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
