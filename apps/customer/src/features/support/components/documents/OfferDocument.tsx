import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function OfferDocument() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        <Translate text={localizationConstants.guideQuote} />
      </h1>

      <p className="mt-4">
        <Translate text={localizationConstants.guideQuoteDescription} />
      </p>
    </div>
  );
}
