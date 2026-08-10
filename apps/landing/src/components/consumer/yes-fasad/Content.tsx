"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getCustomerRegisterUrl } from "@/utils/constants";

const Content: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [customerRegisterUrl, setCustomerRegisterUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    accepted: false,
  });

  const router = useRouter();

  const carouselSlides = [
    {
      id: 1,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/63bee7ac8e1d6a8c8e07335fb7faaef27a0bf933_bceko8.png",
      text: "",
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759423674/Frame_2147226615_bgse57.png",
      text: "",
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759423674/Frame_2147226624_cntwnx.png",
      text: "",
    },
    {
      id: 4,
      img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759423674/Frame_2147226631_vqghhb.png",
      text: "",
    },
  ];

  // Auto slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );

  useEffect(() => {
    setCustomerRegisterUrl(getCustomerRegisterUrl());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.accepted
    ) {
      window.location.href = customerRegisterUrl;
    } else {
      alert("Fyll i alla fält och godkänn användarvillkoren innan du fortsätter.");
    }
  };

  return (
    <div className="w-full">
      {/* ================== Features ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Fördelar för dig som privatperson vid tak- och fasadarbeten
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>
                ✅ Flera aktörer – ett system. Få snabbare beslut när alla jobbar
                samlat i samma plattform.
              </li>
              <li>
                ✅ Tydliga beställningar. Undvik dyra missförstånd med klara
                offerter och digitala avtal.
              </li>
              <li>
                ✅ All kommunikation på ett ställe. Slipp papper och utspridda
                meddelanden – du har full översikt.
              </li>
              <li>
                ✅ Koll på kostnaderna. Följ projektet och budgeten i realtid – du
                vet alltid vad du betalar för.
              </li>
            </ul>

            <div className="space-y-6">
              {[
                {
                  title: "Full översikt från start till mål",
                  text: "Ditt bygge följer ni i projektet och allt samlas i ett och samma system – från offert och beställning till färdigställd slutbesiktning. Inga lösa papper, ingen osäkerhet.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Tydliga avtal och dokument",
                  text: "Alla viktiga handlingar, garantier och dokument arkiveras i det gemensamma systemet. Du har alltid tillgång till korrekt information – när du vill.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: "Löpande uppdateringar från arbetsplatsen",
                  text: "Montörer dokumenterar direkt i systemet via mobilen. Du kan enkelt följa med i vad som görs – dag för dag.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Tryggare ekonomi",
                  text: "Följ projektets kostnadsutveckling, få tydlig prisbild och undvik oväntade fakturor. Alla ändringar och tillägg dokumenteras.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Kvalitetssäkrat arbete",
                  text: "Företag som använder TimeFlow System jobbar med checklistor, säkerhetsrutiner och kvalitetskontroller – så att jobbet blir rätt från början.",
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
            Därför lönar det sig att välja TimeFlow System för ditt tak- eller fasadprojekt
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                När du anlitar ett företag för tak- eller fasadarbeten via TimeFlow System får du
                inte bara ett konkurrenskraftigt pris – du får också tryggheten i att arbetet
                utförs av granskade och kvalitetssäkrade proffs.
              </p>
              <p className="mt-4 font-semibold">Lars</p>
              <p className="text-sm text-gray-500">Villaägare i Göteborg</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 Spara tid och pengar</li>
              <li>🔸 Färre missar – tryggare resultat</li>
              <li>🔸 Mindre krångel med papper</li>
              <li>🔸 Full koll på kostnaderna</li>
              <li>🔸 Bättre kommunikation</li>
              <li>🔸 Dokumentation och säkerhet på plats</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Value (Carousel) ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Spara pengar på ditt tak- eller fasadprojekt – med full kontroll i TimeFlow System
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
                      idx === currentSlide
                        ? "bg-gray-800 scale-125"
                        : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-left">
              <h3 className="font-bold text-[#FF914D] mb-4">
                Trygga val för tak och fasad – så hjälper TimeFlow System dig som kund
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed space-y-2">
                När du använder TimeFlow för att hitta och anlita entreprenörer inom tak och fasad,
                får du total överblick över projektet – från offert till slutbesiktning. <br />
                • Effektiv planering ger snabbare beslut och smidigare byggprocess. <br />
                • Full kostnadskontroll i realtid. <br />
                • Mindre administration – alla dokument och all kommunikation hanteras i samma
                system. <br />
                • Ett smartare och tryggare sätt att driva ditt tak- eller fasadprojekt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Register ================== */}
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
            Registrera ditt projekt - det är gratis
          </h2>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4">
            <input
              type="text"
              placeholder="Namn"
              className="w-full border rounded-md p-3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="E-post"
              className="w-full border rounded-md p-3"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Telefonnummer"
              className="w-full border rounded-md p-3"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <textarea
              placeholder="Beskriv ditt projekt..."
              className="w-full border rounded-md p-3 h-32"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />

            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                id="terms"
                checked={formData.accepted}
                onChange={(e) =>
                  setFormData({ ...formData, accepted: e.target.checked })
                }
                required
              />
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
