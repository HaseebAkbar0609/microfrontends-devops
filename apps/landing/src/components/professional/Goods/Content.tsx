import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link"; 
import { Button } from "@/components/ui/button";

const GoodsContent: React.FC = () => {
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
            MALLAR <br />
            <span className="text-xl text-gray"> Använd färdiga mallar för alla dina dokument och standarddokumentation </span>
          </h1>
          <p className="text-gray-600 mb-6">
            Skapa, anpassa och lagra olika typer av mallar för standardiserad dokumentation.
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
              src="https://play.gumlet.io/embed/68f1e5256b5c1015acee3282"
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

      {/* ================= WHAT'S INCLUDED ================= */}
      <section className="container mx-auto px-6 md:px-20 py-16 grid md:grid-cols-2 gap-10 items-center">
        <Image
          src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1758507383/f077961d0567567ed7e76f33a9ef56d37891da02_xs2zl2.png"
          alt="Included"
          width={350}
          height={350}
          className="rounded-xl mx-auto"
        />
        <div>
          <h2 className="text-3xl font-bold mb-10">Förenkla dokumentation med MALLAR</h2>
          <div className="space-y-16">
            {[
              {
                title: "Enhetligt system",
                desc: "Skapa, anpassa och lagra olika typer av mallar för standardiserad dokumentation.",
              },
              {
                title: "Dela med teamet",
                desc: "Gör mallbiblioteket tillgängligt och säkra för hela teamet och dela ut det.",
              },
              {
                title: "Arbeta effektivt",
                desc: "Fyll i kvartal detalj avtalsmallar, rapportmallar med fler – skippa dubbelarbete.",
              },
              {
                title: "Utforska din kontroll",
                desc: "Håll säkra mallar uppdaterade och följ användning på ett enkelt ställe.",
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
              "Standardmallar för projekt, kalkyl, inköp och KMA",
              "Integration med projektmodulen för effektivt start",
              "Koppling till order- och inköpsmoduler",
              "Stöd för offertmallar i B2B-flöden",
              "Kalkylintegration för beräkningsmallar",
              "Används i juridik och avtalshantering",
              "Synk med CRM för dokumentkoppling till kund",
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Redo att komma igång?</h2>
        <p className="mb-6">Boka en demo idag för en gratis genomgång med våra experter.</p>
        <Button asChild className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
              <Link href="/professional/book_a_demo">
                Boka demo
              </Link>
            </Button>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="bg-[#FF914D0F] py-20 px-6">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Erbjudanden och viktiga fördelar</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Mallar-modulen effektiviserar dokumenthanteringen och säkerställer en smidig och enhetlig väg från utkast till färdigt dokument.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Återanvänd smarta mallar",
              desc: "Spara tid genom att skapa och återanvända färdiga mallar för återkommande uppgifter.",
            },
            {
              title: "Standardisera arbetssättet",
              desc: "Säkerställ att alla jobbar enligt samma struktur med tydliga mallar för varje moment.",
            },
            {
              title: "Snabbstarta nya projekt",
              desc: "Kom igång direkt med färdiga mallar för kalkyler, avtal, checklistor och mer.",
            },
            {
              title: "Minska fel och missar",
              desc: "Färdiga mallar hjälper dig att undvika onödiga steg och kostsamma misstag.",
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

export default GoodsContent;
