import { Card } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { File, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { OfferDetailBodyProps } from "../types";

const getDocumentIconSrc = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "doc" || ext === "docx") return "/file-type-doc.png";
  return "/file-type-pdf.png";
};

export const OfferDetailBody = ({ data }: OfferDetailBodyProps) => {
  const imagePlaceholders = data.extraImagesCount > 0 ? 3 : 0;

  return (
    <Card className="border-t-0 border-slate-200 bg-white px-6 pb-6 pt-4 shadow-sm rounded-t-none rounded-b-xl">
      {/* Description */}
      <section className="pb-0">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">
          <Translate text={localizationConstants.offerDetailDescriptionTitle} />
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {data.description}
        </p>
      </section>

      <div className="border-t border-slate-200 pt-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          <Translate
            text={localizationConstants.offerDetailDocumentsAndImagesTitle}
          />
        </h2>

        {/* Images row */}
        <section className="pb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            <Translate text={localizationConstants.offerDetailImagesTitle} />
          </h3>
          <div className="flex flex-wrap gap-6">
            {data.images.map((image) => (
              <div
                key={image.id}
                className="flex w-[108px] flex-col items-center"
              >
                <div className="h-[88px] w-[108px] overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  <Image
                    src="/offer-details.png"
                    alt={image.label}
                    width={108}
                    height={88}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-2 w-full truncate text-center text-xs text-slate-500">
                  {image.label}
                </div>
              </div>
            ))}

            {Array.from({ length: imagePlaceholders }).map((_, idx) => {
              const isMore = idx === imagePlaceholders - 1;
              return (
                <div
                  key={`img-ph-${idx}`}
                  className="flex w-[108px] flex-col items-center"
                >
                  <div className="flex h-[88px] w-[108px] items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="mt-2 w-full truncate text-center text-xs text-slate-500">
                    {isMore ? `+${data.extraImagesCount} more` : "Photo.img"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="border-t border-slate-200 pt-6">
          {/* Document row */}
          <section className="pb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              <Translate
                text={localizationConstants.offerDetailDocumentTitle}
              />
            </h3>
            <div className="flex flex-wrap gap-6">
              {data.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex w-[108px] flex-col items-center"
                >
                  <div className="flex h-[72px] w-[108px] items-center justify-center rounded-md bg-transparent">
                    <Image
                      src={getDocumentIconSrc(doc.label)}
                      alt={doc.label}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div className="mt-2 w-full truncate text-center text-xs text-slate-600">
                    {doc.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="border-t border-slate-200 pt-6">
          {/* Drawing row */}
          <section>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              <Translate text={localizationConstants.offerDetailDrawingTitle} />
            </h3>
            <div className="flex flex-wrap gap-6">
              {data.drawings.map((drawing) => (
                <div
                  key={drawing.id}
                  className="flex w-[108px] flex-col items-center"
                >
                  <div className="flex h-[72px] w-[108px] items-center justify-center rounded-md bg-transparent">
                    {drawing.label.toLowerCase().endsWith(".pdf") ? (
                      <Image
                        src="/file-type-pdf.png"
                        alt={drawing.label}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <File className="h-10 w-10 text-slate-300" />
                    )}
                  </div>
                  <div className="mt-2 w-full truncate text-center text-xs text-slate-600">
                    {drawing.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Card>
  );
};
