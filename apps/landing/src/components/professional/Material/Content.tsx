import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MaterialContent: React.FC = () => {
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
      <section className="container mx-auto px-6 md:px-20 py-16 grid md:grid-cols-2 gap-10 items-center ">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Material - lager
          </h1>
          <p className="text-xl font-semibold text-gray-700 mb-4">
            Effektivisera företagets materialhantering med smart lager- och beställningskontroll
          </p>
          <p className="text-gray-600 mb-6">
            Material- och lagermodulen ger dig full kontroll över materialflödet – från inköp och lagerhållning till användning i projekt och leveransuppföljning.
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
        <h2 className="text-3xl font-bold mb-12">Funktioner och fördelar</h2>

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
                title: "Håll koll på ditt materialflöde",
                desc: "Registrera material, följ lagersaldo och hantera beställningar från leverantörer.",
              },
              {
                title: "Material direkt från projekt",
                desc: "Lägg till material direkt på order och projekt kopplat till rätt kostnadsställe.",
              },
              {
                title: "Se lagersaldo i realtid",
                desc: "Få en tydlig översikt över lagersaldo och beställ material direkt vid behov.",
              },
              {
                title: "Jämför leverantörer och priser",
                desc: "Jämför priser och villkor för smartare materialinköp.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="bg-[#FF7A00] text-white px-3 py-2 rounded-full font-bold">
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
              "Material och lager kopplat till kalkyl och projekt",
              "Direkt överföring från projekt och order",
              "Prislistor och leverantörsvillkor",
              "Dokumentation och spårbarhet",
              "CRM-stöd",
              "Mallar för beställningar",
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
        <p className="mb-4">Boka demo idag</p>
        <Button asChild className="bg-black">
          <Link href="/professional/book_a_demo">Boka demo</Link>
        </Button>
      </section>

      {/* ================= CAROUSEL ================= */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Effektiv material- och lagerhantering med full spårbarhet
        </h2>
        <p className="mt-5">Material- och lagermodulen ger dig full kontroll över hela materialflödet – från inköp och lagerhållning till användning i projekt och order.<br></br> Registrera material, följ lagersaldo i realtid och säkerställ att rätt material finns på rätt plats i rätt tid. Allt samlat för en smidigare och mer kostnadseffektiv hantering.</p>
        <Button asChild className="bg-[#FF914D] mt-5">
          <Link href="/professional/book_a_demo">Boka demo</Link>
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
          <h2 className="text-3xl font-bold mb-5">Erbjudanden och viktiga fördelar</h2>
          <p>Material- och lagermodulen effektiviserar hanteringen av material och lager och säkerställer ett smidigt flöde från inköp<br></br> och lager till användning i projekt – för bättre kostnadskontroll, tydlig spårbarhet och välkoordinerade projekt.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
            {
            title: "Smidig materialhantering per projekt",
            desc: "Registrera och hantera material direkt från kalkyl, projekt eller arbetsorder och koppla det till rätt projekt, lager eller ansvarig person.",
            },
            {
            title: "Jämför leverantörer och priser",
            desc: "Välj rätt leverantör med hjälp av prisjämförelser, leveranstider och tidigare beställningar – direkt i systemet.",
            },
            {
            title: "Minska svinn",
            desc: "Koppla material och beställningar till verkliga behov i projektet så att rätt mängd används eller beställs – varken mer eller mindre.",
            },
            {
            title: "Full historik och spårbarhet",
            desc: "Följ materialrörelser, lagerförändringar och beställningar i realtid. Se vem som registrerat material, när det användes och till vilket pris.",
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

export default MaterialContent;