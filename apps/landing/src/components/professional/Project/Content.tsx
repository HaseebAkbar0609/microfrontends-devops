import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProjectContent: React.FC = () => {
  // Carousel state
  const [current, setCurrent] = useState(0);
  const slides = [
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758003460/Body_sc0bzf.png",
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758003460/Body_sc0bzf.png",
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758003460/Body_sc0bzf.png",
  ];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full">
      {/* ================= HERO ================= */}
      <section className="container mx-auto pl-auto md:p-40 py-12 flex-col md:py-20 grid md:grid-cols-2 gap-10 items-center bg-gray-50">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Projekt modul för<br /> hantverkare
          </h1>
          <p className="text-gray-600 mb-6">
            Digitalisera hela projektflödet – från planering och resursfördelning till uppföljning och slutfört projekt.
          </p>
          <p>
            TimeFlow Projektmodul är utvecklad för att förenkla hela projektprocessen. Planera, resurssätt och följ upp projekt digitalt – snabbt, enkelt och professionellt.
          </p>
          <Button asChild className="mt-6 bg-[#FF914D] hover:bg-orange-400">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
        </div>
        <div className="relative">
          	{/* Video embed (desktop) */}
        <div className="relative flex-2/5">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              loading="lazy"
              title="Gumlet video player"
              src="https://play.gumlet.io/embed/68f1e526558b404636e3d3e4"
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

      {/* ================= STEPS ================= */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Se hur det fungerar</h2>
          <p className="text-gray-500 mt-2">
            Se stegen nedanför hur projektmodulen fungerar – från första planering till slutfört projekt.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Projektöversikt",
              desc: "Få en tydlig överblick över alla pågående och planerade projekt i ett samlat gränssnitt.",
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039013/019-suitcases_njqk5h.png",
              step: 1,
              highlight: true,
            },
            {
              title: "Planering & Tidsstyrning",
              desc: "Skapa projektplaner och fördela resurser effektivt för att hålla tidsramar och budgetar.",
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039012/028-edit_kkwu0q.png",
              step: 2,
            },
            {
              title: "Dokument & Avtal",
              desc: "Samla alla dokument, avtal och filer på ett ställe för enkel åtkomst och spårbarhet.",
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039012/012-top_xodvkz.png",
              step: 3,
            },
            {
              title: "Kvalitet & Kontroll (KMA)",
              desc: "Regelverk, miljö och arbetsmiljö (KMA) integrerat i projektflödet för kvalitetssäkring.",
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039012/078-done_ohmny9.png",
              step: 4,
            },
            {
              title: "Ekonomi & Uppföljning",
              desc: "Full budget, fakturering, ÄTA och kostnadskontroll integrerat i projektflödet.",
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039012/agreement_jcy73y.png",
              step: 5,
            },
            {
              title: "Avslut & Arkivering",
              desc: "Alla avslutade projekt arkiveras för statistik, analys och full spårbarhet.",
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039328/005-folder-1_p19owf.png",
              step: 6,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`border rounded-2xl p-6 text-left shadow-sm transition ${
                item.highlight ? "border-[#FF7A00]" : "border-gray-200"
              }`}
            >
              <div className="mb-3">
                <Image src={item.icon} alt={item.title} width={40} height={40} />
              </div>
              <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
              <span className="bg-[#FF7A00] text-white text-xs px-3 py-1 rounded-full">
                Steg {item.step}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TOP FEATURES SECTION ================= */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Funktioner som stödjer projekt hanteringen
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039012/024-search-page_ph6hnf.png",
              title: "Smart projektstart",
              desc: "Skapa projekt enkelt med definierade faser, snabbt, strukturerat och klart för produktion.",
            },
            {
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039012/045-edit-1_nziovi.png",
              title: "Full koll på allt",
              desc: "Samla filer, dokument, avtal, KMA, ekonomirapporter och checklistor i ett och samma system.",
            },
            {
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039011/053-send_et2tmr.png",
              title: "Ekonomi & uppföljning",
              desc: "Få full budget, fakturering, ÄTA och kostnadskontroll – med full spårbarhet.",
            },
            {
              icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758039440/031-partnership_xpm9we.png",
              title: "Spar tid i vardagen",
              desc: "Automatiserade dokumentationer, uppföljning och aviseringar – mindre admin, mer produktion.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 text-center shadow hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">
                <Image src={feature.icon} alt={feature.title} width={40} height={40} />
              </div>
              <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto px-24 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-3xl font-bold mb-6">
            Integrerat med hela<br /> TimeFlow
          </h2>
          <ul className="space-y-3 text-gray-600">
            {[
              "Integrerat med affärmodulen",
              "Koppling mot KMA-dokumentation",
              "Direkt överföring till ordermodul",
              "Koppling till resursmodulen",
              "Integration med ekonomimodulen",
              "Stöd för mallar och checklistor",
              "Koppling till tidrapportering",
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-[#FF7A00]">✔</span> {f}
              </li>
            ))}
          </ul>
        </div>
        	{/* Image Bottom */}
          <div className="relative flex-2/5 ">
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg" alt="" className="rounded-xl"/>
          </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-[#FF914D] py-12 text-center text-white">
        <div className="container mx-auto px-4 md:px-80 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Redo att komma igång?</h2>
            <p>Boka en demo idag för en gratis genomgång med våra experter.</p>
          </div>
          <div>
            <Button asChild className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= CAROUSEL ================= */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Jobba smartare med ett modernt projektverktyg</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Effektivisera din verksamhet genom att förenkla projektflödet – från första planering till avslutat projekt. 
          TimeFlow Projektmodul är designad för att underlätta varje steg i processen och ge dig full kontroll i realtid.
        </p>
        <div className="relative max-w-3xl mx-auto">
          <Image
            src={slides[current]}
            alt={`Slide ${current}`}
            width={600}
            height={400}
            className="rounded-xl mx-auto"
          />
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
          >
            <ChevronLeft className="w-6 h-6 text-[#FF7A00]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
          >
            <ChevronRight className="w-6 h-6 text-[#FF7A00]" />
          </button>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === current ? "bg-[#FF7A00]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="bg-[#FF914D0F] py-20 px-4">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Erbjudanden och viktiga fördelar
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Projektmodulen förvandlar projektledning och skapar en sömlös, trygg väg från planering till genomförande – för ökad lönsamhet, smidigare arbetsflöde och säkrare leveranser.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { title: "Fullständig projekt kontroll", desc: "Få full kontroll över hela projektet – planera, resurssätt och följ upp i realtid." },
            { title: "Spårning i realtid", desc: "Följ varje steg i projektet – med aviseringar, automatiska rapporter och uppföljning." },
            { title: "Lönsammare projekt", desc: "Optimera varje steg i projektet – från planering till avslutning – och öka lönsamheten." },
            { title: "Tidsbesparingar", desc: "Spara tid med smidiga arbetsflöden och automatiserade processer – från start till slut." },
          ].map((b, i) => (
            <div key={i} className="bg-white border rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition">
              <span className="bg-[#FF7A00] text-white px-3 py-1 rounded-full text-sm">
                {`0${i + 1}`}
              </span>
              <h3 className="font-semibold mt-4 mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL DEMO CTA ================= */}
      <section className="container mx-auto px-4 py-20 grid md:px-50 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Förenkla din vardag som <br /> hantverkare
          </h2>
          <p className="text-gray-600 mb-2 text-xl font-semibold">
            Boka en gratis demo av TimeFlow idag!
          </p>
          <p className="text-gray-600 mb-6">
            Se hur du sparar tid, ökar lönsamheten och får full kontroll på dina projekt.
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
      </section>
    </div>
  );
};

export default ProjectContent;
