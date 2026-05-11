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
          <h2 className="text-4xl font-bold text-center mb-12">
            Fördelar för dig som privatperson vid <br></br>arkitekt- och konsulttjänster
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>✅ När många aktörer är inblandade krävs tydlig samordning för att undvika missförstånd.</li>
              <li>✅ Klara avtal och strukturerad dialog minskar risken för dyra ändringar och förseningar.</li>
              <li>✅ All kommunikation samlad ger trygghet – du vet alltid vad som är sagt och beslutat.</li>
              <li>✅ Du får bättre kontroll över projektets kostnader, tidplan och resultat – från idé till verklighet.</li>
            </ul>

            <div className="space-y-6">
              <p className="font-semibold text-[#FF914D]">
               Från idé till färdig plan – hitta erfarna arkitekter och konsulter via TimeFlow System
              </p>
              {[
                {
                  title: "Tydlig offert och uppdragsbeskrivning",
                  text: "ADu får ett professionellt och strukturerat upplägg – med tydlig offert, tidplan och vad som ingår i arbetet. Alla kontaktpersoner, ritningar och dokumentation samlas på ett ställe.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Bättre planering och kommunikation",
                  text: "TimeFlow hjälper konsulter att planera tid och resurser på ett effektivt sätt. Det innebär färre missförstånd och bättre flyt genom hela projektet – från idé till bygglov eller byggstart.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: " Smidig hantering av tillägg och ändringar",
                  text: "Vill du justera något i ritningarna eller lägga till en tjänst? Med TimeFlow dokumenteras alla ändringar direkt – du får snabbt svar och vet exakt vad det innebär i tid och kostnad.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Full översikt – även för dig som kund",
                  text: "Få löpande uppdateringar om hur projektet går. Du kan följa viktiga milstolpar, dokumentation och avvikelser – allt samlat och tillgängligt.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Trygg dokumentation vid varje steg",
                  text: "Alla ritningar, skisser, bygglovshandlingar och protokoll sparas säkert i systemet. Det ger dig trygghet både under och efter projektet – särskilt vid framtida försäljning eller ändringar.",
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
              <p>Välj en arkitekt eller konsult som jobbar professionellt – välj någon med TimeFlow System</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================== Benefits ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
           Så vinner du på att anlita konsulter och arkitekter som <br></br>jobbar digitalt i TimeFlow System
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                &quot;Vi fick full insyn i processen – allt från skisser till beslut fanns samlat och lätt att följa. <br></br>Det gjorde hela projektet mycket smidigare&quot;
              </p>
              <p className="mt-4 font-semibold">Martin,</p>
              <p className="text-sm text-gray-500">Husbyggare i Sigtuna</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 När konsulter och arkitekter slipper administrera i flera olika system går mer tid till planering, ritningar och lösningar för just ditt projekt. Det sparar tid – och kostar mindre i slutändan.</li>
              <li>🔸 Du får översikt över arbetstimmar, budget och leveranser i varje fas – vilket gör det lättare att fatta kloka beslut och undvika oväntade kostnader.</li>
              <li>🔸 Tydliga uppdragsbeskrivningar, fasta deadlines och strukturerade arbetsflöden minimerar risken för fel och omtagningar.</li>
              <li>🔸 Ritningar, tidrapporter och avstämningar samlas på ett ställe – spårbart och uppdaterat. Du slipper jaga dokument i mejl och mappar</li>
              <li>🔸 Alla parter jobbar med samma information i realtid – vilket gör kommunikationen effektivare och projekten mer lönsamma.</li>
              <li>🔸 Systemet hjälper företaget att hålla koll på avtal, kvalitetskrav och leveranser – så att du som kund får det du betalat för, utan kompromisser.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Value Carousel ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Spara pengar genom att hitta rätt konsulter och<br></br> arkitekter direkt i TimeFlow System
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
               Hitta rätt arkitekt eller konsult – spara pengar och anlita seriösa proffs via TimeFlow
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Spara pengar och få rätt hjälp från proffs – anlita konsulter och arkitekter via TimeFlow <br></br>När du använder TimeFlow för att hitta arkitekter och konsulter får du professionellt stöd, tydlig planering och kontroll över kostnader – vilket ger ett smidigare och mer kostnadseffektivt projekt.  
                <br />
                • Bättre planering – färre misstag och lägre kostnader Tydliga avtal, uppdrag och uppföljning gör att allt går rätt till från början, vilket sparar både tid och pengar.  
                <br />
                • Full insyn från idé till färdigt förslag Följ projektets faser, få uppdateringar och ha all kommunikation samlad – så du slipper osäkerhet och omvägar  
                <br />
                • Ekonomisk kontroll i varje steg Se exakt hur mycket tid och resurser som lagts ner – och vad det kostar. Du betalar bara för det du behöver  
                <br />
                • Trygghet med kvalitetssäkrade aktörer Alla konsulter och arkitekter i TimeFlow är seriösa, erfarna och arbetar med tydliga processer och ansvar.  
              </p >
              <p className="text-gray-700 text-sm leading-relaxed">Med rätt expertis och bättre översikt blir ditt projekt inte bara bättre – utan också billigare i längden.</p>
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
