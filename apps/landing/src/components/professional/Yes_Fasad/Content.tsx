"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, FileText, Clock } from "lucide-react";
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
              Maximal kontroll i varje steg
            </h1>
            <p className="mt-4 text-gray-600">
              <span className="font-semibold text-xl">
                TimeFlowSystem revolutionerar tak- och fasadarbetet med digital
                planering, smart projektstyrning och färre fel. Spara tid och
                öka lönsamheten.
              </span>
              <br />
              Få kontroll på tak- och fasadjobb - från planering till
              färdigställande. TimeFlow System effektiviserar arbetsflödet,
              minskar stillestånd och ökar lönsamheten.
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
                src="https://play.gumlet.io/embed/68f1e3d4befe20b134d2f766"
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
            Utmaningar i branschen
          </h2>
          <div className="grid md:grid-cols-2 gap-10 mt-12">
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-700">
                <li>✔️ Snabba beslut - många inblandade aktörer på plats</li>
                <li>✔️ Otydliga beställningar - leder lätt till dyra missförstånd</li>
                <li>
                  ✔️ Ostrukturerad kommunikation - papper, sms och mail i olika
                  kanaler
                </li>
                <li>
                  ✔️ Svårt att följa upp lönsamhet - brist på kontroll per projekt
                </li>
              </ul>
              <Link
                href="https://timeflowsystem.com/register/member"
                target="_self"
              >
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
                Så hjälper TimeFlow System dig:
              </h1>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-6 ">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={28} className="text-orange-600" />
                    Projekthantering
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Få full kontroll från anbud till slutfaktura. Samla
                    ritningar, avtal, egenkontroller, ÄTA och arbetsflöden på
                    ett ställe.
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
                    Tydlig tidrapportering och resursplanering anpassat för bygg
                    och betong. Hantera tilläggsarbeten direkt i systemet.
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
                    Få full koll på materialleveranser, beställningar och
                    maskinanvändning. Logga allt för bättre planering och
                    uppföljning.
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
                    Ha kontroll på kostnader, täckningsbidrag och ÄTA. Få
                    uppföljningar i realtid för ökad lönsamhet.
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
                    Skapa arbetsorder, rapportera tid, fota och dokumentera
                    direkt i mobilen även ute på bygget.
                  </p>
                </CardContent>
              </Card>

              <p>
                Skapa konto och testa TimeFlow System för ditt mark- och
                schaktföretag redan idag!
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
            “Vi gick från kaos i Excel, till full kontroll – och ökad lönsamhet
            direkt”
          </blockquote>
          <p className="mt-2 text-gray-600">– Anders, VD, Bygg & Betong AB</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-gray-700">
            <p>✔️ Spara upp till 20% tid Mindre admin - mer fokus på produktion.</p>
            <p>✔️ Bättre koll på lönsamheten Följ kostnader och vinst i realtid.</p>
            <p>✔️ Färre fel & ökad säkerhet Tydliga instruktioner och checklistor.</p>
            <p>
              ✔️ Mindre pappersarbete Digitala arbetsorder, rapporter &
              avvikelser.
            </p>
            <p>✔️ Smidigare samarbete All kommunikation på ett ställe.</p>
            <p>✔️ Säker efterlevnad Full koll på arbetsmiljö och dokumentation.</p>
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
              "Murare",
              "Plattsättare",
              "Fasadarbete",
              "Putsarbete",
              "Plåtslagare",
              "Klottersanneing",
              "Skifferläggning",
              "Industrifasader",
              "Träfasad",
              "Taksäkerhet",
              "Sudumtak",
              "Historiska byggnader",
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

      {/* CTA Section with Carousel */}
      <section className=" text-white py-20">
        <div className="text-center ">
          <h2 className="text-4xl font-bold text-black mb-5">
            Bli ledande i din bransch
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
          {/* === Replaced Static Image with Carousel === */}
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

          {/* Text beside carousel */}
          <div>
            <h2 className="text-2xl font-bold text-[#FF914D] mt-5">
              Bli ledande i tak- och fasadbranschen
            </h2>
            <p className="mt-5 text-black/90 text-xl">
              Digitalisera din verksamhet och stärk din konkurrenskraft med
              TimeFlow System - anpassat för entreprenörer inom tak, fasad, plåt
              och tätning.
            </p>
            <p className="mt-4 text-black/90">
              Mindre administration – mer tid på taket. Få full kontroll från
              offert till färdigställande. Minska pappersarbetet och få struktur
              i hela arbetsflödet – även i höjd och väder.
            </p>
            <p className="mt-4 text-black/90">
              Smarta beslut med realtidsdata från fältet. Få korrekt information
              om pågående jobb - direkt från montörer och arbetsledare. Allt från
              planering till dokumentation i samma system.
            </p>
            <p className="mt-4 text-black/90">
              Styr ekonomi och logistik tidigt i projektet. Följ upp kostnader,
              leveranser och maskinanvändning i realtid.
            </p>
            <p className="mt-4 text-black/90">
              Hantera personal och kvalitet med kontroll. Planera resurser,
              hantera tilläggsarbeten och skapa tydliga arbetsuppgifter.
              Förbättra arbetsmiljön och leveranskvaliteten - varje dag.
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
              </span>
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
