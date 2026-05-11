import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link"; 
import { Button } from "@/components/ui/button";

const InvoiceContent: React.FC = () => {
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
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            FAKTURA
          </h1>
          <p className="text-gray-600 mb-6 text-xl font-semibold">
            Effektiv fakturering med flexibla funktioner som ger full spårbarhet
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
              src="https://play.gumlet.io/embed/68f1e65c6b5c1015acee72ce"
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

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto px-6 md:px-20 py-16 grid md:grid-cols-2 gap-10 items-center">
        <Image
                  src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1758507383/f077961d0567567ed7e76f33a9ef56d37891da02_xs2zl2.png"
                  alt="Included"
                  width={350}
                  height={350}
                  className="rounded-xl mx-auto"
                />
        <div>
          <h2 className="text-3xl font-bold mb-10">Smidig fakturering med full spårbarhet</h2>
          <div className="space-y-16">
            {[
              {
                title: "Skapa tid- och projektfakturor",
                desc: "Spara tid och minska fel genom att fakturera arbetad tid eller material direkt från projekten.",
              },
              {
                title: "Skicka digitala fakturor",
                desc: "Skicka snabbt och säkert dina företagsfakturor elektroniskt via e-post, kundportal eller e-faktura.",
              },
              {
                title: "Automatisera faktura-flödet",
                desc: "Effektivisera faktureringen genom att automatiskt lägga till projekt-kostnader, priser och villkor.",
              },
              {
                title: "Håll koll på status och betalning",
                desc: "Följ varje faktura med full spårbarhet: från skickad och betald till vidare till påminnelse.",
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
              "Automatisk fakturering från projekt och order",
              "Ekonomiintegration för bokföring och uppföljning",
              "Prognoskoppling för kassaflödesstyrning",
              "Inkassointegration vid utebliven betalning",
              "Juridiskt stöd för avtalssäkrad fakturering",
              "Företagsledningkoppling för kontroll och attest",
              "Mallar för fakturaunderlag och villkor",
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-[#FF7A00]">✔</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <Image
          src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg"
          alt="Integration"
          width={450}
          height={350}
          className="rounded-xl mx-auto"
        />
      </section>

      {/* ================= CTA SECTION ================= */}
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
        <h2 className="text-3xl font-bold mb-4">Smidig och professionell fakturering</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Fakturamodulen gör att du enkelt kan skapa fakturor snabbt och digitalt – alltid med full kontroll och spårbarhet över projekten. Hantera fakturaflödet digitalt, spara tid i rutiner och säkerställ att inget faller mellan stolarna.
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

      {/* ================= BENEFITS ================= */}
      <section className="bg-[#FF914D0F] py-20 px-6">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Erbjudanden och viktiga fördelar</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Fakturamodulen förvandlar faktureringen till en smidig och professionell process – från skapande med färdiga mallar till överblick och uppföljning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Skapa fakturor snabbt",
              desc: "Bygg fakturaunderlag direkt från tidrapporter, material och order – klart att skicka med ett klick.",
            },
            {
              title: "Full spårbarhet per projekt",
              desc: "Koppla varje faktura till rätt projekt och få tydlig överblick över vad som är fakturerat och kvar att fakturera.",
            },
            {
              title: "Automatisera flödet",
              desc: "Ställ in fakturaplaner, påminnelser och export till ekonomisystem för smidigare administration.",
            },
            {
              title: "Minska fel och missar",
              desc: "Använd färdiga mallar och kontroller för att säkerställa att alla fakturor blir korrekta varje gång.",
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

      {/* ================= FINAL DEMO CTA ================= */}
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

export default InvoiceContent;
