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
            Dina fördelar som privatperson vid installationer – el, VVS & ventilation
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>✅ När du anlitar ett installationsföretag som jobbar i TimeFlow System får du full insyn i hela processen – från offert till färdig installation. All dokumentation, kommunikation och uppföljning samlas på ett och samma ställe.</li>
              <li>✅ Du slipper gissningar, förseningar och överraskningar. Istället får du en trygg, transparent och professionell leverans – oavsett om det gäller el, VVS, solceller eller annan teknik.</li>
              <li>✅ Med TimeFlow System sparar du både tid och pengar, samtidigt som du får tydlig kommunikation och dokumenterad kvalitet i varje steg. Så ska en modern installation fungera.</li>
              <li>✅ Med TimeFlow System får du ett tryggt installationsprojekt – tydliga avtal, uppdateringar i realtid och inga oväntade kostnader.</li>
            </ul>

            <div className="space-y-6">
              <p className="font-semibold text-[#FF914D]">
                Trygga installationer börjar här – hitta kvalitetssäkrade företag med TimeFlow System
              </p>
              {[
                {
                  title: "Tydlig start och tryggt avslut",
                  text: "Du får full insyn i hela projektet – från första offert till godkänd slutkontroll.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Effektiv planering på plats",
                  text: "Installatörer och tekniker är rätt schemalagda, så arbetet går snabbt och smidigt.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: "Allt material där det behövs",
                  text: "Utrustning, leveranser och maskiner hanteras strukturerat – inget glöms eller försenas.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Kostnader utan överraskningar",
                  text: "Du ser vad som ingår, vad som tillkommer och hur projektet ligger till ekonomiskt.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Mobil dokumentation i realtid",
                  text: "Teknikerna rapporterar direkt från mobilen – även utan uppkoppling – så du vet vad som sker.",
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

      {/* ================== Benefits ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Därför lönar det sig att välja installationsföretag som använder TimeFlow System
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                &quot;Allt fanns samlat på ett ställe – offert, kontakt och uppdateringar. Det gjorde installationen smidigare, och jag slapp oroa mig för missförstånd eller dolda kostnader.&quot;
              </p>
              <p className="mt-4 font-semibold">John</p>
              <p className="text-sm text-gray-500">Villaägare i Tibro</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 När företaget jobbar mer effektivt och har koll på timmar, material och kostnader – slipper du onödiga extratimmar och oförutsedda avgifter.</li>
              <li>🔸 Mindre tid på administration betyder mer fokus på själva installationen – ditt projekt blir klart snabbare.</li>
              <li>🔸 Tydliga arbetsorder och checklistor minskar risken för fel, vilket sparar både tid och pengar för dig som kund.</li>
              <li>🔸 Allt hanteras digitalt – du får tillgång till avtal, tidrapporter och dokumentation på ett och samma ställe.</li>
              <li>🔸 Du slipper jaga svar via mejl och sms – både du och installatören har full översikt över vad som sagts och beslutats.</li>
              <li>🔸 Egenkontroller och arbetsmiljökrav följs upp automatiskt – du kan känna dig trygg med att jobbet är rätt gjort.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Value Carousel ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Spara pengar på installationer – med smart hantering i TimeFlow System
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
                Spara pengar på el-, VVS- och installationsarbeten – med hjälp av TimeFlow
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                När du anlitar företag via TimeFlow får du inte bara tillgång till kvalitetssäkrade installatörer – du får också bättre kontroll över hela projektet, vilket sparar både tid och pengar.  
                <br />
                • Tydliga offerter och inga oväntade kostnader Jämför företag direkt i systemet och välj det som passar din budget – utan dolda avgifter.  
                <br />
                • Mindre dubbelarbete, färre misstag Allt från planering till slutförande hanteras i ett system, vilket minskar risken för fel och förseningar.  
                <br />
                • Kostnadskontroll i realtid Följ utgifter, tilläggsarbeten och leveranser direkt i mobilen – du har alltid koll på vad du betalar för..  
                <br />
                • Spara tid med smidig kommunikationAlla uppdateringar, ritningar och godkännanden finns samlade – så du slipper jaga information.  
                <br />
                • Effektivare projekt – bättre resultat När allt flyter på som det ska, sparar du både pengar och energi – och får jobbet gjort rätt från början.  
                {/* <br />
                • För bättre kontroll, tydligare kommunikation och ett slutresultat du kan lita på – samtidigt som du sparar både tid, pengar och energi. */}
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