"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Content: React.FC = () => {
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

  // Autoplay every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <div className="w-full">
      {/* ================== Features ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Detta får du hjälp med som privatperson i TimeFlow
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>✅ Snabba beslut – många aktörer</li>
              <li>✅ Helt kostnadsfritt för dig som privatperson</li>
              <li>✅ Enkel hantering – allt samlat på ett ställe</li>
              <li>✅ Alltid kvalitetssäkrade och kontrollerade hantverkare</li>
            </ul>

            <div className="space-y-6">
              <p className="font-semibold text-[#FF914D]">
                Detta löser TimeFlow System för dig som privatperson inom bygg- och betongprojekt:
              </p>
              {[
                {
                  title: "Hitta rätt byggföretag snabbt och tryggt",
                  text: "Alltid kvalitetssäkrade hantverkare och företag redo för förfrågan. All information samlad så att du enkelt kan välja en säker aktör.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Jämför offerter och välj det som passar dig bäst",
                  text: "Lägg upp ditt jobb och få flera offerter i TimeFlow. Du jämför enkelt och väljer den lösning och det företag som passar dig bäst.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: "Följ hela projektet digitalt – från start till slut",
                  text: "Få total överblick över ditt projekt med tydliga milstolpar och statusuppdateringar. Du vet alltid vad som händer och när – utan att behöva jaga svar.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Kommunicera smidigt med ditt byggteam i ett verktyg",
                  text: "Chatta, dela bilder och dokument direkt i systemet. All kommunikation sparas – inga missförstånd, allt dokumenterat.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Få full kontroll på avtal, fakturor och godkännanden",
                  text: "Se och godkänn avtal digitalt, få fakturor samlade och kostnader i realtid. Det ger dig full kontroll och trygghet genom hela processen.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_4_e03nax.png",
                },
              ].map((card, idx) => (
                <div key={idx} className="p-4 border rounded-md flex items-start gap-3">
                  <Image src={card.icon} alt={card.title} width={24} height={24} />
                  <div>
                    <h3 className="font-semibold text-[#FF914D] mb-2">{card.title}</h3>
                    <p className="text-gray-700 text-sm">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Construction system */}
        <section className="pt-16 pb-16 px-6 text-center border-y ">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tigh ">
              Byggsystem byggt för
              <span className="text-primary italic">
                byggare och projektteam
              </span> 
            </h2>
          </div>
        </section>

      {/* ================== Benefits ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Vad du vinner med TimeFlow System
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                &quot;Vi har testat annat – men inget slår TimeFlow. Det är enkelt, komplett och ger full kontroll hela vägen.&quot;
              </p>
              <p className="mt-4 font-semibold">Stina</p>
              <p className="text-sm text-gray-500">Villaägare</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 Upp till 20 % snabbare projekt</li>
              <li>🔸 Bättre överblick och kontroll från start till mål</li>
              <li>🔸 Trygghet med seriösa hantverkare som följer alla regler</li>
              <li>🔸 Mindre krångel med papper och avtal</li>
              <li>🔸 Enklare och tydligare kommunikation</li>
              <li>🔸 Färre misstag och tryggare arbetsmiljö</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Value Carousel ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Maximera värdet i ditt projekt – spara pengar med TimeFlow och använd dem till det som verkligen räknas
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mt-10 items-center">
            <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselSlides.map((slide) => (
                  <div key={slide.id} className="w-full flex-shrink-0 relative h-[320px] md:h-[420px]">
                    <Image
                      src={slide.img}
                      alt={`Slide ${slide.id}`}
                      fill
                      className="object-contain bg-white"
                    />
                  </div>
                ))}
              </div>

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
                      idx === currentSlide ? "bg-gray-800 scale-125" : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-left">
              <h3 className="font-bold text-[#FF914D] mb-4">
                Därför spar du pengar med TimeFlow System som privatperson
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                När du som privatperson anlitar ett företag för bygg- eller betongarbeten vill du ha trygghet, tydlighet och ett resultat som håller.  
                <br />
                • Genom att välja en entreprenör som använder TimeFlow System får du inte bara kvalitet i hantverket – du får också ett digitalt stöd som minskar risken för misstag och onödiga kostnader.  
                <br />
                • Med TimeFlow hanteras hela projektet strukturerat och digitalt – från första offert till slutfakturor.  
                <br />
                • Du får total överblick på vad som sker, kan jämföra olika förslag och enkelt se vad du godkänner, allt i realtid.  
                <br />
                • Alla kostnader dokumenteras i realtid så du har full insyn i varje del av projektet. Du undviker dolda avgifter och oklara beställningar.  
                <br />
                • Att anlita en bygg- eller betongföretag som arbetar med TimeFlow System blir helt enkelt ett smartare val.  
                <br />
                • För bättre kontroll, tydligare kommunikation och ett slutresultat du kan lita på – samtidigt som du sparar både tid, pengar och energi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Register Form ================== */}
      <section
        className="relative py-16 bg-[#FF914D]/90 bg-blend-multiply"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293675/54a94203ceaa17e35be7cf97b4bf71e950c344aa_iswn3z.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#FF914D]/70"></div>

        <div className="relative container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Registrera ditt projekt – det är gratis
          </h2>

          {/* ✅ Updated form with validation + redirect */}
          <form
            className="bg-white shadow-md rounded-lg p-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();

              const name = (e.currentTarget.elements.namedItem("name") as HTMLInputElement)?.value.trim();
              const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value.trim();
              const phone = (e.currentTarget.elements.namedItem("phone") as HTMLInputElement)?.value.trim();
              const terms = (e.currentTarget.elements.namedItem("terms") as HTMLInputElement)?.checked;

              if (!name || !email || !phone || !terms) {
                alert("Vänligen fyll i alla obligatoriska fält och godkänn villkoren.");
                return;
              }

              window.location.href = "https://timeflowsystem.com/register/customer";
            }}
          >
            <input type="text" name="name" placeholder="Namn" className="w-full border rounded-md p-3" required />
            <input type="email" name="email" placeholder="E-post" className="w-full border rounded-md p-3" required />
            <input type="tel" name="phone" placeholder="Telefonnummer" className="w-full border rounded-md p-3" required />
            <textarea
              name="message"
              placeholder="Beskriv ditt projekt..."
              className="w-full border rounded-md p-3 h-32"
            />

            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">Jag godkänner TimeFlows användarvillkor</label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF914D] text-white py-3 rounded-md font-semibold hover:bg-[#e67d32] transition"
            >
              Skicka & skapa konto
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Content;
