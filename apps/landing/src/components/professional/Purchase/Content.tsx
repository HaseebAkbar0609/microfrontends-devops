import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PurchaseContent: React.FC = () => {
  // Carousel State
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
      <section className="container mx-auto px-6 md:px-20 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">INKÖP</h1>
          <p className="text-xl text-gray-700 font-semibold mb-4">
            Effektivisera företagets inköp med smart beställningshantering
          </p>
          <p className="text-gray-600 mb-6">
            Inköpsmodulen ger en komplett beställningsprocess från behov till leverans. 
            Med enkel hantering av inköp för material, maskiner och tjänster.
          </p>
          <button className="bg-[#FF7A00] text-white px-6 py-3 rounded-xl font-medium">
            Visa video
          </button>
        </div>
        <div className="relative">
          	{/* Video embed (desktop) */}
        <div className="relative flex-2/5">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              loading="lazy"
              title="Gumlet video player"
              src="https://play.gumlet.io/embed/68f1e65c6b5c1015acee72d0"
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

      {/* ================= FUNKTIONER ================= */}
      <section className="container mx-auto px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold mb-12">Funktioner och fördelar</h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Image
            src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1758507383/f077961d0567567ed7e76f33a9ef56d37891da02_xs2zl2.png"
            alt="Funktioner"
            width={400}
            height={400}
            className="rounded-xl mx-auto"
          />
          <div className="space-y-10">
            {[
              {
                title: "Bevaka dina beställningar",
                desc: "Beställ material och tjänster, följ upp tros leverantörer och övervaka leveransstatus i en strukturerad beställningslista.",
              },
              {
                title: "Inköpsorder direkt från projekt",
                desc: "Köp för inköpsbehovet från projekten smidigt, fördela inköpsorder till kostnadsställe och följ kostnader.",
              },
              {
                title: "Se lagersaldo i realtid",
                desc: "Håll dig uppdaterad på lagersaldo för material, beställ direkt vid behov från lagersituationen.",
              },
              {
                title: "Jämför leverantörspriser",
                desc: "Jämför priser, leveranstider och villkor från olika leverantörer för bästa inköp.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="bg-[#FF7A00] text-white px-4 py-2 rounded-full font-bold">
                  {`0${idx + 1}`}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTEGRATION ================= */}
      <section className="container mx-auto px-6 md:px-20 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Integrerat med hela TimeFlow</h2>
          <ul className="space-y-3 text-gray-600">
            {[
              "Upphandling och kostnadsstyrning från kalkyl",
              "Automatisk orderöverföring från projekt",
              "Integration med offert/B2B för priser och villkor",
              "Direktkoppling till projekt och orderflöde",
              "KMA-koppling för dokumentation av inköp",
              "CRM-stöd för leverantörsrelationer",
              "Mallar för avtal och beställningar",
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

      {/* ================= CTA ================= */}
      <section className="bg-[#FF914D] py-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Redo att komma igång?</h2>
        <p className="mb-6">Boka en demo idag för en gratis genomgång med våra experter.</p>
        <Button asChild className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
      </section>

      {/* ================= CAROUSEL ================= */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Effektivt inköp med full spårbarhet</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Inköpsmodulen ger dig full kontroll över hela inköpsprocessen – från behov till beställning 
          till leverans. Skapa inköpsorder, följ upp kostnader och säkerställ att allt material är på plats 
          i tid och till rätt pris för en smidigare och mer kostnadseffektiv hantering.
        </p>

        <div className="relative max-w-4xl mx-auto">
          <Image
            src={slides[current]}
            alt={`Slide ${current}`}
            width={900}
            height={500}
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

      {/* ================= ERBJUDANDEN ================= */}
      <section className="bg-[#FF914D0F] py-20 px-6">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Erbjudanden och viktiga fördelar</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Inköpsmodulen förvandlar inköpsprocessen och säkerställer en smidig och effektiv väg från behov till leverans – 
            för bättre kostnadskontroll, tydlig spårbarhet och välkoordinerade projekt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Smidiga inköp per projekt",
              desc: "Skapa inköpsunderlag direkt från kalkylen och koppla till rätt projekt, arbetsorder eller ansvarig person.",
            },
            {
              title: "Jämför priser och leverantörer",
              desc: "Välj rätt leverantör med hjälp av prisjämförelser, leveranstider och tidigare beställningar direkt i systemet.",
            },
            {
              title: "Minska svinn och felköp",
              desc: "Koppla inköp till verkligt behov i projekten, så att rätt mängd beställs – varken mer eller mindre.",
            },
            {
              title: "Samlad inköpeshistorik",
              desc: "Följ alla inköp i realtid med tydlig spårbarhet. Se vem som beställt vad, när och till vilket pris.",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition"
            >
              <span className="bg-[#FF7A00] text-white px-3 py-1 rounded-full text-sm">
                {`0${i + 1}`}
              </span>
              <h3 className="font-semibold mt-4 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="container mx-auto px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Förenkla din vardag som hantverkare
          </h2>
          <p className="text-gray-600 mb-2 text-xl font-semibold">
            Boka en gratis demo av TimeFlow idag!
          </p>
          <p className="text-gray-600 mb-6">
            Se hur du sparar tid, får fler affärer och full kontroll på dina projekt.
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

export default PurchaseContent;
