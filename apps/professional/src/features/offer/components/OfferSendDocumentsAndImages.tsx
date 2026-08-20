"use client";

import { FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { OfferSendDocumentsAndImagesProps } from "../types";

const getDocumentIconSrc = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "doc" || ext === "docx") return "/file-type-doc.png";
  return "/file-type-pdf.png";
};

export function OfferSendDocumentsAndImages({
  data,
}: OfferSendDocumentsAndImagesProps) {
  const t = useTranslate();
  const imagePlaceholders = data.extraImagesCount > 0 ? 3 : 0;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 font-sans font-medium text-[14px] leading-[20px] tracking-normal text-[#09090B]">
          <Translate text={localizationConstants.offerDetailImagesTitle} />
        </div>
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
              <div className="mt-2 w-full truncate text-center font-sans font-normal text-xs leading-5 text-[#64748B]">
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
                <div className="mt-2 w-full truncate text-center font-sans font-normal text-xs leading-5 text-[#64748B]">
                  {isMore ? `+${data.extraImagesCount} ${t(localizationConstants.offerMoreImages)}` : "Photo.img"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-px w-full bg-slate-200" />

      <section>
        <div className="mb-4 font-sans font-medium text-[14px] leading-[20px] tracking-normal text-[#09090B]">
          <Translate text={localizationConstants.offerDetailDocumentTitle} />
        </div>
        <div className="flex flex-wrap gap-3">
          {data.documents.map((doc) => (
            <div key={doc.id} className="flex w-[108px] flex-col items-center">
              <div className="flex h-[72px] w-[108px] items-center justify-center rounded-md bg-transparent">
                <Image
                  src={getDocumentIconSrc(doc.label)}
                  alt={doc.label}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="mt-2 w-full truncate text-center font-sans font-normal text-xs leading-5 text-[#64748B]">
                {doc.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-slate-200" />

      <section>
        <div className="mb-4 font-sans font-medium text-[14px] leading-[20px] tracking-normal text-[#09090B]">
          <Translate text={localizationConstants.offerDetailDrawingTitle} />
        </div>
        <div className="flex flex-wrap gap-3">
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
                  <FileText className="h-10 w-10 text-slate-300" />
                )}
              </div>
              <div className="mt-2 w-full truncate text-center font-sans font-normal text-xs leading-5 text-[#64748B]">
                {drawing.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
