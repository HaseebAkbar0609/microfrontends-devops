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
      {/* ================== Section 1 ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Fördelar för dig som privatperson vid beläggningsarbeten
          </h2>
          <p className="text-center text-[#FF914D] font-semibold mb-12">
            Från tak till golv – hitta kvalitetssäkrade beläggningsproffs med TimeFlow System
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4 text-gray-700">
              <p>✅ Trygghet i varje steg – professionella aktörer inom beläggning som vet vad som krävs.</p>
              <p>✅ Tydliga offerter och avtal minskar risken för missförstånd och extra kostnader.</p>
              <p>✅ Hela projektet dokumenterat och hanterat digitalt för högsta kvalitet och maximal kontroll.</p>
              <p>✅ Smidigt uppstart där rätt firma blir tilldelad direkt.</p>
            </div>

            <div className="space-y-6">
              <div className="p-4 border rounded-md flex items-start gap-3">
                <Image
                  src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17611448_cm0vwm.png"
                  alt="Tryggare hantverk"
                  width={24}
                  height={24}
                />
                <div>
                  <h3 className="font-semibold text-[#FF914D] mb-2">
                    Tryggare hantverk med full insyn – anlita proffs som jobbar med TimeFlow System
                  </h3>
                  <p className="text-sm text-gray-700">
                    Du anlitar en aktör med erfarenhet som använder TimeFlow System för att hantera hela arbetet digitalt.
                    Tydligare kommunikation, minskad risk för fel – och du får löpande uppdateringar om framdriften.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-md flex items-start gap-3">
                <Image
                  src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_16747471_bhiedp.png"
                  alt="Tydliga offerter"
                  width={24}
                  height={24}
                />
                <div>
                  <h3 className="font-semibold text-[#FF914D] mb-2">
                    Tydliga offerter och arbetsbeskrivningar
                  </h3>
                  <p className="text-sm text-gray-700">
                    Du får ett proffsigt upplägg från start – med en tydlig offert, tydlig tidsplan och vad som ingår i arbetet.
                    Inga otrevliga överraskningar i efterhand.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-md flex items-start gap-3">
                <Image
                  src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png"
                  alt="Bättre planering"
                  width={24}
                  height={24}
                />
                <div>
                  <h3 className="font-semibold text-[#FF914D] mb-2">
                    Bättre planering och punktlig leverans
                  </h3>
                  <p className="text-sm text-gray-700">
                    Företaget använder TimeFlow för att hålla ordning på arbeten, beräknat flöde och följa tidschemat.
                    Det gör att projektet flyter smidigare och blir klart i tid.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-md flex items-start gap-3">
                <Image
                  src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_4_e03nax.png"
                  alt="Löpande uppdateringar"
                  width={24}
                  height={24}
                />
                <div>
                  <h3 className="font-semibold text-[#FF914D] mb-2">
                    Löpande uppdateringar och full insyn
                  </h3>
                  <p className="text-sm text-gray-700">
                    Få löpande uppdateringar om hur arbetet går – direkt via mobil eller e-post.
                    Både arbetsledare och montörer dokumenterar i systemet, så du kan känna dig trygg genom hela projektet.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-md flex items-start gap-3">
                <Image
                  src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png"
                  alt="Ändringar och tillägg"
                  width={24}
                  height={24}
                />
                <div>
                  <h3 className="font-semibold text-[#FF914D] mb-2">
                    Enklare hantering av ändringar och tillägg
                  </h3>
                  <p className="text-sm text-gray-700">
                    Behöver du göra en ändring? TimeFlow gör det lätt för företaget att dokumentera tilläggsarbeten och ge dig snabba, korrekta prisuppgifter – så du vet vad det kostar innan något utförs.
                  </p>
                </div>
              </div>
              <p>Kort sagt – du får ett mer professionellt och pålitligt hantverksjobb när företaget använder TimeFlow System.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================== Section 2 ================== */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-10">
            Snyggt resultat utan krångel – så förenklar TimeFlow System hela processen för dig
          </h2>

          <div className="grid md:grid-cols-2 gap-12 text-left items-center">
            <div className="bg-[#F2F2F2] p-8 rounded-lg shadow-md">
              <p className="text-gray-800 italic mb-6">
                “Allt sköttes smidigt och digitalt – jag fick tydlig information om vad som skulle göras, när det skulle göras och vad det skulle kosta. Inga tapp, inga missförstånd – bara ett proffsigt jobb från start till mål.”
              </p>
              <p className="font-semibold">Sara</p>
              <p className="text-sm text-gray-500">Bostadsrättsinnehavare i Norrköping</p>
            </div>

            <ul className="text-gray-700 space-y-4">
              <li>🔸 Företagen lägger mindre tid på administration och mer tid på själva arbetet – ditt projekt blir klart snabbare.</li>
              <li>🔸 Du får svar på frågor snabbt, med all historik och underlag samlat digitalt – inga överraskningar.</li>
              <li>🔸 Administrationen sköts i realtid – resultat blir bättre och tydligare för alla.</li>
              <li>🔸 All rapportering sker digitalt – du får full insyn i vad som görs, när och av vem.</li>
              <li>🔸 Du och företaget jobbar med samma information – i realtid, med lagrat bakåt, så allt är spårbart.</li>
              <li>🔸 Dokumentation, egenkontroller och arbetsmiljökrav hanteras korrekt – du kan känna dig trygg med att allt går rätt till.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Section 3 ================== */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold">
            Spara pengar på ditt beläggningsprojekt – med TimeFlow System
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mt-10 items-center">
            <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselSlides.map((slide) => (
                  <div key={slide.id} className="w-full flex-shrink-0 relative h-[320px] md:h-[420px]">
                    <Image src={slide.img} alt={`Slide ${slide.id}`} fill className="object-contain bg-white" />
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
                Spara pengar på ditt beläggningsprojekt – anlita rätt företag direkt via TimeFlow
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Med tillgång till kvalitetssäkrade beläggningsbolag i TimeFlow får du tydliga offerter, färre misstag och bättre kontroll – vilket ger lägre kostnader och ett tryggare slutresultat.
                <br /><br />
                När du anlitar företag via TimeFlow får du bättre planering, snabbare genomförande och full kontroll – samtidigt som projektet blir smidigare och mer kostnadseffektivt.
                <br /><br />• Snabbare från start till färdigt resultat Mindre krångel och tydlig struktur gör att arbetet kan påbörjas och slutföras utan onödiga förseningar  
                <br></br>• All information samlad – inget faller mellan stolarna Följ varje steg i projektet och se status i realtid – så du slipper onödig väntetid och missförstånd  
                <br></br>• Koll på kostnader från dag ettDu ser hur arbetet utvecklas och vad det kostar – inga överraskningar eller extra utgifter  
                <br></br>• Rätt resurser på rätt plats Företagen som arbetar via TimeFlow planerar smartare, hanterar maskiner och material effektivt – vilket gynnar både tidsplan och plånbok.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Section 4 ================== */}
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
            <textarea name="message" placeholder="Beskriv ditt projekt..." className="w-full border rounded-md p-3 h-32" />

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
