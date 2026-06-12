import { useState } from "react";
import { GuideSidebar } from "./GuideSidebar";
import { OfferDocument } from "./documents/OfferDocument";
import { ConsultantDocument } from "./documents/ConsultantDocument";

export function GuideSection() {
  const [selectedDocument, setSelectedDocument] = useState("offert");
  return (
    <div className="flex -mt-2">
      <div className="h-[712px] w-[280px] border-r border-slate-200 bg-[#FAFAFA]">
        <GuideSidebar
          selectedDocument={selectedDocument}
          onSelectDocument={setSelectedDocument}
        />
      </div>

      <div className="h-[712px] w-[920px] pl-[46.5px] pt-8">
        {selectedDocument === "offert" && <OfferDocument />}
        {selectedDocument === "konsult" && <ConsultantDocument />}
      </div>
    </div>
  );
}
