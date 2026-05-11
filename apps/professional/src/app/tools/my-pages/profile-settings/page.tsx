import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { ProfileSettingsTabs } from "@/features/my-pages/profile-settings";
import localizationConstants from "@/utils/translation/constants";
export default function Page() {
  return (
    <div className="pt-6">
      <div className="px-6">
        <DynamicBreadcrumb
          className="!text-2xl mb-3"
          items={[
            { translationKey: localizationConstants.myPages, href: "/tools/my-pages" },
            { translationKey: localizationConstants.profileSettings },
          ]}
        />
      </div>
     <ProfileSettingsTabs />
    </div>
  )
}
