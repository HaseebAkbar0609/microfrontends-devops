import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VehicleContent: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const slides = [
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758003460/Body_sc0bzf.png",
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758003460/Body_sc0bzf.png",
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758003460/Body_sc0bzf.png",
  ];

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full">

      {/* ================= HERO ================= */}
      <section className="container mx-auto px-6 md:px-20 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FORDON</h1>
          <p className="text-xl font-semibold text-gray-700 mb-4">
            Modulen ger fullständig översikt och kontroll över företagets fordonspark
          </p>
          <p className="text-gray-600 mb-6">
            Hantera servicebehov, resurser och användning i realtid med smart planering.
          </p>
          <button className="bg-[#FF7A00] text-white px-6 py-3 rounded-xl">
            Visa video
          </button>
        </div>

        <div className="relative">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              src="https://play.gumlet.io/embed/68f1e65c6b5c1015acee72d0"
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold mb-12">FORDON ÖVERSIKT</h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Image
            src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1758507383/f077961d0567567ed7e76f33a9ef56d37891da02_xs2zl2.png"
            alt="Person"
            width={400}
            height={400}
            className="mx-auto"
          />

          <div className="space-y-8">
            {[
              {
                title: "Samla fordonsdokumentation",
                desc: "Digitalisera och samla all dokumentation kopplad till fordon – såsom servicehistorik, försäkringar och registreringsuppgifter – på ett och samma ställe. Alltid uppdaterat och enkelt att komma åt.",
              },
              {
                title: "Bevaka service och besiktning",
                desc: "Planera och få automatiska påminnelser inför service, reparationer och besiktningar, så att inget missas och fordonen alltid är i gott skick.",
              },
              {
                title: "Följ upp resurs-utnyttjande",
                desc: "Få överblick över bokningar och användning direkt i mobilen. Säkerställ ett effektivt nyttjande av fordonsflottan och undvik stillestånd.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="bg-[#FF7A00] text-white px-3 py-5 rounded-full font-bold">
                  {`0${i + 1}`}
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
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
              "Alltid uppkopplad fordonsflotta",
              "Rätt fordon till rätt förare",
              "Projekt- och kundkopplad styrning",
              "Stöd för service och dokumentation",
              "Full kontroll över uppdrag och användning",
              "Datadriven uppföljning",
            ].map((item, i) => (
              <li key={i}>✔ {item}</li>
            ))}
          </ul>
        </div>

        <img
          src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg"
          className="rounded-xl"
        />
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#FF914D] text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-3">Redo att komma igång?</h2>
        <p className="mb-4">Boka en demo idag för en gratis genomgång med våra experter.</p>
        <Button asChild className="bg-black">
          <Link href="/professional/book_a_demo">Boka demo</Link>
        </Button>
      </section>

      {/* ================= CAROUSEL ================= */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Planera och optimera rutter för företagets fordon med Rutplan. <br></br>Effektivisera körningar, spara tid och reducera bränslekostnader.
        </h2>
        <p className="mb-5">Fordon-modulen ger dig full översikt över företagets fordonsflotta – från personbilar till transportfordon. Hantera service, bokningar, <br></br>dokumentation och tillgänglighet i realtid för att minimera stillestånd och maximera effektivitet. Allt samlat i en strukturerad och lättanvänd lösning.</p>
        <Button asChild className="bg-[#FF914D] mb-6">
          <Link href="/professional/book_a_demo">Skapa konto</Link>
        </Button>

        <div className="relative max-w-4xl mx-auto">
          <Image
            src={slides[current]}
            alt="slide"
            width={900}
            height={500}
            className="rounded-xl"
          />

          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2">
            <ChevronLeft />
          </button>

          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2">
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="bg-[#FFF5ED] py-20">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-5">
            Funktioner och viktiga fördelar för fordonsmodulen
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Registrera och boka fordon",
              desc: "Registrera och hantera alla fordon med information om inköp, service, status och placering i verksamheten. Boka och tilldela fordon enkelt så att rätt resurser finns på plats i rätt tid.",
            },
            {
              title: "Spåra fordon med Drive",
              desc: "Få realtidsöversikt över fordonens position och användning med tillvalet Drive. Öka kontrollen, förbättra säkerheten och optimera nyttjandet av fordonsflottan.",
            },
            {
              title: "Service och underhåll i tid",
              desc: "Få automatiska påminnelser inför service, besiktningar och reparationer – minska driftstopp och förläng fordonens livslängd.",
            },
            {
              title: "Optimera rutter",
              desc: "Planera och optimera fordonsrutter för verksamheten med Rutplan. Effektivisera körningar, spara tid och minska bränslekostnader.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border">
              <span className="bg-[#FF7A00] text-white px-3 py-1 rounded-full">
                {`0${i + 1}`}
              </span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL ================= */}
      <section className="container mx-auto py-20 grid md:grid-cols-2 gap-10 items-center p-5">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Förenkla din vardag som hantverkare
          </h1>
          <h2 className="text-xl font-bold mb-4">
            boka en gratis demo av TimeFlow idag!
          </h2>
          <p className="mb-3">Se hur du sparar tid, får fler affärer och full kontroll på dina projekt.</p>
          <Button asChild className="bg-[#FF7A00]">
            <Link href="/professional/book_a_demo">Boka demo</Link>
          </Button>
        </div>

        <img
          src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg"
          className="rounded-xl"
        />
      </section>
    </div>
  );
};

export default VehicleContent;