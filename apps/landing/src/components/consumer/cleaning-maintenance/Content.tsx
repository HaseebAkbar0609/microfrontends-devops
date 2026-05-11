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
            Vad du som privatperson vinner på att använda TimeFlow<br></br> för städ- och underhållstjänster
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>✅ Få ett tryggt och professionellt resultat – med rätt kommunikation från start.</li>
              <li>✅ Tydliga bokningar och avtal minskar risken för missförstånd och oväntade kostnader.</li>
              <li>✅ Du slipper stressen när ändringar, tillval och tider hanteras strukturerat och digitalt.</li>
              <li>✅ En pålitlig partner ger dig kontroll över kostnader, kvalitet och vad som faktiskt utförs.</li>
            </ul>

            <div className="space-y-6">
              <p className="font-semibold text-[#FF914D]">
               Professionell hjälp för hem och fastighet – hitta rätt städfirma med TimeFlow System
              </p>
              {[
                {
                  title: "Tydlig offert och struktur från start",
                  text: "Du får ett professionellt upplägg – med tydlig information om vad som ska göras, när det sker och vad det kostar. Alla arbetsmoment, kontaktuppgifter och checklistor samlas på ett ställe.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Pålitlig och punktlig service",
                  text: "Företaget planerar resurser och personal med TimeFlow, vilket ger bättre punktlighet och mindre strul. Du vet när personalen kommer – och att rätt saker blir gjorda.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: "Snabb hantering av tillägg och ändringar",
                  text: "Vill du lägga till något – som fönsterputs eller extra städning inför fest? Tilläggstjänster hanteras direkt i systemet, med snabb återkoppling och tydlig prisbild.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Ordning och reda på utrustning och material",
                  text: "Företaget planerar inköp och följer upp användning av städmaterial och maskiner. Det gör arbetet mer effektivt och miljösmart – samtidigt som du får ett bättre resultat.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Dokumentation och återkoppling i mobilen",
                  text: "Personalen använder TimeFlows mobilapp för att starta, rapportera och avsluta uppdrag. Du som kund får tydlig återkoppling om vad som har gjorts – i realtid.",
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
              <p>Välj ett företag som jobbar professionellt – välj ett företag med TimeFlow System - för din lönsamhet.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================== Benefits ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Trygg service från start till klart – därför väljer fler <br></br> TimeFlow System för städ och underhåll
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                &quot;Nu har vi full koll på när städningen sker, vem som kommer och vad vi betalar – allt är tydligt och enkelt&quot;
              </p>
              <p className="mt-4 font-semibold">Lena,</p>
              <p className="text-sm text-gray-500">Villaägare i Uppsala</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 När företaget lägger mindre tid på administration blir jobbet gjort snabbare och effektivare – du får mer värde för pengarna.</li>
              <li>🔸 Du ser enkelt hur tid, material och tillägg påverkar priset – inga dolda kostnader.</li>
              <li>🔸 Med tydliga checklistor och instruktioner görs jobbet rätt från början – vilket sparar både tid och pengar på onödiga återbesök.</li>
              <li>🔸 Allt sker i mobilen eller datorn. Du får full insyn i tidrapporter, arbetsorder och utförda tjänster – snabbt och enkelt.</li>
              <li>🔸 När personal och kontor jobbar i samma system slipper du missförstånd – och sparar både tid och irritation.</li>
              <li>🔸 Arbetsmiljökrav och kvalitetskontroller hanteras löpande – vilket säkerställer att du får ett professionellt och korrekt utfört uppdrag.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Value Carousel ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Effektivisera städ- och underhållsarbetet –<br></br> och spara pengar med TimeFlow
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
                Spara tid och pengar med rätt städbolag – hitta dem enkelt via TimeFlow
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
               Smartare städhjälp – spara pengar med rätt städbolag via TimeFlow <br></br>När du anlitar städföretag genom TimeFlow får du inte bara ett bra pris – du får högre kvalitet, nöjdare resultat och färre misstag, vilket gör hela städuppdraget mer lönsamt för dig som privatperson.
                <br />
                • Effektiv planering minskar onödig tid och kostnad Allt hanteras strukturerat i systemet – inga tappade instruktioner, missförstånd eller dubbelarbete  
                <br />
                •Rätt jobb, på rätt plats, i rätt tid Du ser tydligt vad som görs och när – vilket gör att både bemanning och leverans blir mer exakt och kostnadseffektiv  
                <br />
                • Färre fel – bättre resultat Tydliga rutiner, checklistor och uppföljning säkerställer att städningen håller hög kvalitet varje gång  
                <br />
                • Bättre uppföljning – inga överraskningar på fakturan Du får full insyn i vad som ingår, vilka timmar som lagts och om något tillkommit – så du betalar bara för det du fått  
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">Med TimeFlow får du mer värde för pengarna – och ett renare hem utan krångel.</p>
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
