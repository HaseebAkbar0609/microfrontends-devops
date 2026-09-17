"use client";
import { getProfileSettings } from "../../profile-settings/api/profileSettings.api";
import { useMyPagesQuery } from "../../shared/api";
import { MyPagesQueryState } from "../../shared/feedback";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import EmploymentDocuments from "./EmploymentDocuments";

export default function EmploymentContractCard() {
  const t = useTranslate();
  const query = useMyPagesQuery(["employment", "profile"], getProfileSettings);
  const profile = query.data;
  const fields = [
    [localizationConstants.myPagesEmpRole, profile?.position],
    [localizationConstants.myPagesEmpNumber, profile?.employmentNumber],
    [localizationConstants.myPagesEmpName, [profile?.firstName, profile?.lastName].filter(Boolean).join(" ")],
    [localizationConstants.myPagesEmpPersonNo, profile?.personalId],
    [localizationConstants.myPagesEmpAddress, profile?.streetAddress],
    [localizationConstants.myPagesEmpPostalCode, profile?.postalCode],
    [localizationConstants.myPagesEmpCity, profile?.cityName],
    [localizationConstants.myPagesEmpMobile, profile?.phone],
    [localizationConstants.myPagesEmpEmail, profile?.email],
  ];
  return <div className="space-y-5">
    <MyPagesQueryState query={query} />
    {profile && <dl className="grid grid-cols-1 gap-5 rounded-md border border-slate-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-4">
      {fields.map(([label, value]) => <div key={label}><dt className="text-sm font-medium"><Translate text={label!} /></dt>
        <dd className="mt-1 break-words text-sm text-slate-500">{value || t(localizationConstants.myPagesUnavailable)}</dd></div>)}
    </dl>}
    <EmploymentDocuments kind="contract" />
  </div>;
}
