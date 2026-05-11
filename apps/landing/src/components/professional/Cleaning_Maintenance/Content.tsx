"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Package, FileText, Clock } from "lucide-react";
import { BiMobile } from "react-icons/bi";
import Link from "next/link";

const Content = () => {
  // === Carousel Logic ===
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      id: 1,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/63bee7ac8e1d6a8c8e07335fb7faaef27a0bf933_bceko8.png",
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759423674/Frame_2147226615_bgse57.png",
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759423674/Frame_2147226624_cntwnx.png",
    },
    {
      id: 4,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759423674/Frame_2147226631_vqghhb.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 my-10 mb-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center px-6">
          <div>
            <h1 className="text-3xl font-bold leading-snug text-gray-900">
              Från planering till utförande
            </h1>
            <p className="mt-4 text-gray-600">
              <span className="font-semibold text-xl">
                TimeFlowSystem ger total kontroll och ökad effektivitet i
                städ- och underhållsarbetet.
              </span>
              <br />
              TimeFlow är utvecklat för städ- och underhållsbranschen. Planera
              och följ upp uppdrag, personal och kundkontakt digitalt - direkt i
              mobilen.
            </p>
            <Button asChild className="mt-6 bg-[#FF914D] hover:bg-orange-400">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
          </div>
          {/* Video embed (desktop) */}
          <div className="relative flex-2/5">
            <div style={{ position: "relative", aspectRatio: "16/9" }}>
              <iframe
                loading="lazy"
                title="Gumlet video player"
                src="https://play.gumlet.io/embed/68f1dfeb558b404636e30e8d"
                style={{
                  border: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className="rounded-xl"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            Vanliga utmaningar i städ- och underhållsbranschen
          </h2>
          <div className="grid md:grid-cols-2 gap-10 mt-12">
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-700">
                <li>
                  ✔️ Snabba beslut-många aktörer Samarbete mellan kund, personal
                  och ibland externa leverantörer kräver tydlig kommunikation.
                </li>
                <li>
                  ✔️ Otydliga beställningar leder till missförstånd och
                  extrakostnader. När uppdrag ändras i sista stund eller saknar
                  detaljerad information riskerar arbetet att bli fel.
                </li>
                <li>
                  ✔️ Papper, sms och mejl i olika kanaler Planering, ändringar
                  och rapportering utspritt-vilket skapar förvirring.
                </li>
                <li>
                  ✔️ Svårt att följa upp lönsamheten per uppdrag eller kund
                  Tider, tilläggstjänster och material glöms lätt bort i
                  faktureringen.
                </li>
              </ul>
              <Link href="https://timeflowsystem.com/register/member" target="_self">
                <Button
                  variant="outline"
                  className="mt-6 bg-[#FF914D] text-white hover:bg-orange-400"
                >
                  Skapa konto
                </Button>
              </Link>
            </div>
            <div className="grid gap-6">
              <h1 className="text-[#FF914D] font-bold text-xl">
                Så hjälper TimeFlow System din städ-eller
                underhållsverksamhet
              </h1>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6 ">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={28} className="text-orange-600" />
                    Projekthantering
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Allt samlat på ett ställe Från offert till färdig faktura
                    -uppdrag, arbetsbeskrivningar, kontaktuppgifter och
                    checklistor.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Users size={28} className="text-orange-600" />
                    Personal & Tid
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Effektiv tidrapportering, resursplanering och enkel hantering
                    av tilläggstjänster vid varje uppdrag.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Package size={28} className="text-orange-600" />
                    Material & Maskin
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Planera inköp och leveranser av städmaterial och följ
                    användning av maskiner och utrustning.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock size={18} className="text-orange-600" />
                    Ekonomi & Uppföljning
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Följ kostnader, fakturaunderlag, prognoser och vinstmarginal
                    per uppdrag, kund eller avtal.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BiMobile size={28} className="text-orange-600" />
                    Fältapp för snickare, betongarbetare & arbetsledare
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Skapa arbetsorder, rapportera avvikelser och avsluta uppdrag
                    direkt i mobilen - snabbt och enkelt.
                  </p>
                </CardContent>
              </Card>
              <p>
                Skapa konto idag och få full kontroll över din städ- och
                underhållsverksamhet - med TimeFlow System.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-5">
            Vad du vinner med TimeFlow System
          </h1>
          <blockquote className="text-xl italic text-gray-800">
            “Vi hade svårt att hålla ihop planeringen - nu har vi full kontroll
            på personal, uppdrag och fakturering.”
          </blockquote>
          <p className="mt-2 text-gray-600">– Sofia, VD,Klarservice AB</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-gray-700">
            <p>
              ✔️ Mer tid till kunduppdrag Minska administrationen och fokusera
              mer på leverans och service.
            </p>
            <p>
              ✔️ Stenkoll på lönsamheten Följ arbetsinsats, material och
              tilläggstjänster i realtid - uppdrag för uppdrag.
            </p>
            <p>
              ✔️Färre missförstånd och ökad trygghet Tydliga instruktioner och
              checklistor ger bättre kvalitet och säkrare arbetsmiljö.
            </p>
            <p>
              ✔️ Digitalt istället för papper All hantering av arbetsorder, tid
              och rapporter sker i mobilen eller datorn.
            </p>
            <p>
              ✔️ Bättre samspel mellan kontor och personal. All information finns
              på ett ställe lättillgängligt och uppdaterat.
            </p>
            <p>
              ✔️ Enklare att följa regler och rutiner Systemet stödjer
              arbetsmiljökrav, kvalitetskontroller och dokumentation.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Timeflow passar även för
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 ">
            {[
              "Flyttstäning",
              "Fönsterputsning",
              "Sanering, klotter",
              "Golvvård",
              "Fasadrengöring",
              "Kontors-hemstädning",
              "Matt-tvättning",
              "Ventilations -rengöring",
              "Grovstädning",
              "Trapp-polering",
              "Brandsanering",
              "Dödsbostädning",
            ].map((item) => (
              <div
                key={item}
                className="bg-white shadow rounded-md px-6 py-4 flex items-center justify-center text-gray-900 font-medium text-base hover:shadow-lg transition"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (carousel inserted here) */}
      <section className="text-white py-20">
        <div className="text-center ">
          <h2 className="text-4xl font-bold text-black mb-5">
            Bli ledande i din bransch
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
          {/* Carousel */}
          <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg bg-white">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 relative h-[320px] md:h-[420px]"
                >
                  <Image
                    src={slide.img}
                    alt={`Slide ${slide.id}`}
                    fill
                    className="object-contain bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 left-4 bg-gray-800 text-white rounded-full p-3 shadow-md hover:bg-gray-700 transition"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 right-4 bg-gray-800 text-white rounded-full p-3 shadow-md hover:bg-gray-700 transition"
            >
              →
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    idx === currentSlide
                      ? "bg-gray-800 scale-125"
                      : "bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Text beside carousel */}
          <div>
            <h2 className="text-2xl font-bold text-[#FF914D] mt-5">
              Bli ledande i städ- och underhållsbranschen
            </h2>
            <p className="mt-5 text-black/90 text-xl">
              Digitalisera din verksamhet och få full kontroll med TimeFlow
              System - utvecklat för företag inom lokalvård, fastighetsskötsel
              och tekniskt underhåll.
            </p>
            <p className="mt-4 text-black/90 ">
              Mindre administration. - mer tid för kund och kvalitet Samla
              arbetsorder, planering och rapportering i ett och samma system.
              Slipp utspridd information via lappar, sms och mejl.
            </p>
            <p className="mt-4 text-black/90">
              Allt i realtid - från schemaläggning till utfört arbete Få snabb
              översikt över bemanning, uppdrag och avvikelser. Följ arbetsflöden
              och kvalitetssäkra leveransen direkt från fältet.
            </p>
            <p className="mt-4 text-black/90">
              Styr ekonomi och resurser smartare Följ upp timmar, kostnader och
              tilläggstjänster -uppdaterat per kund, objekt eller uppdrag. Minska
              fel och förbättra faktureringsunderlaget.
            </p>
            <p className="mt-4 text-black/90">
              Hantera personal, säkerhet och rutiner med tydlighet Planera
              arbetslag, hantera arbetsmiljörutiner och säkerställ hög kvalitet
              genom tydliga roller, checklistor och återkoppling från fältet.
            </p>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Förenkla din vardag som hantverkare
            </h2>
            <p className="mt-4 text-gray-600">
              <span className="font-semibold text-2xl">
                Boka en gratis demo av TimeFlow idag!
              </span>{" "}
              <br />
              Se hur du sparar tid, får fler affärer och full kontroll på dina
              projekt.
            </p>
            <Button asChild className="mt-6 bg-[#FF914D] hover:bg-orange-400">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
          </div>
          {/* Image Bottom */}
          <div className="relative flex-2/5 ">
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg" alt="" className="rounded-xl"/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;
