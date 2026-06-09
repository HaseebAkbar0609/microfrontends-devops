import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function ConsultantDocument() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        <Translate text={localizationConstants.guideConsultant} />
      </h1>

      <p className="mt-4">
        <Translate text={localizationConstants.guideConsultantDescription} />
      </p>
    </div>
  );
}