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
              TimeFlowSystem
            </h1>
            <p className="mt-4 text-gray-600">
              <span className="font-semibold text-xl">
                Smartare projekthantering för konsulter och arkitekter. Bättre
                överblick, smidigare samarbete och trygg leverans varje gång
              </span>
              <br />
              TimeFlow är utvecklat för konsulter och arkitekter. Planera,
              samordna och följ upp projekt och kunddialog - digitalt och direkt
              i mobilen.
            </p>
            <Button asChild className="mt-6 bg-[#FF914D] hover:bg-orange-400">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
          </div>
          {/* Video embed */}
          <div className="relative flex-2/5">
            <div style={{ position: "relative", aspectRatio: "16/9" }}>
              <iframe
                loading="lazy"
                title="Gumlet video player"
                src="https://play.gumlet.io/embed/68f1e3d46b5c1015acedf37e"
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
            Vanliga utmaningar i konsult-och arkitektbranschen
          </h2>
          <div className="grid md:grid-cols-2 gap-10 mt-12">
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-700">
                <li>
                  ✔️ Snabba beslut - många inblandade Projekten involverar ofta
                  byggherrar, entreprenörer, myndigheter och andra konsulter -
                  vilket kräver tydlig samordning.
                </li>
                <li>
                  ✔️ Otydliga beställningar leder till feltolkningar och
                  kostsamma ändringar Missförstånd kring omfattning, tidplan
                  eller leveranser ger snabbt merarbete.
                </li>
                <li>
                  ✔️ Information sprids i olika kanaler - mejl, sms,
                  mötesanteckningar Det är lätt att tappa bort viktig
                  kommunikation, beslut eller ändringar.
                </li>
                <li>
                  ✔️ Svårt att följa upp lönsamhet per projekt eller fas. Tid
                  och resurser registreras inte korrekt -vilket påverkar analys
                  och fakturering.
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
                Så hjälper TimeFlow System din konsult- eller arkitektverksamhet
              </h1>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6 ">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={28} className="text-orange-600" />
                    Projekthantering
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Allt samlat Från offert till slutfaktura. Samla ritningar,
                    underlag, mötesprotokoll och deadlines på ett ställe.
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
                    Tidsregistrering per uppdrag, fas eller team - med stöd för
                    tilläggsuppdrag och parallella projekt.
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
                    Planera inköp av licenser, programvaror, modeller och följ
                    användningen över tid (anpassat efter behov).
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
                    Få kontroll över timmar, kostnader, kalkyler och marginaler
                    - per projekt, kund eller uppdragstyp.
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
                    Skapa arbetsorder, dokumentera platsbesök eller rapportera
                    tid direkt från mobilen - perfekt för platsbesök och
                    uppföljning.
                  </p>
                </CardContent>
              </Card>
              <p>
                Skapa konto idag och digitalisera din projekthantering med
                TimeFlow System - för bättre kontroll, tydligare processer och
                ökad lönsamhet.
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
            “Tidrapportering, uppföljning och dokumentation tog för mycket tid -
            nu har vi allt samlat och jobbar mycket smartare.”
          </blockquote>
          <p className="mt-2 text-gray-600">– Helena, VD, Formark Arkitekter AB</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-gray-700">
            <p>
              ✔️ Spara upp till 20% av din tid Minska den administrativa bördan
              frigör mer tid för analyser, planering och kundvärde.
            </p>
            <p>
              ✔️ Bättre kontroll på projektlönsamheten Följ timmar,
              resursutnyttjande och budget i realtid - fas för fas, projekt för
              projekt.
            </p>
            <p>
              ✔️ Färre fel och ökad kvalitet Tydliga uppdragsbeskrivningar,
              deadlines och processflöden minskar risken för missar och omtag.
            </p>
            <p>
              ✔️ Digital hantering av uppdrag Tidrapportering, avstämningar och
              dokumentation samlas digitalt - spårbart och strukturerat.
            </p>
            <p>
              ✔️ Smidigare samarbete i teamet Alla jobbar med samma uppdaterade
              information - oavsett om det gäller interna resurser eller externa
              parter.
            </p>
            <p>
              ✔️ Enklare uppföljning och efterlevnad Följ upp kvalitetskrav,
              avtal och leveransvillkor utan att missa viktiga detaljer.
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
              "Arkitekt",
              "Konstruktions konsult",
              "VVS-konsult",
              "El-konsult",
              "Ljudkonsult",
              "Brandkonsult",
              "Ventilatiions konsult",
              "Trädgårds arkitekt",
              "Kvalitetsansvarig",
              "Besiktning",
              "Utsättning",
              "Färgsättnings -konsult",
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

      {/* CTA Section (Carousel Replaced Here) */}
      <section className=" text-white py-20">
        <div className="text-center ">
          <h2 className="text-4xl font-bold text-black mb-5">
            Bli ledande i din bransch
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
          {/* 🔄 Carousel */}
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

            {/* Controls */}
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

            {/* Dots */}
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

          <div>
            <h2 className="text-2xl font-bold text-[#FF914D] mt-5">
              Bli ledande i konsult- och arkitektbranschen
            </h2>
            <p className="mt-5 text-black/90 text-xl">
              Digitalisera din verksamhet och få full kontroll med TimeFlow
              System - skapat för arkitektkontor, tekniska konsulter och
              projektledare i bygg- och fastighetssektorn.
            </p>
            <p className="mt-4 text-black/90 ">
              Mindre administration - mer tid till kreativt och strategiskt
              arbete Samla uppdrag, avtal, tidrapportering och och
              dokumentation i ett system. Slipp fragmenterad information och
              frigör tid för värdeskapande insatser.
            </p>
            <p className="mt-4 text-black/90">
              Full överblick i realtid från idé till leverans Följ projektets
              faser, deadlines, underlag och kundkommunikation - allt uppdateras
              automatiskt, för hela teamet.
            </p>
            <p className="mt-4 text-black/90">
              Styr ekonomi och resurser med precision Få full kontroll på
              budget, timmar och och fakturering. Jämför kalkyl mot utfall - per
              projekt, fas eller kund.
            </p>
            <p className="mt-4 text-black/90">
              Hantera personal och leveranskvalitet med struktur Planera arbets
              arbetsbelastning, hantera hantera tilläggsuppdrag och säkra
              kvalitet genom tydliga roller, checkpunkter och dokumentation.
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
              <br></br>Se hur du sparar tid, får fler affärer och full kontroll
              på dina projekt.
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
