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

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <div className="w-full">
      {/* ================== Features ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Fördelar för dig som privatperson vid mark- och schaktprojekt
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <ul className="space-y-4 text-gray-700">
              <li>✅ Jämför och välj mellan kvalitetssäkrade entreprenörer</li>
              <li>✅ Få tydliga offerter och avtal direkt i systemet</li>
              <li>✅ Kommunicera enkelt med entreprenören på ett ställe</li>
              <li>✅ Spara tid och pengar genom effektiv planering och uppföljning</li>
            </ul>

            <div className="space-y-6">
              <p className="font-bold text-[#FF914D]">
                Tryggt, tydligt och kostnadsfritt för dig som privatperson
              </p>
              {[
                {
                  title: "Full kontroll på hela projektet",
                  text: "Få mark- eller schaktprojektet från offert till slutfört arbete – allt samlat på ett ställe.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17343649_sdx5fc.png",
                },
                {
                  title: "Digitala avtal och dokument",
                  text: "Alla ritningar, avtal och godkännanden lagras tryggt och lättillgängligt i systemet.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293004/fi_17611448_cm0vwm.png",
                },
                {
                  title: "Smidig kommunikation",
                  text: "Chatta direkt med entreprenören, dela bilder och följ upp utan krångel eller missförstånd.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_16747471_bhiedp.png",
                },
                {
                  title: "Koll på tid och tilläggsarbeten",
                  text: "Få uppdateringar i realtid om tidplan och eventuella ändringar eller tilläggsarbeten.",
                  icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759293003/fi_17619538_h5wajn.png",
                },
                {
                  title: "Allt direkt i mobilen",
                  text: "Följ projektet enkelt från din mobil – få uppdateringar, bilder och status vart du än är.",
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
            Dina fördelar som privatperson med TimeFlow System
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#F2F2F2] shadow-md p-8 rounded-lg">
              <p className="text-lg italic text-gray-800">
                &quot;Vi hade tidigare dålig koll och mycket krångel – med TimeFlow blev allt enkelt, tydligt och tryggt.&quot;
              </p>
              <p className="mt-4 font-semibold">Anna</p>
              <p className="text-sm text-gray-500">Villaägare i Nacka</p>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>🔸 Spara tid – upp till 20 % snabbare mark & schaktprojekt</li>
              <li>🔸 Bättre koll – undvik onödiga kostnader</li>
              <li>🔸 Färre misstag – högre kvalitet på jobbet</li>
              <li>🔸 Mindre pappersarbete – allt samlat digitalt, direkt i mobilen</li>
              <li>🔸 Bättre samarbete – tryggare projekt</li>
              <li>🔸 Tydlighet och regel efterlevnad</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== Carousel ================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Spara pengar redan från start – undvik misstag och få full kontroll på kostnaderna
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

              {/* Navigation */}
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
                Så sparar du pengar som privatperson vid mark- och schaktarbeten med TimeFlow System
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed space-y-2">
                När du som privatperson anlitar ett företag för mark- och schaktarbeten vill du ha trygghet, tydlighet och ett resultat som håller. <br />
                • Genom TimeFlow System får du inte bara kvalitet i arbetet – du får också ett digitalt stöd som minskar risken för misstag och extra kostnader. <br />
                • Hela projektet hanteras strukturerat och digitalt – från första offert till slutlig faktura. <br />
                • Du får total överblick i realtid och kan enkelt jämföra olika förslag och se vad du godkänner. <br />
                • Alla kostnader dokumenteras transparent så du undviker dolda avgifter och missförstånd. <br />
                • Att välja ett företag som använder TimeFlow System är helt enkelt ett smartare val.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Register (with validation + redirect) ================== */}
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

          {/* ✅ Validating + redirect form */}
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
            <input
              type="text"
              name="name"
              placeholder="Namn"
              className="w-full border rounded-md p-3"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-post"
              className="w-full border rounded-md p-3"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefonnummer"
              className="w-full border rounded-md p-3"
              required
            />
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
