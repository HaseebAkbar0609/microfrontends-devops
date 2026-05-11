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
            Vad du får som privatperson när du använder TimeFlow
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>✅ Specialistjobb kräver tydliga ramar – annars riskerar arbetet att bli fel eller försenat.</li>
              <li>✅ När beställningar och ändringar är klara från början slipper du obehagliga överraskningar.</li>
              <li>✅ Samlad kommunikation ger överblick – inga fler tappade trådar mellan mejl, sms och samtal.</li>
              <li>✅ Med struktur och transparens får du rätt kompetens, till rätt pris, i rätt tid.</li>
            </ul>

            <div className="space-y-6">
              <p className="font-semibold text-[#FF914D]">
               När det krävs expertis – vi kopplar dig till rätt nischföretag genom TimeFlow System
              </p>
              {[
                {
                  title: "Tydlig offert, teknisk info och struktur",
                  text: "Du får ett professionellt upplägg redan från start – med tydlig offert, information om tekniska krav, arbetsbeskrivning och vad som ska göras när. Allt dokumenteras digitalt.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Effektiv planering och snabb återkoppling",
                  text: "Företaget använder TimeFlow för att planera tid, resurser och akuta insatser. Du får snabbare återkoppling och bättre service – även vid ändringar eller tillägg under projektets gång.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: "Koll på material och specialutrustning",
                  text: "Systemet säkerställer att rätt material, verktyg och maskiner används på rätt plats och i rätt tid – vilket minskar risken för förseningar och fel.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Ekonomi du förstår – inga överraskningar",
                  text: "Du får tydlig uppföljning kring eventuella tillägg, kostnader och slutfaktura. Alla moment är dokumenterade – så att du känner dig trygg med vad du betalar för.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Dokumentation i mobilen – direkt från fältet",
                  text: "Fältpersonal skapar arbetsordrar, dokumenterar vad som görs och rapporterar direkt i mobilen. Du får tydlig status på arbetet, även vid montage, service eller akuta uppdrag.",
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
              <p className="text-[#5B5B5B]">Trygghet i varje detalj – välj ett företag med TimeFlow System</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Benefits ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            När expertkunskap krävs – anlita nischföretag som<br></br> jobbar med TimeFlow System
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                &quot;Vi letade länge efter rätt firma – via TimeFlow gick det snabbt och allt var tydligt från start till mål.&quot;
              </p>
              <p className="mt-4 font-semibold">Andreas,</p>
              <p className="text-sm text-gray-500">Tomtägare i Haninge</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 När specialister jobbar strukturerat i TimeFlow System minskar risken för förseningar och dubbeljobb. Det betyder kortare projekttid och lägre kostnader för dig.</li>
              <li>🔸 Du ser tydligt vilka moment som är gjorda, hur mycket tid och material som använts, och vad som återstår – oavsett om det är en snabb insats eller ett avancerat montage.</li>
              <li>🔸 Digitala ritningar, instruktioner och checklistor säkerställer att tekniska arbetsmoment utförs korrekt. Du slipper betala för fel som måste göras om.</li>
              <li>🔸 Tid, foton, material och avvikelser registreras direkt på plats – du får ordning och reda utan lösa papper eller borttappad information.</li>
              <li>🔸 Alla i projektet – från montörer till projektledare – jobbar i samma system. Det minskar väntetider och gör att du som kund får snabba svar och tydliga besked.</li>
              <li>🔸 Allt som görs sparas spårbart. Perfekt för dig som kräver dokumentation vid t.ex. certifierade installationer, energikrav eller efterkontroller.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Value Carousel ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Spara pengar när du anlitar nischade hantverksföretag –<br></br> direkt i TimeFlow
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
               Hitta lönsamma nischföretag direkt i TimeFlow – spara pengar och
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Hitta rätt nischföretag – för smartare, enklare och mer lönsamma projekt med TimeFlow <br></br>Med TimeFlow får du som privatperson tillgång till specialiserade företag inom olika hantverksområden – allt samlat på ett ställe. Du sparar tid, minskar risken för fel och får ett tryggt projekt med hög kvalitet.  
                <br />
                • Enklare hantering – mer fokus på resultat Alla uppdrag, tidrapporter, material och dokument samlas digitalt – inga papper, inget dubbelarbete.  
                <br />
                • Koll i realtid – från offert till färdig leverans Följ varje steg i projektet och se uppdateringar direkt från arbetsplatsen – så du vet vad som händer, när det händer.  
                <br />
                • Kostnadskontroll från dag ett Följ material, resurser och maskinanvändning löpande – så du undviker oväntade utgifter och håller budgeten  
                <br />
                • Trygghet vid tekniska eller reglerade arbeten När du anlitar nischade företag via TimeFlow får du struktur, dokumentation och kvalitet som uppfyller alla krav – utan krångel. 
                
              </p>
              <p className="text-[#5B5B5B]">Resultatet? Ett smartare projekt med rätt expertis, bättre flyt – och pengar kvar i plånboken.</p>
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
